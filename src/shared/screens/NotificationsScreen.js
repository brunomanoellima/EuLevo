import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useEuLevo } from '../../core/store/eulevo-store';
import { colors } from '../../core/theme/colors';
import { formatDate, formatTime } from '../../core/utils/formatters';
import { Card, PrimaryButton, Screen, SecondaryButton, SectionTitle } from '../components/ui';

export function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    notificationsForCurrentUser,
    invitationsForCurrentUser,
    markNotificationsRead,
    acceptInvitation,
    declineInvitation,
    getEventById,
    refreshInvitationsForCurrentUser,
  } = useEuLevo();

  const notifications = notificationsForCurrentUser();
  const invitations = invitationsForCurrentUser();

const onRefresh = async () => {
  setRefreshing(true);

  try {
    await refreshInvitationsForCurrentUser();
  } catch (error) {
    Alert.alert('Erro ao atualizar avisos', error.message);
  } finally {
    setRefreshing(false);
  }
};


  const grouped = notifications.reduce((acc, item) => {
    acc[item.eventId] = acc[item.eventId] || [];
    acc[item.eventId].push(item);
    return acc;
  }, {});

  return (
    <Screen
  scroll
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
      <SectionTitle subtitle="Alterações recentes agrupadas por evento.">
        Avisos
      </SectionTitle>

      {invitations.length > 0 ? (
        <>
          <SectionTitle subtitle="Aceite ou recuse os convites enviados para o seu e-mail.">
            Convites pendentes
          </SectionTitle>

          {invitations.map((invitation, index) => (
            <Card key={invitation.id} delay={index * 40}>
              <Text style={styles.title}>{invitation.eventName}</Text>

              <Text style={styles.inviteText}>
                {invitation.invitedByName} convidou você para participar deste evento.
              </Text>

              <Text style={styles.date}>
                {formatDate(invitation.createdAt)} {formatTime(invitation.createdAt)}
              </Text>

              <View style={styles.actions}>
                <PrimaryButton
                  label="Aceitar"
                  onPress={async () => {
                    try {
                      await acceptInvitation(invitation.id);
                    } catch (error) {
                      Alert.alert('Erro ao aceitar convite', error.message);
                    }
                  }}
                  style={styles.flex}
                  icon="check"
                />

                <SecondaryButton
                  label="Recusar"
                  onPress={async () => {
                    try {
                      await declineInvitation(invitation.id);
                    } catch (error) {
                      Alert.alert('Erro ao recusar convite', error.message);
                    }
                  }}
                  style={styles.flex}
                  icon="close"
                />
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <PrimaryButton
        label="Marcar todas como lidas"
        onPress={markNotificationsRead}
        icon="check-all"
      />

      {Object.entries(grouped).map(([eventId, items], index) => (
        <Card key={eventId} delay={index * 50}>
          <Text style={styles.title}>
            {getEventById(eventId)?.name ?? `Evento ${eventId}`}
          </Text>

          <View style={{ gap: 12, marginTop: 14 }}>
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.notice,
                  { backgroundColor: item.read ? colors.cardMuted : colors.success },
                ]}
              >
                <View style={styles.noticeIcon}>
                  <MaterialCommunityIcons
                    name={item.type === 'item_created' ? 'playlist-plus' : 'playlist-check'}
                    size={18}
                    color={colors.primaryDark}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.message}>{item.message}</Text>

                  <Text style={styles.date}>
                    {formatDate(item.createdAt)} {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  notice: {
    borderRadius: 20,
    padding: 14,
    gap: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: colors.text,
    lineHeight: 20,
  },
  inviteText: {
    color: colors.textSoft,
    marginTop: 10,
    lineHeight: 20,
  },
  date: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  flex: {
    flex: 1,
  },
});