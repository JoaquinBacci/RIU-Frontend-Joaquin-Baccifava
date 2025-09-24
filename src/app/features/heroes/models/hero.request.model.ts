export interface CreateHeroRequest { 
    name: string; 
    power?: string; 
    description?: string; 
}

export interface UpdateHeroRequest { 
    id: string; 
    name: string; 
    power?: string; 
    description?: string; 
}