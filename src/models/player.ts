export interface Player {
    uid: string;
    order: number;
    name: string;
    surname: string;
    archetype: Archetype;
    role: string;
    company: string;
    status: 'pending' | 'setup' | 'ready';
}

export interface Archetype {
    id: number;
    name: string;
    description: string;
    roles: string[];
    actions: string[];
}
