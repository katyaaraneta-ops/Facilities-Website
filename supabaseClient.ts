import { createClient } from '@supabase/supabase-js';

// Derived from your current Supabase dashboard screenshot
const supabaseUrl = 'https://qriujbcdkawzziemyykd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaXVqYmNka2F3enppZW15eWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjE2MzksImV4cCI6MjA4NjQ5NzYzOX0.MQTr8BgM4nzXF6YtYFszA091jk5r3FVx9yw_TA8N3Mo'; // Copy the full string from your 'anon public' box

export const supabase = createClient(supabaseUrl, supabaseAnonKey);