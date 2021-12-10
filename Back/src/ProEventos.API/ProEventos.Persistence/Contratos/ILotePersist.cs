using ProEventos.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {   
        /// <summary>
        /// Método que retorna a lista de lotes por eventoId
        /// </summary>
        /// <param name="eventoId">Key evento</param>
        /// <returns>array de lotes</returns>
        Task<Lote[]> GetLoteByEventoIdAsync(int eventoId);

        /// <summary>
        /// Método get que retona apenas 1 lote
        /// </summary>
        /// <param name="eventoId">Key Evento</param>
        /// <param name="id">Key Lote</param>
        /// <returns>apenas 1 lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);

    }
}
