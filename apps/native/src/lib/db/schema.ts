import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const invoice = sqliteTable("invoice", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  total: real("total").notNull(),
  vendor: text("vendor").notNull().default(""),
  tax: real("tax").notNull(),
  tip: real("tip").notNull(),
  date: text("date").notNull().default(new Date().toISOString()),
  state: text("state").notNull().default("pending"), // pending, paid, cancelled
});

export const item = sqliteTable("item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoice.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const member = sqliteTable("member", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoice.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  total: real("total").notNull().default(0),
  status: text("status").notNull().default("pending"), // 0 = not paid, 1 = partially paid, 2 = paid
});

export const memberItem = sqliteTable("member_item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoice.id, { onDelete: "cascade" }),
  memberId: integer("member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  itemId: integer("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
});

