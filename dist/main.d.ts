import BrowserInterface from './lib/browser/browser_interface';
import { WendigoPluginInterface, WendigoPluginAssertionInterface, PluginModule, BrowserSettings } from './lib/types';
import * as WendigoErrors from './lib/models/errors';
export declare const Errors: typeof WendigoErrors;
export declare function createBrowser(settings?: BrowserSettings): Promise<BrowserInterface>;
export declare function stop(): Promise<void>;
export declare function registerPlugin(name: string | PluginModule, plugin?: WendigoPluginInterface, assertions?: WendigoPluginAssertionInterface): void;
export declare function clearPlugins(): void;
export { WendigoPluginInterface, WendigoPluginAssertionInterface, PluginModule, BrowserSettings, WendigoSelector, GeoLocationCoords } from './lib/types';
import { default as DomElementClass } from './lib/models/dom_element';
export interface DomElement extends DomElementClass {
}
export { default as Browser } from './lib/browser/browser_interface';
