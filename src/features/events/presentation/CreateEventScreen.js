import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useEuLevo } from '../../../core/store/eulevo-store';
import { colors } from '../../../core/theme/colors';
import {
  Card,
  Input,
  Label,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
} from '../../../shared/components/ui';

export function CreateEventScreen({ navigation }) {
  const { createEvent } = useEuLevo();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (name.trim().length < 3 || name.trim().length > 100) {
      Alert.alert('Validacao', 'O nome deve ter entre 3 e 100 caracteres.');
      return;
    }
    try {
      setSaving(true);
      const event = await createEvent({ name, description });
      navigation.replace('EventDetail', { eventId: event.id });
    } catch (error) {
      Alert.alert('Erro ao criar evento', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll>
      <SectionTitle subtitle="Preencha os dados principais para abrir um novo evento.">
        Criar evento
      </SectionTitle>
      <Card style={styles.formCard}>
        <Label>Nome</Label>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Nome do evento"
          icon="calendar-star"
        />
        <Label>Descricao</Label>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Descricao opcional"
          multiline
          icon="text-box-outline"
        />
      </Card>
      <View style={styles.row}>
        <SecondaryButton
          label="Cancelar"
          onPress={() => navigation.goBack()}
          style={styles.flex}
          icon="close"
        />
        <PrimaryButton
          label={saving ? 'Criando...' : 'Criar Evento'}
          onPress={handleCreate}
          style={styles.flex}
          disabled={saving}
          icon="check"
        />
      </View>
      <Text style={styles.caption}>Nome obrigatorio com 3 a 100 caracteres.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  flex: {
    flex: 1,
  },
  caption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
