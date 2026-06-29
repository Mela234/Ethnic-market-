import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '../theme/colors';
import { useCart } from '../context/CartContext';

export default function StoreScreen({ route, navigation }) {
  const { store } = route.params;
  const { addItem, removeItem, items, totalItems, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState(store.categories[0]);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'

  const filteredProducts = store.products.filter(p => p.category === activeCategory);

  const getItemQty = (id) => items.find(i => i.id === id)?.qty ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: store.headerBg[0] }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.heroEmoji}>{store.emoji}</Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>{store.flag} {store.origin.toUpperCase()}</Text>
        </View>

        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{store.name}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroStar}>★ {store.rating}</Text>
            <Text style={styles.heroDot}>·</Text>
            <Text style={styles.heroMetaText}>{store.reviewCount} reviews</Text>
            <Text style={styles.heroDot}>·</Text>
            <Text style={styles.heroMetaText}>{store.distance}</Text>
          </View>
        </View>

        {/* Order Type Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, orderType === 'delivery' && styles.toggleBtnActive]}
            onPress={() => setOrderType('delivery')}
          >
            <Feather name="truck" size={13} color={orderType === 'delivery' ? COLORS.black : COLORS.gray} />
            <Text style={[styles.toggleText, orderType === 'delivery' && styles.toggleTextActive]}>
              Delivery · {store.deliveryTime}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, orderType === 'pickup' && styles.toggleBtnActive]}
            onPress={() => setOrderType('pickup')}
          >
            <Feather name="shopping-bag" size={13} color={orderType === 'pickup' ? COLORS.black : COLORS.gray} />
            <Text style={[styles.toggleText, orderType === 'pickup' && styles.toggleTextActive]}>
              Pickup · ~15 min
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.catBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {store.categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catTabText, activeCategory === cat && styles.catTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products */}
      <ScrollView style={styles.productScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.productGrid}>
          {filteredProducts.map(product => {
            const qty = getItemQty(product.id);
            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImgArea}>
                  <Text style={styles.productEmoji}>{product.emoji}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productUnit}>{product.unit}</Text>
                  <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                    {qty === 0 ? (
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => addItem(product, store.id)}
                      >
                        <Feather name="plus" size={16} color={COLORS.black} />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qtyControl}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(product.id)}>
                          <Feather name="minus" size={13} color={COLORS.black} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{qty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => addItem(product, store.id)}>
                          <Feather name="plus" size={13} color={COLORS.black} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ height: totalItems > 0 ? 100 : 30 }} />
      </ScrollView>

      {/* Cart Bar */}
      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
          <Text style={styles.cartBarText}>View Cart</Text>
          <Text style={styles.cartBarPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },

  hero: { padding: 20, paddingTop: 10, position: 'relative' },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  heroEmoji: { fontSize: 52, textAlign: 'center', marginBottom: 8 },
  heroBadge: {
    backgroundColor: COLORS.mustard,
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'center', marginBottom: 10,
    borderWidth: 1.5, borderColor: COLORS.black,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '800', color: COLORS.black, letterSpacing: 0.5 },
  heroInfo: { alignItems: 'center', marginBottom: 14 },
  heroName: { color: COLORS.white, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  heroStar: { color: COLORS.mustard, fontSize: 13, fontWeight: '700' },
  heroDot: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  heroMetaText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 9, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  toggleBtnActive: { backgroundColor: COLORS.mustard, borderColor: COLORS.mustard },
  toggleText: { color: COLORS.gray, fontSize: 12, fontWeight: '600' },
  toggleTextActive: { color: COLORS.black },

  catBar: { backgroundColor: COLORS.black, paddingHorizontal: 16, paddingVertical: 10 },
  catTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: COLORS.charcoalLight },
  catTabActive: { backgroundColor: COLORS.mustard, borderColor: COLORS.mustard },
  catTabText: { color: COLORS.gray, fontSize: 12, fontWeight: '600' },
  catTabTextActive: { color: COLORS.black },

  productScroll: { flex: 1, backgroundColor: COLORS.white },
  productGrid: { padding: 14, gap: 12 },
  productCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS.grayBorder,
    flexDirection: 'row', overflow: 'hidden',
  },
  productImgArea: {
    width: 88, backgroundColor: COLORS.grayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  productEmoji: { fontSize: 36 },
  productInfo: { flex: 1, padding: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.black },
  productUnit: { fontSize: 11, color: COLORS.gray, marginTop: 1 },
  productDesc: { fontSize: 12, color: COLORS.textDim, marginTop: 4, lineHeight: 16 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  productPrice: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  addBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.mustard,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.mustardLight,
    borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2,
    borderWidth: 1, borderColor: COLORS.mustardBorder,
  },
  qtyBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.mustard,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 14, fontWeight: '800', color: COLORS.black, minWidth: 18, textAlign: 'center' },

  cartBar: {
    position: 'absolute', bottom: 20, left: 16, right: 16,
    backgroundColor: COLORS.black,
    borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.mustard,
  },
  cartBadge: {
    backgroundColor: COLORS.mustard, borderRadius: 10,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  cartBadgeText: { color: COLORS.black, fontSize: 12, fontWeight: '800' },
  cartBarText: { color: COLORS.white, fontSize: 15, fontWeight: '700', flex: 1 },
  cartBarPrice: { color: COLORS.mustard, fontSize: 15, fontWeight: '800' },
});
