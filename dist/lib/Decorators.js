"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Glob = require("glob");
const Path = require("path");
const __1 = require("../");
const Enums_1 = require("./Enums");
const root = global['rootPath'];
if (!root) {
    throw Error('Set Root diractory to global.rootPath');
}
const RouteDecorator = (target, propertyKey, descriptor, method, route, cb, isRender = false) => {
    let stringMethod = Enums_1.RouterMethods[method].toLowerCase();
    let absolutePath = '';
    let finalPathToView = '';
    let originalFunction = descriptor.value;
    if (isRender) {
        absolutePath = Glob.sync(root + `/app/views/${target.constructor.name.toLowerCase()}/**/${propertyKey}.jade`)[0];
        finalPathToView = Path.dirname(absolutePath).replace(root + '/app/views/', '') + `/${propertyKey}`;
    }
    descriptor.value = (router) => {
        return new __1.Route(router, route, stringMethod, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield cb(router, originalFunction, req, res, next, finalPathToView, res);
        }));
    };
};
exports.RenderRoute = (route, method) => {
    return (target, propertyKey, descriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, (router, originalFunction, req, res, next, finalPathToView) => __awaiter(this, void 0, void 0, function* () {
            let params = {};
            let result = yield originalFunction(router, req, next);
            Object.assign(params, result);
            res.render(finalPathToView, params);
        }), true);
    };
};
exports.RedirectRoute = (route, method) => {
    return (target, propertyKey, descriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, (router, originalFunction, req, res, next, finalPathToView) => __awaiter(this, void 0, void 0, function* () {
            let redirectParams = yield yield originalFunction(router, req, next);
            if (redirectParams.path) {
                if (redirectParams.code) {
                    res.redirect(redirectParams.code, redirectParams.path);
                }
                else {
                    res.redirect(redirectParams.path);
                }
            }
            else {
                throw Error('Укажите путь редиректа!');
            }
        }));
    };
};
exports.SendRoute = (route, method) => {
    return (target, propertyKey, descriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, (router, originalFunction, req, res, next, finalPathToView) => __awaiter(this, void 0, void 0, function* () {
            let sendParams = yield yield originalFunction(router, req, next);
            let params = {};
            Object.assign(params, sendParams);
            res.send(params);
        }));
    };
};
exports.CustomRoute = (route, method) => {
    return (target, propertyKey, descriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, (router, originalFunction, req, res, next, finalPathToView) => __awaiter(this, void 0, void 0, function* () {
            let sendParams = yield yield originalFunction(router, req, next, res);
        }));
    };
};
