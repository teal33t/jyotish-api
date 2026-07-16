import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { RegisterPageProps } from '../utils/registerPage';
import { registerPageStyles as styles } from '../custom-styles/registerPageStyles';

export default function Register({ onRegisterSuccess, onNavigateToLogin }: RegisterPageProps) {
  const { register, isSubmitting, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const emailError = email.trim() === '';
  const passwordError = password.length < 6;
  const isValid = !emailError && !passwordError;

  const handleRegister = async () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const success = await register(email.trim(), password);
    if (success) {
      onRegisterSuccess?.();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started with Astromonk</Text>

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
        Password must be at least 6 characters
      </HelperText>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleRegister}
      >
        Register
      </Button>

      <View style={styles.linkRow}>
        <Text>Already have an account? </Text>
        <Text style={styles.linkText} onPress={onNavigateToLogin}>
          Log In
        </Text>
      </View>
    </ScrollView>
  );
}
