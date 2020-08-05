import Router from "./router";
import {GetTemplate2Request, GetTemplate2Reply} from "./Protos/templates_pb.js";
import {GrpcTemplatesClient} from "./Protos/templates_grpc_web_pb.js";

import {GrpcService, ReplayType, RequestType} from "./grpc-service";

const updateElement = (element: HTMLElement, selector: string, value: string) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
}

new Router()
    .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
    .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
    .start();


//https://grpc.io/docs/languages/web/basics/
//protoc Protos/templates.proto --js_out=import_style=commonjs:src
//protoc Protos/templates.proto --grpc-web_out=import_style=commonjs,mode=grpcwebtext:src

/*
const service = new GrpcTemplatesClient("");
const request = new GetTemplate2Request();
request.setName("test");
service.getTemplate2(request, {}, (err, response: GetTemplate2Reply) => {
    console.log(err);
    console.log(response.getContent());
});
*/

(async () => {
    const service = new GrpcService();
    
    const response = await service.unaryCall({
        service: "/templates.GrpcTemplates/GetTemplate2",
        request: [RequestType.String, RequestType.Int32],
        replay: [ReplayType.String, ReplayType.String, ReplayType.Int32]
    }, "test", 9999);
    
    console.log(response);
    

    const stream = service.serverStreaming({
        service: "/templates.GrpcTemplates/StreamTest",
        request: [RequestType.String, RequestType.Int32],
        replay: [ReplayType.String, ReplayType.String, ReplayType.Int32]
    }, "test", 9999);

    stream
        .on("error", error => console.log("error", error))
        .on("status", status => console.log("status", status))
        .on("data", data => console.log("data", data))
        .on("end", () => console.log("end"));
})();
