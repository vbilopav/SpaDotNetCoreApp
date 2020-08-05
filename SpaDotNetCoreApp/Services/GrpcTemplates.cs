using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using SpaDotNetCoreApp.Protos;

namespace SpaDotNetCoreApp.Services
{
    public class GrpcTemplates : Protos.GrpcTemplates.GrpcTemplatesBase
    {
        private readonly RazorPartialToStringRenderer _renderer;

        public GrpcTemplates(RazorPartialToStringRenderer renderer)
        {
            _renderer = renderer;
        }

        public override async Task<GetTemplate2Reply> GetTemplate2(GetTemplate2Request request, ServerCallContext context)
        {
            return new GetTemplate2Reply
            {
                Content = await _renderer.RenderPartialToStringAsync("/Pages/Views/_Template2.cshtml", (request.Param1, request.Param2))
            };
        }
    }
}
