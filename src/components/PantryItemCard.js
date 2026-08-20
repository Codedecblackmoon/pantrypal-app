import { TouchableOpacity, Text, StyleSheet } from 'react-native';

function getUrgencyColor(expiryDate) {
  const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 1) return '#ffcccc'; // red
  if (daysLeft <= 3) return '#fff3cd'; // yellow
  return '#d4edda'; // green
}

export default function PantryItemCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: getUrgencyColor(item.expiry_date) }]}
      onPress={onPress}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>{item.quantity} {item.unit} — expires {item.expiry_date}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 8, marginVertical: 6 },
  name: { fontWeight: 'bold', fontSize: 16 },
});