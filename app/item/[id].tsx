import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/config/supabase';
import { PantryItem } from '../../src/types';
export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<PantryItem | null>(null); //maintain the state of the item being viewed.... changed from PantryItem | null to PantryItem | undefined
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      const { data } = await supabase.from('pantry_items').select('*').eq('id', id).single();
      if (data) {
        setItem(data);
        setQuantity(String(data.quantity));
        setExpiryDate(data.expiry_date);
      }
    };
    loadItem();
  }, [id]);

//   const updateStatus = async (status) => {
//     setSaving(true);
//     const { error } = await supabase
//       .from('pantry_items')
//       .update({ status, updated_at: new Date().toISOString() })
//       .eq('id', id);
//     setSaving(false);
//     if (error) Alert.alert('Error', error.message);
//     else router.back();
//   };
  const updateStatus = async (status: 'used' | 'expired') => {
    setSaving(true);
    const { error } = await supabase
        .from('pantry_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    setSaving(false);
    if (error) Alert.alert('Error', error.message);
    else router.back();
    };

  const saveEdits = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('pantry_items')
      .update({ quantity: Number(quantity), expiry_date: expiryDate, updated_at: new Date().toISOString() })
      .eq('id', id);
    setSaving(false);
    if (error) Alert.alert('Error', error.message);
    else router.back();
  };

  const deleteItem = async () => {
    Alert.alert('Delete item?', `Remove ${item?.name} from your pantry?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('pantry_items').delete().eq('id', id);
          if (!error) router.back();
        },
      },
    ]);
  };

  if (!item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.label}>Quantity</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={quantity} onChangeText={setQuantity} />
      <Text style={styles.label}>Expiry date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={expiryDate} onChangeText={setExpiryDate} />
      <Button title="Save changes" onPress={saveEdits} disabled={saving} />
      <View style={styles.spacer} />
      <Button title="Mark as Used ✅" onPress={() => updateStatus('used')} disabled={saving} />
      <View style={styles.spacer} />
      <Button title="Mark as Expired ❌" color="#cc3333" onPress={() => updateStatus('expired')} disabled={saving} />
      <View style={styles.spacer} />
      <Button title="Delete item" color="gray" onPress={deleteItem} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  spacer: { height: 12 },
});