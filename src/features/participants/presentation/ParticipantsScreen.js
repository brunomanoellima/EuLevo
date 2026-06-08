import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useEuLevo } from '../../../core/store/eulevo-store';
import {
  AppModal,
  Avatar,
  Card,
  Input,
  PrimaryButton,
  Screen,
  SectionTitle,
} from '../../../shared/components/ui';

const palette = {
  primary: '#0082F0',
  secondary: '#199EF3',
  white: '#FEFEFF',
  soft: '#B9DEFE',
  light: '#88C6FC',
  text: '#1F2937',
  muted: '#6B7280',
  background: '#F4F6F9',
};

export function ParticipantsScreen({ route }) {
  const { eventId } = route.params;

const {
  currentUser,
  getEventById,
  participantsForEvent,
  addParticipant,
  listRegisteredUsers,
  listPendingInvitationsForEvent,
} = useEuLevo();

  const event = getEventById(eventId);
  const participants = participantsForEvent(eventId);

  const [search, setSearch] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [pendingEmails, setPendingEmails] = useState(new Set());

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackIcon, setFeedbackIcon] = useState('information-outline');

  const isOwner = event?.ownerId === currentUser?.id;

  const participantEmails = useMemo(
    () => new Set(participants.map((participant) => participant.email.toLowerCase())),
    [participants]
  );

  const availableUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return registeredUsers
      .filter(
        (user) =>
          user.id !== currentUser?.id &&
          !participantEmails.has(user.email.toLowerCase())
      )
      .filter((user) => {
        if (!term) return true;

        return (
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        );
      });
  }, [registeredUsers, currentUser?.id, participantEmails, search]);

  const showFeedback = ({ title, message, icon = 'information-outline' }) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackIcon(icon);
    setFeedbackVisible(true);
  };

  const isPendingEmail = (userEmail) => {
    return pendingEmails.has(userEmail.toLowerCase());
  };

  const markEmailAsPending = (userEmail) => {
    setPendingEmails((previous) => {
      const next = new Set(previous);
      next.add(userEmail.toLowerCase());
      return next;
    });
  };

