interface IRoute {
    route: string,
    element: HTMLElement,
    defaultParams: Record<string, any>
    paramMap: Map<string, any>
    params: Record<string, any>
}

type RouteEventArgs = {
    route: string, 
    params: Record<string, any>, 
    element: HTMLElement,
    hashChangedEvent: HashChangeEvent
};

type ErrorEvent = (hashChangedEvent: HashChangeEvent) => void;
type RouteEvent = (event: RouteEventArgs) => void;

export default class Router {
    private hashChar = "#";
    private onErrorHandler: ErrorEvent = (hashChangedEvent: HashChangeEvent) => {throw new Error(`Unknown route: ${hashChangedEvent.newURL}`)};
    private onBeforeNavigateHandler: RouteEvent = route => {};
    private onBeforeLeaveHandler: RouteEvent = route => {};
    private onNavigateHandler: RouteEvent = route => {};
    private onLeaveHandler: RouteEvent = route => {};

    public current: IRoute;
    public routes: Record<string, IRoute>;

    constructor(
        element: Element = document.body, 
        hashChar = "#", 
        test=((r: string) => /^[A-Za-z0-9_@()/.-]*$/.test(r))
    ) {
        this.hashChar = hashChar;
        this.routes = {};
        for(let e of element.querySelectorAll("[data-route]")) {
            let element = (e as HTMLElement),
                route = element.dataset["route"] as string,
                p = element.dataset["routeParams"] as string,
                paramMap = null,
                params = {},
                defaultParams = {};
            if (!test(route)) {
                throw new Error(`Invalid route definition: ${route}`);
            }
            if (!route.startsWith("/")) {
                throw new Error(`Invalid route definition: ${route}`);
            }
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
            this.routes[route] = {route, element, defaultParams, paramMap, params};
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

    private onHashChange(event: HashChangeEvent) {
        let hash = document.location.hash;
        if (hash && event.newURL) {
            hash = event.newURL.replace(document.location.origin + document.location.pathname, "");
        }
        hash = hash.replace(document.location.search, "");
        let
            uri = hash.replace(this.hashChar, ""),
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
            this.onBeforeLeaveHandler({route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event});
            this.current.element.style["display"] = "none";
            this.onLeaveHandler({route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event});
        }

        if (uriPieces[uriPieces.length - 1] == "") {
            uriPieces.splice(-1, 1);
        }
        let pieces = uriPieces.slice(sliceIndex);
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

        if (route) {
            this.onBeforeNavigateHandler({route: route.route, params: route.params, element: route.element, hashChangedEvent: event});
            this.current = route;
            this.current.element.style["display"] = "contents";
            this.onNavigateHandler({route: this.current.route, params: this.current.params, element: this.current.element, hashChangedEvent: event});
        } else {
            this.current = null;
            this.onErrorHandler(event);
        }
    }
}