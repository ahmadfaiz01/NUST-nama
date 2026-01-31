import { createClient } from '@/lib/supabase/client';

/**
 * Request notification permission and subscribe to push
 */
export async function subscribeToPushNotifications(userId: string): Promise<boolean> {
    // Check browser support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported in this browser');
        return false;
    }

    try {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return false;
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // Get VAPID public key from environment
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
            console.error('VAPID public key not configured');
            return false;
        }

        // Convert VAPID key to proper format
        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey,
        });

        // Save subscription to user's profile in database
        const supabase = createClient();
        const { error } = await supabase
            .from('profiles')
            .update({ push_subscription: subscription.toJSON() })
            .eq('id', userId);

        if (error) {
            console.error('Failed to save push subscription:', error);
            return false;
        }

        console.log('Successfully subscribed to push notifications');
        return true;
    } catch (error) {
        console.error('Error subscribing to push:', error);
        return false;
    }
}

/**
 * Check if user is subscribed to push notifications
 */
export async function isPushSubscribed(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return !!subscription;
    } catch {
        return false;
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(userId: string): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
        }

        // Remove from database
        const supabase = createClient();
        await supabase
            .from('profiles')
            .update({ push_subscription: null })
            .eq('id', userId);

        return true;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return false;
    }
}

/**
 * Convert VAPID key from base64 to Uint8Array
 * Uses ArrayBuffer to ensure correct type for PushManager
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
