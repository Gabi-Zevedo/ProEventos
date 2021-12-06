﻿using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProEventos.Application.Services
{
    public class EventoService : IEventoService
    {
        private readonly IEventoPersist _eventoPersist;
        private readonly IMapper _mapper;
        private readonly IGeralPersist _geralPersist;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventtoPersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventtoPersist;
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEventos(EventoDto eventoDto)
        {
            try
            {


                var eventoModel = _mapper.Map<Evento>(eventoDto);

                _geralPersist.Add<Evento>(eventoModel);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var resultado = await _eventoPersist.GetEventoByIdAsync(eventoModel.Id, false);
                    return _mapper.Map<EventoDto>(resultado);
                }
                return null;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto eventoDto)
        {
            try
            {
                var eventoModel = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                if (eventoModel == null) return null;

                eventoDto.Id = eventoModel.Id;

                _mapper.Map(eventoDto, eventoModel);

                _geralPersist.Update<Evento>(eventoModel);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var resultado = await _eventoPersist.GetEventoByIdAsync(eventoModel.Id, false);
                    return _mapper.Map<EventoDto>(resultado);
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

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if (eventos == null) return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);

                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if (evento == null) return null;

                var resultado = _mapper.Map<EventoDto>(evento);

                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
    }
}
