-- Update the trigger function to allow .seecs.edu.pk
CREATE OR REPLACE FUNCTION public.enforce_nust_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with .nust.edu.pk OR is exactly @nust.edu.pk
  -- AND also allow .seecs.edu.pk
  IF NEW.email NOT LIKE '%.nust.edu.pk' 
     AND NEW.email NOT LIKE '%@nust.edu.pk' 
     AND NEW.email NOT LIKE '%.seecs.edu.pk' 
     AND NEW.email NOT LIKE '%@seecs.edu.pk' THEN
    -- Delete the user row (cancels signup)
    DELETE FROM auth.users WHERE id = NEW.id;
    RAISE EXCEPTION 'Only NUST emails (@*.nust.edu.pk) or SEECS emails (@seecs.edu.pk) are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
