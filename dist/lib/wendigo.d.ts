import { WendigoPluginInterface, BrowserSettings, WendigoPluginAssertionInterface, PluginModule } from './types';
import BrowserInterface from './browser/browser_interface';
export default class Wendigo {
    private _customPlugins;
    private _browsers;
    constructor();
    createBrowser(settings?: BrowserSettings): Promise<BrowserInterface>;
    stop(): Promise<void>;
    registerPlugin(name: string | PluginModule, plugin?: WendigoPluginInterface, assertions?: WendigoPluginAssertionInterface): void;
    clearPlugins(): void;
    private _validatePlugin;
    private _validatePluginName;
    private _validatePluginAssertion;
    private _createInstance;
    private _removeBrowser;
    private _processSettings;
}
