"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_service_1 = require("./grpc-service");
const grpc = new grpc_service_1.GrpcService();
exports.default = async (route) => {
    let service = route.element.dataset["routeGrpcTemplateService"];
    if (!service) {
        return;
    }
    let params = Array.from(route.paramMap.entries()).map(entry => {
        let split = entry[0].split(":");
        return {
            id: Number(split[0]),
            type: split[1] ? split[1] : "String",
            value: entry[1]
        };
    }).sort((x, y) => x.id > y.id ? 1 : -1);
    const response = await grpc.unaryCall({
        service: service,
        request: params.map(p => grpc_service_1.RequestType[p.type])
    }, ...params.map(p => p.value));
    route.element.innerHTML = response[1];
};
