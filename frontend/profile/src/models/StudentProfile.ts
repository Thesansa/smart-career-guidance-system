// src/models/StudentProfile.ts

export interface StudentProfile {
    id?: number;
    userId?: string;
    name?: string;
    email?: string;
    contact?: string;
    university?: string;
    // Add more fields if backend includes them (like gender, address, etc.)
}
