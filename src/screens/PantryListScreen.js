// import { useEffect, useState } from 'react';
// import { View, FlatList, Button, StyleSheet } from 'react-native';
// import { supabase } from '../config/supabase';
// import PantryItemCard from '../components/PantryItemCard';

// export default function PantryListScreen({ navigation }) {
//   const [items, setItems] = useState([]);

//   const fetchItems = async () => {
//     const { data, error } = await supabase
//       .from('pantry_items')
//       .select('*')
//       .eq('status', 'active')
//       .order('expiry_date', { ascending: true });

//     if (!error) setItems(data);
//   };

//   useEffect(() => {
//     fetchItems();

//     // Realtime subscription: auto-refresh when items change
//     const channel = supabase
//       .channel('pantry_items_changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'pantry_items' },
//         () => fetchItems()
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Button title="+ Add Item" onPress={() => navigation.navigate('AddItem')} />
//       <FlatList
//         data={items}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <PantryItemCard
//             item={item}
//             onPress={() => navigation.navigate('ItemDetail', { item })}
//           />
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });

import { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../config/supabase';
import { api } from '../services/api';
import PantryItemCard from '../components/PantryItemCard';

async function registerForPushNotifications() {
  if (!Device.isDevice) return; // push doesn't work on simulators

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  await api.registerPushToken(tokenData.data);
}

export default function PantryListScreen({ navigation }) {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('status', 'active')
      .order('expiry_date', { ascending: true });

    if (!error) setItems(data);
  };

  useEffect(() => {
    fetchItems();
    registerForPushNotifications(); // ← added here, runs once when the screen first mounts

    const channel = supabase
      .channel('pantry_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pantry_items' }, () => fetchItems())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <View style={styles.container}>
      <Button title="+ Add Item" onPress={() => navigation.navigate('AddItem')} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PantryItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { item })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 } });