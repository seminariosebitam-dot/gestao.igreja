import { supabase } from '@/lib/supabaseClient';

/* =========================
   TIPOS
========================= */

export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_by: string;
  created_at: string;
}

export interface CreateFinancialTransactionDTO {
  type: 'entrada' | 'saida';
  category: string;
  amount: number;
  description?: string | null;
  date: string; // YYYY-MM-DD
  created_by: string;
}

/* =========================
   SERVIÇO
========================= */

async function create(data: CreateFinancialTransactionDTO) {
  const { error } = await supabase
    .from('financial_transactions')
    .insert({
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description ?? null,
      date: data.date,
      created_by: data.created_by,
    });

  if (error) {
    console.error('Erro Supabase (create):', error);
    throw error;
  }
}

async function list(startDate?: Date, endDate?: Date): Promise<Transaction[]> {
  let query = supabase
    .from('financial_transactions')
    .select('*')
    .order('date', { ascending: false });

  if (startDate && endDate) {
    query = query
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro Supabase (list):', error);
    throw error;
  }

  return data ?? [];
}

async function remove(id: string) {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro Supabase (delete):', error);
    throw error;
  }
}

/* =========================
   EXPORT
========================= */

export const financialService = {
  create,
  list,
  delete: remove,
};
