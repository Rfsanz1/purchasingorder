import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Tabel key-value untuk pengaturan aplikasi yang bisa diubah dari halaman
// admin tanpa redeploy (mis. token Fonnte, ID grup WA tujuan).
// Disimpan di DB supaya persisten lintas deploy/restart.
export const appSettingsTable = pgTable("app_settings", {
  key:       text("key").primaryKey(),
  value:     text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AppSetting = typeof appSettingsTable.$inferSelect;
