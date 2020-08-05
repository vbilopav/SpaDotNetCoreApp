import {IRoute} from "./router";
import {GrpcService, GrpcType} from "./grpc-service";

const grpc = new GrpcService();

interface IParams {
    id: number;
    type: string;
    value: any;
}

export default async (route: IRoute, errorHandler: ()=>void) => {
    let service = route.element.dataset["routeGrpcTemplateService"] as string;
    if (!service) {
        return;
    }
    let params = Array.from(route.paramMap.entries()).map(entry => {
        let split = entry[0].split(":")
        return {
            id: Number(split[0]), 
            type: split[1] ? split[1] : "String", 
            value: entry[1]
        } as IParams
    }).sort((x,y) => x.id > y.id ? 1 : -1);

    const response = await grpc.unaryCall({
        service: service, 
        request: params.map(p => GrpcType[p.type])
    }, ...params.map(p => p.value));

    if (response instanceof Error) {
        errorHandler();
    } else {
        route.element.innerHTML = response[1];
    }
}