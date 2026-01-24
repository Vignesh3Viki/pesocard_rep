-- Create card_views table for tracking unique visitors
CREATE TABLE IF NOT EXISTS card_views (
  id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(card_id, visitor_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_card_views_card_id ON card_views(card_id);
CREATE INDEX IF NOT EXISTS idx_card_views_visitor_id ON card_views(visitor_id);
