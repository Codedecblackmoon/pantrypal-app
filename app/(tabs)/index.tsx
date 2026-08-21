
// import { useEffect, useState } from 'react';
// import { View, FlatList, Button, StyleSheet } from 'react-native';
// import { useRouter, type Href } from 'expo-router';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { supabase } from '../../src/config/supabase';
// import { api } from '../../src/services/api';
// import PantryItemCard from '../../src/components/PantryItemCard';
// import { PantryItem } from '../../src/types';

// // async function registerForPushNotifications() {
// //   if (!Device.isDevice) return;
// //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
// //   let finalStatus = existingStatus;
// //   if (existingStatus !== 'granted') {
// //     const { status } = await Notifications.requestPermissionsAsync();
// //     finalStatus = status;
// //   }
// //   if (finalStatus !== 'granted') return;
// //   const tokenData = await Notifications.getExpoPushTokenAsync();
// //   await api.registerPushToken(tokenData.data);
// // }

// export default function PantryListScreen() {
//   const [items, setItems] = useState<PantryItem[]>([]);
//   const router = useRouter();

//   const fetchItems = async () => {
//     const { data, error } = await supabase
//       .from('pantry_items')
//       .select('*')
//       .eq('status', 'active')
//       .order('expiry_date', { ascending: true });
//     if (!error && data) setItems(data);
//   };

//   useEffect(() => {
//     fetchItems();
//     // registerForPushNotifications();

//     const channel = supabase
//       .channel('pantry_items_changes')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'pantry_items' }, () => fetchItems())
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Button title="+ Add Item" onPress={() => router.push('/add-item' as Href)} />
//       <FlatList
//         data={items}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <PantryItemCard item={item} onPress={() => router.push(`/item/${item.id}` as Href)} />
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });

import { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, type Href, Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../../src/config/supabase';
import { api } from '../../src/services/api';
import PantryItemCard from '../../src/components/PantryItemCard';
import { PantryItem } from '../../src/types';

// async function registerForPushNotifications() {
//   if (!Device.isDevice) return;
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== 'granted') return;
//   const tokenData = await Notifications.getExpoPushTokenAsync();
//   await api.registerPushToken(tokenData.data);
// }

export default function PantryListScreen() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const router = useRouter();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('status', 'active')
      .order('expiry_date', { ascending: true });
    if (!error && data) setItems(data);
  };

  const handleLogout = () => {
    Alert.alert('Log out?', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.unregisterPushToken();
          } catch (err) {
            console.warn('Failed to unregister push token:', err);
            // not fatal — proceed with logout anyway
          }
          await supabase.auth.signOut();
          // root layout's redirect effect handles sending us to /login automatically
        },
      },
    ]);
  };

  useEffect(() => {
    fetchItems();
    // registerForPushNotifications();

    const channel = supabase
      .channel('pantry_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pantry_items' }, () => fetchItems())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Pantry',
          headerRight: () => <Button title="Log out" onPress={handleLogout} />,
        }}
      />
      <Button title="+ Add Item" onPress={() => router.push('/add-item' as Href)} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PantryItemCard item={item} onPress={() => router.push(`/item/${item.id}` as Href)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });