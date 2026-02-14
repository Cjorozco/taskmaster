import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskListScreen } from '../features/tasks/screens/TaskListScreen';
import { TaskDetailScreen } from '../features/tasks/screens/TaskDetailScreen';
import { TaskFormScreen } from '../features/tasks/screens/TaskFormScreen';

// RootStackParamList: Define los tipos de parámetros que recibe cada pantalla.
// 'undefined' significa que la pantalla no recibe parámetros.
// Esto es vital para que TypeScript nos ayude a evitar errores de navegación.
export type RootStackParamList = {
    TaskList: undefined;
    TaskDetail: { taskId: number }; // Esta pantalla requiere un ID de tarea.
    TaskForm: undefined;
};

// Stack: Creamos el objeto que gestionará la pila de navegación.
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        // Stack.Navigator: Componente contenedor que gestiona la historia de navegación.
        <Stack.Navigator>
            {/* Stack.Screen: Define una pantalla dentro del navegador.
                - name: Identificador único usado para navegar (navigation.navigate('Nombre')).
                - component: El componente React que se renderizará.
                - options: Configuración visual (título, cabecera, etc.).
            */}
            <Stack.Screen
                name="TaskList"
                component={TaskListScreen}
                options={{ title: 'Mis Tareas' }}
            />
            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{ title: 'Detalle de Tarea' }}
            />
            <Stack.Screen
                name="TaskForm"
                component={TaskFormScreen}
                options={{ title: 'Nueva Tarea' }}
            />
        </Stack.Navigator>
    );
};