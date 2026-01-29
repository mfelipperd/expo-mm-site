echo "Setting up Vercel Environment Variables..."

echo "Adding NEXT_PUBLIC_FIREBASE_API_KEY"
echo "AIzaSyBHaL7VDwE12rGdX0GaJhu2hp3XQPncjNE" | npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

echo "Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "expo-mm-site.firebaseapp.com" | npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

echo "Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "expo-mm-site" | npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

echo "Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "expo-mm-site.firebasestorage.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

echo "Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "739233309720" | npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

echo "Adding NEXT_PUBLIC_FIREBASE_APP_ID"
echo "1:739233309720:web:6126762e641e436241cf6d" | npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo "Adding NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
echo "G-VXPGJ8CLXF" | npx vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production

echo "Adding NEXT_PUBLIC_FIREBASE_VAPID_KEY"
echo "BC9ISaiOunVhLca8vCCES8ReIxNCm_jj5J5LIG_FXUpbWhkRgqPjTlbwFATvshtXb5yddWNLB0MzkLLCxxQeOh4" | npx vercel env add NEXT_PUBLIC_FIREBASE_VAPID_KEY production

echo "All environment variables added."
