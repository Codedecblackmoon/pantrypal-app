import { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/config/supabase';

export default function AddItemScreen() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expiryDate, setExpiryDate] = useState('');
  const router = useRouter();

//   const handleAdd = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     const { error } = await supabase.from('pantry_items').insert({
//       user_id: user.id,
//       name,
//       quantity: Number(quantity),
//       expiry_date: expiryDate,
//       status: 'active',
//     });
//     if (!error) router.back();
//   };
    const handleAdd = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     Alert.alert('Error', 'You must be logged in to add an item.');
        //     return;
        // }
        if (!user) {
          Alert.alert('Not logged in', 'Please log in to add items.', [
            { text: 'OK', onPress: () => router.replace('/(auth)/login') },
          ]);
          return;
        }


        const { error } = await supabase.from('pantry_items').insert({
            user_id: user.id,
            name,
            quantity: Number(quantity),
            expiry_date: expiryDate,
            status: 'active',
        });

        if (!error) router.back();
        };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Item name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Quantity" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
      <TextInput style={styles.input} placeholder="Expiry date (YYYY-MM-DD)" value={expiryDate} onChangeText={setExpiryDate} />
      <Button title="Add to Pantry" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
});