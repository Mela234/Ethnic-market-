import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function StoreCard({ store, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Store Image / Hero */}
      <View style={[styles.imgArea, { backgroundColor: store.headerBg[0] }]}>
        {/* Diagonal Origin Flag */}
        <View style={styles.flagWrap}>
          <Text style={styles.flagText}>{store.flag} {store.origin.toUpperCase()}</Text>
        </View>
        <Text style={styles.storeEmoji}>{store.emoji}</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.storeName}>{store.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{store.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{store.distance}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{store.deliveryTime}</Text>
        </View>
        <View style={styles.tagsRow}>
          {store.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.deliveryRow}>
          <Feather name="truck" size={13} color={COLORS.textDim} />
          <Text style={styles.deliveryText}>${store.deliveryFee.toFixed(2)} delivery</Text>
        </View>
        <View style={styles.orderBtn}>
          <Text style={styles.orderBtnText}>Order Now</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    marginBottom: 14,
    overflow: 'hidden',
  },
  imgArea: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  storeEmoji: { fontSize: 44 },

  // Diagonal flag ribbon
  flagWrap: {
    position: 'absolute',
    top: 10,
    left: -26,
    backgroundColor: COLORS.mustard,
    paddingHorizontal: 30,
    paddingVertical: 4,
    transform: [{ rotate: '-12deg' }],
    borderWidth: 1.5,
    borderColor: COLORS.black,
    zIndex: 10,
  },
  flagText: { fontSize: 10, fontWeight: '800', color: COLORS.black, letterSpacing: 0.5 },

  body: { padding: 12 },
  storeName: { fontSize: 15, fontWeight: '700', color: COLORS.black },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  star: { color: COLORS.mustard, fontSize: 13, fontWeight: '700' },
  rating: { fontSize: 12, fontWeight: '700', color: COLORS.black },
  dot: { color: '#CCC', fontSize: 12 },
  meta: { fontSize: 12, color: COLORS.textDim },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: {
    backgroundColor: COLORS.mustardLight,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS.mustardBorder,
  },
  tagText: { fontSize: 11, fontWeight: '700', color: COLORS.mustardDeep },

  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#F0EDE6',
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deliveryText: { fontSize: 12, color: COLORS.textDim, fontWeight: '500' },
  orderBtn: {
    backgroundColor: COLORS.black, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 7,
  },
  orderBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
});
