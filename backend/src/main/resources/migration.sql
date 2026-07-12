-- SQL Migration Script for Multi-User Isolation
-- Refactoring smart-meter-analytics-dashboard database tables

-- 1. Add user_id column to target tables
ALTER TABLE kpi_cards ADD COLUMN user_id BIGINT;
ALTER TABLE consumption_records ADD COLUMN user_id BIGINT;
ALTER TABLE consumption_categories ADD COLUMN user_id BIGINT;
ALTER TABLE energy_flows ADD COLUMN user_id BIGINT;
ALTER TABLE meter_alerts ADD COLUMN user_id BIGINT;

-- 2. Establish Foreign Key constraints pointing to the users table
ALTER TABLE kpi_cards ADD CONSTRAINT fk_kpi_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE consumption_records ADD CONSTRAINT fk_consumption_records_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE consumption_categories ADD CONSTRAINT fk_consumption_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE energy_flows ADD CONSTRAINT fk_energy_flows_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE meter_alerts ADD CONSTRAINT fk_meter_alerts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Create Indexes for user_id to optimize database queries
CREATE INDEX idx_kpi_cards_user_id ON kpi_cards(user_id);
CREATE INDEX idx_consumption_records_user_id ON consumption_records(user_id);
CREATE INDEX idx_consumption_categories_user_id ON consumption_categories(user_id);
CREATE INDEX idx_energy_flows_user_id ON energy_flows(user_id);
CREATE INDEX idx_meter_alerts_user_id ON meter_alerts(user_id);
