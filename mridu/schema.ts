import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// ─── BOOKS ──────────────────────────────────────────────────────────────────
export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull().default(""),
  description: text("description").notNull().default(""),
  language: text("language").notNull().default("hindi"),
  coverColor: text("cover_color").notNull().default("#6366f1"),
  status: text("status").notNull().default("draft"), // draft | writing | completed | archived
  category: text("category").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  isFavorite: boolean("is_favorite").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  isTrashed: boolean("is_trashed").notNull().default(false),
  wordCount: integer("word_count").notNull().default(0),
  chapterCount: integer("chapter_count").notNull().default(0),
  lastReadPosition: jsonb("last_read_position"),
  readingProgress: integer("reading_progress").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────
export const collections = pgTable("collections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull().default("#6366f1"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bookCollections = pgTable("book_collections", {
  id: serial("id").primaryKey(),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  collectionId: text("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
});

// ─── CHAPTERS ────────────────────────────────────────────────────────────────
export const chapters = pgTable("chapters", {
  id: text("id").primaryKey(),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  orderIndex: integer("order_index").notNull().default(0),
  partTitle: text("part_title").notNull().default(""),
  wordCount: integer("word_count").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── BOOKMARKS ────────────────────────────────────────────────────────────────
export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  chapterId: text("chapter_id").references(() => chapters.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull().default(""),
  label: text("label").notNull().default(""),
  color: text("color").notNull().default("#f59e0b"),
  position: integer("position").notNull().default(0),
  isFavorite: boolean("is_favorite").notNull().default(false),
  context: text("context").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── TIMELINE EVENTS ─────────────────────────────────────────────────────────
export const timelineEvents = pgTable("timeline_events", {
  id: text("id").primaryKey(),
  bookId: text("book_id").references(() => books.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull().default(""),
  character: text("character").notNull().default(""),
  place: text("place").notNull().default(""),
  eventDay: integer("event_day"),
  eventMonth: integer("event_month"),
  eventYear: integer("event_year"),
  yearsAgo: integer("years_ago"),
  era: text("era").notNull().default("CE"), // CE | BCE
  description: text("description").notNull().default(""),
  eventType: text("event_type").notNull().default("custom"), // book_created | chapter_added | custom | milestone
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── APP SETTINGS ────────────────────────────────────────────────────────────
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").notNull().default("light"), // light | dark | sepia
  fontSize: integer("font_size").notNull().default(16),
  fontFamily: text("font_family").notNull().default("Noto Sans Devanagari"),
  defaultLanguage: text("default_language").notNull().default("hindi"),
  autoSaveInterval: integer("auto_save_interval").notNull().default(30),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type NewTimelineEvent = typeof timelineEvents.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type AppSettings = typeof appSettings.$inferSelect;
