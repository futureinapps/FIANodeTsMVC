import * as Express from 'express';
export default class Controller {
    private app;
    constructor(app: any, path: string | string[], routerParams?: Express.RouterOptions);
    initParentRoutePath(path: string | string[], router: Express.Router): void;
    initRoutes(router: Express.Router): void;
}
