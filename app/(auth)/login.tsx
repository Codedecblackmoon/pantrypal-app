import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../src/config/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    // No manual navigation needed — root layout's redirect effect handles it
    // once `session` updates via onAuthStateChange
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PantryPal</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Log In" onPress={handleLogin} />
      <Link href="/(auth)/signup" style={styles.link}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  error: { color: 'red', marginBottom: 12 },
  link: { color: '#3478f6', marginTop: 16, textAlign: 'center' },
});