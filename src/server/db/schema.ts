// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `t3-ele_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  username: varchar("username", { length: 255 }),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
  password: varchar("password", { length: 255 }).notNull(),
  isVerified: boolean("isVerified").default(false),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow()
 })
 
 export const accounts = createTable(
  "account",
   {
    userId: varchar("userId", { length: 255 })
       .notNull()
       .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
     provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
   token_type: varchar("token_type", { length: 255 }),
   scope: varchar("scope", { length: 255 }),
   id_token: varchar("id_token", { length: 2048 }),
   session_state: varchar("session_state", { length: 255 }),
 },
 (account) => ({
    compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
 })
 )
 
 export const sessions = createTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 })
 
 export const verificationTokens = createTable(
 "verificationToken",
 {
   identifier: varchar("identifier", { length: 255 }).notNull(),
   token: varchar("token", { length: 255 }).notNull(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
 )

 //👇 This code block will tell Drizzle that users & blocks are related!
export const usersRelations = relations(users, ({ many }) => ({
  account: many(accounts),
  sessions: many(sessions)
}))


//👇 This code block defines which columns in the two tables are related
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}))

//👇 This code block defines which columns in the two tables are related
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))



export const posts = createTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

// export const users = createTable(
//   "user",
//   {
//     id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
//     username: varchar("name", { length: 256 }),
//     email: varchar("name", { length: 256 }),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt").onUpdateNow(),
//   },
//   (example) => ({
//     nameIndex: index("name_idx").on(example.username),
//   })
// );