export interface User {
    displayName?: string;
    email: string;
    username: string;
    phoneNumber: string;
    cover?: string; // PATH ABSOLUTE
    photoURL: string; // PATH ABSOLUTE
    emailVerified: boolean;
    aboutMe?: string;
    cite?: string;
    blocked: boolean;
    deleted: boolean;
    createdAt: Date;
}
export class User {
}
