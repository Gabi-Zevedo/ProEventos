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
    public class PalestrantePersistence : GeralPersistence, IPalestrantePersist
    {
        private readonly ProEventosContext _context;

        public PalestrantePersistence(ProEventosContext context) : base(context)
        {
            this._context = context;
        }

        public async Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.User)
                .Include(x => x.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Evento);
            }
            query = query.AsNoTracking()
                     .Where(p => (p.MiniCurriculo.ToLower().Contains(pageParams.Term.ToLower()) ||
                                 p.User.PrimeiroNome.ToLower().Contains(pageParams.Term.ToLower()) ||
                                 p.User.UltimoNome.ToLower().Contains(pageParams.Term.ToLower())) &&
                                 p.User.Funcao == Domain.Enum.Funcao.Palestrante)
                     .OrderBy(x => x.Id);
            return await PageList<Palestrante>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

       

        public async Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.User)
                .Include(x => x.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(x => x.PalestrantesEventos).ThenInclude(pe => pe.Evento);
            }
            query = query.AsNoTracking().OrderBy(x => x.Id).Where(p => p.UserId == userId);
            return await query.FirstOrDefaultAsync();
        }

    }
}
