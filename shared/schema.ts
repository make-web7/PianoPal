import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const practiceSessions = pgTable("practice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  notes: text("notes"),
  focusArea: text("focus_area"),
  mood: integer("mood").notNull(),
  focus: integer("focus").notNull(),
  duration: integer("duration").notNull(),
  recordingUrl: text("recording_url"),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({
  id: true,
  date: true,
});

export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type PracticeSession = typeof practiceSessions.$inferSelect;

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dailyMinutes: integer("daily_minutes").notNull().default(30),
  weeklyMinutes: integer("weekly_minutes").notNull().default(210),
  monthlyMinutes: integer("monthly_minutes").notNull().default(900),
});

export const insertGoalsSchema = createInsertSchema(goals).omit({
  id: true,
});

export type InsertGoals = z.infer<typeof insertGoalsSchema>;
export type Goals = typeof goals.$inferSelect;
