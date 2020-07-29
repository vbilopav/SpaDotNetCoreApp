System.register("router", [], function (exports_1, context_1) {
    "use strict";
    var Router;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Router = class Router {
                constructor(element = document.body, hashChar = "#", test = ((r) => /^[A-Za-z0-9_@()/.-]*$/.test(r))) {
                    this.hashChar = "#";
                    this.onErrorHandler = (hashChangedEvent) => { throw new Error(`Unknown route: ${hashChangedEvent.newURL}`); };
                    this.onBeforeNavigateHandler = route => { };
                    this.onBeforeLeaveHandler = route => { };
                    this.onNavigateHandler = route => { };
                    this.onLeaveHandler = route => { };
                    this.hashChar = hashChar;
                    this.routes = {};
                    for (let e of element.querySelectorAll("[data-route]")) {
                        let element = e, route = element.dataset["route"], p = element.dataset["routeParams"], paramMap = null, params = {}, defaultParams = {};
                        if (!test(route)) {
                            throw new Error(`Invalid route definition: ${route}`);
                        }
                        if (!route.startsWith("/")) {
                            throw new Error(`Invalid route definition: ${route}`);
                        }
                        if (!p) {
                            paramMap = new Map();
                        }
                        else {
                            try {
                                defaultParams = JSON.parse(p);
                                paramMap = new Map(Object.entries(defaultParams));
                            }
                            catch (e) {
                                console.error(`Couldn't deserialize default params for route ${route}: ${e}.\nMake sure that "${p}" is valid JSON...`);
                            }
                        }
                        this.routes[route] = { route, element, defaultParams, paramMap, params };
                    }
                }
                start() {
                    window.addEventListener("hashchange", event => this.onHashChange(event));
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                    return this;
                }
                onError(event) {
                    this.onErrorHandler = event;
                    return this;
                }
                onNavigate(event) {
                    this.onNavigateHandler = event;
                    return this;
                }
                onLeave(event) {
                    this.onLeaveHandler = event;
                    return this;
                }
                onBeforeNavigate(event) {
                    this.onBeforeNavigateHandler = event;
                    return this;
                }
                onBeforeLeave(event) {
                    this.onBeforeLeaveHandler = event;
                    return this;
                }
                onHashChange(event) {
                    let hash = document.location.hash;
                    if (hash && event.newURL) {
                        hash = event.newURL.replace(document.location.origin + document.location.pathname, "");
                    }
                    hash = hash.replace(document.location.search, "");
                    let uri = hash.replace(this.hashChar, ""), uriPieces = uri.split("/").map(item => decodeURIComponent(item)), route, candidate, test = "";
                    let i, len, sliceIndex;
                    for (i = 0, len = uriPieces.length; i < len; i++) {
                        let piece = uriPieces[i];
                        test = test.endsWith("/") ? test + piece : test + "/" + piece;
                        candidate = this.routes[test];
                        if ((candidate && !route) || (candidate && route.route.length < candidate.route.length)) {
                            route = candidate;
                            sliceIndex = i + 1;
                        }
                    }
                    if (this.current) {
                        this.onBeforeLeaveHandler({ route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event });
                        this.current.element.style["display"] = "none";
                        this.onLeaveHandler({ route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event });
                    }
                    if (uriPieces[uriPieces.length - 1] == "") {
                        uriPieces.splice(-1, 1);
                    }
                    let pieces = uriPieces.slice(sliceIndex);
                    if (pieces.length > route.paramMap.size) {
                        route = null;
                    }
                    else {
                        route.params = Object.assign({}, route.defaultParams);
                        route.paramMap = new Map(Object.entries(route.params));
                        if (pieces.length) {
                            let keys = Array.from(route.paramMap.keys());
                            for (i = 0, len = pieces.length; i < len; i++) {
                                let piece = pieces[i];
                                let key = keys[i];
                                route.paramMap.set(key, piece);
                                route.params[key] = piece;
                            }
                        }
                    }
                    if (route) {
                        this.onBeforeNavigateHandler({ route: route.route, params: route.params, element: route.element, hashChangedEvent: event });
                        this.current = route;
                        this.current.element.style["display"] = "contents";
                        this.onNavigateHandler({ route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event });
                    }
                    else {
                        this.current = null;
                        this.onErrorHandler(event);
                    }
                }
            };
            exports_1("default", Router);
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
            new router_1.default()
                .onNavigate(e => {
                console.log(e.params);
            })
                .start();
        }
    };
});
//# sourceMappingURL=app.js.map