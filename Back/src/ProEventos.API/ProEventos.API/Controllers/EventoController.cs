using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Data;
using ProEventos.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly EventoContext _context;

        public EventoController(EventoContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _context.Eventos;
        }

        [HttpGet("{id}")]
        public Evento GetById(int id)
        {
            return _context.Eventos.FirstOrDefault(x => x.EventoId == id);
        }

        [HttpPost]
        public string Post()
        {
            return "Post";
        }

        [HttpPut]
        public string Put()
        {
            return "Put";
        }


        [HttpDelete]
        public string Delete()
        {
            return "Delete";
        }


        [HttpPatch]
        public string Patch()
        {
            return "Patch";
        }
    }

}

