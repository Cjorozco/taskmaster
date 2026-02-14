import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useTasks } from '../api/useTasks';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../../../shared/components/Button';

// ... (lines 10-59 omitted in thought, but I need to be careful with replace_file_content)
// I cannot match huge blocks. I need to do it in chunks.

// Actually I should use multi_replace.


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

interface TaskListScreenProps {
  navigation: NavigationProp;
}

export const TaskListScreen = ({ navigation }: TaskListScreenProps) => {
  // Desestructuramos los valores que nos devuelve nuestro Custom Hook.
  const { tasks, isLoading, error, refetch } = useTasks();
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all');

  // useCallback: Memorizamos esta función. Como 'navigation' no suele cambiar, esta función será muy estable.
  const handleTaskPress = useCallback((taskId: number) => {
    navigation.navigate('TaskDetail', { taskId });
  }, [navigation]);

  const filteredTasks = useMemo(() => {
    switch (filterType) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filterType]);

  // renderItem: Función que renderiza cada elemento de la lista.
  // Usamos useCallback para que FlatList no tenga que recalcularla en cada render.
  const renderItem = useCallback(({ item }: { item: any }) => ( // 'any' temporal o importar tipo Task
    <TaskCard
      task={item}
      onPress={() => handleTaskPress(item.id)} // Pasamos la función memorizada
    />
  ), [handleTaskPress]);

  // Renderizado Condicional: Si está cargando, mostramos un indicador.
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizado Condicional: Si hay error, mostramos el mensaje.
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Todas" onPress={() => setFilterType('all')} />
      <Button title="Completadas" onPress={() => setFilterType('completed')} />
      <Button title="Pendientes" onPress={() => setFilterType('pending')} />
      {/* FlatList: Componente optimizado para listas largas.
                - data: El array de datos.
                - keyExtractor: Función para obtener una ID única por item (necesario para la optimización).
                - renderItem: Función para renderizar cada item.
            */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch} // Pull-to-refresh
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No hay tareas</Text>
          </View>
        }
      />

      {/* Botón flotante (FAB) */}
      <Pressable
        onPress={() => navigation.navigate('TaskForm')}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: SPACING.sm,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 32,
  },
});