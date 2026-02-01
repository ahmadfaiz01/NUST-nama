import { createClient } from "@/lib/supabase/client";

export type UserRole = "student" | "admin" | "moderator";

export interface AdminCheckResult {
    isAdmin: boolean;
    isModerator: boolean;
    role: UserRole | null;
    userId: string | null;
}

/**
 * Check if the current user has admin or moderator privileges.
 * This function should be called from client components.
 */
export async function checkAdminStatus(): Promise<AdminCheckResult> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return {
            isAdmin: false,
            isModerator: false,
            role: null,
            userId: null,
        };
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return {
            isAdmin: false,
            isModerator: false,
            role: null,
            userId: user.id,
        };
    }

    const role = profile.role as UserRole;

    return {
        isAdmin: role === "admin",
        isModerator: role === "moderator" || role === "admin",
        role,
        userId: user.id,
    };
}

/**
 * Check if a specific user ID has admin privileges.
 * Useful for server-side checks.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
    const supabase = createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    return profile?.role === "admin";
}

/**
 * Check if a specific user ID has moderator or admin privileges.
 */
export async function isUserModeratorOrAdmin(userId: string): Promise<boolean> {
    const supabase = createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    return profile?.role === "admin" || profile?.role === "moderator";
}
