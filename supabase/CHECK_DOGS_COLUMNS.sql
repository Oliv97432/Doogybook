-- Check all columns in the dogs table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'dogs'
ORDER BY ordinal_position;
