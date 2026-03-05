import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Registration {
    age: bigint;
    weight: number;
    height: number;
    dateOfBirth: string;
    bust: number;
    hips: number;
    bioPlatformStatement: string;
    fullName: string;
    talentSkills: string;
    fullBodyPhotoBlob?: ExternalBlob;
    address: string;
    occupationOrSchool: string;
    timestamp: bigint;
    emergencyContactPhone: string;
    previousPageantExperience: string;
    contactNumber: string;
    emergencyContactName: string;
    headshotBlob?: ExternalBlob;
    waist: number;
    hobbiesInterests: string;
    educationLevel: string;
}
export type RegistrationId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllRegistrations(): Promise<Array<Registration>>;
    getAllRegistrationsSortedByTimestamp(): Promise<Array<Registration>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRegistration(registrationId: RegistrationId): Promise<Registration>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRegistration(registration: Registration): Promise<RegistrationId>;
}
