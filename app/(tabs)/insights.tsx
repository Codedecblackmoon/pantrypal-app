import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { api } from '../../src/services/api';

export default function InsightsScreen() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInsights = async () => {
    try {
      const data = await api.getInsights();
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInsights().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { used = 0, expired = 0, wasteRate = 0 } = insights || {};

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.heading}>Your Pantry Insights</Text>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{wasteRate}%</Text>
        <Text style={styles.statLabel}>Waste rate</Text>
        <Text style={styles.statSub}>
          {wasteRate === 0
            ? 'No items tracked yet — start marking items used or expired!'
            : wasteRate < 20
            ? "You're doing great at using up your food!"
            : 'Try planning meals around items expiring soon.'}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.smallCard, { backgroundColor: '#d4edda' }]}>
          <Text style={styles.smallNumber}>{used}</Text>
          <Text style={styles.smallLabel}>Used ✅</Text>
        </View>
        <View style={[styles.smallCard, { backgroundColor: '#f8d7da' }]}>
          <Text style={styles.smallNumber}>{expired}</Text>
          <Text style={styles.smallLabel}>Expired ❌</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  statCard: {
    backgroundColor: '#f0f0f5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: { fontSize: 48, fontWeight: 'bold' },
  statLabel: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  statSub: { textAlign: 'center', color: '#555', marginTop: 8 },
  row: { flexDirection: 'row', gap: 12 },
  smallCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  smallNumber: { fontSize: 28, fontWeight: 'bold' },
  smallLabel: { marginTop: 4 },
});