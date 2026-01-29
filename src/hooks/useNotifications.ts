import { useEffect, useState } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';

export function useNotifications({ listen = true }: { listen?: boolean } = {}) {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const requestPermission = async () => {
    // ... existing logic ...
    console.log('Starting notification permission request...');
    if (typeof window === 'undefined') return;
    
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return;
    }

    if (!messaging) {
      console.warn('Firebase Messaging not initialized.');
      return;
    }

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      console.log('Notification permission status:', permissionResult);
      
      if (permissionResult === 'granted') {
        console.log('Requesting FCM token with VAPID key...');
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        
        if (token) {
          console.log('✅ Notification token generated:', token);
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      }
    } catch (error) {
      console.error('❌ Error in notification flow:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    if (!listen) return; // Skip listeners if listen is false

    // Listen for foreground messages
    let unsubscribe: (() => void) | undefined;
    
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
        console.log('🔔 Foreground message received:', payload);
        // You can implement your custom toast/notification UI here
        const { title, body } = payload.notification || {};
        if (title) {
           new Notification(title, { body, icon: '/assets/logo EMM_Prancheta 1.png' });
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [listen]); // Add listen dependency

  return { requestPermission, permission };
}
