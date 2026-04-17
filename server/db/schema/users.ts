import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at', { withTimezone: true }),
    unit_kerja: text('unit_kerja'),
    username: varchar('username'),
    password: varchar('password'),
    role_id: integer('role_id'),
    alias: varchar('alias'),
    role: varchar('role'),
  }
)
