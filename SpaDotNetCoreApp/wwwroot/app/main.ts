import Router from "./router";

new Router()
.onNavigate(e => {
    e.element.querySelector("div").innerHTML = JSON.stringify(e.params);
})
.start();




