import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import AuthScreen from './AuthScreen';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [authVisible, setAuthVisible] = useState(false);

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  // Guest: browsing without an account.
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.body}>
          <View style={[styles.bigAvatar, styles.guestAvatar]}>
            <Text style={styles.guestAvatarText}>?</Text>
          </View>
          <Text style={styles.name}>Browsing as guest</Text>
          <Text style={styles.meta}>Sign in to place orders and track them</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={() => setAuthVisible(true)}>
            <Text style={styles.primaryText}>Sign in or create account</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={authVisible} animationType="slide" onRequestClose={() => setAuthVisible(false)}>
          <AuthScreen
            onClose={() => setAuthVisible(false)}
            onSuccess={() => setAuthVisible(false)}
          />
        </Modal>
      </SafeAreaView>
    );
  }

  const initial = (user.name || user.phone || '?').trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bigAvatar}>
          <Text style={styles.bigAvatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{user.name || 'Bazaar customer'}</Text>
        <Text style={styles.meta}>{user.phone}</Text>
        {user.email ? <Text style={styles.meta}>{user.email}</Text> : null}

        <TouchableOpacity style={styles.signOutBtn} onPress={confirmSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },

  header: { backgroundColor: COLORS.black, padding: 20, paddingTop: 14 },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800' },

  body: { flex: 1, alignItems: 'center', paddingTop: 44 },
  bigAvatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.mustard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.black,
  },
  bigAvatarText: { color: COLORS.black, fontWeight: '800', fontSize: 32 },
  guestAvatar: { backgroundColor: COLORS.charcoal, borderColor: COLORS.charcoalLight },
  guestAvatarText: { color: COLORS.gray, fontWeight: '800', fontSize: 32 },

  name: { fontSize: 19, fontWeight: '700', color: COLORS.black, marginTop: 14 },
  meta: { fontSize: 13, color: COLORS.gray, marginTop: 3, textAlign: 'center' },

  primaryBtn: {
    marginTop: 24,
    backgroundColor: COLORS.mustard,
    borderRadius: 12,
    paddingHorizontal: 26,
    paddingVertical: 13,
  },
  primaryText: { color: COLORS.black, fontWeight: '800', fontSize: 14 },

  signOutBtn: {
    marginTop: 30,
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  signOutText: { color: COLORS.black, fontWeight: '700', fontSize: 14 },
});
