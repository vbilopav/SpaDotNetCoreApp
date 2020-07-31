using Microsoft.AspNetCore.Mvc;

namespace SpaDotNetCoreApp.Services
{
    [ApiController]
    public class RestApiTemplatesController : Controller
    {
        [HttpGet("template1/{param1}/{param2}")]
        public IActionResult GetTemplate1(string param1, string param2) => 
            PartialView("/Pages/Views/_Template1.cshtml", (param1, param2));
    }
}
