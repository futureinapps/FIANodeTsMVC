/// <reference types="express" />
import * as Express from 'express';
export default class Route {
    constructor(router: Express.Router, routePath: string, method: string, cb: any);
}
