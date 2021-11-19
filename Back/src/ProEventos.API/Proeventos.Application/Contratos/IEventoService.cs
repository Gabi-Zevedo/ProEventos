using ProEventos.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proeventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<Evento> AddEventos(Evento evento);
        Task<Evento> UpdateEvento(int eventoId, Evento evento);
        Task<bool> DeleteEventos(int eventoId);
        Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false);
        Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false);

    }
}
