import { users, visitors, type Visitor, type InsertVisitor, type UpdateVisitorRequest } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getVisitors(search?: string, limit?: number): Promise<Visitor[]>;
  getVisitor(id: number): Promise<Visitor | undefined>;
  createVisitor(visitor: InsertVisitor): Promise<Visitor>;
  updateVisitor(id: number, visitor: UpdateVisitorRequest): Promise<Visitor>;
  deleteVisitor(id: number): Promise<void>;
  exitVisitor(id: number): Promise<Visitor>;
  getStats(): Promise<{ totalEntries: number; totalExits: number; currentInside: number }>;
}

export class DatabaseStorage implements IStorage {
  async getVisitors(search?: string, limit?: number): Promise<Visitor[]> {
    let query = db.select().from(visitors).orderBy(desc(visitors.entryTime));
    
    if (search) {
      const searchPattern = `%${search}%`;
      query.where(
        or(
          ilike(visitors.name, searchPattern),
          ilike(visitors.surname, searchPattern),
          ilike(visitors.company, searchPattern),
          ilike(visitors.plate, searchPattern)
        )
      );
    }

    if (limit) {
      query.limit(limit);
    }

    return await query;
  }

  async getVisitor(id: number): Promise<Visitor | undefined> {
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, id));
    return visitor;
  }

  async createVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const [visitor] = await db.insert(visitors).values(insertVisitor).returning();
    return visitor;
  }

  async updateVisitor(id: number, updateVisitor: UpdateVisitorRequest): Promise<Visitor> {
    const [updated] = await db
      .update(visitors)
      .set(updateVisitor)
      .where(eq(visitors.id, id))
      .returning();
    return updated;
  }

  async deleteVisitor(id: number): Promise<void> {
    await db.delete(visitors).where(eq(visitors.id, id));
  }

  async exitVisitor(id: number): Promise<Visitor> {
    const [updated] = await db
      .update(visitors)
      .set({ 
        exitTime: new Date(), 
        isInside: false 
      })
      .where(eq(visitors.id, id))
      .returning();
    return updated;
  }

  async getStats(): Promise<{ totalEntries: number; totalExits: number; currentInside: number }> {
    const [stats] = await db.select({
      totalEntries: sql<number>`count(*)`.mapWith(Number),
      totalExits: sql<number>`count(case when ${visitors.exitTime} is not null then 1 end)`.mapWith(Number),
      currentInside: sql<number>`count(case when ${visitors.isInside} = true then 1 end)`.mapWith(Number),
    }).from(visitors);
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
