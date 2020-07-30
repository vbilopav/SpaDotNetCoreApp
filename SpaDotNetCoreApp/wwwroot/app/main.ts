import Router from "./router";

new Router()
    .onNavigate(e => {
        let paramsElement = e.element.querySelector(".params")
        if (paramsElement) {
            paramsElement.innerHTML = JSON.stringify(e.params);
        }
    })
    .onError(e => e.router.navigate("/error"))
    .start();




