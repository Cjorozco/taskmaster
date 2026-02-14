// Interface: Ideal para definir la forma de los objetos. Es extensible.
export interface Task {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
}

// Type + Omit: 'Omit' es un Utility Type que crea un nuevo tipo eliminando propiedades de otro.
// Aquí creamos 'TaskFormData' igual a 'Task' pero sin 'id' ni 'userId', útil para formularios de creación.
export type TaskFormData = Omit<Task, 'id' | 'userId'>;