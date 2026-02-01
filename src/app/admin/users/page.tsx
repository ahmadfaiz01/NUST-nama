"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface User {
    id: string;
    name: string | null;
    email?: string;
    faculty: string | null;
    role: "student" | "admin" | "moderator";
    is_banned: boolean;
    created_at: string;
    event_count?: number;
    rsvp_count?: number;
}

export default function AdminUsersPage() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get("filter") || "all";
    
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [roleModalUser, setRoleModalUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [filter, searchQuery]);

    const fetchUsers = async () => {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        // Filter
        if (filter === "banned") {
            query = query.eq("is_banned", true);
        } else if (filter === "admin") {
            query = query.eq("role", "admin");
        } else if (filter === "moderator") {
            query = query.eq("role", "moderator");
        }

        // Search
        if (searchQuery.trim()) {
            query = query.ilike("name", `%${searchQuery.trim()}%`);
        }

        const { data, error } = await query.limit(100);

        if (data) {
            // Get event counts for each user
            const userIds = data.map(u => u.id);
            
            const { data: eventCounts } = await supabase
                .from("events")
                .select("created_by")
                .in("created_by", userIds);
            
            const { data: rsvpCounts } = await supabase
                .from("rsvps")
                .select("user_id")
                .in("user_id", userIds);

            const eventCountMap: Record<string, number> = {};
            const rsvpCountMap: Record<string, number> = {};

            eventCounts?.forEach(e => {
                eventCountMap[e.created_by] = (eventCountMap[e.created_by] || 0) + 1;
            });

            rsvpCounts?.forEach(r => {
                rsvpCountMap[r.user_id] = (rsvpCountMap[r.user_id] || 0) + 1;
            });

            setUsers(data.map(u => ({
                ...u,
                event_count: eventCountMap[u.id] || 0,
                rsvp_count: rsvpCountMap[u.id] || 0,
            })));
        }

        setLoading(false);
    };

    const handleBanToggle = async (userId: string, currentlyBanned: boolean) => {
        if (!confirm(currentlyBanned 
            ? "Are you sure you want to unban this user?" 
            : "Are you sure you want to ban this user? They will not be able to post events or RSVP."
        )) {
            return;
        }

        setActionLoading(userId);
        const supabase = createClient();

        const { error } = await supabase
            .from("profiles")
            .update({ is_banned: !currentlyBanned })
            .eq("id", userId);

        if (!error) {
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, is_banned: !currentlyBanned } : u
            ));
        }

        setActionLoading(null);
    };

    const handleRoleChange = async (userId: string, newRole: "student" | "admin" | "moderator") => {
        setActionLoading(userId);
        const supabase = createClient();

        const { error } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", userId);

        if (!error) {
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, role: newRole } : u
            ));
        }

        setActionLoading(null);
        setRoleModalUser(null);
    };

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            admin: "bg-red-100 text-red-700 border-red-200",
            moderator: "bg-purple-100 text-purple-700 border-purple-200",
            student: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return styles[role] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-4xl text-nust-blue mb-2">USER MANAGEMENT</h1>
                <p className="text-gray-600 font-display">Manage user roles and access.</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-nust-blue focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {[
                            { id: "all", label: "All Users" },
                            { id: "admin", label: "Admins" },
                            { id: "moderator", label: "Moderators" },
                            { id: "banned", label: "Banned" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                                    filter === tab.id
                                        ? "bg-white text-nust-blue shadow-sm"
                                        : "text-gray-500 hover:text-nust-blue"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nust-blue"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="text-5xl mb-4 block">👥</span>
                        <h3 className="font-heading text-xl text-gray-600 mb-2">No Users Found</h3>
                        <p className="text-gray-500">No users match your search criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Faculty</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Activity</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Joined</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.is_banned ? 'bg-red-50' : ''}`}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-nust-blue rounded-full flex items-center justify-center text-white font-bold">
                                                    {(user.name || "U").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-nust-blue">
                                                        {user.name || "Unknown User"}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ID: {user.id.slice(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {user.faculty || "—"}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getRoleBadge(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-3">
                                                <span title="Events Posted">📅 {user.event_count}</span>
                                                <span title="RSVPs">🎟️ {user.rsvp_count}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4">
                                            {user.is_banned ? (
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                                                    🚫 Banned
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                    ✓ Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setRoleModalUser(user)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition-colors"
                                                    title="Change Role"
                                                >
                                                    👑
                                                </button>
                                                <button
                                                    onClick={() => handleBanToggle(user.id, user.is_banned)}
                                                    disabled={actionLoading === user.id}
                                                    className={`p-2 rounded-lg disabled:opacity-50 transition-colors ${
                                                        user.is_banned 
                                                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    }`}
                                                    title={user.is_banned ? "Unban User" : "Ban User"}
                                                >
                                                    {user.is_banned ? "✓" : "🚫"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Role Change Modal */}
            {roleModalUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="font-heading text-2xl text-nust-blue mb-2">
                            CHANGE USER ROLE
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Select a new role for <strong>{roleModalUser.name || "this user"}</strong>
                        </p>

                        <div className="space-y-3 mb-6">
                            {[
                                { id: "student", label: "Student", desc: "Regular user, can post events and RSVP" },
                                { id: "moderator", label: "Moderator", desc: "Can approve/reject events" },
                                { id: "admin", label: "Admin", desc: "Full access to all admin features" },
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleChange(roleModalUser.id, role.id as any)}
                                    disabled={actionLoading === roleModalUser.id}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                                        roleModalUser.role === role.id
                                            ? 'border-nust-blue bg-nust-blue/5'
                                            : 'border-gray-200 hover:border-nust-blue/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-nust-blue">{role.label}</p>
                                            <p className="text-sm text-gray-500">{role.desc}</p>
                                        </div>
                                        {roleModalUser.role === role.id && (
                                            <span className="text-nust-blue">✓</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setRoleModalUser(null)}
                            className="w-full py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
