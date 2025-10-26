import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export type UserRole = 'admin' | 'agent' | 'farmer';

// Users table - for authentication and role management
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // 'admin' | 'agent' | 'farmer'
  name: text("name").notNull(),
  phone: text("phone"),
  agent_id: text("agent_id"), // For agents: their unique Agent ID
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Farmers table
export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  national_id: text("national_id").notNull().unique(),
  agent_id: text("agent_id"), // Which agent linked this farmer
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmer_id: text("farmer_id").notNull(),
  agent_id: text("agent_id").notNull(),
  product_name: text("product_name").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit_price: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  total_cost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  down_payment: decimal("down_payment", { precision: 10, scale: 2 }).notNull(),
  remaining_balance: decimal("remaining_balance", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'pending' | 'approved' | 'rejected'
  created_at: timestamp("created_at").defaultNow().notNull(),
  approved_at: timestamp("approved_at"),
  approved_by: text("approved_by"), // Admin user ID
});

// Payments table - tracks the 50% remaining balance payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  order_id: text("order_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  due_date: timestamp("due_date").notNull(),
  paid_date: timestamp("paid_date"),
  status: text("status").notNull(), // 'pending' | 'paid' | 'overdue'
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  approvedBy: true,
}).extend({
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.coerce.number().positive("Unit price must be positive"),
  totalCost: z.coerce.number().positive("Total cost must be positive"),
  downPayment: z.coerce.number().positive("Down payment must be positive"),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// Extended types for joined queries
export type OrderWithDetails = Order & {
  farmer: Farmer;
  agent: User;
};

export type PaymentSchedule = Payment & {
  order: OrderWithDetails;
};
