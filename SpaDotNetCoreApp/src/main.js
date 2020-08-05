"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const grpc_render_router_plugin_1 = require("./grpc-render-router-plugin");
const rest_render_router_plugin_1 = require("./rest-render-router-plugin");
const updateElement = (element, selector, value) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
};
new router_1.Router({ renderPlugins: [grpc_render_router_plugin_1.default, rest_render_router_plugin_1.default] })
    .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
    .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
    .start();
