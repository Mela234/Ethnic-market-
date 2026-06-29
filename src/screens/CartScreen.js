import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { STORES } from '../data/stores';

export default function CartScreen() {
  const { items, storeId, addItem, removeItem, clearCart, totalItems, totalPrice } = useCart();

  const store = STORES.find(s => s.id === storeId);
  const deliveryFee = store?.deliveryFee ?? 0;
  const tax = totalPrice * 0.095;
  const grandTotal = totalPrice + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🧺</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Browse stores and add items to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {store && <Text style={styles.headerStore}>{store.flag} {store.name}</Text>}
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsCard}>
          {items.map((item, i) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemUnit}>{item.unit}</Text>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(item.id)}>
                      <Feather name="minus" size={11} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => addItem(item, storeId)}>
                      <Feather name="plus" size={11} color={COLORS.black} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {i < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.summaryVal}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery fee</Text>
            <Text style={styles.summaryVal}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (9.5%)</Text>
            <Text style={styles.summaryVal}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>${grandTotal.toFixed(2)}</Text>
          <Text style={styles.checkoutSub}>incl. tax & delivery</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Place Order</Text>
          <Feather name="arrow-right" size={16} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.grayLight },
  header: {
    backgroundColor: COLORS.black, padding: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: COLORS.mustard,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', flex: 1 },
  headerStore: { color: COLORS.mustard, fontSize: 12, fontWeight: '600', marginRight: 12 },
  clearText: { color: COLORS.gray, fontSize: 13, fontWeight: '600' },

  scroll: { flex: 1 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.black, marginBottom: 8 },
  emptySub: { fontSize: 14, color: COLORS.textDim, textAlign: 'center' },

  itemsCard: {
    backgroundColor: COLORS.white, margin: 16,
    borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.grayBorder,
    padding: 4,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  itemEmoji: { fontSize: 30, width: 40, textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.black },
  itemUnit: { fontSize: 11, color: COLORS.gray, marginTop: 1 },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemPrice: { fontSize: 14, fontWeight: '800', color: COLORS.black },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.mustardLight, borderRadius: 16,
    paddingHorizontal: 4, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS.mustardBorder,
  },
  qtyBtn: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: COLORS.mustard, alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 13, fontWeight: '800', color: COLORS.black, minWidth: 16, textAlign: 'center' },
  divider: { height: 1, backgroundColor: COLORS.grayBorder, marginHorizontal: 12 },

  summaryCard: {
    backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 16, borderWidth: 1.5, borderColor: COLORS.grayBorder,
    padding: 16, gap: 10,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 13, color: COLORS.textDim },
  summaryVal: { fontSize: 13, fontWeight: '600', color: COLORS.black },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.grayBorder, paddingTop: 10, marginTop: 2 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  totalVal: { fontSize: 15, fontWeight: '800', color: COLORS.black },

  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.black, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 2, borderTopColor: COLORS.mustard,
  },
  checkoutTotal: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  checkoutSub: { color: COLORS.gray, fontSize: 11 },
  checkoutBtn: {
    backgroundColor: COLORS.mustard, borderRadius: 14,
    paddingHorizontal: 22, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  checkoutBtnText: { color: COLORS.black, fontSize: 15, fontWeight: '800' },
});
