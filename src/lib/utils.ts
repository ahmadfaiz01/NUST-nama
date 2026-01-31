import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for conditionally constructing className strings
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = target.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 0) {
        // Past
        if (diffMins > -60) return `${Math.abs(diffMins)} min ago`;
        if (diffHours > -24) return `${Math.abs(diffHours)} hours ago`;
        return `${Math.abs(diffDays)} days ago`;
    } else {
        // Future
        if (diffMins < 60) return `in ${diffMins} min`;
        if (diffHours < 24) return `in ${diffHours} hours`;
        return `in ${diffDays} days`;
    }
}

/**
 * Format date for display
 */
export function formatEventDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

/**
 * Check if coordinates are within a geofence radius
 */
export function isWithinGeofence(
    userLat: number,
    userLng: number,
    venueLat: number,
    venueLng: number,
    radiusMeters: number
): boolean {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (userLat * Math.PI) / 180;
    const φ2 = (venueLat * Math.PI) / 180;
    const Δφ = ((venueLat - userLat) * Math.PI) / 180;
    const Δλ = ((venueLng - userLng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance <= radiusMeters;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
