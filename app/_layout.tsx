import { useEffect } from 'react';
import { Stack, useRouter, useSegments, type Href } from 'expo-router';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';

// function RootLayoutNav() {
//   const { session, loading } = useAuth();
//   const segments = useSegments() as string[];
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;

//     const inAuthGroup = segments[0] === '(auth)';

//     if (!session && !inAuthGroup) {
//       // Not logged in, and not already on a login/signup screen → redirect there
//       router.replace('/add-item' as Href);
//     } else if (session && inAuthGroup) {
//       // Logged in, but sitting on login/signup → redirect into the app
//       router.replace('/(tabs)' as Href);
//     }
//   }, [session, loading, segments]);

//   if (loading) return null; // could render a splash screen here

//   return <Stack screenOptions={{ headerShown: false }} />;
// }

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  console.log('AUTH DEBUG:', { loading, hasSession: !!session, segments });

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}