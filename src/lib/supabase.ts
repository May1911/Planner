import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Show = {
  id: string;
  user_id: string;
  date: string;
  local: string;
  horario: string;
  duracao: string;
  valor: number;
  status: 'Pago' | 'Pendente';
  observacoes?: string;
  created_at: string;
  updated_at: string;
};
