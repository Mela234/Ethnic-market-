import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

/**
 * Serves two jobs:
 *
 *  1. Landing screen  — pass `onGuest` to show the "Browse as guest" escape
 *                       hatch. This is the DoorDash shape: looks like a wall,
 *                       isn't one.
 *  2. Checkout gate   — pass `onClose` + `reason` to render it in a Modal when
 *                       a guest tries to place an order.
 */
export default function AuthScreen({ onGuest, onClose, reason, onSuccess }) {
  // Defaults to sign-up: tokens last 7 days, so returning users rarely land
  // here. Most people who do see it are new.
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, signUp } = useAuth();
  const isSignUp = mode === 'signup';

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup');
    setError(null);
  };

  const submit = async () => {
    setError(null);

    // Mirror the backend's rules so obvious mistakes don't cost a round trip.
    // The server validates independently regardless.
    if (phone.trim().length < 6) {
      setError('Enter a valid phone number');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setBusy(true);
    try {
      const creds = { phone: phone.trim(), password };
      if (isSignUp) {
        await signUp({ ...creds, name: name.trim() || null });
      } else {
        await signIn(creds);
      }
      onSuccess?.();
    } catch (e) {
      // 409 = phone already taken. Nudge them to sign in with it prefilled
      // instead of leaving them staring at an error they can't act on.
      if (e.status === 409) {
        setMode('signin');
        setError('That number already has an account. Sign in instead.');
      } else {
        setError(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={busy}>
            <Feather name="x" size={22} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🧺</Text>
            <Text style={styles.brand}>BAZAAR</Text>
            <Text style={styles.tagline}>
              Your world of <Text style={styles.taglineAccent}>flavors</Text>, delivered.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {reason || (isSignUp ? 'Create your account' : 'Welcome back')}
            </Text>

            {isSignUp && (
              <View style={styles.field}>
                <Text style={styles.label}>NAME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={COLORS.gray}
                  autoCapitalize="words"
                  editable={!busy}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>PHONE</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+263 77 123 4567"
                placeholderTextColor={COLORS.gray}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={COLORS.gray}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!busy}
                onSubmitEditing={submit}
                returnKeyType="go"
              />
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, busy && styles.submitBtnBusy]}
              onPress={submit}
              disabled={busy}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator color={COLORS.black} />
              ) : (
                <Text style={styles.submitText}>
                  {isSignUp ? 'Create account' : 'Sign in'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={switchMode} disabled={busy} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                {isSignUp ? 'Already have an account? ' : 'New to Bazaar? '}
                <Text style={styles.switchAccent}>
                  {isSignUp ? 'Sign in' : 'Create one'}
                </Text>
              </Text>
            </TouchableOpacity>

            {onGuest && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.guestBtn}
                  onPress={onGuest}
                  disabled={busy}
                  activeOpacity={0.7}
                >
                  <Text style={styles.guestText}>Browse as guest</Text>
                </TouchableOpacity>
                <Text style={styles.guestHint}>
                  You'll need an account to place an order
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.black },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  closeBtn: {
    position: 'absolute', top: 10, right: 16, zIndex: 10,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.charcoal,
    alignItems: 'center', justifyContent: 'center',
  },

  header: { alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 46 },
  brand: {
    color: COLORS.mustard,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 8,
  },
  tagline: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 10,
    textAlign: 'center',
  },
  taglineAccent: { color: COLORS.mustard },

  form: { gap: 14 },
  formTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  field: { gap: 6 },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: COLORS.gray },
  input: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: COLORS.white,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.charcoalLight,
  },

  errorBox: {
    backgroundColor: 'rgba(217, 48, 37, 0.15)',
    borderRadius: 10,
    padding: 11,
    borderLeftWidth: 3,
    borderLeftColor: '#D93025',
  },
  errorText: { color: '#FF8A80', fontSize: 13, fontWeight: '600' },

  submitBtn: {
    backgroundColor: COLORS.mustard,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnBusy: { opacity: 0.7 },
  submitText: { color: COLORS.black, fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },

  switchBtn: { alignItems: 'center', paddingVertical: 6 },
  switchText: { color: COLORS.gray, fontSize: 13 },
  switchAccent: { color: COLORS.mustard, fontWeight: '700' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.charcoalLight },
  dividerText: { color: COLORS.gray, fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  guestBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.charcoalLight,
  },
  guestText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  guestHint: { color: COLORS.gray, fontSize: 11, textAlign: 'center', marginTop: -4 },
});
