import { db } from "./db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  users, products, orders, orderItems,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(search?: string, category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  
  // Orders
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Stats
  getStats(): Promise<{ totalProducts: number; totalUsers: number; totalOrders: number; revenue: number }>;
  getProductStats(): Promise<{ category: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(search?: string, category?: string): Promise<Product[]> {
    let query = db.select().from(products).$dynamic();
    
    if (search && category) {
      query = query.where(and(ilike(products.name, `%${search}%`), eq(products.category, category)));
    } else if (search) {
      query = query.where(ilike(products.name, `%${search}%`));
    } else if (category) {
      query = query.where(eq(products.category, category));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [p] = await db.insert(products).values(product).returning();
    return p;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [p] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return p;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId));
    }
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values(order).returning();
      for (const item of items) {
        await tx.insert(orderItems).values({
          ...item,
          orderId: newOrder.id
        });
      }
      return newOrder;
    });
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getStats(): Promise<{ totalProducts: number; totalUsers: number; totalOrders: number; revenue: number }> {
    const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [ordersCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
    const [revenueResult] = await db.select({ total: sql<string>`sum(total_amount)` }).from(orders);
    
    return {
      totalProducts: Number(productsCount.count) || 0,
      totalUsers: Number(usersCount.count) || 0,
      totalOrders: Number(ordersCount.count) || 0,
      revenue: Number(revenueResult.total) || 0,
    };
  }

  async getProductStats(): Promise<{ category: string; count: number }[]> {
    const stats = await db
      .select({
        category: products.category,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .groupBy(products.category);
    
    return stats.map(s => ({
      category: s.category || "Uncategorized",
      count: Number(s.count)
    }));
  }
}

export const storage = new DatabaseStorage();
