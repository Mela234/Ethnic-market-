import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../theme/colors';

export function OrdersScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Orders</Text>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySub}>Your past and active orders will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.emptyState}>
        <View style={styles.bigAvatar}>
          <Text style={styles.bigAvatarText}>A</Text>
        </View>
        <Text style={styles.emptyTitle}>Guest User</Text>
        <Text style={styles.emptySub}>Sign in to track orders and save favorites</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.black, padding: 20, paddingTop: 14,
    borderBottomWidth: 2, borderBottomColor: COLORS.mustard,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  bigAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.mustard,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3, borderColor: COLORS.black,
  },
  bigAvatarText: { color: COLORS.black, fontWeight: '800', fontSize: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.black, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textDim, textAlign: 'center' },
});

// Add this line at the very bottom of OrdersScreen.js
export default OrdersScreen;