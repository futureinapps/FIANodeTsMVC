/// <reference types="express" />
import * as Express from 'express';
export default class Controller {
    private app;
    constructor(app: any, path: string, routerParams?: Express.RouterOptions);
    initParentRoutePath(path: String, router: Express.Router): void;
    initRoutes(router: Express.Router): void;
}
