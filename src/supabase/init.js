import { createClient } from "@supabase/supabase-js";

const url = 'https://vjjrqcikqjrfhzgboilx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqanJxY2lrcWpyZmh6Z2JvaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMwMDUwNzIsImV4cCI6MTk2ODU4MTA3Mn0.Oylk_toXSMsF4sXO4hOr--mj8Wce30Rp7i_uTdlFjKU';

export const supabase = createClient(url, key);