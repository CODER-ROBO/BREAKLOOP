import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const screenTimeSessions = pgTable("screen_time_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // in minutes
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyGoals = pgTable("daily_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalGoal: integer("total_goal").notNull(), // in minutes
  categoryLimits: text("category_limits").notNull(), // JSON string
  breakReminders: integer("break_reminders").notNull(), // in minutes
  enableReminders: text("enable_reminders").notNull().default("true"),
});

export const insertScreenTimeSessionSchema = createInsertSchema(screenTimeSessions).omit({
  id: true,
  createdAt: true,
});

export const insertDailyGoalSchema = createInsertSchema(dailyGoals).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertScreenTimeSession = z.infer<typeof insertScreenTimeSessionSchema>;
export type InsertDailyGoal = z.infer<typeof insertDailyGoalSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ScreenTimeSession = typeof screenTimeSessions.$inferSelect;
export type DailyGoal = typeof dailyGoals.$inferSelect;
