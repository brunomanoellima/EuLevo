import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../core/theme/colors';
import { initialsFromName } from '../../core/utils/formatters';

export const Screen = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  refreshControl,
}) => {
  if (scroll) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, style, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.screen, styles.content, style]}>{children}</View>;
};

export const AnimatedEntrance = ({ children, delay = 0, style }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 340,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 340,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

export const Card = ({ children, style, delay = 0 }) => (
  <AnimatedEntrance delay={delay}>
    <View style={[styles.card, style]}>{children}</View>
  </AnimatedEntrance>
);

export const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;

export const Input = ({ multiline = false, style, icon, ...props }) => (
  <View style={[styles.inputShell, multiline && styles.inputShellMultiline]}>
    {icon ? (
      <View style={styles.inputIconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.primaryDark} />
      </View>
    ) : null}
    <TextInput
      placeholderTextColor={colors.muted}
      style={[styles.input, multiline && styles.multiline, icon && styles.inputWithIcon, style]}
      multiline={multiline}
      {...props}
    />
  </View>
);

export const PrimaryButton = ({ label, onPress, disabled, style, icon }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.button,
      disabled && styles.buttonDisabled,
      pressed && styles.buttonPressed,
      style,
    ]}
  >
    {icon ? <MaterialCommunityIcons name={icon} size={18} color="#fff" /> : null}
    <Text style={styles.buttonText}>{label}</Text>
  </Pressable>
);

export const SecondaryButton = ({ label, onPress, disabled, style, icon }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.secondaryButton,
      disabled && styles.buttonDisabled,
      pressed && styles.secondaryButtonPressed,
      style,
    ]}
  >
    {icon ? <MaterialCommunityIcons name={icon} size={18} color={colors.textSoft} /> : null}
    <Text style={styles.secondaryButtonText}>{label}</Text>
  </Pressable>
);

export const Badge = ({ label, success = true }) => (
  <View style={[styles.badge, !success && styles.badgeError]}>
    <Text style={[styles.badgeText, !success && styles.badgeErrorText]}>{label}</Text>
  </View>
);

export const Avatar = ({ name, size = 44 }) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
    ]}
  >
    <Text style={[styles.avatarText, { fontSize: Math.max(14, size * 0.34) }]}>
      {initialsFromName(name || '?')}
    </Text>
  </View>
);

export const Fab = ({ onPress }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
    <MaterialCommunityIcons name="plus" size={28} color="#fff" />
  </Pressable>
);

export const SectionTitle = ({ children, subtitle }) => (
  <View style={styles.sectionWrap}>
    <Text style={styles.sectionTitle}>{children}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

export const AppModal = ({ visible, title, children, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        {children}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(228,236,231,0.7)',
    shadowColor: colors.shadowStrong,
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  label: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputShell: {
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputShellMultiline: {
    alignItems: 'flex-start',
  },
  inputIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 15,
    color: colors.text,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingHorizontal: 0,
  },
  multiline: {
    minHeight: 108,
    textAlignVertical: 'top',
  },
  button: {
    minHeight: 54,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonPressed: {
    transform: [{ scale: 0.985 }],
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonPressed: {
    backgroundColor: colors.cardMuted,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badgeError: {
    backgroundColor: colors.error,
  },
  badgeText: {
    color: colors.successText,
    fontSize: 12,
    fontWeight: '800',
  },
  badgeErrorText: {
    color: colors.errorText,
  },
  avatar: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.08)',
  },
  avatarText: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  fabPressed: {
    transform: [{ scale: 0.98 }],
  },
  sectionWrap: {
    gap: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,32,25,0.32)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    gap: 14,
  },
  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D8E1DB',
    alignSelf: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});
