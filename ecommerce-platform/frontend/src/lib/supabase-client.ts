import { createBrowserClient } from '@supabase/ssr';

// Singleton - reuse same instance so session is preserved
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

// Named export for direct use
export const supabaseClient = getSupabaseClient();
