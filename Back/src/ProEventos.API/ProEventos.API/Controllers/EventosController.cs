using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.Persistence;
using ProEventos.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Persistence.Data;
using Proeventos.Application.Services;
using Microsoft.AspNetCore.Http;
using Proeventos.Application.Contratos;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _eventoService;

        public EventosController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if (eventos == null) return NotFound("Nenhum Evento encontrado");

                return Ok(eventos);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao recuperar eventos. Erro: {e.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if (evento == null) return NotFound("Nenhum Evento encontrado");

                return Ok(evento);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao recuperar eventos. Erro: {e.Message}");
            }
        }

        [HttpGet("{tema}/tema")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try
            {
                var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
                if (evento == null) return NotFound($"Nenhum Evento encontrado com o tema: {tema.ToUpper()}");

                return Ok(evento);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao recuperar eventos. Erro: {e.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try
            {
                var evento = await _eventoService.AddEventos(model);
                if (evento == null) return BadRequest("Erro ao adicionar Evento");

                return Ok(evento);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao adicionar eventos. Erro: {e.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Evento model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id, model);
                if (evento == null) return BadRequest("Erro ao aatualizar Evento");

                return Ok(evento);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao atualizar eventos. Erro: {e.Message}");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                return await _eventoService.DeleteEventos(id) ? Ok("Deletado") : BadRequest("Evento não deletado"); 
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao deletar eventos. Erro: {e.Message}");
            }
        }

    }

}

