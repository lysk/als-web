-- Supabase数据库Schema
-- 为Anime Last Stand数据采集系统创建表

-- 删除已存在的表(如果需要重新创建)
-- DROP TABLE IF EXISTS unit_upgrades CASCADE;
-- DROP TABLE IF EXISTS units CASCADE;
-- DROP TABLE IF EXISTS techniques CASCADE;
-- DROP TABLE IF EXISTS items CASCADE;
-- DROP TABLE IF EXISTS codes CASCADE;
-- DROP TABLE IF EXISTS tier_list CASCADE;
-- DROP TABLE IF EXISTS maps CASCADE;

-- 1. units表 - 单位基本信息
CREATE TABLE IF NOT EXISTS units (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    wiki_url TEXT,
    scraped_at TIMESTAMPTZ,
    rarity TEXT,
    element TEXT,
    type TEXT,
    deployment_cost INTEGER,
    total_cost INTEGER,
    can_evolve BOOLEAN DEFAULT FALSE,
    is_evolved BOOLEAN DEFAULT FALSE,
    base_form TEXT,
    base_form_url TEXT,
    evolved_form TEXT,
    evolved_form_url TEXT,
    image_url TEXT, -- 新增: 图片URL
    abilities TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. unit_upgrades表 - 单位升级数据
CREATE TABLE IF NOT EXISTS unit_upgrades (
    id SERIAL PRIMARY KEY,
    unit_id TEXT NOT NULL,
    level INTEGER NOT NULL,
    upgrade_cost INTEGER,
    damage INTEGER,
    range NUMERIC,
    spa NUMERIC,
    dps NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    UNIQUE(unit_id, level)
);

-- 3. techniques表 - 技能数据
CREATE TABLE IF NOT EXISTS techniques (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier INTEGER,
    rarity TEXT,
    probability NUMERIC,
    description TEXT,
    effects JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. items表 - 道具数据
CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    image_url TEXT,
    wiki_url TEXT,
    obtain_method TEXT,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. codes表 - 兑换码数据
CREATE TABLE IF NOT EXISTS codes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT,
    rewards JSONB,
    source JSONB,
    description TEXT,
    expires_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. tier_list表 - Tier List数据
CREATE TABLE IF NOT EXISTS tier_list (
    id SERIAL PRIMARY KEY,
    unit_name TEXT NOT NULL,
    category TEXT,
    tier TEXT,
    subcategory TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(unit_name, category)
);

-- 7. maps表 - 地图数据
CREATE TABLE IF NOT EXISTS maps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    world TEXT,
    difficulty TEXT,
    rewards JSONB,
    enemies TEXT[],
    wiki_url TEXT,
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_units_rarity ON units(rarity);
CREATE INDEX IF NOT EXISTS idx_units_element ON units(element);
CREATE INDEX IF NOT EXISTS idx_units_name ON units(name);
CREATE INDEX IF NOT EXISTS idx_units_image_url ON units(image_url); -- 新增: 图片URL索引
CREATE INDEX IF NOT EXISTS idx_upgrades_unit ON unit_upgrades(unit_id);
CREATE INDEX IF NOT EXISTS idx_techniques_tier ON techniques(tier);
CREATE INDEX IF NOT EXISTS idx_techniques_rarity ON techniques(rarity);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_image_url ON items(image_url); -- items表已有的image_url索引
CREATE INDEX IF NOT EXISTS idx_codes_status ON codes(status);
CREATE INDEX IF NOT EXISTS idx_codes_code ON codes(code);
CREATE INDEX IF NOT EXISTS idx_tierlist_tier ON tier_list(tier);
CREATE INDEX IF NOT EXISTS idx_tierlist_category ON tier_list(category);
CREATE INDEX IF NOT EXISTS idx_maps_world ON maps(world);
