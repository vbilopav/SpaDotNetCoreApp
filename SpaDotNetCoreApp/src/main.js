"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const grpc_service_1 = require("./grpc-service");
const updateElement = (element, selector, value) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
};
new router_1.default()
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
    const service = new grpc_service_1.GrpcService();
    const response = await service.unaryCall({
        service: "/templates.GrpcTemplates/GetTemplate2",
        request: [grpc_service_1.RequestType.String, grpc_service_1.RequestType.Int32],
        replay: [grpc_service_1.ReplayType.String, grpc_service_1.ReplayType.String, grpc_service_1.ReplayType.Int32]
    }, "test", 9999);
    console.log(response);
})();
