import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../config/supabase';

export default function ItemDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [expiryDate, setExpiryDate] = useState(item.expiry_date);
  const [saving, setSaving] = useState(false);

  const updateStatus = async (status) => {
    setSaving(true);
    const { error } = await supabase
      .from('pantry_items')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.goBack();
    }
  };

  const saveEdits = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('pantry_items')
      .update({
        quantity: Number(quantity),
        expiry_date: expiryDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.goBack();
    }
  };

  const deleteItem = async () => {
    Alert.alert('Delete item?', `Remove ${item.name} from your pantry?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('pantry_items').delete().eq('id', item.id);
          if (!error) navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  spacer: { height: 12 },
});