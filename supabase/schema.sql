import { supabase } from '@/lib/supabaseClient';

export interface CreateFinancialTransactionDTO {
  type: 'entrada' | 'saida';
  category: string;
  amount: number;
  description?: string;
  date: string; // YYYY-MM-DD
}

async function create(data: CreateFinancialTransactionDTO) {
  const { error } = await supabase
    .from('financial_transactions')
    .insert({
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      date: data.date,
    });

  if (error) {
    console.error('Erro Supabase (financial):', error);
    throw error;
  }
}

async function list() {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Erro ao listar transações:', error);
    throw error;
  }

  return data ?? [];
}

export const financialService = {
  create,
  list,
};
	