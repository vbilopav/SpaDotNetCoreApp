"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (route, errorHandler) => {
    let templateUrl = route.element.dataset["routeTemplateUrl"];
    if (templateUrl) {
        let result = [];
        let i = 0, idx;
        const values = Array.from(route.paramMap.values());
        for (let piece of templateUrl.split(/{/)) {
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
            errorHandler();
        }
        else {
            route.element.innerHTML = await response.text();
        }
    }
};
