import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

import { useEuLevo } from '../../../core/store/eulevo-store';
import { colors } from '../../../core/theme/colors';
import { formatTime } from '../../../core/utils/formatters';
import { Card } from '../../../shared/components/ui';

export function ChatScreen({ route }) {
  const { eventId } = route.params;
  const navigation = useNavigation();

  const {
    currentUser,
    messagesForEvent,
    participantsForEvent,
    sendMessage,
    isParticipant,
    refreshMessagesForEvent,
    deleteEvent,
    getEventById,
  } = useEuLevo();

  const [content, setContent] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const messages = messagesForEvent(eventId);
  const users = participantsForEvent(eventId);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const event = getEventById(eventId);

  const isAdmin =
    event?.ownerId === currentUser?.id ||
    event?.organizerId === currentUser?.id ||
    event?.createdBy === currentUser?.id ||
    event?.userId === currentUser?.id;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerAvatar}>
            <MaterialCommunityIcons name="account-group" size={24} color="#0082F0" />
          </View>
          <View>
            <Text style={styles.headerTitleText}>{event?.name ?? 'Grupo do Evento'}</Text>
            <Text style={styles.headerSubtitleText}>{users.length} participantes</Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => setMenuVisible((prev) => !prev)}
            style={styles.headerIconButton}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#FEFEFF',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerBackTitleVisible: false,
      headerTintColor: '#1F2937',
    });
  }, [navigation, event, users.length]);

  useEffect(() => {
    let active = true;

    const loadMessages = async () => {
      if (!active) return;

      try {
        await refreshMessagesForEvent?.(eventId);
      } catch (error) {
        console.log('Erro ao carregar mensagens:', error.message);
      }
    };

    loadMessages();

    const interval = setInterval(loadMessages, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [eventId]);

  const participantMap = useMemo(
    () => Object.fromEntries(users.map((entry) => [entry.id, entry])),
    [users]
  );

  if (!isParticipant(eventId, currentUser?.id)) {
    return (
      <View style={styles.root}>
        <Card>
          <Text>Apenas participantes podem acessar o chat deste evento.</Text>
        </Card>
      </View>
    );
  }

  const handleDeleteGroup = () => {
    Alert.alert(
      'Apagar grupo',
      'Tem certeza que deseja apagar este grupo? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              setMenuVisible(false);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro ao apagar grupo', error.message);
            }
          },
        },
      ]
    );
  };

  const handleLeaveGroup = () => {
    setMenuVisible(false);

    Alert.alert(
      'Sair do grupo',
      'Tem certeza que deseja sair deste grupo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Função pendente',
              'A função de sair do grupo ainda precisa ser conectada ao backend.'
            );
          },
        },
      ]
    );
  };

  const handleViewParticipants = () => {
    setMenuVisible(false);
    navigation.navigate('Participants', { eventId });
  };

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    try {
      await sendMessage(eventId, content);
      setContent('');
      await refreshMessagesForEvent?.(eventId);
    } catch (error) {
      Alert.alert('Erro ao enviar', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      {menuVisible && (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}
          />

          <View style={styles.menuBox}>
            <Text style={styles.menuTitle}>
              {event?.name ?? 'Opções do grupo'}
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleViewParticipants}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account-group-outline"
                size={21}
                color="#0082F0"
              />
              <Text style={styles.menuText}>Ver participantes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDangerSoft]}
              onPress={handleLeaveGroup}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="logout"
                size={21}
                color="#EF4444"
              />
              <Text style={styles.menuTextDanger}>Sair do grupo</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemDanger]}
                onPress={handleDeleteGroup}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={21}
                  color="#EF4444"
                />
                <Text style={styles.menuTextDanger}>Apagar grupo</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 20 + Math.max(insets.bottom, 12) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>Hoje</Text>
        </View>

        {messages.map((message) => {
          const mine = message.userId === currentUser?.id;
          const author = participantMap[message.userId];

          return (
            <View
              key={message.id}
              style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowOther]}
            >
              <View style={[styles.bubbleContainer, mine ? styles.bubbleContainerMine : styles.bubbleContainerOther]}>
                
                {!mine && (
                  <Text style={styles.authorName}>
                    {author?.name ?? 'Participante'}
                  </Text>
                )}

                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                  <Text style={[styles.content, mine ? styles.contentMine : styles.contentOther]}>
                    {message.content}
                  </Text>
                </View>

                <Text style={[styles.time, mine ? styles.timeMine : styles.timeOther]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Digite sua mensagem"
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          
          {content.trim().length > 0 && (
            <TouchableOpacity 
              onPress={handleSendMessage} 
              style={styles.sendButton}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color="#199EF3" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FEFEFF', 
  },

  // HEADER STYLES
headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
},

headerTitleContainer: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  minWidth: 0,
  marginRight: 10,
},

headerAvatar: {
  width: 36,
  height: 36,
  minWidth: 36,
  borderRadius: 18,
  backgroundColor: '#E8F4FE',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
  flexShrink: 0,
},

headerTextContainer: {
  flex: 1,
  minWidth: 0,
},

headerTitleText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1F2937',
},

headerSubtitleText: {
  fontSize: 12,
  color: '#9CA3AF',
},

headerRightContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
},

headerIconButton: {
  width: 38,
  height: 38,
  borderRadius: 19,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 4,
  flexShrink: 0,
},

  // MENU STYLES
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 20,
  },
  menuBox: {
    position: 'absolute',
    top: 10,
    right: 18,
    width: 230,
    backgroundColor: '#FEFEFF',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 8,
    zIndex: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#B9DEFE',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0082F0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  menuItemDangerSoft: {
    backgroundColor: '#FFF7F7',
  },
  menuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  menuTextDanger: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '800',
  },

  // CHAT AREA
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 16,
    paddingTop: 16,
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // BUBBLES
  messageRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  bubbleContainerMine: {
    alignItems: 'flex-end',
  },
  bubbleContainerOther: {
    alignItems: 'flex-start',
  },
  authorName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bubbleMine: {
    backgroundColor: '#199EF3', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#F4F5F7', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
  contentMine: {
    color: '#FEFEFF',
  },
  contentOther: {
    color: '#1F2937',
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: '#9CA3AF',
  },
  timeMine: {
    alignSelf: 'flex-start', 
  },
  timeOther: {
    alignSelf: 'flex-end',   
  },

  // COMPOSER (BOTTOM INPUT)
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FEFEFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingTop: 12,
    paddingBottom: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});