const loadUsers = async () => {
  try {
    setSearchingUsers(true);

    const users = await listRegisteredUsers('');

    let pendingInvitations = [];

    if (isOwner && typeof listPendingInvitationsForEvent === 'function') {
      pendingInvitations = await listPendingInvitationsForEvent(eventId);
    }

    const pendingList = pendingInvitations.map((invitation) =>
      String(invitation.email ?? invitation.invitedUserEmail ?? '').trim().toLowerCase()
    );

    setPendingEmails(new Set(pendingList));

    setRegisteredUsers(
      users.map((user) => {
        const userEmail = user.email.toLowerCase();

        return {
          ...user,
          inviteStatus: pendingList.includes(userEmail) ? 'pending' : user.inviteStatus,
        };
      })
    );
  } catch (error) {
    showFeedback({
      title: 'Erro ao carregar usuários',
      message: error.message,
      icon: 'alert-circle-outline',
    });
  } finally {
    setSearchingUsers(false);
  }
};

  useEffect(() => {
    if (!isOwner) return;
    loadUsers();
  }, [isOwner]);

  const handleInviteUser = async (user) => {
    const userEmail = user.email.toLowerCase();

    if (isPendingEmail(userEmail)) {
      showFeedback({
        title: 'Convite pendente',
        message: 'Esse usuário já recebeu um convite para este evento.',
        icon: 'clock-outline',
      });
      return;
    }

    try {
await addParticipant(eventId, { email: user.email });

markEmailAsPending(user.email);

showFeedback({
  title: 'Seu convite foi enviado com sucesso!',
  message: 'Agora é só aguardar o participante aceitar o convite na aba de avisos.',
  icon: 'check-bold',
});

await loadUsers();

      await loadUsers();
    } catch (error) {
      showFeedback({
        title: 'Erro ao enviar convite',
        message: error.message,
        icon: 'alert-circle-outline',
      });
    }
  };

  return (
    <View style={styles.page}>
      <Screen scroll>
        <SectionTitle subtitle="Quem já confirmou presença neste evento.">
          Participantes
        </SectionTitle>

        {participants.map((participant, index) => (
          <Card key={participant.id} delay={index * 45}>
            <View style={styles.row}>
              <Avatar name={participant.name} size={50} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{participant.name}</Text>
                <Text style={styles.email}>{participant.email}</Text>
              </View>

              <View style={styles.trailingIcon}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={20}
                  color={palette.primary}
                />
              </View>
            </View>
          </Card>
        ))}

        {isOwner ? (
          <>
            <SectionTitle subtitle="Procure usuários cadastrados para enviar convite.">
              Convidar participantes
            </SectionTitle>

            <View style={styles.searchBox}>
              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="Procurar por nome ou e-mail"
                autoCapitalize="none"
                icon="magnify"
              />
            </View>

            {searchingUsers ? (
              <Card>
                <Text style={styles.directoryTip}>Carregando usuários cadastrados...</Text>
              </Card>
            ) : availableUsers.length === 0 ? (
              <Card>
                <View style={styles.emptyBox}>
                  <MaterialCommunityIcons
                    name="account-search-outline"
                    size={34}
                    color={palette.primary}
                  />
                  <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
                  <Text style={styles.directoryTip}>
                    Tente procurar por outro nome ou e-mail.
                  </Text>
                </View>
              </Card>
            ) : (
              availableUsers.map((user, index) => {
                const pending = isPendingEmail(user.email);

                return (
                  <Card key={user.id} delay={index * 35}>
                    <View style={styles.userInviteRow}>
                      <Avatar name={user.name} size={48} />

                      <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>

                      {pending ? (
                        <View style={styles.pendingBadge}>
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={16}
                            color={palette.primary}
                          />
                          <Text style={styles.pendingText}>Convite pendente</Text>
                        </View>
                      ) : (
                        <PrimaryButton
                          label="Convidar"
                          onPress={() => handleInviteUser(user)}
                          icon="account-plus"
                          style={styles.inviteButton}
                        />
                      )}
                    </View>
                  </Card>
                );
              })
            )}
          </>
        ) : null}
      </Screen>

      <AppModal
        visible={feedbackVisible}
        title=""
        onClose={() => setFeedbackVisible(false)}
      >
        <View style={styles.feedbackBox}>
          <View style={styles.feedbackIconOuter}>
            <View style={styles.feedbackIconCircle}>
              <MaterialCommunityIcons
                name={feedbackIcon}
                size={34}
                color={palette.white}
              />
            </View>
          </View>

          <Text style={styles.feedbackTitle}>{feedbackTitle}</Text>

          <Text style={styles.feedbackSubtitle}>{feedbackMessage}</Text>

          <PrimaryButton
            label="Entendi"
            onPress={() => setFeedbackVisible(false)}
            icon="check-circle-outline"
            style={styles.feedbackButton}
          />
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.background,
  },

  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },

  name: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },

  email: {
    color: palette.muted,
    marginTop: 4,
  },

  trailingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBox: {
    marginBottom: 12,
  },

  directoryTip: {
    color: palette.muted,
    lineHeight: 20,
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },

  emptyTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900',
  },

  userInviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  userName: {
    color: palette.text,
    fontWeight: '700',
  },

  userEmail: {
    color: palette.muted,
    marginTop: 2,
  },

  inviteButton: {
    minWidth: 108,
    paddingHorizontal: 14,
  },

  pendingBadge: {
    minWidth: 132,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#EEF7FF',
    borderWidth: 1,
    borderColor: palette.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  pendingText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  feedbackBox: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  feedbackIconOuter: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: palette.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  feedbackIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  feedbackTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 29,
  },

  feedbackSubtitle: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  feedbackButton: {
    width: '100%',
  },
});