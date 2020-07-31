interface IRoute {
    route: string;
    element: HTMLElement;
    defaultParams: Record<string, any>;
    paramMap: Map<string, any>;
    params: Record<string, any>;
    templateUrl: string;
}

type RouteEventArgs = {
    route: string;
    params: Record<string, any>;
    router: Router;
    element: HTMLElement;
    hashChangedEvent: HashChangeEvent;
};

type IRouterCtorArgs = {
    element?: Element;
    hashChar?: string;
    test?: (route: string) => boolean;
}

type ErrorEvent = (event: RouteEventArgs) => void;
type RouteEvent = (event: RouteEventArgs) => void;

export default class Router {
    private hashChar = "#";
    private onErrorHandler: ErrorEvent = event => {throw new Error(`Unknown route: ${event.hashChangedEvent.newURL}`)};
    private onBeforeNavigateHandler: RouteEvent = route => {};
    private onBeforeLeaveHandler: RouteEvent = route => {};
    private onNavigateHandler: RouteEvent = route => {};
    private onLeaveHandler: RouteEvent = route => {};

    public current: IRoute;
    public routes: Record<string, IRoute>;

    constructor(args: IRouterCtorArgs = {}) {
        args = Object.assign({
            element: document.body,
            hashChar: "#",
            test: ((r: string) => /^[A-Za-z0-9_@()/.-]*$/.test(r))
        }, args);
        this.hashChar = args.hashChar;
        this.routes = {};
        for(let e of args.element.querySelectorAll("[data-route]")) {
            let element = (e as HTMLElement), route = element.dataset["route"] as string;
            if (!args.test(route)) {
                throw new Error(`Invalid route definition: ${route}`);
            }
            if (!route.startsWith("/")) {
                throw new Error(`Invalid route definition: ${route}`);
            }
            let defaultParams = {}, paramMap = null;
            const p = element.dataset["routeParams"] as string, params = {};
            if (!p) {
                paramMap = new Map<string, any>();
            } else {
                try {
                    defaultParams = JSON.parse(p);
                    paramMap = new Map<string, any>(Object.entries(defaultParams));
                } catch (e) {
                    console.error(`Couldn't deserialize default params for route ${route}: ${e}.\nMake sure that "${p}" is valid JSON...`);
                }
            }
            let templateUrl = element.dataset["routeTemplateUrl"] as string;
            if (!templateUrl) {
                templateUrl = null;
            }
            this.routes[route] = {route, element, defaultParams, paramMap, params, templateUrl};
        }
        
    }

    public start() {
        window.addEventListener("hashchange", event => this.onHashChange(event));
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        return this;
    }

    public onError(event: ErrorEvent) {
        this.onErrorHandler = event;
        return this;
    }

    public onNavigate(event: RouteEvent) {
        this.onNavigateHandler = event;
        return this;
    }

    public onLeave(event: RouteEvent) {
        this.onLeaveHandler = event;
        return this;
    }

    public onBeforeNavigate(event: RouteEvent) {
        this.onBeforeNavigateHandler = event;
        return this;
    }

    public onBeforeLeave(event: RouteEvent) {
        this.onBeforeLeaveHandler = event;
        return this;
    }

    public navigate(route: string) {
        document.location.hash = this.hashChar + route;
        return this;
    }

    public reveal(route: string) {
        return this.revealUri(route, null);
    }

    private onHashChange(event: HashChangeEvent) {
        let hash = document.location.hash;
        if (hash && event.newURL) {
            hash = event.newURL.replace(document.location.origin + document.location.pathname, "");
        }
        hash = hash.replace(document.location.search, "");
        this.revealUri(hash.replace(this.hashChar, ""), event);
    }

    private async revealUri(uri: string, event: HashChangeEvent) {
        let
            uriPieces = uri.split("/").map(item => decodeURIComponent(item)),
            route: IRoute,
            candidate: IRoute,
            test = "";
            
        let i: number, len: number, sliceIndex: number;
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
            const args = this.buildRouteEventArgs(this.current, event);
            this.onBeforeLeaveHandler(args);
            this.current.element.style["display"] = "none";
            this.onLeaveHandler(args);
        }

        if (uriPieces[uriPieces.length - 1] == "") {
            uriPieces.splice(-1, 1);
        }
        let pieces = uriPieces.slice(sliceIndex);
        if (route) {
            if (pieces.length > route.paramMap.size) {
                route = null;
            } else {
                route.params = Object.assign({}, route.defaultParams);
                route.paramMap = new Map<string, any>(Object.entries(route.params));
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
            this.onBeforeNavigateHandler(args);
            if (route.templateUrl) {
                let result = [];
                let i = 0, idx: number;
                const values = Array.from(route.paramMap.values());
                for(let piece of route.templateUrl.split(/{/)) {
                    idx = piece.indexOf("}");
                    if (idx != -1) {
                        result.push(values[i++] + piece.substring(idx + 1, piece.length));
                    } else {
                        result.push(piece);
                    }
                }
                const response = await fetch(result.join(""), { method: "get" });
                if (!response.ok) {
                    this.onErrorHandler(args);
                }
                route.element.innerHTML = await response.text();
            }
            this.current.element.style["display"] = "contents";
            this.onNavigateHandler(args);
            return args;
        } else {
            this.current = null;
            const args = this.buildRouteEventArgs(null, event);
            this.onErrorHandler(args);
            return args;
        }
    }

    private buildRouteEventArgs(route: IRoute, event: HashChangeEvent) : RouteEventArgs {
        return {
            route: route == null ? null : route.route, 
            params: route == null ? null : route.params, 
            router: this, 
            element: route == null ? null : route.element, 
            hashChangedEvent: event
        }
    }
}