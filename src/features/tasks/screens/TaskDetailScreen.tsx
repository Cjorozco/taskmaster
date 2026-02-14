import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { Task } from '../types/task.types';
import { Button } from '../../../shared/components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen = ({ route, navigation }: Props) => {
  // route.params: Aquí recibimos los parámetros que enviamos desde la navegación (taskId).
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect: Se ejecuta cuando el componente se monta o cuando cambia 'taskId'.
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`)
      .then(res => res.json())
      .then(data => {
        setTask(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [taskId]); // Dependencia: si el ID cambia, volvemos a buscar.

  const handleDelete = () => {  // ← No necesita async aquí
    Alert.alert('Confirmación', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {  // ← async AQUÍ
          try {  // ← try-catch AQUÍ
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');

            Alert.alert('Éxito', 'Tarea eliminada', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          } catch (error) {  // ← AHORA SÍ atrapa errores
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const handleUpdate = async () => {  // ← async
    if (!task) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {  // ← await
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      // Actualiza el estado local (opcional pero mejor UX)
      setTask({ ...task, completed: !task.completed });

      Alert.alert('Éxito', 'Tarea actualizada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  // Renderizado condicional: Loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizado condicional: Error o no encontrado
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No se encontró la tarea</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Título</Text>
          <Text style={styles.title}>{task.title}</Text>

          <View style={styles.separator} />

          <Text style={styles.label}>ID de Tarea</Text>
          <Text style={styles.value}>#{task.id}</Text>

          <View style={styles.separator} />

          <Text style={styles.label}>Estado</Text>
          <View style={[
            styles.badge,
            { backgroundColor: task.completed ? COLORS.success : COLORS.error }
          ]}>
            <Text style={styles.badgeText}>
              {task.completed ? '✓ Completada' : '○ Pendiente'}
            </Text>
          </View>
          <Button
            title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
            onPress={() => { handleUpdate() }}
            backgroundColor={task.completed ? COLORS.pending : COLORS.success}
          />

          <View style={styles.separator} />

          <Text style={styles.label}>Usuario ID</Text>
          <Text style={styles.value}>{task.userId}</Text>
          <Button
            title="Eliminar"
            onPress={() => { handleDelete() }}
            backgroundColor={COLORS.error}
          />
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 28,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
  },
  fabDelete: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  fabDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});