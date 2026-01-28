import { useEffect } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';

export function useNotifications() {
  useEffect(() => {
    const requestPermission = async () => {
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
        const permission = await Notification.requestPermission();
        console.log('Notification permission status:', permission);
        
        if (permission === 'granted') {
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

    requestPermission();
  }, []);
}
