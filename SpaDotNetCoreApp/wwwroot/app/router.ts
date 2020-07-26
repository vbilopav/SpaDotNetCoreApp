
export default class {
    constructor(element: Element = document.body) {
        for(let e of element.querySelectorAll("[data-route]")) {
            //(e as HTMLElement).style["display"] = "none";
        }
    }
}