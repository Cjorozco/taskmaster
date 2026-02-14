import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { COLORS, SPACING } from '../../../shared/constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;

export const TaskFormScreen = ({ navigation }: Props) => {
  // useState: Para formularios, necesitamos un estado para cada campo (o un objeto para todos).
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({ title: '' });

  // useCallback: Validar depende de 'title'.
  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = { title: '' };

    // Validación simple: no vacío y longitud mínima.
    if (title.trim().length === 0) {
      newErrors.title = 'El título es requerido';
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [title]); // Se recrea solo cuando cambia 'title'.

  // Manejador del envío del formulario. Es 'async' porque hace una petición de red.
  const handleSave = async () => {
    if (!validate()) {
      return; // Si no es válido, detenemos la ejecución.
    }

    try {
      // fetch: PUT/POST request.
      // NOTA: JSONPlaceholder simula la creación. Devuelve un ID (siempre 201) pero no guarda el objeto.
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
          userId: 1, // Hardcoded: En una app real, vendría del contexto de autenticación.
        }),
      });

      // Parseamos la respuesta aunque en este caso dummy no la usemos mucho.
      const data = await response.json();

      // Alert: Feedback nativo al usuario.
      Alert.alert(
        'Éxito',
        'Tarea creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navegamos atrás al terminar.
          },
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Título de la tarea *</Text>
          <TextInput
            style={[
              styles.input,
              errors.title ? styles.inputError : null,
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({ title: '' });
              }
            }}
            placeholder="Ej: Comprar leche"
            placeholderTextColor={COLORS.textSecondary}
          />
          {errors.title ? (
            <Text style={styles.errorText}>{errors.title}</Text>
          ) : null}

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Guardar Tarea</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  form: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#FFFFFF',
    marginBottom: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});