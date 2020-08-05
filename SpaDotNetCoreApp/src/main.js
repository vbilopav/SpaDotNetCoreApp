"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const grpc_render_router_plugin_1 = require("./grpc-render-router-plugin");
//import {GrpcService, RequestType} from "./grpc-service";
const updateElement = (element, selector, value) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
};
new router_1.Router({ renderPlugins: [grpc_render_router_plugin_1.default] })
    .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
    .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
    .start();
/*
(async () => {
    const service = new GrpcService();
    
    const response = await service.unaryCall({service: "/templates.GrpcTemplates/GetTemplate2", request: [RequestType.String, RequestType.Int32]}, "test", 9999);
    console.log(response);
})();
*/ 
