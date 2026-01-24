-- ENUM types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_share_type') THEN
    CREATE TYPE card_share_type AS ENUM ('QR', 'shareLink');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visiting_source_type') THEN
    CREATE TYPE visiting_source_type AS ENUM (
      'linkedin', 'website', 'instagram', 'facebook', 'twitter', 'direct', 'other'
    );
  END IF;
END$$;

-- Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- card_share_metrics
CREATE TABLE IF NOT EXISTS card_share_metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  type card_share_type NOT NULL,
  visitor_id BIGINT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_view_metrics
CREATE TABLE IF NOT EXISTS user_view_metrics (
  id BIGSERIAL PRIMARY KEY,
  card_share_id BIGINT NOT NULL REFERENCES card_share_metrics(id) ON DELETE RESTRICT,
  visitor_id BIGINT NOT NULL,
  country_name VARCHAR(100) NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (card_share_id, visitor_id)
);

-- card_save_metrics
CREATE TABLE IF NOT EXISTS card_save_metrics (
  id BIGSERIAL PRIMARY KEY,
  card_share_id BIGINT NOT NULL REFERENCES card_share_metrics(id) ON DELETE RESTRICT,
  visitor_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (card_share_id, visitor_id)
);

-- profile_visit_metrics
CREATE TABLE IF NOT EXISTS profile_visit_metrics (
  id BIGSERIAL PRIMARY KEY,
  card_share_id BIGINT NOT NULL REFERENCES card_share_metrics(id) ON DELETE RESTRICT,
  visitor_id BIGINT NOT NULL,
  visiting_source visiting_source_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (card_share_id, visitor_id)
);

-- Triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_card_share_metrics_updated_at'
  ) THEN
    CREATE TRIGGER trg_card_share_metrics_updated_at
    BEFORE UPDATE ON card_share_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_view_metrics_updated_at'
  ) THEN
    CREATE TRIGGER trg_user_view_metrics_updated_at
    BEFORE UPDATE ON user_view_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_card_save_metrics_updated_at'
  ) THEN
    CREATE TRIGGER trg_card_save_metrics_updated_at
    BEFORE UPDATE ON card_save_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profile_visit_metrics_updated_at'
  ) THEN
    CREATE TRIGGER trg_profile_visit_metrics_updated_at
    BEFORE UPDATE ON profile_visit_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_card_share_metrics_user_id ON card_share_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_view_metrics_card_share_id ON user_view_metrics(card_share_id);
CREATE INDEX IF NOT EXISTS idx_card_save_metrics_card_share_id ON card_save_metrics(card_share_id);
CREATE INDEX IF NOT EXISTS idx_profile_visit_metrics_card_share_id ON profile_visit_metrics(card_share_id);

-- RPC: get_user_card_metrics
CREATE OR REPLACE FUNCTION get_user_card_metrics(p_user_id BIGINT)
RETURNS TABLE (
  user_id BIGINT,
  total_views INT,
  total_shares INT,
  total_saves INT,
  save_rate_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_user_id AS user_id,
    COALESCE((SELECT COUNT(*) FROM user_view_metrics uvm
              JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
              WHERE csm.user_id = p_user_id), 0) AS total_views,
    COALESCE((SELECT COUNT(*) FROM card_share_metrics csm
              WHERE csm.user_id = p_user_id), 0) AS total_shares,
    COALESCE((SELECT COUNT(*) FROM card_save_metrics sav
              JOIN card_share_metrics csm ON csm.id = sav.card_share_id
              WHERE csm.user_id = p_user_id), 0) AS total_saves,
    CASE
      WHEN COALESCE((SELECT COUNT(*) FROM user_view_metrics uvm
                     JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
                     WHERE csm.user_id = p_user_id), 0) = 0 THEN 0
      ELSE ROUND(
        (
          COALESCE((SELECT COUNT(*) FROM card_save_metrics sav
                    JOIN card_share_metrics csm ON csm.id = sav.card_share_id
                    WHERE csm.user_id = p_user_id), 0)::numeric
          /
          COALESCE((SELECT COUNT(*) FROM user_view_metrics uvm
                    JOIN card_share_metrics csm ON csm.id = uvm.card_share_id
                    WHERE csm.user_id = p_user_id), 0)::numeric
        ) * 100, 2
      )
    END AS save_rate_percentage;
END;
$$ LANGUAGE plpgsql;
