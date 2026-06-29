import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, FlatList,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '../theme/colors';
import { STORES, ORIGINS } from '../data/stores';
import StoreCard from '../components/StoreCard';

export default function HomeScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All Stores');
  const filters = ['All Stores', 'Ethiopian', 'Indian', 'Nigerian'];

  const filteredStores = activeFilter === 'All Stores'
    ? STORES
    : STORES.filter(s => s.cuisine === activeFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero Header */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.locationLabel}>DELIVERING TO</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={13} color={COLORS.mustard} />
                <Text style={styles.locationText}>Eastside, WA</Text>
                <Feather name="chevron-down" size={14} color={COLORS.mustard} />
              </View>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>
            Your world of{'\n'}<Text style={styles.heroAccent}>flavors</Text>, delivered.
          </Text>
          <Text style={styles.heroSub}>Authentic ingredients from your neighborhood</Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color={COLORS.mustard} />
            <TextInput
              placeholder="Search stores, ingredients..."
              placeholderTextColor={COLORS.gray}
              style={styles.searchInput}
            />
            <View style={styles.filterBtn}>
              <Feather name="sliders" size={14} color={COLORS.black} />
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.tab, activeFilter === f ? styles.tabActive : styles.tabInactive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.tabText, activeFilter === f ? styles.tabTextActive : styles.tabTextInactive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Area */}
        <View style={styles.content}>

          {/* Promo Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoAccent} />
            <Text style={styles.promoIcon}>🎁</Text>
            <View>
              <Text style={styles.promoLabel}>FIRST ORDER</Text>
              <Text style={styles.promoHeading}>Free delivery on us</Text>
              <Text style={styles.promoSub}>Use code WELCOME · Min. $20 order</Text>
            </View>
          </View>

          {/* Nearby Stores */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Stores</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onPress={() => navigation.navigate('Store', { store })}
            />
          ))}

          {/* Browse by Origin */}
          <View style={[styles.sectionHeader, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>Browse by origin</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.originsRow}>
            {ORIGINS.map((o, i) => (
              <TouchableOpacity
                key={o.label}
                style={[styles.originChip, i === 0 && styles.originChipActive]}
              >
                <Text style={styles.originFlag}>{o.flag}</Text>
                <Text style={[styles.originLabel, i === 0 && styles.originLabelActive]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  scroll: { flex: 1 },

  // Hero
  hero: { backgroundColor: COLORS.black, padding: 20, paddingTop: 10 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  locationLabel: { color: COLORS.gray, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.mustard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.charcoal,
  },
  avatarText: { color: COLORS.black, fontWeight: '800', fontSize: 15 },
  heroHeadline: { color: COLORS.white, fontSize: 30, fontWeight: '800', lineHeight: 36, letterSpacing: -0.5 },
  heroAccent: { color: COLORS.mustard },
  heroSub: { color: COLORS.gray, fontSize: 13, marginTop: 4 },

  // Search
  searchBar: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.charcoalLight,
    gap: 8,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 13 },
  filterBtn: {
    backgroundColor: COLORS.mustard,
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },

  // Tabs
  tabsRow: { backgroundColor: COLORS.black, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2 },
  tab: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginRight: 8 },
  tabActive: { backgroundColor: COLORS.mustard },
  tabInactive: { backgroundColor: COLORS.charcoal, borderWidth: 1, borderColor: COLORS.charcoalLight },
  tabText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  tabTextActive: { color: COLORS.black },
  tabTextInactive: { color: COLORS.gray },

  // Content
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    marginTop: 4,
  },

  // Promo Banner
  promoBanner: {
    backgroundColor: COLORS.black,
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  promoAccent: {
    position: 'absolute', right: -10, top: -10,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.mustard, opacity: 0.15,
  },
  promoIcon: { fontSize: 32 },
  promoLabel: { color: COLORS.mustard, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  promoHeading: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  promoSub: { color: COLORS.gray, fontSize: 12, marginTop: 2 },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.black },
  seeAll: { fontSize: 13, fontWeight: '700', color: COLORS.mustard },

  // Origins
  originsRow: { marginBottom: 10 },
  originChip: {
    backgroundColor: COLORS.black, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    alignItems: 'center', marginRight: 10, minWidth: 78,
  },
  originChipActive: { backgroundColor: COLORS.mustard },
  originFlag: { fontSize: 24 },
  originLabel: { color: COLORS.white, fontSize: 10, fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },
  originLabelActive: { color: COLORS.black },
});
