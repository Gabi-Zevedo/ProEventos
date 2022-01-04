using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.API.Helpers;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _util;

        private readonly string _destino = "Perfil";

        public AccountController(IAccountService accountService,
            ITokenService tokenService, IUtil util)
        {
            _accountService = accountService;
            _tokenService = tokenService;
            _util = util;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var username = User.GetUsername();
                var user = await _accountService.GetUserByUsernameAsync(username);
                return Ok(user);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                       $"Erro ao recuperar conta. Erro: {e.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser(UserDto userDto)
        {
            try
            {
                if (await _accountService.UserExists(userDto.Username))
                    return BadRequest("Usuário já existe");


                var newUser = await _accountService.CreateAccountAsync(userDto);
                if (newUser != null)
                    return Ok(new
                    {
                        Username = newUser.Username,
                        PrimeiroNome = newUser.PrimeiroNome,
                        token = _tokenService.CreateToken(newUser).Result
                    });

                return BadRequest("Erro ao criar conta");
               
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                       $"Erro ao registrar conta. Erro: {e.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _accountService.GetUserByUsernameAsync(userLoginDto.Username);
                if (user == null) return Unauthorized("Usuário Inválido");

                var result = await _accountService.CheckUserPasswordAsync(user, userLoginDto.Password);
                if (!result.Succeeded) return Unauthorized("Senha Inválida");

                return Ok(new
                {
                    Username = user.Username,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                }) ;  
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                       $"Erro ao logar na conta. Erro: {e.Message}");
            }
        }


        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                if (userUpdateDto.Username != User.GetUsername())
                    return Unauthorized("Usuário Inválido");

                var user = await _accountService.GetUserByUsernameAsync(User.GetUsername());
                if (user == null) return Unauthorized("Usuário Inválido");


                var userReturn = await _accountService.UpdateAccount(userUpdateDto);
                if (userReturn == null)
                    return NoContent();

                return Ok(new
                {
                    Username = userReturn.Username,
                    PrimeiroNome = userReturn.PrimeiroNome,
                    token = _tokenService.CreateToken(userReturn).Result
                });

            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                       $"Erro ao atualizar conta. Erro: {e.Message}");
            }
        }
        [HttpPost("upload-image")]

        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var user = await _accountService.GetUserByUsernameAsync(User.GetUsername());
                if (user == null) return NoContent();

                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    _util.DeleteImage(user.ImageURL, _destino);
                    user.ImageURL = await _util.SaveImage(file, _destino);
                }
                var userRetorno = await _accountService.UpdateAccount(user);

                return Ok(userRetorno);
            }
            catch (Exception e)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao adicionar foto de Perfil. Erro: {e.Message}");
            }
        }

    }
}
