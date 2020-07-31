import Router from "./router";

const updateElement = (element: HTMLElement, selector: string, value: string) => {
    let result = element.querySelector(selector);
    if (result) {
        result.innerHTML = value;
    }
}

new Router()
    .onNavigate(e => updateElement(e.element, ".params", JSON.stringify(e.params)))
    .onError(e => e.router.reveal("/error").then(args => updateElement(args.element, "code", document.location.hash)))
    .start();
