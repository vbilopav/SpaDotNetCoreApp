System.register("router", [], function (exports_1, context_1) {
    "use strict";
    var default_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            default_1 = class {
                constructor(element = document.body) {
                    for (let e of element.querySelectorAll("[data-route]")) {
                    }
                }
            };
            exports_1("default", default_1);
        }
    };
});
System.register("main", ["router"], function (exports_2, context_2) {
    "use strict";
    var router_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (router_1_1) {
                router_1 = router_1_1;
            }
        ],
        execute: function () {
            new router_1.default();
            console.log("hello world from main...");
        }
    };
});
//# sourceMappingURL=app.js.map