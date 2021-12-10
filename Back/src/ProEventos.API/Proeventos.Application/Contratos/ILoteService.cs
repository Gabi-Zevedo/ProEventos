using ProEventos.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application.Contratos
{
    public interface ILoteService
    {
         Task<LoteDto[]> SaveLoteAsync(int eventoId, LoteDto[] models);
         Task<bool> DeleteLoteAsync(int eventoId, int loteId);
         Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId);
         Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}
