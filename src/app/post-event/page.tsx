"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { findVenueCoordinates, getVenueSuggestions, NUST_VENUES } from "@/lib/nust_venues";
import type { Venue } from "@/lib/nust_venues";

export default function PostEventPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        category: "",
        tags: "",
        registrationUrl: "",
        allowGuests: false,
        isPrivate: false,
    });

    // New state for location & images
    const [venueLocation, setVenueLocation] = useState<{ name: string, lat: number, lng: number } | null>(null);
    const [venueSuggestions, setVenueSuggestions] = useState<Venue[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const categories = [
        "Tech & Innovation",
        "Cultural",
        "Sports",
        "Academic",
        "Career",
        "Entertainment",
        "Social",
        "Workshop",
        "Competition",
        "Other",
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Show suggestions if typing in venue field
        if (name === "venue") {
            if (value.trim().length > 0) {
                const suggestions = getVenueSuggestions(value);
                setVenueSuggestions(suggestions);
                setShowSuggestions(true);
            } else {
                setVenueSuggestions([]);
                setShowSuggestions(false);
                setVenueLocation(null);
            }
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (venue: Venue) => {
        setFormData(prev => ({
            ...prev,
            venue: venue.name,
        }));
        setVenueLocation({
            name: venue.name,
            lat: venue.lat,
            lng: venue.lng,
        });
        setShowSuggestions(false);
    };

    // Auto-detect venue coordinates on blur
    const handleVenueBlur = () => {
        if (!formData.venue) return;
        const found = findVenueCoordinates(formData.venue);
        if (found) {
            setVenueLocation(found);
            // Optional: Auto-correct the name to the official one
            // setFormData(prev => ({ ...prev, venue: found.name }));
        } else {
            setVenueLocation(null);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const supabase = createClient();

            // 1. Auth Check
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                alert("You must be logged in to post an event.");
                setUploading(false);
                return;
            }

            // 2. Upload Image (if any)
            let posterUrl = null;
            if (images.length > 0) {
                const file = images[0]; // Taking the first one as thumbnail/poster
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('event-posters')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('event-posters')
                    .getPublicUrl(fileName);

                posterUrl = publicUrl;
            } else {
                // Fallback placeholder
                posterUrl = `https://source.unsplash.com/random/800x600/?event,${formData.category}`;
            }

            // 3. Prepare Data
            const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
            const endDateTime = formData.endTime
                ? new Date(`${formData.date}T${formData.endTime}:00`)
                : new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

            const tagList = formData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0);

            // Use geocoded location or null
            const lat = venueLocation?.lat || null;
            const lng = venueLocation?.lng || null;

            // 4. Insert Event
            const { error } = await supabase.from("events").insert({
                title: formData.title,
                description: formData.description,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                venue_name: formData.venue,
                venue_lat: lat,
                venue_lng: lng,
                category: formData.category,
                tags: [formData.category, ...tagList],
                registration_url: formData.registrationUrl,
                allow_guests: formData.allowGuests,
                poster_url: posterUrl,
                created_by: user.id,
                is_official: false,
                status: "pending", // Events require admin approval
            });

            if (error) throw error;

            setSubmitted(true);
        } catch (err: any) {
            console.error("Error posting event:", err);
            alert(`Failed to post event: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-4">
                <div className="bg-white border-2 border-nust-blue rounded-xl p-8 md:p-12 text-center max-w-lg shadow-[8px_8px_0px_var(--nust-blue)]">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="font-heading text-4xl text-nust-blue mb-4">EVENT SUBMITTED!</h1>
                    <p className="font-display text-nust-blue/70 mb-6">
                        Your event has been submitted for review! Our team will approve it shortly. {venueLocation ? "📍 We found the venue on the map!" : ""}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-700 text-sm">
                            ⏳ <strong>Pending Approval</strong> - Your event will be visible once approved by an admin.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/events" className="btn btn-primary w-full justify-center">
                            View Events Feed
                        </Link>
                        <Link href="/profile" className="btn btn-outline w-full justify-center">
                            View My Events
                        </Link>
                        <Link href="/post-event" onClick={() => window.location.reload()} className="btn btn-outline w-full justify-center">
                            Post Another
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section
                className="py-12"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        POST AN EVENT
                    </h1>
                    <p className="text-white/80 text-lg font-display">
                        Share your event with the NUST community
                    </p>
                </div>
            </section>

            {/* Progress Steps */}
            <div className="bg-white border-b-2 border-nust-blue sticky top-20 z-40">
                <div className="container py-4">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <button
                                    onClick={() => s < step && setStep(s)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading text-lg transition-all ${s === step
                                        ? "bg-nust-blue text-white shadow-[2px_2px_0px_var(--nust-orange)]"
                                        : s < step
                                            ? "bg-nust-orange text-nust-blue"
                                            : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {s < step ? "✓" : s}
                                </button>
                                {s < 3 && (
                                    <div className={`w-16 h-1 ${s < step ? "bg-nust-orange" : "bg-gray-200"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form */}
            <section className="py-12">
                <div className="container max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">BASIC INFORMATION</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., SEECS Tech Fest 2026"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Venue *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="venue"
                                                    value={formData.venue}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        // Manually trigger location update since we don't have blur anymore
                                                        const found = NUST_VENUES.find(v => v.name === e.target.value);
                                                        if (found) {
                                                            setVenueLocation({ name: found.name, lat: found.lat, lng: found.lng });
                                                        }
                                                    }}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange appearance-none cursor-pointer"
                                                    style={{ backgroundImage: 'none' }} // Remove default arrow to use custom if needed, or stick to browser default
                                                >
                                                    <option value="" disabled className="text-gray-400">Select a location...</option>
                                                    {NUST_VENUES.map((v) => (
                                                        <option key={v.id} value={v.name}>{v.name}</option>
                                                    ))}
                                                </select>

                                                {/* Custom Chevron Arrow */}
                                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-nust-blue">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                Start Time *
                                            </label>
                                            <input
                                                type="time"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary w-full mt-8"
                                >
                                    Next: Add Details
                                </button>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">EVENT DETAILS</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Tell everyone what your event is about..."
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="e.g., hackathon, coding, prizes"
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                            Registration Link (optional)
                                        </label>
                                        <input
                                            type="url"
                                            name="registrationUrl"
                                            value={formData.registrationUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://forms.google.com/..."
                                            className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="allowGuests"
                                                checked={formData.allowGuests}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-2 border-nust-blue"
                                            />
                                            <span className="font-display text-nust-blue">Allow guests (non-NUST attendees)</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isPrivate"
                                                checked={formData.isPrivate}
                                                onChange={handleInputChange}
                                                className="w-5 h-5 rounded border-2 border-nust-blue"
                                            />
                                            <span className="font-display text-nust-blue">Private event (invite only)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="btn btn-outline flex-1"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="btn btn-primary flex-1"
                                    >
                                        Next: Add Media
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Media */}
                        {step === 3 && (
                            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <h2 className="font-heading text-2xl text-nust-blue mb-6">ADD MEDIA</h2>

                                <div className="space-y-6">
                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-nust-blue rounded-xl p-8 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <div className="text-5xl mb-4">📷</div>
                                            <p className="font-heading text-xl text-nust-blue mb-2">UPLOAD POSTER</p>
                                            <p className="font-display text-sm text-nust-blue/60">
                                                Click to select a high-quality event poster (Max 2MB)
                                            </p>
                                        </label>
                                    </div>

                                    {/* Preview */}
                                    {images.length > 0 && (
                                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-nust-blue">
                                            <img
                                                src={URL.createObjectURL(images[0])}
                                                alt="Event Poster Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImages([])}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="btn btn-outline flex-1"
                                        disabled={uploading}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-1"
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "Submit Event"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

