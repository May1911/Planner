import { useEffect, useState } from 'react';
import { Music2 } from 'lucide-react';
import { supabase, Show } from './lib/supabase';
import { Dashboard } from './components/Dashboard';
import { AddShowForm } from './components/AddShowForm';
import { ShowsList } from './components/ShowsList';
import { WeeklyCalendar } from './components/WeeklyCalendar';

function App() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShows = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShow = async (id: string) => {
    try {
      const { error } = await supabase.from('shows').delete().eq('id', id);
      if (error) throw error;
      fetchShows();
    } catch (error) {
      console.error('Error deleting show:', error);
      alert('Erro ao excluir show. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
              <Music2 className="text-emerald-500" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Planner Músico</h1>
              <p className="text-gray-400 text-sm">Gerenciamento de shows e cachês</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Dashboard shows={shows} />

        <WeeklyCalendar shows={shows} />

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Shows Cadastrados</h2>
              <p className="text-gray-400 text-sm mt-1">
                {shows.length} {shows.length === 1 ? 'show cadastrado' : 'shows cadastrados'}
              </p>
            </div>
            <AddShowForm onShowAdded={fetchShows} />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Carregando shows...</div>
          ) : (
            <ShowsList shows={shows} onDelete={handleDeleteShow} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
