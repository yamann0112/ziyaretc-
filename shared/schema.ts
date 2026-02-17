import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const visitors = pgTable("visitors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  company: text("company"),
  plate: text("plate"),
  entryTime: timestamp("entry_time").defaultNow().notNull(),
  exitTime: timestamp("exit_time"),
  notes: text("notes"),
  isInside: boolean("is_inside").default(true).notNull(),
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
  entryTime: true,
  exitTime: true,
  isInside: true
});

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = z.infer<typeof insertVisitorSchema>;

export type CreateVisitorRequest = InsertVisitor;
export type UpdateVisitorRequest = Partial<InsertVisitor>;

export interface VisitorStats {
  totalEntries: number;
  totalExits: number;
  currentInside: number;
}
