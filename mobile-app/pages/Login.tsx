import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { LoginPageProps } from '../utils/loginPage';
import { loginPageStyles as styles } from '../custom-styles/loginPageStyles';

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginPageProps) {
  const { login, isSubmitting, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const emailError = email.trim() === '';
  const passwordError = password === '';
  const isValid = !emailError && !passwordError;

  const handleLogin = async () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const success = await login(email.trim(), password);
    if (success) {
      onLoginSuccess?.();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue to Astromonk</Text>

      <TextInput
        label="Email"
        mode="flat"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        error={showErrors && emailError}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clearError();
        }}
      />
      <HelperText type="error" visible={showErrors && emailError}>
        Email is required
      </HelperText>

      <TextInput
        label="Password"
        mode="flat"
        style={styles.input}
        secureTextEntry
        error={showErrors && passwordError}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearError();
        }}
      />
      <HelperText type="error" visible={showErrors && passwordError}>
        Password is required
      </HelperText>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleLogin}
      >
        Log In
      </Button>

      <View style={styles.linkRow}>
        <Text>Don&apos;t have an account? </Text>
        <Text style={styles.linkText} onPress={onNavigateToRegister}>
          Register
        </Text>
      </View>
    </ScrollView>
  );
}
