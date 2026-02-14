import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { useTasks } from '../api/useTasks';
import { TaskCard } from '../components/TaskCard';

export const TaskListScreen = () => {
    const { tasks, isLoading, error, refetch } = useTasks();

    const handleTaskPress = (taskId: number) => {
        console.log('Task pressed:', taskId);
    };

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
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        onPress={() => handleTaskPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={refetch}
                ListEmptyComponent={
                    <View style={styles.centerContent}>
                        <Text style={styles.emptyText}>No hay tareas</Text>
                    </View>
                }
            />
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
});