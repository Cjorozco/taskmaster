import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types/task.types';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Custom Hook: Una función que encapsula lógica de estado y efectos para ser reutilizada.
// Siempre debe empezar con 'use'.
export const useTasks = () => {
    // useState: Maneja el estado local del componente/hook.
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useCallback: Memoriza la función 'fetchTasks' para que no se recree en cada renderizado.
    // Esto es importante si pasamos esta función como prop o dependencia de useEffect.
    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            // fetch: API nativa del navegador/RN para hacer peticiones HTTP.
            // NOTA: Usamos JSONPlaceholder, por lo que los datos son de prueba.
            const response = await fetch(`${API_URL}?_limit=20`);

            if (!response.ok) {
                throw new Error('Error al cargar tareas');
            }

            const data: Task[] = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            // finally: Se ejecuta siempre, haya error o no. Ideal para limpiar el loading.
            setIsLoading(false);
        }
    }, []); // Dependencias vacías: esta función no depende de variables externas que cambien.

    // useEffect: Ejecuta efectos secundarios (como llamadas a API) después del renderizado.
    // En un proyecto real, aquí usaríamos librerías como TanStack Query para manejo de caché y reintentos.
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // Se ejecuta cuando fetchTasks cambia (o sea, al montar, gracias a useCallback).

    return {
        tasks,
        isLoading,
        error,
        refetch: fetchTasks, // Exponemos la función para poder recargar manualmente.
    };
};