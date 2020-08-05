"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Router {
    constructor(args = {}) {
        this.onErrorHandler = event => { throw new Error(`Unknown route: ${event.hashChangedEvent.newURL}`); };
        this.onBeforeNavigateHandler = route => { };
        this.onBeforeLeaveHandler = route => { };
        this.onNavigateHandler = route => { };
        this.onLeaveHandler = route => { };
        args = Object.assign({
            element: document.body,
            hashChar: "#",
            test: ((r) => /^[A-Za-z0-9_@()/.-]*$/.test(r)),
            renderPlugins: []
        }, args);
        this.hashChar = args.hashChar;
        this.renderPlugins = args.renderPlugins;
        this.routes = {};
        for (let e of args.element.querySelectorAll("[data-route]")) {
            let element = e, route = element.dataset["route"];
            if (!args.test(route)) {
                throw new Error(`Invalid route definition: ${route}`);
            }
            if (!route.startsWith("/")) {
                throw new Error(`Invalid route definition: ${route}`);
            }
            let defaultParams = {}, paramMap = null;
            const p = element.dataset["routeParams"], params = {};
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
    navigate(route) {
        document.location.hash = this.hashChar + route;
        return this;
    }
    reveal(route) {
        return this.revealUri(route, null);
    }
    onHashChange(event) {
        let hash = document.location.hash;
        if (hash && event.newURL) {
            hash = event.newURL.replace(document.location.origin + document.location.pathname, "");
        }
        hash = hash.replace(document.location.search, "");
        this.revealUri(hash.replace(this.hashChar, ""), event);
    }
    async revealUri(uri, event) {
        const uriPieces = uri.split("/").map(item => decodeURIComponent(item));
        let route, candidate, test = "";
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
        let eventResult;
        if (this.current) {
            const args = this.buildRouteEventArgs(this.current, event);
            eventResult = this.onBeforeLeaveHandler(args);
            if (eventResult == false) {
                return;
            }
            if (eventResult instanceof Promise) {
                eventResult = await eventResult;
                if (eventResult == false) {
                    return;
                }
            }
            this.current.element.style["display"] = "none";
            eventResult = this.onLeaveHandler(args);
            if (eventResult == false) {
                return;
            }
            if (eventResult instanceof Promise) {
                eventResult = await eventResult;
                if (eventResult == false) {
                    return;
                }
            }
        }
        if (uriPieces[uriPieces.length - 1] === "") {
            uriPieces.splice(-1, 1);
        }
        const pieces = uriPieces.slice(sliceIndex);
        if (route) {
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
        }
        if (route) {
            this.current = route;
            const args = this.buildRouteEventArgs(this.current, event);
            eventResult = this.onBeforeNavigateHandler(args);
            if (eventResult == false) {
                return;
            }
            if (eventResult instanceof Promise) {
                eventResult = await eventResult;
                if (eventResult == false) {
                    return;
                }
            }
            for (let plugin of this.renderPlugins) {
                let result = plugin(route, () => this.onErrorHandler(args));
                if (result instanceof Promise) {
                    await result;
                }
            }
            this.current.element.style["display"] = "contents";
            eventResult = this.onNavigateHandler(args);
            if (eventResult instanceof Promise) {
                await eventResult;
            }
            return args;
        }
        else {
            this.current = null;
            const args = this.buildRouteEventArgs(null, event);
            this.onErrorHandler(args);
            return args;
        }
    }
    buildRouteEventArgs(route, event) {
        return {
            route: route == null ? null : route.route,
            params: route == null ? null : route.params,
            router: this,
            element: route == null ? null : route.element,
            hashChangedEvent: event
        };
    }
}
exports.Router = Router;
