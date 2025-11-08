import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { Show } from '../lib/supabase';

type WeeklyCalendarProps = {
  shows: Show[];
};

export function WeeklyCalendar({ shows }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });

  const getWeekDays = (startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeekStart);

  const getShowsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shows.filter((show) => show.date === dateStr);
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const monthYearText = `${weekStart.toLocaleDateString('pt-BR', { month: 'long' })} ${
    weekStart.getMonth() !== weekEnd.getMonth()
      ? `/ ${weekEnd.toLocaleDateString('pt-BR', { month: 'long' })} `
      : ''
  }${weekStart.getFullYear()}`;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-emerald-500" size={28} />
            Agenda Semanal
          </h2>
          <p className="text-gray-400 text-sm mt-1 capitalize">{monthYearText}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Semana anterior"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Hoje
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Próxima semana"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dayShows = getShowsForDate(date);
          const today = isToday(date);
          const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index];

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[200px] rounded-lg p-3 border-2 ${
                today
                  ? 'bg-emerald-900/20 border-emerald-600'
                  : 'bg-gray-700/30 border-gray-700 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center mb-3">
                <div className={`text-xs font-medium ${today ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {dayName}
                </div>
                <div
                  className={`text-xl font-bold mt-1 ${
                    today ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {dayShows.length === 0 ? (
                  <div className="text-center text-gray-500 text-xs py-4">Sem shows</div>
                ) : (
                  dayShows.map((show) => (
                    <div
                      key={show.id}
                      className={`rounded-lg p-2 text-xs ${
                        show.status === 'Pago'
                          ? 'bg-green-900/40 border border-green-700/50'
                          : 'bg-yellow-900/40 border border-yellow-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock size={12} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-white font-medium">{show.horario}</span>
                      </div>
                      <div className="flex items-start gap-1 mb-1">
                        <MapPin size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white line-clamp-2 leading-tight">{show.local}</span>
                      </div>
                      <div className="text-emerald-400 font-bold mt-1">
                        {formatCurrency(show.valor)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            show.status === 'Pago'
                              ? 'bg-green-900/60 text-green-300'
                              : 'bg-yellow-900/60 text-yellow-300'
                          }`}
                        >
                          {show.status}
                        </span>
                        <span className="text-gray-400 text-[10px]">{show.duracao}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
