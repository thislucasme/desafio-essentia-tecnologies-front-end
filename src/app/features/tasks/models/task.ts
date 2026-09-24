export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTask {
    title: string;
    description: string;
    status: TaskStatus;
}

export interface UpdateTask {
    title?: string;
    description?: string;
    status?: TaskStatus;
}
