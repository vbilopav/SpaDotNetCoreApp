System.register("router", [], function (exports_1, context_1) {
    "use strict";
    var Router;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Router = class Router {
                constructor(args = {}) {
                    this.hashChar = "#";
                    this.onErrorHandler = event => { throw new Error(`Unknown route: ${event.hashChangedEvent.newURL}`); };
                    this.onBeforeNavigateHandler = route => { };
                    this.onBeforeLeaveHandler = route => { };
                    this.onNavigateHandler = route => { };
                    this.onLeaveHandler = route => { };
                    args = Object.assign({
                        element: document.body,
                        hashChar: "#",
                        test: ((r) => /^[A-Za-z0-9_@()/.-]*$/.test(r))
                    }, args);
                    this.hashChar = args.hashChar;
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
                        let templateUrl = element.dataset["routeTemplateUrl"];
                        if (!templateUrl) {
                            templateUrl = null;
                        }
                        this.routes[route] = { route, element, defaultParams, paramMap, params, templateUrl };
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
                        if (route.templateUrl) {
                            let result = [];
                            let i = 0, idx;
                            const values = Array.from(route.paramMap.values());
                            for (let piece of route.templateUrl.split(/{/)) {
                                idx = piece.indexOf("}");
                                if (idx != -1) {
                                    result.push(values[i++] + piece.substring(idx + 1, piece.length));
                                }
                                else {
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
            };
            exports_1("default", Router);
        }
    };
});
System.register("main", ["router"], function (exports_2, context_2) {
    "use strict";
    var router_1, updateElement;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (router_1_1) {
                router_1 = router_1_1;
            }
        ],
        execute: function () {
            updateElement = (element, selector, value) => {
                let result = element.querySelector(selector);
                if (result) {
                    result.innerHTML = value;
                }
            };
            new router_1.default()
                .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
                .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
                .start();
            console.log("hello world");
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlci50cyIsIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUEwQkEsU0FBQSxNQUFxQixNQUFNO2dCQVd2QixZQUFZLE9BQXVCLEVBQUU7b0JBVjdCLGFBQVEsR0FBRyxHQUFHLENBQUM7b0JBQ2YsbUJBQWMsR0FBZSxLQUFLLENBQUMsRUFBRSxHQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO29CQUMzRyw0QkFBdUIsR0FBZSxLQUFLLENBQUMsRUFBRSxHQUFFLENBQUMsQ0FBQztvQkFDbEQseUJBQW9CLEdBQWUsS0FBSyxDQUFDLEVBQUUsR0FBRSxDQUFDLENBQUM7b0JBQy9DLHNCQUFpQixHQUFlLEtBQUssQ0FBQyxFQUFFLEdBQUUsQ0FBQyxDQUFDO29CQUM1QyxtQkFBYyxHQUFlLEtBQUssQ0FBQyxFQUFFLEdBQUUsQ0FBQyxDQUFDO29CQU03QyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDakIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJO3dCQUN0QixRQUFRLEVBQUUsR0FBRzt3QkFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN6RCxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ2pCLEtBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDeEQsSUFBSSxPQUFPLEdBQUksQ0FBaUIsRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQVcsQ0FBQzt3QkFDN0UsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEtBQUssRUFBRSxDQUFDLENBQUM7eUJBQ3pEO3dCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFLLEVBQUUsQ0FBQyxDQUFDO3lCQUN6RDt3QkFDRCxJQUFJLGFBQWEsR0FBRyxFQUFFLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDeEMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQVcsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO3dCQUNoRSxJQUFJLENBQUMsQ0FBQyxFQUFFOzRCQUNKLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO3lCQUNyQzs2QkFBTTs0QkFDSCxJQUFJO2dDQUNBLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM5QixRQUFRLEdBQUcsSUFBSSxHQUFHLENBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzZCQUNsRTs0QkFBQyxPQUFPLENBQUMsRUFBRTtnQ0FDUixPQUFPLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxLQUFLLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOzZCQUMxSDt5QkFDSjt3QkFDRCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFXLENBQUM7d0JBQ2hFLElBQUksQ0FBQyxXQUFXLEVBQUU7NEJBQ2QsV0FBVyxHQUFHLElBQUksQ0FBQzt5QkFDdEI7d0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUM7cUJBQ3ZGO2dCQUVMLENBQUM7Z0JBRU0sS0FBSztvQkFDUixNQUFNLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN6RSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7b0JBQ3hELE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUVNLE9BQU8sQ0FBQyxLQUFpQjtvQkFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7b0JBQzVCLE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUVNLFVBQVUsQ0FBQyxLQUFpQjtvQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztvQkFDL0IsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRU0sT0FBTyxDQUFDLEtBQWlCO29CQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztvQkFDNUIsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRU0sZ0JBQWdCLENBQUMsS0FBaUI7b0JBQ3JDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7b0JBQ3JDLE9BQU8sSUFBSSxDQUFDO2dCQUNoQixDQUFDO2dCQUVNLGFBQWEsQ0FBQyxLQUFpQjtvQkFDbEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztvQkFDbEMsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRU0sUUFBUSxDQUFDLEtBQWE7b0JBQ3pCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUMvQyxPQUFPLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFFTSxNQUFNLENBQUMsS0FBYTtvQkFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTyxZQUFZLENBQUMsS0FBc0I7b0JBQ3ZDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO29CQUNsQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO3dCQUN0QixJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQzFGO29CQUNELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDM0QsQ0FBQztnQkFFTyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQVcsRUFBRSxLQUFzQjtvQkFDdkQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN2RSxJQUFJLEtBQWEsRUFBRSxTQUFpQixFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2hELElBQUksQ0FBUyxFQUFFLEdBQVcsRUFBRSxVQUFrQixDQUFDO29CQUMvQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDOUMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7d0JBQzlELFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTs0QkFDckYsS0FBSyxHQUFHLFNBQVMsQ0FBQzs0QkFDbEIsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ3RCO3FCQUNKO29CQUNELElBQUksV0FBOEQsQ0FBQztvQkFDbkUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNkLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMzRCxXQUFXLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM5QyxJQUFJLFdBQVcsSUFBSSxLQUFLLEVBQUU7NEJBQ3RCLE9BQU87eUJBQ1Y7d0JBQ0QsSUFBSSxXQUFXLFlBQVksT0FBTyxFQUFFOzRCQUNoQyxXQUFXLEdBQUcsTUFBTSxXQUFXLENBQUM7NEJBQ2hDLElBQUksV0FBVyxJQUFJLEtBQUssRUFBRTtnQ0FDdEIsT0FBTzs2QkFDVjt5QkFDSjt3QkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDO3dCQUMvQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxXQUFXLElBQUksS0FBSyxFQUFFOzRCQUN0QixPQUFPO3lCQUNWO3dCQUNELElBQUksV0FBVyxZQUFZLE9BQU8sRUFBRTs0QkFDaEMsV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDOzRCQUNoQyxJQUFJLFdBQVcsSUFBSSxLQUFLLEVBQUU7Z0NBQ3RCLE9BQU87NkJBQ1Y7eUJBQ0o7cUJBQ0o7b0JBRUQsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQ3hDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzNCO29CQUNELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzNDLElBQUksS0FBSyxFQUFFO3dCQUNQLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTs0QkFDckMsS0FBSyxHQUFHLElBQUksQ0FBQzt5QkFDaEI7NkJBQU07NEJBQ0gsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7NEJBQ3RELEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDcEUsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dDQUNmLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dDQUM3QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQ0FDM0MsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ2xCLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztvQ0FDL0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7aUNBQzdCOzZCQUNKO3lCQUNKO3FCQUNKO29CQUNELElBQUksS0FBSyxFQUFFO3dCQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO3dCQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDM0QsV0FBVyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakQsSUFBSSxXQUFXLElBQUksS0FBSyxFQUFFOzRCQUN0QixPQUFPO3lCQUNWO3dCQUNELElBQUksV0FBVyxZQUFZLE9BQU8sRUFBRTs0QkFDaEMsV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDOzRCQUNoQyxJQUFJLFdBQVcsSUFBSSxLQUFLLEVBQUU7Z0NBQ3RCLE9BQU87NkJBQ1Y7eUJBQ0o7d0JBQ0QsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFOzRCQUNuQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7NEJBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFXLENBQUM7NEJBQ3ZCLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOzRCQUNuRCxLQUFJLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dDQUMzQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDekIsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUU7b0NBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7aUNBQ3JFO3FDQUFNO29DQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUNBQ3RCOzZCQUNKOzRCQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs0QkFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUU7Z0NBQ2QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs2QkFDN0I7NEJBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ25EO3dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUM7d0JBQ25ELFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzNDLElBQUksV0FBVyxZQUFZLE9BQU8sRUFBRTs0QkFDaEMsTUFBTSxXQUFXLENBQUM7eUJBQ3JCO3dCQUNELE9BQU8sSUFBSSxDQUFDO3FCQUNmO3lCQUFNO3dCQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO3dCQUNwQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNuRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUMxQixPQUFPLElBQUksQ0FBQztxQkFDZjtnQkFDTCxDQUFDO2dCQUVPLG1CQUFtQixDQUFDLEtBQWEsRUFBRSxLQUFzQjtvQkFDN0QsT0FBTzt3QkFDSCxLQUFLLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSzt3QkFDekMsTUFBTSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU07d0JBQzNDLE1BQU0sRUFBRSxJQUFJO3dCQUNaLE9BQU8sRUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPO3dCQUM3QyxnQkFBZ0IsRUFBRSxLQUFLO3FCQUMxQixDQUFBO2dCQUNMLENBQUM7YUFDSixDQUFBOztRQUFBLENBQUM7Ozs7Ozs7Ozs7Ozs7O1lDM09JLGFBQWEsR0FBRyxDQUFDLE9BQW9CLEVBQUUsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsRUFBRTtnQkFDNUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQzVCO1lBQ0wsQ0FBQyxDQUFBO1lBRUQsSUFBSSxnQkFBTSxFQUFFO2lCQUNQLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2lCQUM5RSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNqSCxLQUFLLEVBQUUsQ0FBQztZQUdiLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFBQSxDQUFDIn0=