-- D1 Database Schema for Blog Portfolio
-- Migration: 0001_schema.sql

-- Posts table (primary content storage)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Views table (telemetry)
CREATE TABLE IF NOT EXISTS views (
  post_id TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Seen visitors table (view deduplication)
CREATE TABLE IF NOT EXISTS seen_visitors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  seen_at TEXT NOT NULL,
  UNIQUE(post_id, visitor_hash),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Index for faster visitor lookup
CREATE INDEX IF NOT EXISTS idx_seen_visitors ON seen_visitors(post_id, visitor_hash);
