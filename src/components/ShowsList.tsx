import { Calendar, Clock, MapPin, Music, Trash2 } from 'lucide-react';
import { Show } from '../lib/supabase';

type ShowsListProps = {
  shows: Show[];
  onDelete: (id: string) => void;
};

export function ShowsList({ shows, onDelete }: ShowsListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (shows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Music size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">Nenhum show cadastrado ainda</p>
        <p className="text-sm mt-2">Adicione seu primeiro show usando o botão acima</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {shows.map((show) => (
        <div
          key={show.id}
          className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar size={18} className="text-emerald-500" />
                  <span className="font-medium">{formatDate(show.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock size={18} className="text-emerald-500" />
                  <span>{show.horario}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white">
                <MapPin size={18} className="text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-lg">{show.local}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Duração: {show.duracao}</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(show.valor)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    show.status === 'Pago'
                      ? 'bg-green-900/50 text-green-400 border border-green-700'
                      : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                  }`}
                >
                  {show.status}
                </span>
              </div>

              {show.observacoes && (
                <p className="text-sm text-gray-400 italic mt-2 pl-6 border-l-2 border-gray-700">
                  {show.observacoes}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este show?')) {
                  onDelete(show.id);
                }
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-colors"
              title="Excluir show"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
