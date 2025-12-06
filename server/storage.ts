import { type User, type InsertUser, type PracticeSession, type InsertPracticeSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSessions(): Promise<PracticeSession[]>;
  getSession(id: string): Promise<PracticeSession | undefined>;
  createSession(session: InsertPracticeSession): Promise<PracticeSession>;
  updateSession(id: string, session: Partial<InsertPracticeSession>): Promise<PracticeSession | undefined>;
  deleteSession(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, PracticeSession>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSessions(): Promise<PracticeSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getSession(id: string): Promise<PracticeSession | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertPracticeSession): Promise<PracticeSession> {
    const id = randomUUID();
    const session: PracticeSession = {
      id,
      name: insertSession.name,
      description: insertSession.description ?? null,
      notes: insertSession.notes ?? null,
      focusArea: insertSession.focusArea ?? null,
      mood: insertSession.mood,
      focus: insertSession.focus,
      duration: insertSession.duration,
      date: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<InsertPracticeSession>): Promise<PracticeSession | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    
    const updated: PracticeSession = { ...existing, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }
}

export const storage = new MemStorage();
