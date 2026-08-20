import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';

export default function AddItemScreen({ navigation }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expiryDate, setExpiryDate] = useState(''); // YYYY-MM-DD for now; swap for a date picker later

  const handleAdd = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('pantry_items').insert({
      user_id: user.id,
      name,
      quantity: Number(quantity),
      expiry_date: expiryDate,
      status: 'active',
    });

    if (!error) navigation.goBack();
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