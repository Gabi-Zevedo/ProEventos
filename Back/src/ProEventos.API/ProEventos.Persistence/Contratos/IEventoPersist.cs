using ProEventos.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        //EVENTOS
        Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes);
        Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes);

    }
}
