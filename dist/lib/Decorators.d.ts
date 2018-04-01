import { RouterMethods } from './Enums';
export declare const RenderRoute: (route: string, method: RouterMethods) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const RedirectRoute: (route: string, method: RouterMethods) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const SendRoute: (route: string, method: RouterMethods) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const CustomRoute: (route: string, method: RouterMethods) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
