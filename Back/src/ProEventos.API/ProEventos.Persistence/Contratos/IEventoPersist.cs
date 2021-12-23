using ProEventos.Domain;
using ProEventos.Persistence.Models;
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
        
        Task<PageList<Evento>> GetAllEventosAsync(int userId,PageParams pageParams, bool includePalestrantes);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes);

    }
}
