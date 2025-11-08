import { DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { Show } from '../lib/supabase';

type DashboardProps = {
  shows: Show[];
};

export function Dashboard({ shows }: DashboardProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const showsThisMonth = shows.filter((show) => {
    const showDate = new Date(show.date + 'T00:00:00');
    return showDate.getMonth() === currentMonth && showDate.getFullYear() === currentYear;
  });

  const totalShows = showsThisMonth.length;
  const totalGeral = showsThisMonth.reduce((sum, show) => sum + Number(show.valor), 0);
  const totalPago = showsThisMonth
    .filter((show) => show.status === 'Pago')
    .reduce((sum, show) => sum + Number(show.valor), 0);
  const totalPendente = totalGeral - totalPago;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
    currentDate
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400 capitalize">Resumo de {monthName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <Calendar className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total de Shows</p>
          <p className="text-3xl font-bold text-white">{totalShows}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <DollarSign className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Geral</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalGeral)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Recebido</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalPago)}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">A Receber</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalPendente)}</p>
        </div>
      </div>
    </div>
  );
}
