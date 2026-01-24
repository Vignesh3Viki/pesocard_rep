-- Create card_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS card_analytics (
  id SERIAL PRIMARY KEY,
  card_id UUID NOT NULL UNIQUE,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_card_analytics_card_id ON card_analytics(card_id);
