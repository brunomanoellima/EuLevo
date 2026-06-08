import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEuLevo } from '../../../core/store/eulevo-store';
import { formatDate, formatTime } from '../../../core/utils/formatters';
import {
  AppModal,
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
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  text: '#1F2937',
  muted: '#6B7280',
  background: '#F4F6F9',
};

function ItemFormModal({ visible, onClose, onSave, item }) {
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(item?.quantity ? String(item.quantity) : '1');

  useEffect(() => {
    setName(item?.name ?? '');
    setQuantity(item?.quantity ? String(item.quantity) : '1');
  }, [item, visible]);

  return (
    <AppModal visible={visible} title={item ? 'Editar item' : 'Adicionar item'} onClose={onClose}>
      <Label>Nome do item</Label>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Ex: Refrigerante, copos, bolo..."
        icon="package-variant-closed"
      />

      <Label>Quantidade</Label>
      <Input
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Quantidade"
        keyboardType="numeric"
        icon="numeric"
      />

      <View style={styles.modalActions}>
        <SecondaryButton
          label="Cancelar"
          onPress={onClose}
          style={styles.flex}
          icon="close"
        />

        <PrimaryButton
          label={item ? 'Salvar' : 'Adicionar'}
          onPress={() => onSave({ name, quantity })}
          style={styles.flex}
          icon="check"
        />
      </View>
    </AppModal>
  );
}

