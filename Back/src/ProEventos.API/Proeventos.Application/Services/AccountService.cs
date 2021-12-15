﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProEventos.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;

        public AccountService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper, IUserPersist userPersist)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _userPersist = userPersist;
        }

        public async Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string password)
        {
            try
            {
                var user = await _userManager.Users
                    .SingleOrDefaultAsync(user => user.UserName == userUpdateDto.Username.ToLower());

                return await _signInManager.CheckPasswordSignInAsync(user, password, false);
            }
            catch (Exception e)
            {

                throw new Exception($"Erro ao verificar Senha. Erro{e.Message}");
            }
        }

        public async Task<UserDto> CreateAccountAsync(UserDto userDto)
        {

            try
            {
                var user = _mapper.Map<User>(userDto);

                var result = await _userManager.CreateAsync(user, userDto.Password);

                if (result.Succeeded)
                {
                    var userReturn = _mapper.Map<UserDto>(user);
                    return userReturn;
                }

                return null;

            }
            catch (Exception e)
            {

                throw new Exception($"Erro ao criar conta. Erro{e.Message}");
            }
        }

        public async Task<UserUpdateDto> GetUserByUsernameAsync(string username)
        {
            
            try
            {
                var user = await _userPersist.GetUserByUsernameAsync(username);
                if (user == null) return null;

                var userUpdateDto = _mapper.Map<UserUpdateDto>(user);
                return userUpdateDto;

            }
            catch (Exception e)
            {

                throw new Exception($"Usuario não encontrado. Erro{e.Message}");
            }
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            
            try
            {
                var user = await _userPersist.GetUserByUsernameAsync(userUpdateDto.Username);
                if (user == null) return null;

                _mapper.Map(userUpdateDto, user);


                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, userUpdateDto.Password);

                _userPersist.Update<User>(user);

                if (await _userPersist.SaveChangesAsync())
                {
                    var userReturn = await _userPersist.GetUserByUsernameAsync(user.UserName);
                    return _mapper.Map<UserUpdateDto>(userReturn);
                }

                return null;
            }
            catch (Exception e)
            {

                throw new Exception($"Erro ao atualizar conta. Erro{e.Message}");
            }
        }

        public async Task<bool> UserExists(string username)
        {
            
            try
            {
                return await _userManager.Users.AnyAsync(
                    user => user.UserName == username);
                    
            }
            catch (Exception e)
            {

                throw new Exception($"Erro ao encontrar usuario. Erro{e.Message}");
            }
        }
    }
}
