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
export type Zone = string;
export type Time = bigint;
export interface Profile {
    id: Principal;
    age: bigint;
    bio: string;
    name: string;
    wins: bigint;
    zone: Zone;
    created_at: Time;
    level: Level;
    availability: Array<string>;
    matchesPlayed: bigint;
    photo?: ExternalBlob;
    position: Position;
}
export enum Filters {
    zone = "zone",
    level = "level"
}
export enum Level {
    one = "one",
    two = "two",
    three = "three",
    five = "five",
    four = "four"
}
export enum Position {
    drive = "drive",
    reves = "reves"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProfile(name: string, age: bigint, level: Level, position: Position, zone: Zone, availability: Array<string>, bio: string): Promise<void>;
    discoverCandidates(_filters: Filters): Promise<Array<Profile>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    updateProfile(name: string, age: bigint, level: Level, position: Position, zone: Zone, availability: Array<string>, bio: string): Promise<void>;
    uploadPhoto(photo: ExternalBlob): Promise<void>;
}
