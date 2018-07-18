import * as Express from 'express';
import Route from './Route';
import * as Glob from 'glob';
import * as Path from 'path';

export default class Controller {

    private app: any;

    constructor(app: any, path: string | string[], routerParams: Express.RouterOptions = {}) {
        var router = Express.Router(routerParams);
        this.app = app;
        this.initParentRoutePath(path, router);
        this.initRoutes(router);
    }

    initParentRoutePath(path: string | string[], router: Express.Router) {
        this.app.use(path, router)
    }

    initRoutes(router: Express.Router) {
        let routes = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(x => typeof (this as any)[x] == 'function' && x !== 'constructor')
        let routeCounter = 0;
        for (let route of routes) {
            if ((this as any)[route](router) instanceof Route) {
                routeCounter++;
            } else {
                throw Error(`Функция контроллера ${route} должна возвращать тип Route`)
            }
        }
        if (routeCounter == 0) {
            throw Error('Вы не определили ни одного роута!')
        }
    }
}