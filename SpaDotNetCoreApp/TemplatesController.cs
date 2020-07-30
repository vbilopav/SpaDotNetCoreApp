using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpaDotNetCoreApp
{
    [ApiController]
    public class TemplatesController : Controller
    {
        [HttpGet("template1/{param1}/{param2}")]
        public IActionResult GetTemplate1(string param1, string param2)
        {
            return PartialView("/Pages/Views/_Template1.cshtml", (param1, param2));
        }
    }
}
