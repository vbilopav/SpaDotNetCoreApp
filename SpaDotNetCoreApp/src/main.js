"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
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
console.log("hello world from watchify");
//# sourceMappingURL=main.js.map