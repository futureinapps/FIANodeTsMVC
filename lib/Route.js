"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Route {
    constructor(router, routePath, method, cb) {
        router[method](routePath, cb);
    }
}
exports.default = Route;
