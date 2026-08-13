-- Track last successful WhatsApp send per student.
-- Run against: utavqate_msbsec_wa

ALTER TABLE `students`
  ADD COLUMN `last_message_sent_at` DATETIME NULL DEFAULT NULL AFTER `synced_at`;
