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
export interface Filters {
    levelMax: Level;
    levelMin: Level;
    zone: string;
}
export interface ChatMessage {
    content: string;
    recipient: Principal;
    sender: Principal;
    timestamp: Time;
}
export interface Profile {
    id: Principal;
    age: bigint;
    bio: string;
    name: string;
    createdAt: Time;
    wins: bigint;
    zone: Zone;
    level: Level;
    availability: Array<string>;
    matchesPlayed: bigint;
    photo?: ExternalBlob;
    position: Position;
}
export interface Match {
    createdAt: Time;
    user1: Principal;
    user2: Principal;
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
    discoverCandidates(filters: Filters): Promise<Array<Profile>>;
    fetchNewMessagesSince(since: Time): Promise<Array<ChatMessage>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChat(recipient: Principal): Promise<Array<ChatMessage>>;
    getMatches(): Promise<Array<Match>>;
    getOwnProfile(): Promise<Profile>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeUser(target: Principal): Promise<boolean>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    sendMessage(recipient: Principal, content: string): Promise<void>;
    updateProfile(name: string, age: bigint, level: Level, position: Position, zone: Zone, availability: Array<string>, bio: string): Promise<void>;
    uploadPhoto(photo: ExternalBlob): Promise<void>;
}
