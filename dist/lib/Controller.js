"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const Route_1 = require("./Route");
class Controller {
    constructor(app, path, routerParams = {}) {
        var router = Express.Router(routerParams);
        this.app = app;
        this.initParentRoutePath(path, router);
        this.initRoutes(router);
    }
    initParentRoutePath(path, router) {
        this.app.use(path, router);
    }
    initRoutes(router) {
        let routes = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(x => typeof this[x] == 'function' && x !== 'constructor');
        let routeCounter = 0;
        for (let route of routes) {
            if (this[route](router) instanceof Route_1.default) {
                routeCounter++;
            }
            else {
                throw Error(`Функция контроллера ${route} должна возвращать тип Route`);
            }
        }
        if (routeCounter == 0) {
            throw Error('Вы не определили ни одного роута!');
        }
    }
}
exports.default = Controller;