function NavItem({ icon, label, active = false, onPress }) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={active ? palette.primary : palette.muted}
      />
      <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;

  const {
    currentUser,
    getEventById,
    participantsForEvent,
    itemsForEvent,
    notificationsForEvent,
    deleteEvent,
    assignItem,
    unassignItem,
    createItem,
    updateItem,
    deleteItem,
    refreshCurrentUserData,
  } = useEuLevo();

  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState('items');

  const event = getEventById(eventId);
  const participants = participantsForEvent(eventId);
  const items = itemsForEvent(eventId);

  const historyEntries = notificationsForEvent(eventId).filter((entry) =>
    ['item_created', 'item_updated', 'item_deleted'].includes(entry.type)
  );

  useEffect(() => {
    let active = true;

    const refreshData = async () => {
      if (!active) return;

      try {
        await refreshCurrentUserData?.();
      } catch (error) {
        console.log('Erro ao atualizar dados do evento:', error.message);
      }
    };

    refreshData();

    const interval = setInterval(refreshData, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [eventId]);

  const { available, confirmed } = useMemo(
    () => ({
      available: items.filter((item) => !item.assignedUserId),
      confirmed: items.filter((item) => item.assignedUserId),
    }),
    [items]
  );

  if (!event) {
    return (
      <Screen style={{ backgroundColor: palette.background }}>
        <Card>
          <Text style={styles.notFoundTitle}>Evento não encontrado.</Text>
          <Text style={styles.notFoundText}>
            Este evento pode ter sido excluído pelo organizador.
          </Text>
          <SecondaryButton
            label="Voltar"
            onPress={() => navigation.popToTop()}
            icon="arrow-left"
            style={{ marginTop: 16 }}
          />
        </Card>
      </Screen>
    );
  }

  const isOwner = currentUser?.id === event.ownerId;
  const totalItems = items.length;
  const availableCount = available.length;
  const confirmedCount = confirmed.length;

  const openNewItemModal = () => {
    setEditingItem(null);
    setShowModal(true);
  };

const canCurrentUserDeleteItem = (item) => {
  if (isOwner) return true;

  const creatorId =
    item.createdById ||
    item.createdBy ||
    item.creatorId ||
    item.createdUserId ||
    item.createdByUserId ||
    item.ownerId ||
    item.userId ||
    item.authorId ||
    item.participantId ||
    item.createdBy?.id ||
    item.creator?.id ||
    item.user?.id ||
    item.owner?.id ||
    item.author?.id;

  // Se o backend não mandou quem criou, mostra o botão mesmo assim
  // e deixa o backend/store tentar validar a exclusão.
  if (!creatorId) {
    return true;
  }

  if (!currentUser?.id) {
    return false;
  }

  return String(creatorId) === String(currentUser.id);
};

  const handleDelete = () => {
    Alert.alert('Excluir evento', 'Deseja realmente excluir este evento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(eventId);
            await refreshCurrentUserData?.();
            navigation.popToTop();
          } catch (error) {
            Alert.alert('Erro', error.message);
          }
        },
      },
    ]);
  };

  const handleDeleteItem = (item) => {
    if (!canCurrentUserDeleteItem(item)) {
      Alert.alert(
        'Sem permissão',
        'Você só pode excluir itens criados por você.'
      );
      return;
    }

    Alert.alert(
      'Excluir item',
      `Deseja realmente excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!deleteItem) {
                Alert.alert(
                  'Função não encontrada',
                  'A função deleteItem ainda precisa ser criada no store/backend.'
                );
                return;
              }

              await deleteItem(eventId, item.id);
              await refreshCurrentUserData?.();
            } catch (error) {
              Alert.alert('Erro ao excluir item', error.message);
            }
          },
        },
      ]
    );
  };

  const handleSaveItem = async ({ name, quantity }) => {
    try {
      if (editingItem) {
        await updateItem(eventId, editingItem.id, { name, quantity });
      } else {
        await createItem(eventId, { name, quantity });
      }

      await refreshCurrentUserData?.();

      setShowModal(false);
      setEditingItem(null);
      setSelectedPanel('items');
    } catch (error) {
      Alert.alert('Erro ao salvar item', error.message);
    }
  };

  const goToProfile = () => {
    const parentNavigation = navigation.getParent?.();

    if (parentNavigation) {
      parentNavigation.navigate('Perfil');
      return;
    }

    navigation.navigate('Perfil');
  };

  return (
    <View style={styles.page}>
      <Screen
        scroll
        contentContainerStyle={{ paddingBottom: 160 }}
        style={{ backgroundColor: palette.background }}
      >
        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
  <View style={styles.headerTitleArea}>
    <Text style={styles.headerSmall}>Evento</Text>
    <Text style={styles.headerTitle} numberOfLines={1}>
      {event.name}
    </Text>
  </View>

  <View style={styles.dateBox}>
    <Text style={styles.dateDay}>{totalItems}</Text>
    <Text style={styles.dateMonth}>itens</Text>
  </View>
</View>

          <Text style={styles.headerDescription} numberOfLines={2}>
            {event.description || 'Sem descrição informada.'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{participants.length}</Text>
              <Text style={styles.statLabel}>Participantes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{availableCount}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{confirmedCount}</Text>
              <Text style={styles.statLabel}>Confirmados</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.panel}>

          <View style={styles.quickActions}>
            {isOwner ? (
              <SmallAction
                icon="delete-outline"
                label="Excluir evento"
                danger
                onPress={handleDelete}
              />
            ) : null}
          </View>

          {selectedPanel === 'history' ? (
            <View style={styles.contentArea}>
              {historyEntries.length === 0 ? (
                <EmptyState
                  icon="history"
                  title="Sem histórico ainda"
                  message="As movimentações dos itens aparecerão aqui."
                />
              ) : (
                historyEntries.map((entry, index) => (
                  <Card key={entry.id} delay={index * 40} style={styles.historyCard}>
                    <View style={styles.historyRow}>
                      <View style={styles.historyIcon}>
                        <MaterialCommunityIcons
                          name={entry.type === 'item_created' ? 'playlist-plus' : 'history'}
                          size={18}
                          color={palette.primary}
                        />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.historyMessage}>{entry.message}</Text>

                        <Text style={styles.historyMeta}>
                          {formatDate(entry.createdAt)} {formatTime(entry.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))
              )}
            </View>
          ) : (
            <View style={styles.contentArea}>
              <Text style={styles.sectionLabel}>Itens disponíveis</Text>

              {available.length === 0 ? (
                <EmptyState
                  icon="check-circle-outline"
                  title="Tudo confirmado"
                  message="Todos os itens já foram assumidos."
                />
              ) : (
                available.map((item, index) => (
                  <TaskCard
                    key={item.id}
                    item={item}
                    index={index}
                    status="available"
                    isOwner={isOwner}
                    canDelete={canCurrentUserDeleteItem(item)}
                    onAssign={async () => {
                      try {
                        await assignItem(eventId, item.id);
                        await refreshCurrentUserData?.();
                      } catch (error) {
                        Alert.alert('Erro', error.message);
                      }
                    }}
                    onEdit={() => {
                      setEditingItem(item);
                      setShowModal(true);
                    }}
                    onDelete={() => handleDeleteItem(item)}
                  />
                ))
              )}

              <Text style={[styles.sectionLabel, { marginTop: 22 }]}>
                Itens confirmados
              </Text>

              {confirmed.length === 0 ? (
                <EmptyState
                  icon="playlist-check"
                  title="Nenhum item confirmado"
                  message="Quando alguém assumir um item, ele aparecerá aqui."
                />
              ) : (
                confirmed.map((item, index) => {
                  const assigned = participants.find(
                    (participant) => participant.id === item.assignedUserId
                  );

                  const canUnassign = item.assignedUserId === currentUser?.id || isOwner;

                  return (
                    <TaskCard
                      key={item.id}
                      item={item}
                      index={index}
                      status="confirmed"
                      assignedName={assigned?.name ?? 'Participante'}
                      isOwner={isOwner}
                      canUnassign={canUnassign}
                      canDelete={canCurrentUserDeleteItem(item)}
                      onUnassign={async () => {
                        try {
                          await unassignItem(eventId, item.id);
                          await refreshCurrentUserData?.();
                        } catch (error) {
                          Alert.alert('Erro', error.message);
                        }
                      }}
                      onEdit={() => {
                        setEditingItem(item);
                        setShowModal(true);
                      }}
                      onDelete={() => handleDeleteItem(item)}
                    />
                  );
                })
              )}
            </View>
          )}
        </View>
      </Screen>

      <Pressable
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { eventId })}
      >
        <MaterialCommunityIcons name="chat-processing-outline" size={26} color={palette.white} />
      </Pressable>

      <View style={styles.bottomNavBar}>
        <View style={styles.bottomNavHalf}>
          <NavItem
            icon="home-variant"
            label="Início"
            active={selectedPanel === 'items'}
            onPress={() => setSelectedPanel('items')}
          />

          <NavItem
            icon="history"
            label="Histórico"
            active={selectedPanel === 'history'}
            onPress={() => setSelectedPanel('history')}
          />
        </View>

        <View style={styles.bottomNavHalf}>
          <NavItem
            icon="account-group-outline"
            label="Participantes"
            onPress={() => navigation.navigate('Participants', { eventId })}
          />

          <NavItem
            icon="account-outline"
            label="Perfil"
            onPress={goToProfile}
          />
        </View>

        <Pressable style={styles.centerFab} onPress={openNewItemModal}>
          <LinearGradient
            colors={[palette.primary, palette.secondary]}
            style={styles.centerFabGradient}
          >
            <MaterialCommunityIcons name="plus" size={34} color={palette.white} />
          </LinearGradient>
        </Pressable>
      </View>

      <ItemFormModal
        visible={showModal}
        item={editingItem}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />
    </View>
  );
}

function TabButton({ label, count, selected, onPress }) {
  return (
    <Pressable style={[styles.tabButton, selected && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabText, selected && styles.tabTextActive]}>{label}</Text>
      <View style={[styles.tabCount, selected && styles.tabCountActive]}>
        <Text style={[styles.tabCountText, selected && styles.tabCountTextActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function SmallAction({ icon, label, onPress, danger = false }) {
  return (
    <Pressable
      style={[styles.smallAction, danger && styles.smallActionDanger]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={danger ? palette.danger : palette.primary}
      />
      <Text style={[styles.smallActionText, danger && styles.smallActionTextDanger]}>
        {label}
      </Text>
    </Pressable>
  );
}

function TaskCard({
  item,
  index,
  status,
  assignedName,
  isOwner,
  canUnassign,
  canDelete,
  onAssign,
  onUnassign,
  onEdit,
  onDelete,
}) {
  const confirmed = status === 'confirmed';

  return (
    <Card delay={index * 35} style={styles.taskCard}>
      <View style={styles.taskTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{confirmed ? 'confirmado' : 'novo'}</Text>
          </View>

          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>Quantidade: {item.quantity}</Text>

          {confirmed ? (
            <Text style={styles.itemMeta}>Responsável: {assignedName}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={!confirmed ? onAssign : undefined}
          style={styles.circleActionArea}
        >
          <View style={[styles.circleStatus, confirmed && styles.circleStatusConfirmed]}>
            {confirmed ? (
              <MaterialCommunityIcons name="hand-heart" size={20} color={palette.white} />
            ) : (
              <MaterialCommunityIcons name="circle-outline" size={25} color={palette.light} />
            )}
          </View>

          {!confirmed ? (
            <Text style={styles.circleActionText}>Eu levo!</Text>
          ) : (
            <Text style={styles.circleActionTextConfirmed}>Levando</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.itemActions}>
        {confirmed && canUnassign ? (
          <SecondaryButton
            label="Desmarcar"
            onPress={onUnassign}
            style={styles.flex}
            icon="close-circle-outline"
          />
        ) : null}

        {isOwner ? (
          <SecondaryButton
            label="Editar"
            onPress={onEdit}
            style={styles.flex}
            icon="pencil-outline"
          />
        ) : null}

        {canDelete ? (
          <Pressable style={styles.deleteItemButton} onPress={onDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={palette.danger} />
            <Text style={styles.deleteItemText}>Excluir item</Text>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <Card style={styles.emptyCard}>
      <MaterialCommunityIcons name={icon} size={30} color={palette.primary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.background,
  },

  header: {
    borderRadius: 30,
    padding: 18,
    marginBottom: -24,
    minHeight: 220,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  headerTitleArea: {
    flex: 1,
    minWidth: 0,
  },

  headerSmall: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    fontWeight: '600',
  },

  headerTitle: {
    color: palette.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 4,
  },

  dateBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateDay: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '900',
  },

  dateMonth: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 10,
    fontWeight: '700',
  },

  headerDescription: {
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 20,
    marginTop: 18,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },

  statNumber: {
    color: palette.white,
    fontSize: 20,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },

  panel: {
    backgroundColor: palette.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 16,
  },

  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabButtonActive: {
    borderBottomColor: palette.primary,
  },

  tabText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '800',
  },

  tabTextActive: {
    color: palette.text,
  },

  tabCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  tabCountActive: {
    backgroundColor: palette.soft,
  },

  tabCountText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: '800',
  },

  tabCountTextActive: {
    color: palette.primary,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  smallAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  smallActionDanger: {
    backgroundColor: palette.dangerSoft,
  },

  smallActionText: {
    color: palette.primary,
    fontWeight: '800',
    fontSize: 12,
  },

  smallActionTextDanger: {
    color: palette.danger,
  },

  contentArea: {
    gap: 12,
  },

  sectionLabel: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EEF2F7',
  },

  taskTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDF4FF',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 8,
  },

  statusPillText: {
    color: palette.primary,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  itemName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900',
  },

  itemMeta: {
    marginTop: 6,
    color: palette.muted,
    fontSize: 13,
  },

  circleActionArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minWidth: 58,
  },

  circleActionText: {
    marginTop: 5,
    color: palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  circleActionTextConfirmed: {
    marginTop: 5,
    color: palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  circleStatus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: palette.light,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.white,
  },

  circleStatusConfirmed: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },

  itemActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 14,
  },

  deleteItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: palette.dangerSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexGrow: 1,
  },

  deleteItemText: {
    color: palette.danger,
    fontWeight: '800',
    fontSize: 13,
  },

  historyCard: {
    backgroundColor: '#FFFFFF',
  },

  historyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyMessage: {
    color: palette.text,
    lineHeight: 20,
    fontWeight: '700',
  },

  historyMeta: {
    marginTop: 6,
    color: palette.muted,
    fontSize: 12,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#F8FBFF',
  },

  emptyTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
  },

  emptyText: {
    color: palette.muted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 19,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },

  flex: {
    flex: 1,
  },

  notFoundTitle: {
    color: palette.text,
    fontWeight: '900',
    fontSize: 16,
  },

  notFoundText: {
    color: palette.muted,
    marginTop: 8,
  },

  chatButton: {
    position: 'absolute',
    right: 22,
    bottom: 100,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 10,
  },

  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 15,
  },

  bottomNavHalf: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-around',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  navItemText: {
    fontSize: 10,
    color: palette.muted,
    marginTop: 4,
    fontWeight: '600',
  },

  navItemTextActive: {
    color: palette.primary,
  },

  centerFab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    left: '50%',
    marginLeft: -38,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: palette.background,
  },

  centerFabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});