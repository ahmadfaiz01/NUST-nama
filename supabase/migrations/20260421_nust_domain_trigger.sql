-- =============================================
-- MIGRATION: NUST Domain Enforcement Trigger
-- Run in: Supabase SQL Editor (auth schema requires elevated privileges)
-- Purpose: Reject any Google OAuth signup from a non-NUST email domain
-- =============================================

CREATE OR REPLACE FUNCTION auth.enforce_nust_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Allowlist: root domain and all subdomains of NUST institutions
  -- Accepted examples:
  --   student@nust.edu.pk          ✅
  --   name@seecs.edu.pk            ✅
  --   anything@sub.smme.edu.pk     ✅
  --   user@gmail.com               ❌ REJECTED
  --   user@hotmail.com             ❌ REJECTED
  IF NEW.email !~ '^[^@]+@([a-z0-9.-]+\.)?(nust|seecs|smme|scme|s3h|igis|nbc|asab|sada|mcs|ceme|nice|pnec)\.edu\.pk$' THEN
    RAISE EXCEPTION
      'access_denied: Only NUST institutional emails are permitted. Got domain: %',
      split_part(NEW.email, '@', 2);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if it exists, then recreate
DROP TRIGGER IF EXISTS enforce_nust_domain_trigger ON auth.users;

CREATE TRIGGER enforce_nust_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.enforce_nust_domain();

-- =============================================
-- VERIFICATION: Test the trigger is active
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE event_object_schema = 'auth'
--   AND trigger_name = 'enforce_nust_domain_trigger';
-- =============================================
