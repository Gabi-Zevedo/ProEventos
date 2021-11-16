using Microsoft.EntityFrameworkCore;
using ProEventos.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.API.Data
{
    public class EventosContext : DbContext
    {
        public EventosContext(DbContextOptions<EventosContext> options) : base(options)
        {
        }

        public DbSet<Evento> Eventos { get; set; }

    }
}
