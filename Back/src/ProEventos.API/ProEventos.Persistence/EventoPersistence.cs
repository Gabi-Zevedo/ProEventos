using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence
{
    public class EventoPersistence : IEventoPersist
    {
        
        private readonly ProEventosContext _context;
        public EventoPersistence(ProEventosContext context)
        {
            this._context = context;
        }
        public async Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(x => x.Lotes).Include(x => x.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Palestrante);
            }
            query = query.AsNoTracking()
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(x => x.Lotes).Include(x => x.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Palestrante);
            }
            query = query.AsNoTracking().OrderBy(x => x.Id).Where(x => x.Tema.ToLower().Contains(tema.ToLower()) && x.UserId == userId);
            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(x => x.Lotes).Include(x => x.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Palestrante);
            }
            query = query.AsNoTracking().OrderBy(x => x.Id).Where(x => x.Id == eventoId && x.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }

    }
}
