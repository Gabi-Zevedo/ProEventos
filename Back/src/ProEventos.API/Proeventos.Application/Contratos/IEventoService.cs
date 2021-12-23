using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(int userId, EventoDto evento);
        Task<EventoDto> UpdateEvento(int userId, int eventoId, EventoDto evento);
        Task<bool> DeleteEventos(int userId, int eventoId);
        Task<PageList<EventoDto>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);

    }
}
