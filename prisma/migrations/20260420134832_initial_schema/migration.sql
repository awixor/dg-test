-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon_url" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_under_maintenance" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "icon_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_networks" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "network_id" INTEGER NOT NULL,
    "deposit_address" TEXT NOT NULL,
    "min_deposit" DECIMAL(20,8) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "token_networks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_symbol_key" ON "tokens"("symbol");

-- CreateIndex
CREATE INDEX "idx_tokens_display_order" ON "tokens"("display_order");

-- CreateIndex
CREATE INDEX "idx_tokens_enabled_order" ON "tokens"("is_enabled", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "networks_name_key" ON "networks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "networks_slug_key" ON "networks"("slug");

-- CreateIndex
CREATE INDEX "idx_token_networks_token_id" ON "token_networks"("token_id");

-- CreateIndex
CREATE INDEX "idx_token_networks_network_id" ON "token_networks"("network_id");

-- CreateIndex
CREATE INDEX "idx_token_networks_token_active" ON "token_networks"("token_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "uq_token_network" ON "token_networks"("token_id", "network_id");

-- AddForeignKey
ALTER TABLE "token_networks" ADD CONSTRAINT "token_networks_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_networks" ADD CONSTRAINT "token_networks_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
