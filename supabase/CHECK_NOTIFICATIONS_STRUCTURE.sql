-- Check the structure of the notifications table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'notifications'
ORDER BY ordinal_position;
