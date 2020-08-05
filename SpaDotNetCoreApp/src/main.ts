import {Router} from "./router";
import grpcRenderer from "./grpc-render-router-plugin";

const updateElement = (element: HTMLElement, selector: string, value: string) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
}

new Router({renderPlugins: [grpcRenderer]})
    .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
    .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
    .start();
