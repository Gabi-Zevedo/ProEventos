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
    public class PalestrantePersistence : IPalestrantePersist
    {
        private readonly ProEventosContext _context;

        public PalestrantePersistence(ProEventosContext context)
        {
            this._context = context;
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(x => x.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Evento);
            }
            query = query.AsNoTracking().OrderBy(x => x.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(x => x.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Evento);
            }
           query = query.AsNoTracking().OrderBy(x => x.Id).Where(p => p.User.PrimeiroNome.ToLower().Contains(nome.ToLower()));
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes.Include(x => x.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Evento);
            }
            query = query.AsNoTracking().OrderBy(x => x.Id).Where(p => p.Id == palestranteId);
            return await query.FirstOrDefaultAsync();
        }

    }
}
