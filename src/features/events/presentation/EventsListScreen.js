import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEuLevo } from '../../../core/store/eulevo-store';
import { formatDate } from '../../../core/utils/formatters';
import { Fab, Screen } from '../../../shared/components/ui';

const palette = {
  primary: '#0082F0',
  secondary: '#199EF3',
  white: '#FEFEFF',
  soft: '#B9DEFE',
  light: '#88C6FC',
  text: '#1F2937',
  muted: '#6B7280',
  background: '#F4F6F9',
  danger: '#EF4444',
};

export function EventsListScreen({ navigation }) {
  const {
    currentUser,
    listEventsForCurrentUser,
    participantsForEvent,
    notificationsForCurrentUser,
    invitationsForCurrentUser,
    markNotificationsRead,
  } = useEuLevo();

  const events = listEventsForCurrentUser();
  const invitations = invitationsForCurrentUser();
  const unreadCount = notificationsForCurrentUser().filter((item) => !item.read).length;

  const [activeTab, setActiveTab] = useState('Todos');

  const handleOpenNotices = async () => {
    await markNotificationsRead();
    navigation.getParent()?.navigate('Avisos');
  };

  const handleOpenProfile = () => {
    navigation.getParent()?.navigate('Perfil');
  };

  return (
    <View style={styles.root}>
      <Screen scroll contentContainerStyle={{ paddingBottom: 130 }} style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.headerLeft} onPress={handleOpenProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(currentUser?.name ?? 'US')
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>

            <Text style={styles.greetingText}>
              Olá, {currentUser?.name?.split(' ')[0] ?? 'Usuário'}
            </Text>
          </Pressable>

          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton} onPress={handleOpenNotices}>
              <Ionicons name="notifications-outline" size={24} color={palette.text} />
              {unreadCount > 0 ? <View style={styles.badgeDot} /> : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.headlineContainer}>
          <Text style={styles.headline}>Controle seus eventos facilmente</Text>
        </View>

        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconRow}>
              <MaterialCommunityIcons name="calendar-check" size={18} color={palette.white} />
              <Text style={styles.summaryLabel}>Ativos</Text>
            </View>

            <Text style={styles.summaryValue}>{String(events.length).padStart(2, '0')}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconRow}>
              <MaterialCommunityIcons name="bell-outline" size={18} color={palette.soft} />
              <Text style={[styles.summaryLabel, { color: palette.soft }]}>Avisos</Text>
            </View>

            <Text style={[styles.summaryValue, { color: palette.soft }]}>
              {String(unreadCount).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconRow}>
              <MaterialCommunityIcons name="email-outline" size={18} color={palette.soft} />
              <Text style={[styles.summaryLabel, { color: palette.soft }]}>Convites</Text>
            </View>

            <Text style={[styles.summaryValue, { color: palette.soft }]}>
              {String(invitations.length).padStart(2, '0')}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Eventos listados</Text>

            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{events.length}</Text>
            </View>
          </View>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="calendar-plus" size={34} color={palette.primary} />
            </View>

            <Text style={styles.emptyTitle}>Nenhum evento ativo</Text>

            <Text style={styles.emptyText}>
              Crie um novo evento usando a bolinha azul ou verifique seus convites.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {events.map((event) => {
              const participants = participantsForEvent(event.id);

              return (
                <Pressable
                  key={event.id}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIconWrap}>
                      <MaterialCommunityIcons
                        name="party-popper"
                        size={22}
                        color={palette.primary}
                      />
                    </View>


                  </View>

                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {event.name}
                  </Text>

                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {participants.length} participantes
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardDate}>{formatDate(event.date)}</Text>

                    <View style={styles.openGroupButton}>
                      <Text style={styles.openGroupText}>Ver lista</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color={palette.primary}
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Screen>

      <Fab onPress={() => navigation.navigate('CreateEvent')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.background,
  },

  screen: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: palette.white,
    fontWeight: '800',
    fontSize: 14,
  },

  greetingText: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.text,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  iconButton: {
    position: 'relative',
    padding: 4,
  },

  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.danger,
    borderWidth: 2,
    borderColor: palette.background,
  },

  headlineContainer: {
    marginBottom: 24,
  },

  headline: {
    fontSize: 38,
    lineHeight: 44,
    color: palette.text,
    fontWeight: '900',
  },

  summaryCard: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: palette.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  summaryLabel: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '500',
  },

  summaryValue: {
    color: palette.white,
    fontSize: 24,
    fontWeight: '800',
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },

  countBadge: {
    backgroundColor: palette.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  countBadgeText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '800',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },

  gridCard: {
    width: '47%',
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

openGroupButton: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-end',
  backgroundColor: '#EEF6FF',
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 6,
  gap: 2,
},

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 12,
    color: palette.muted,
    marginBottom: 24,
  },

  cardFooter: {
    gap: 10,
  },

cardFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
},

openGroupButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#EEF6FF',
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 6,
  gap: 2,
},

  openGroupText: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.primary,
  },

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});