-- Meta WhatsApp Cloud API credentials
-- Run against: utavqate_msbsec_wa
-- Adds Meta credential columns; drops queue/frequency/window controls.

ALTER TABLE `whatsapp`
  ADD COLUMN `provider` VARCHAR(20) NOT NULL DEFAULT 'meta' AFTER `id`,
  ADD COLUMN `access_token` TEXT NOT NULL AFTER `provider`,
  ADD COLUMN `phone_number_id` VARCHAR(64) NOT NULL DEFAULT '' AFTER `access_token`,
  ADD COLUMN `waba_id` VARCHAR(64) NOT NULL DEFAULT '' AFTER `phone_number_id`,
  ADD COLUMN `api_version` VARCHAR(16) NOT NULL DEFAULT 'v22.0' AFTER `waba_id`;

UPDATE `whatsapp`
SET
  `provider` = 'meta',
  `url` = 'https://graph.facebook.com',
  `api_version` = 'v22.0',
  `access_token` = '',
  `phone_number_id` = '',
  `waba_id` = ''
WHERE `id` = 1;

ALTER TABLE `whatsapp`
  DROP COLUMN `queue_status`,
  DROP COLUMN `frequency`,
  DROP COLUMN `start_time`,
  DROP COLUMN `end_time`;

-- Optional cleanup after Meta sender is live and verified:
-- ALTER TABLE `whatsapp`
--   DROP COLUMN `token`,
--   DROP COLUMN `instance_id`,
--   DROP COLUMN `account`,
--   DROP COLUMN `secret`;
