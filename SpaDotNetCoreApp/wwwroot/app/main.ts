import Router from "./router";

new Router()
.onNavigate(e => {
    console.log(e.params);
})
.start();




