using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace SpaDotNetCoreApp
{
    public static class Extensions
    {
        public static string AddFileVersionToPath(this IRazorPage page, string path)
        {
            var context = page.ViewContext.HttpContext;
            var fileVersionProvider = context.RequestServices.GetRequiredService<IFileVersionProvider>();
            return fileVersionProvider.AddFileVersionToPath(context.Request.PathBase, path);
        }
    }
}
