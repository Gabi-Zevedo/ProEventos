using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application.Services
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IMapper _mapper;

        public PalestranteService(IPalestrantePersist palestrantePersist, IMapper mapper)
        {
            _palestrantePersist = palestrantePersist;
            _mapper = mapper;
        }
        public async Task<PalestranteDto> AddPalestrantes(int userId, PalestranteAddDto palestranteDto)
        {
            try
            {


                var palestranteModel = _mapper.Map<Palestrante>(palestranteDto);
                palestranteModel.UserId = userId;

                _palestrantePersist.Add<Palestrante>(palestranteModel);
                if (await _palestrantePersist.SaveChangesAsync())
                {
                    var resultado = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    return _mapper.Map<PalestranteDto>(resultado);
                }
                return null;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }

        public async Task<PalestranteDto> UpdatePalestrante(int userId, PalestranteUpdateDto palestranteDto)
        {
            try
            {
                var palestranteModel = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                if (palestranteModel == null) return null;

                palestranteDto.Id = palestranteModel.Id;
                palestranteDto.UserId = userId;

                _mapper.Map(palestranteDto, palestranteModel);

                _palestrantePersist.Update<Palestrante>(palestranteModel);
                if (await _palestrantePersist.SaveChangesAsync())
                {
                    var resultado = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    return _mapper.Map<PalestranteDto>(resultado);
                }
                return null;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }


        public async Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            try
            {
                var palestrantes = await _palestrantePersist.GetAllPalestrantesAsync(pageParams, includeEventos);
                if (palestrantes == null) return null;

                var resultado = _mapper.Map<PageList<PalestranteDto>>(palestrantes);

                resultado.CurrentPage = palestrantes.CurrentPage;
                resultado.TotalPages = palestrantes.TotalPages;
                resultado.PageSize = palestrantes.PageSize;
                resultado.TotalCount = palestrantes.TotalCount;

                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }



        public async Task<PalestranteDto> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, includeEventos);
                if (palestrante == null) return null;

                var resultado = _mapper.Map<PalestranteDto>(palestrante);

                return resultado;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }
        }
    }
}
