import * as Glob from 'glob';
import * as Path from 'path';
import { Route } from '../';
import { RouterMethods } from './Enums'
const root = Path.normalize(__dirname + '/..');

const RouteDecorator = (target:any, propertyKey: string, descriptor: PropertyDescriptor, method: RouterMethods, route: string, cb: Function) => {
    let stringMethod = RouterMethods[method].toLowerCase()
    let absolutePath = Glob.sync(root + `/app/views/${target.constructor.name.toLowerCase()}/**/${propertyKey}.jade`)[0]
    let finalPathToView = Path.dirname(absolutePath).replace(root + '/app/views/', '') + `/${propertyKey}`
    let originalFunction = descriptor.value
    descriptor.value = (router:any) => {
        return new Route(
            router,
            route,
            stringMethod,
            async (req: Express.Request, res: Express.Request, next: Function) => {
                await cb(router, originalFunction, req, res, next, finalPathToView, res)
            }
        )
    }
}

export const RenderRoute = (route: string, method: RouterMethods) => {
    return (target:any, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, async (router:any, originalFunction:Function, req:Express.Request, res:any, next:Function, finalPathToView?:string) => {
            let params = {}
            let result = await originalFunction(router, req, next)
            Object.assign(params, result)
            res.render(finalPathToView, params)
        })
    }
}

export const RedirectRoute = (route: string, method: RouterMethods) => {
    return (target:any, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, async (router:any, originalFunction:Function, req:Express.Request, res:any, next:Function, finalPathToView?:string) => {
            let redirectParams: { path: string, code?: number } = await await originalFunction(router, req, next)
            if (redirectParams.path) {
                if (redirectParams.code) {
                    res.redirect(redirectParams.code, redirectParams.path)
                } else {
                    res.redirect(redirectParams.path)
                }
            } else {
                throw Error('Укажите путь редиректа!')
            }
        })
    }
}

export const SendRoute = (route: string, method: RouterMethods) => {
    return (target:any, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, async (router:any, originalFunction:Function, req:Express.Request, res:any, next:Function, finalPathToView?:string) => {
            let sendParams = await await originalFunction(router, req, next)
            let params = {}
            Object.assign(params, sendParams)
            res.send(params)
        })
    }
}

export const CustomRoute = (route: string, method: RouterMethods) => {
    return (target:any, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteDecorator(target, propertyKey, descriptor, method, route, async (router:any, originalFunction:Function, req:Express.Request, res:any, next:Function, finalPathToView?:string) => {
            let sendParams = await await originalFunction(router, req, next, res)
        })
    }
}
