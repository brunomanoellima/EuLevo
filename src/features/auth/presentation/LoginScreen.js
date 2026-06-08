import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useEuLevo } from '../../../core/store/eulevo-store';
import { AppModal } from '../../../shared/components/ui';

const logoEuLevo = require('../../../../assets/images/logo-eulevo.png');

const palette = {
  primary: '#0082F0',
  secondary: '#199EF3',
  white: '#FEFEFF',
  soft: '#B9DEFE',
  light: '#88C6FC',
  text: '#1F2937',
  muted: '#6B7280',
  danger: '#EF4444',
};

export function LoginScreen() {
  const { signIn, signUp, recoverPassword } = useEuLevo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [registerVisible, setRegisterVisible] = useState(false);
  const [recoverVisible, setRecoverVisible] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverNewPassword, setRecoverNewPassword] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      await signUp({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      setEmail(registerEmail.trim().toLowerCase());
      setPassword(registerPassword);

      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterVisible(false);

      Alert.alert('Cadastro realizado', 'Conta criada com sucesso. Agora você pode entrar.');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = async () => {
    try {
      setLoading(true);

      await recoverPassword({
        email: recoverEmail,
        newPassword: recoverNewPassword,
      });

      setEmail(recoverEmail.trim().toLowerCase());
      setPassword(recoverNewPassword);

      setRecoverEmail('');
      setRecoverNewPassword('');
      setRecoverVisible(false);

      Alert.alert('Senha redefinida', 'Sua senha foi alterada com sucesso.');
    } catch (error) {
      Alert.alert('Erro ao recuperar senha', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <LinearGradient
          colors={[palette.white, '#F3FAFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.logoBox}>
            <Image
              source={logoEuLevo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.brandArea}>
            <Text style={styles.hello}>Olá!</Text>
            <Text style={styles.welcome}>Bem-vindo ao EuLevo</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.formSection}
        >
          <Text style={styles.formTitle}>Entrar</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="email-outline" size={20} color={palette.primary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="E-mail"
                placeholderTextColor={palette.muted}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrap}>
              <MaterialCommunityIcons name="lock-outline" size={20} color={palette.primary} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Senha"
                placeholderTextColor={palette.muted}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.forgotWrap} onPress={() => setRecoverVisible(true)}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </Pressable>

          <View style={styles.footerLine}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Pressable onPress={() => setRegisterVisible(true)}>
              <Text style={styles.footerLink}> Criar conta</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ScrollView>

      <AppModal
        visible={registerVisible}
        title="Criar conta"
        onClose={() => setRegisterVisible(false)}
      >
        <Text style={styles.modalLabel}>Nome</Text>
        <View style={styles.modalInputWrap}>
          <MaterialCommunityIcons name="account-outline" size={19} color={palette.primary} />
          <TextInput
            value={registerName}
            onChangeText={setRegisterName}
            placeholder="Digite seu nome"
            placeholderTextColor={palette.muted}
            style={styles.modalInput}
          />
        </View>

        <Text style={styles.modalLabel}>E-mail</Text>
        <View style={styles.modalInputWrap}>
          <MaterialCommunityIcons name="email-outline" size={19} color={palette.primary} />
          <TextInput
            value={registerEmail}
            onChangeText={setRegisterEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Digite seu e-mail"
            placeholderTextColor={palette.muted}
            style={styles.modalInput}
          />
        </View>

        <Text style={styles.modalLabel}>Senha</Text>
        <View style={styles.modalInputWrap}>
          <MaterialCommunityIcons name="lock-outline" size={19} color={palette.primary} />
          <TextInput
            value={registerPassword}
            onChangeText={setRegisterPassword}
            secureTextEntry
            placeholder="Crie uma senha"
            placeholderTextColor={palette.muted}
            style={styles.modalInput}
          />
        </View>

        <View style={styles.modalButtonsRow}>
          <Pressable
            onPress={() => setRegisterVisible(false)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
          >
            <Text style={styles.secondaryButtonText}>Fechar</Text>
          </Pressable>

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryModalButton,
              pressed && styles.loginButtonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryModalButtonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </Pressable>
        </View>
      </AppModal>

      <AppModal
        visible={recoverVisible}
        title="Recuperar senha"
        onClose={() => setRecoverVisible(false)}
      >
        <Text style={styles.modalLabel}>E-mail</Text>
        <View style={styles.modalInputWrap}>
          <MaterialCommunityIcons name="email-outline" size={19} color={palette.primary} />
          <TextInput
            value={recoverEmail}
            onChangeText={setRecoverEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Digite seu e-mail"
            placeholderTextColor={palette.muted}
            style={styles.modalInput}
          />
        </View>

        <Text style={styles.modalLabel}>Nova senha</Text>
        <View style={styles.modalInputWrap}>
          <MaterialCommunityIcons name="lock-reset" size={19} color={palette.primary} />
          <TextInput
            value={recoverNewPassword}
            onChangeText={setRecoverNewPassword}
            secureTextEntry
            placeholder="Digite a nova senha"
            placeholderTextColor={palette.muted}
            style={styles.modalInput}
          />
        </View>

        <View style={styles.modalButtonsRow}>
          <Pressable
            onPress={() => setRecoverVisible(false)}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}
          >
            <Text style={styles.secondaryButtonText}>Fechar</Text>
          </Pressable>

          <Pressable
            onPress={handleRecoverPassword}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryModalButton,
              pressed && styles.loginButtonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryModalButtonText}>
              {loading ? 'Redefinindo...' : 'Redefinir'}
            </Text>
          </Pressable>
        </View>
      </AppModal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.white,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  headerSection: {
    paddingTop: 65,
    paddingBottom: 35,
    paddingHorizontal: 24,
  },

  logoBox: {
    width: 340,
    height: 180,
    borderRadius: 34,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    paddingHorizontal: 0,

    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },

  logoImage: {
    width: 330,
    height: 165,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },

  brandArea: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 8,
  },

  hello: {
    color: palette.primary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  welcome: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 6,
  },

  formSection: {
    flex: 1,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 40,
  },

  formTitle: {
    color: palette.white,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 28,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputWrap: {
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },

  input: {
    flex: 1,
    color: palette.text,
    fontSize: 15,
    paddingVertical: 0,
    fontWeight: '500',
  },

  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: 4,
  },

  forgotText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: '700',
  },

  loginButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 20,
  },

  loginButtonPressed: {
    opacity: 0.85,
  },

  loginButtonText: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  footerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },

  footerText: {
    color: palette.white,
    fontSize: 14,
  },

  footerLink: {
    color: '#EAF6FF',
    fontWeight: '800',
    fontSize: 14,
  },

  modalLabel: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 12,
  },

  modalInputWrap: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 10,
  },

  modalInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
  },

  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  primaryModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryModalButtonText: {
    color: palette.white,
    fontWeight: '800',
    fontSize: 15,
  },

  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryPressed: {
    backgroundColor: '#E5E7EB',
  },

  secondaryButtonText: {
    color: palette.text,
    fontWeight: '800',
    fontSize: 15,
  },
});