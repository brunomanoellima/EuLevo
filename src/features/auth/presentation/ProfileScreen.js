import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEuLevo } from '../../../core/store/eulevo-store';
import {
  AppModal,
  Avatar,
  Card,
  Input,
  Label,
  PrimaryButton,
  Screen,
  SecondaryButton,
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
  danger: '#EF4444',
  dangerSoft: '#FDECEC',
};

export function ProfileScreen({ navigation }) {
  const {
    currentUser,
    signOut,
    listEventsForCurrentUser,
    notificationsForCurrentUser,
    updateProfile,
    updateCurrentUserName,
  } = useEuLevo();

  const totalEvents = listEventsForCurrentUser().length;
  const totalNotices = notificationsForCurrentUser().filter((entry) => !entry.read).length;

  const [editVisible, setEditVisible] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? '');

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackIcon, setFeedbackIcon] = useState('information-outline');

  useEffect(() => {
    setName(currentUser?.name ?? '');
  }, [currentUser?.name]);

  const showFeedback = ({ title, message, icon = 'information-outline' }) => {
    setFeedbackTitle(title);
    setFeedbackMessage(message);
    setFeedbackIcon(icon);
    setFeedbackVisible(true);
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.getParent?.()?.navigate?.('Inicio');
  };

  const handleSaveName = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      showFeedback({
        title: 'Nome obrigatório',
        message: 'Digite um nome para atualizar seu perfil.',
        icon: 'account-alert-outline',
      });
      return;
    }

    if (trimmedName.length < 3) {
      showFeedback({
        title: 'Nome muito curto',
        message: 'O nome deve ter pelo menos 3 caracteres.',
        icon: 'account-alert-outline',
      });
      return;
    }

    try {
      if (typeof updateProfile === 'function') {
        await updateProfile({ name: trimmedName });
      } else if (typeof updateCurrentUserName === 'function') {
        await updateCurrentUserName(trimmedName);
      } else {
        showFeedback({
          title: 'Função não encontrada',
          message:
            'A tela já está pronta, mas ainda falta criar a função de atualizar nome no eulevo-store.js/backend.',
          icon: 'alert-circle-outline',
        });
        return;
      }

      setEditVisible(false);

      showFeedback({
        title: 'Perfil atualizado!',
        message: 'Seu nome foi alterado com sucesso.',
        icon: 'check-bold',
      });
    } catch (error) {
      showFeedback({
        title: 'Erro ao atualizar perfil',
        message: error.message,
        icon: 'alert-circle-outline',
      });
    }
  };

  return (
    <View style={styles.page}>
      <Screen scroll>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={palette.white} />
          </Pressable>
        </View>

        <Card style={styles.heroCard}>
          <LinearGradient
            colors={[palette.primary, palette.secondary, palette.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.center}>
              <Avatar name={currentUser?.name ?? 'EL'} size={76} />

              <Text style={styles.name}>{currentUser?.name}</Text>
              <Text style={styles.email}>{currentUser?.email}</Text>

              <Pressable style={styles.editButton} onPress={() => setEditVisible(true)}>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={18}
                  color={palette.primary}
                />
                <Text style={styles.editButtonText}>Editar perfil</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Card>
        <PrimaryButton label="Sair" onPress={signOut} icon="logout" />
      </Screen>

      <AppModal
        visible={editVisible}
        title="Editar perfil"
        onClose={() => {
          setName(currentUser?.name ?? '');
          setEditVisible(false);
        }}
      >
        <Text style={styles.modalTip}>
          Você pode alterar apenas o nome do seu perfil.
        </Text>

        <Label>Nome</Label>

        <Input
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          icon="account-outline"
        />

        <View style={styles.actions}>
          <SecondaryButton
            label="Cancelar"
            onPress={() => {
              setName(currentUser?.name ?? '');
              setEditVisible(false);
            }}
            style={styles.flex}
            icon="close"
          />

          <PrimaryButton
            label="Salvar"
            onPress={handleSaveName}
            style={styles.flex}
            icon="check"
          />
        </View>
      </AppModal>

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

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  center: {
    alignItems: 'center',
  },

  heroCard: {
    padding: 0,
    overflow: 'hidden',
  },

  heroGradient: {
    padding: 24,
  },

  name: {
    color: palette.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 16,
    textAlign: 'center',
  },

  email: {
    color: 'rgba(255,255,255,0.84)',
    marginTop: 6,
    textAlign: 'center',
  },

  editButton: {
    marginTop: 18,
    backgroundColor: palette.white,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  editButtonText: {
    color: palette.primary,
    fontWeight: '900',
    fontSize: 13,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.text,
  },

  statLabel: {
    color: palette.muted,
    fontSize: 13,
  },

  section: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900',
  },

  body: {
    color: palette.muted,
    marginTop: 12,
    lineHeight: 22,
  },

  modalTip: {
    color: palette.muted,
    lineHeight: 20,
    marginBottom: 8,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
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

  flex: {
    flex: 1,
  },
});