"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Types
interface Profile {
    id: string;
    name: string | null;
    email: string;
    school: string | null;
    avatar_url: string | null;
    created_at: string;
}

interface Event {
    id: string;
    title: string;
    start_time: string;
    venue_name: string;
    status: string; // 'approved' | 'pending' | 'rejected' - currently we assume everything is approved or pending based on logic, but schema doesn't have status yet, so we'll mock or infer
    rsvp_count?: number;
}

interface RsvpEvent extends Event {
    event_id: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"rsvps" | "events" | "settings">("rsvps");
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [myRsvps, setMyRsvps] = useState<RsvpEvent[]>([]);

    // Edit Profile State
    const [editName, setEditName] = useState("");
    const [editSchool, setEditSchool] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const supabase = createClient();

            // 1. Get Auth User
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push("/auth"); // Redirect if not logged in
                return;
            }
            setUser(user);

            // 2. Get Profile
            // We use single() but handle error in case profile doesn't exist yet (signup trigger might be missing)
            let { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            // Fallback if no profile row exists, use auth metadata
            if (!profileData) {
                profileData = {
                    id: user.id,
                    name: user.user_metadata.full_name || "NUST Student",
                    email: user.email,
                    school: user.user_metadata.school || "SEECS", // Default fallback
                    avatar_url: null,
                    created_at: new Date().toISOString()
                }
            }
            setProfile(profileData);
            setEditName(profileData.name || "");
            setEditSchool(profileData.school || "");

            // 3. Get My Posted Events
            const { data: eventsData } = await supabase
                .from("events")
                .select("*")
                .eq("created_by", user.id)
                .order("start_time", { ascending: false });

            if (eventsData) {
                // Approximate status logic (since we don't have a status col yet, assume all are 'active')
                setMyEvents(eventsData.map(e => ({
                    ...e,
                    status: "approved" // Defaulting to approved for now
                })));
            }

            // 4. Get My RSVPs
            // We need to join rsvps -> events
            const { data: rsvpsData } = await supabase
                .from("rsvps")
                .select(`
                    event_id,
                    events:event_id (
                        id,
                        title,
                        start_time,
                        venue_name
                    )
                `)
                .eq("user_id", user.id);

            if (rsvpsData) {
                const formattedRsvps = rsvpsData.map((item: any) => ({
                    ...item.events,
                    event_id: item.event_id
                }));
                setMyRsvps(formattedRsvps);
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    // Avatar Upload State
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploadingAvatar(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            const supabase = createClient();

            // 1. Upload
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update Profile immediately
            const updates = {
                id: user.id,
                avatar_url: publicUrl,
                updated_at: new Date(), // assuming you have this column, or ignore if not
            };

            const { error: updateError } = await supabase.from('profiles').upsert(updates);

            if (updateError) {
                throw updateError;
            }

            // 4. Update local state
            setProfile({ ...profile!, avatar_url: publicUrl });
            alert("Avatar updated!");

        } catch (error: any) {
            alert("Error uploading avatar: " + error.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        setSaving(true);
        const supabase = createClient();

        // Upsert profile
        const updates = {
            id: user.id,
            name: editName,
            school: editSchool,
            // updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);
        if (error) {
            alert("Error updating profile: " + error.message);
        } else {
            alert("Profile updated!");
            setProfile({ ...profile!, name: editName, school: editSchool });
        }
        setSaving(false);
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
            </div>
        );
    }

    if (!user || !profile) return null;

    // Helper for initials
    const initials = profile.name
        ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "NS";

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Header */}
            <section className="py-12 bg-nust-blue">
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-cream border-4 border-nust-orange flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.3)] overflow-hidden">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.name || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-heading text-4xl text-nust-blue">
                                        {initials}
                                    </span>
                                )}
                            </div>

                            {/* Upload Overlay */}
                            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs uppercase tracking-wide">
                                {uploadingAvatar ? (
                                    <span className="animate-pulse">Uploading...</span>
                                ) : (
                                    <span>Change</span>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left">
                            <h1 className="font-heading text-4xl text-white mb-1">{(profile.name || "NUST STUDENT").toUpperCase()}</h1>
                            <p className="font-display text-white/70 mb-2">{user.email}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="px-3 py-1 bg-nust-orange text-nust-blue font-bold text-sm rounded-full">
                                    {profile.school || "NUST"}
                                </span>
                                <span className="text-white/50 text-sm font-display">
                                    Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{myRsvps.length}</div>
                            <div className="font-display text-xs text-white/70 uppercase">RSVPs</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{myEvents.length}</div>
                            <div className="font-display text-xs text-white/70 uppercase">Posted</div>
                        </div>
                        {/* 
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{mockUser.rsvpCount}</div>
                            <div className="font-display text-xs text-white/70 uppercase">RSVPs</div>
                        </div> 
                        */}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="bg-white border-b-2 border-nust-blue sticky top-20 z-40">
                <div className="container">
                    <div className="flex gap-1">
                        {[
                            { key: "rsvps", label: "My RSVPs" },
                            { key: "events", label: "My Events" },
                            { key: "settings", label: "Settings" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`px-6 py-4 font-heading text-lg border-b-4 transition-colors ${activeTab === tab.key
                                    ? "border-nust-orange text-nust-blue"
                                    : "border-transparent text-nust-blue/50 hover:text-nust-blue"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-12">
                <div className="container max-w-4xl">
                    {/* RSVPs Tab */}
                    {activeTab === "rsvps" && (
                        <div className="space-y-4">
                            <h2 className="font-heading text-2xl text-nust-blue mb-6">UPCOMING EVENTS</h2>

                            {myRsvps.length > 0 ? (
                                myRsvps.map((event) => (
                                    <Link
                                        key={event.event_id}
                                        href={`/events/${event.id}`}
                                        className="block bg-white border-2 border-nust-blue rounded-xl p-5 hover:shadow-[4px_4px_0px_var(--nust-blue)] transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-heading text-xl text-nust-blue">{event.title}</h3>
                                                <p className="font-display text-sm text-nust-blue/60 mt-1">
                                                    📅 {new Date(event.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: 'numeric', minute: '2-digit' })}
                                                    &nbsp;&nbsp;📍 {event.venue_name}
                                                </p>
                                            </div>
                                            <span className="text-nust-orange font-heading text-2xl">→</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white border-2 border-nust-blue rounded-xl">
                                    <div className="text-5xl mb-4">📅</div>
                                    <p className="font-display text-nust-blue/60">No upcoming RSVPs</p>
                                    <Link href="/events" className="btn btn-primary mt-4">
                                        Explore Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === "events" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-2xl text-nust-blue">MY POSTED EVENTS</h2>
                                <Link href="/post-event" className="btn btn-primary text-sm">
                                    + Post New
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {myEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-white border-2 border-nust-blue rounded-xl p-5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-heading text-xl text-nust-blue">{event.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${event.status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <p className="font-display text-sm text-nust-blue/60">
                                                    📅 {new Date(event.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </div>
                                            <Link href={`/events/${event.id}`} className="text-nust-blue/50 hover:text-nust-blue">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {myEvents.length === 0 && (
                                    <div className="text-center py-12 bg-white border-2 border-nust-blue rounded-xl">
                                        <p className="font-display text-nust-blue/60">You haven't posted any events yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]">
                            <h2 className="font-heading text-2xl text-nust-blue mb-6">ACCOUNT SETTINGS</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                    />
                                </div>

                                <div>
                                    <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                        School/Department
                                    </label>
                                    <select
                                        value={editSchool}
                                        onChange={(e) => setEditSchool(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                    >
                                        <option value="">Select School</option>
                                        <option value="SEECS">SEECS</option>
                                        <option value="SMME">SMME</option>
                                        <option value="SCME">SCME</option>
                                        <option value="SADA">SADA</option>
                                        <option value="NBS">NBS</option>
                                        <option value="S3H">S3H</option>
                                        <option value="NICE">NICE</option>
                                        <option value="RCMS">RCMS</option>
                                        <option value="ASAB">ASAB</option>
                                        <option value="SNS">SNS</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-heading text-lg text-nust-blue mb-4">NOTIFICATIONS</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-nust-blue" />
                                            <span className="font-display text-nust-blue">Email me about events I RSVPd to</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-nust-blue" />
                                            <span className="font-display text-nust-blue">Weekly digest of popular events</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={saving}
                                    className="btn btn-primary w-full mt-4"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
