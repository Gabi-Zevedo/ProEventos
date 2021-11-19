using Proeventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proeventos.Application.Services
{
    public class EventoService : IEventoService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IGeralPersist _geralPersist;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventtoPersist)
        {
            _eventoPersist = eventtoPersist;
            _geralPersist = geralPersist;
        }
        public async Task<Evento> AddEventos(Evento evento)
        {
            try
            {
                _geralPersist.Add<Evento>(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                }
                return null;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento evento)
        {
            try
            {
                var e = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if (e == null) return null;

                evento.Id = e.Id;

                _geralPersist.Update(evento);
                if (await _geralPersist.SaveChangesAsync())
                {
                    return await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                }
                return null;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<bool> DeleteEventos(int eventoId)
        {
            try
            {
                var e = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if (e == null) throw new Exception("Evento não encontrado");


                _geralPersist.Delete<Evento>(e);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if (eventos == null) return null;

                return eventos;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if (eventos == null) return null;

                return eventos;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<Evento> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if (eventos == null) return null;

                return eventos;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
    }
}
