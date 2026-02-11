import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/contexts/AuthContext';

export default function DailyCash() {
  const { user } = useAuth();

  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [category, setCategory] = useState('Dízimo');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('financial_transactions')
      .insert({
        type,
        category,
        amount: Number(amount),
        description,
        date: new Date().toISOString().split('T')[0],
        created_by: user.id,
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setAmount('');
    setDescription('');
    alert('Lançamento salvo com sucesso ✅');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Caixa Diário</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          maxWidth: 900,
        }}
      >
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Categoria"
        />

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Valor"
        />

        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descrição"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: '10px 20px',
          background: '#ff8a00',
          color: '#fff',
          borderRadius: 6,
        }}
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
}
