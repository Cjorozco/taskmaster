import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task } from '../types/task.types';
import { COLORS, SPACING } from '../../../shared/constants/theme';

interface TaskCardProps {
    task: Task;
    onPress: () => void;
}

// React.memo: Es una técnica de optimización (HOC - High Order Component).
// Evita que este componente se renderice de nuevo si sus 'props' (task, onPress) no han cambiado.
// Es muy útil en listas largas (FlatList) para mejorar el rendimiento.
export const TaskCard = React.memo(({ task, onPress }: TaskCardProps) => {
    return (
        <Pressable
            onPress={onPress}
            // style como función: Nos permite cambiar el estilo dinámicamente según el estado del componente.
            // 'pressed' es true cuando el usuario está tocando el elemento.
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed, // Si está presionado, aplicamos opacidad visual.
            ]}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,
                        task.completed && styles.titleCompleted, // Estilo condicional: tachamos si está completada.
                    ]}
                    numberOfLines={2} // Limitamos a 2 líneas para que no rompa el diseño.
                >
                    {task.title}
                </Text>

                <View style={[
                    styles.badge,
                    // Estilo dinámico en línea para el color de fondo según el estado.
                    { backgroundColor: task.completed ? COLORS.success : COLORS.error }
                ]}>
                    <Text style={styles.badgeText}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: SPACING.md,
        marginHorizontal: SPACING.md,
        marginVertical: SPACING.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardPressed: {
        opacity: 0.7,
    },
    content: {
        gap: SPACING.sm,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: COLORS.textSecondary,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: 6,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});