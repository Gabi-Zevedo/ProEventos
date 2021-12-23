using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Data;
using ProEventos.Persistence.Models;
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
        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos.Include(x => x.Lotes).Include(x => x.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Palestrante);
            }
            query = query.AsNoTracking()
                .Where(x => (x.Tema.ToLower()
                .Contains(pageParams.Term.ToLower())
                || x.Local.ToLower()
                .Contains(pageParams.Term.ToLower()))
                && x.UserId == userId)
                .OrderBy(e => e.Id);
            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber,pageParams.pageSize);
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
