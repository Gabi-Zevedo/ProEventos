using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required]
        public string Local { get; set; }
        [Required]
        public DateTime? DataEvento { get; set; }
        [Required, StringLength(50, MinimumLength = 4)]
        public string Tema { get; set; }
        [Required,
         Range(1, 120000)]
        public int QtdPessoas { get; set; }
       [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$")]
        public string ImageURL { get; set; }
        [Required,Phone]
        public string Telefone { get; set; }
        [Required,
         EmailAddress]
        public string Email { get; set; }

        public int userId { get; set; }

        public UserDto userDto { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }

    }
}
