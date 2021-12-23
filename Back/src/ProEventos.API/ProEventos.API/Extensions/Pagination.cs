using Microsoft.AspNetCore.Http;
using ProEventos.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ProEventos.API.Extensions
{
    public static class Pagination
    {
        public static void AddPagination(this HttpResponse httpResponse,
            int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var pagination = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            httpResponse.Headers.Add("Pagination", JsonSerializer.Serialize(
                pagination, options
                ));
            httpResponse.Headers.Add("Acess-Control-Expose-Headers", "Pagination");
        }
    }
}
