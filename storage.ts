import { 
  users, 
  screenTimeSessions, 
  dailyGoals,
  type User, 
  type InsertUser,
  type ScreenTimeSession,
  type InsertScreenTimeSession,
  type DailyGoal,
  type InsertDailyGoal
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Screen time session methods
  getScreenTimeSessions(userId: number): Promise<ScreenTimeSession[]>;
  getScreenTimeSessionsByDate(userId: number, date: string): Promise<ScreenTimeSession[]>;
  createScreenTimeSession(session: InsertScreenTimeSession): Promise<ScreenTimeSession>;
  deleteScreenTimeSession(sessionId: number): Promise<void>;
  
  // Daily goal methods
  getDailyGoal(userId: number): Promise<DailyGoal | undefined>;
  createOrUpdateDailyGoal(goal: InsertDailyGoal): Promise<DailyGoal>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private screenTimeSessions: Map<number, ScreenTimeSession>;
  private dailyGoals: Map<number, DailyGoal>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentGoalId: number;

  constructor() {
    this.users = new Map();
    this.screenTimeSessions = new Map();
    this.dailyGoals = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentGoalId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getScreenTimeSessions(userId: number): Promise<ScreenTimeSession[]> {
    return Array.from(this.screenTimeSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async getScreenTimeSessionsByDate(userId: number, date: string): Promise<ScreenTimeSession[]> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
    
    return Array.from(this.screenTimeSessions.values()).filter(
      (session) => session.userId === userId && 
      session.createdAt >= startOfDay && 
      session.createdAt < endOfDay
    );
  }

  async createScreenTimeSession(insertSession: InsertScreenTimeSession): Promise<ScreenTimeSession> {
    const id = this.currentSessionId++;
    const session: ScreenTimeSession = { 
      ...insertSession, 
      id,
      notes: insertSession.notes || null,
      createdAt: new Date()
    };
    this.screenTimeSessions.set(id, session);
    return session;
  }

  async deleteScreenTimeSession(sessionId: number): Promise<void> {
    this.screenTimeSessions.delete(sessionId);
  }

  async getDailyGoal(userId: number): Promise<DailyGoal | undefined> {
    return Array.from(this.dailyGoals.values()).find(
      (goal) => goal.userId === userId
    );
  }

  async createOrUpdateDailyGoal(insertGoal: InsertDailyGoal): Promise<DailyGoal> {
    const existingGoal = await this.getDailyGoal(insertGoal.userId);
    
    if (existingGoal) {
      const updatedGoal: DailyGoal = { ...existingGoal, ...insertGoal };
      this.dailyGoals.set(existingGoal.id, updatedGoal);
      return updatedGoal;
    }
    
    const id = this.currentGoalId++;
    const goal: DailyGoal = { 
      id,
      userId: insertGoal.userId,
      totalGoal: insertGoal.totalGoal,
      categoryLimits: insertGoal.categoryLimits,
      breakReminders: insertGoal.breakReminders,
      enableReminders: insertGoal.enableReminders || "true"
    };
    this.dailyGoals.set(id, goal);
    return goal;
  }
}

export const storage = new MemStorage();
