-- Migration: 001_init
-- Creates tokens, networks, and token_networks tables

CREATE TABLE tokens (
  id                   SERIAL PRIMARY KEY,
  symbol               VARCHAR(20)  NOT NULL,
  name                 VARCHAR(100) NOT NULL,
  icon_url             TEXT,
  is_enabled           BOOLEAN      NOT NULL DEFAULT true,
  is_under_maintenance BOOLEAN      NOT NULL DEFAULT false,
  display_order        INT          NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_tokens_symbol UNIQUE (symbol)
);

CREATE TABLE networks (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(50)  NOT NULL,
  icon_url   TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_networks_name UNIQUE (name),
  CONSTRAINT uq_networks_slug UNIQUE (slug)
);

CREATE TABLE token_networks (
  id              SERIAL PRIMARY KEY,
  token_id        INT          NOT NULL REFERENCES tokens(id)   ON DELETE CASCADE,
  network_id      INT          NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  deposit_address TEXT         NOT NULL,
  min_deposit     DECIMAL(20, 8) NOT NULL,
  is_active       BOOLEAN      NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_token_network UNIQUE (token_id, network_id)
);

-- Indexes
CREATE INDEX idx_tokens_display_order       ON tokens        (display_order);
CREATE INDEX idx_tokens_enabled_order       ON tokens        (is_enabled, display_order);
CREATE INDEX idx_token_networks_token_id    ON token_networks (token_id);
CREATE INDEX idx_token_networks_network_id  ON token_networks (network_id);
CREATE INDEX idx_token_networks_token_active ON token_networks (token_id, is_active);

-- updated_at auto-update trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tokens_updated_at
  BEFORE UPDATE ON tokens
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER token_networks_updated_at
  BEFORE UPDATE ON token_networks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed data
INSERT INTO networks (name, slug) VALUES
  ('Ethereum', 'ethereum'),
  ('Tron',     'tron'),
  ('Polygon',  'polygon'),
  ('Bitcoin',  'bitcoin');

INSERT INTO tokens (symbol, name, display_order) VALUES
  ('USDT', 'Tether',   1),
  ('USDC', 'USD Coin', 2),
  ('BTC',  'Bitcoin',  3);

INSERT INTO token_networks (token_id, network_id, deposit_address, min_deposit) VALUES
  -- USDT
  (1, 1, '0xdAC17F958D2ee523a2206206994597C13D831ec7',    1.00000000),
  (1, 2, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',           1.00000000),
  (1, 3, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',    1.00000000),
  -- USDC
  (2, 1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',    1.00000000),
  (2, 3, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',    1.00000000),
  -- BTC
  (3, 4, '0xadj9f8s9mfkjs9djmskdcmjjsd8778sdjfl3404fFD', 0.00000500);
