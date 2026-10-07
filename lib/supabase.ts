import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function createMockSupabase() {
  const createBuilder = (defaultData: any = []) => {
    const builder: any = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      order: () => builder,
      single: async () => ({ data: null, error: null }),
      then: (resolve: any) => Promise.resolve({ data: defaultData, count: 0, error: null }).then(resolve),
    };
    return builder;
  };

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Supabase not configured in this environment' },
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => createBuilder([]),
  } as any;
}

export function getSupabaseClient(customKey?: string): SupabaseClient<any> {
  const key = customKey || supabaseAnonKey;
  if (!supabaseUrl || !key) {
    return createMockSupabase() as SupabaseClient<any>;
  }
  try {
    return createSupabaseClient<any>(supabaseUrl, key);
  } catch {
    return createMockSupabase() as SupabaseClient<any>;
  }
}

export const supabase = getSupabaseClient();

// For server-side operations with service role
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? getSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY)
  : supabase;
