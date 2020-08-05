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
        public override Task<GetTemplate2Reply> GetTemplate2(GetTemplate2Request request, ServerCallContext context)
        {
            return Task.FromResult(new GetTemplate2Reply
            {
                Content = "Hello " + request.Name,
                Content2 = "Hello again " + request.Name,
                Content3 = request.I
            });
        }

        public override async Task StreamTest(StreamTestRequest request, IServerStreamWriter<GetTemplate2Reply> responseStream, ServerCallContext context)
        {
            await responseStream.WriteAsync(new GetTemplate2Reply(new GetTemplate2Reply
            {
                Content = "Hello 1 " + request.Name,
                Content2 = "Hello 1 again " + request.Name,
                Content3 = request.I + 1
            }));
            await responseStream.WriteAsync(new GetTemplate2Reply(new GetTemplate2Reply
            {
                Content = "Hello 2 " + request.Name,
                Content2 = "Hello 2 again " + request.Name,
                Content3 = request.I + 2
            }));
            await responseStream.WriteAsync(new GetTemplate2Reply(new GetTemplate2Reply
            {
                Content = "Hello 3 " + request.Name,
                Content2 = "Hello 3 again " + request.Name,
                Content3 = request.I + 3
            }));
        }
    }
}
