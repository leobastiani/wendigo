"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const browser_factory_1 = __importDefault(require("./browser_factory"));
const Errors = __importStar(require("./models/errors"));
const puppeteer_launcher_1 = require("./puppeteer_wrapper/puppeteer_launcher");
const defaultSettings = {
    log: false,
    logRequests: false,
    headless: true,
    args: [],
    slowMo: 0,
    incognito: false,
    noSandbox: false,
    bypassCSP: true,
    proxyServer: null,
    defaultTimeout: 500
};
class Wendigo {
    constructor() {
        this._customPlugins = [];
        this._browsers = [];
    }
    createBrowser(settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalSettings = this._processSettings(settings);
            const instance = yield this._createInstance(finalSettings);
            const plugins = this._customPlugins;
            const b = yield browser_factory_1.default.createBrowser(instance, finalSettings, plugins);
            this._browsers.push(b);
            if (settings.timezone)
                b.setTimezone(settings.timezone);
            return b;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearPlugins();
            const p = Promise.all(this._browsers.map((b) => {
                return b.close();
            }));
            this._browsers = [];
            yield p;
        });
    }
    registerPlugin(name, plugin, assertions) {
        let finalName;
        if (typeof name === 'object') {
            const config = name;
            finalName = config.name;
            plugin = config.plugin;
            assertions = config.assertions;
        }
        else {
            finalName = name;
        }
        this._validatePlugin(finalName, plugin, assertions);
        browser_factory_1.default.clearCache();
        this._customPlugins.push({
            name: finalName,
            plugin: plugin,
            assertions: assertions
        });
    }
    clearPlugins() {
        this._customPlugins = [];
        browser_factory_1.default.clearCache();
    }
    _validatePlugin(name, plugin, assertions) {
        this._validatePluginName(name);
        if (plugin && typeof plugin !== 'function')
            throw new Errors.FatalError("registerPlugin", `Invalid plugin module "${name}".`);
        this._validatePluginAssertion(name, assertions);
        if (!plugin && !assertions)
            throw new Errors.FatalError("registerPlugin", `Invalid plugin module "${name}".`);
    }
    _validatePluginName(name) {
        if (!name || typeof name !== 'string')
            throw new Errors.FatalError("registerPlugin", `Plugin requires a name.`);
        let invalidNames = ["assert", "page", "not"];
        const defaultModules = ["cookies", "localStorage", "requests", "console", "webworkers", "dialog"];
        const plugins = this._customPlugins;
        invalidNames = invalidNames.concat(plugins.map(p => p.name)).concat(defaultModules);
        const valid = !invalidNames.includes(name);
        if (!valid)
            throw new Errors.FatalError("registerPlugin", `Invalid plugin name "${name}".`);
    }
    _validatePluginAssertion(name, assertions) {
        if (assertions) {
            if (typeof assertions !== 'function')
                throw new Errors.FatalError("registerPlugin", `Invalid assertion module for plugin "${name}".`);
        }
    }
    _createInstance(settings) {
        const launcher = new puppeteer_launcher_1.PuppeteerLauncher();
        return launcher.launch(settings);
    }
    _removeBrowser(browser) {
        const idx = this._browsers.indexOf(browser);
        if (idx === -1) {
            throw new Errors.FatalError("onClose", "browser not found on closing.");
        }
        this._browsers.splice(idx, 1);
    }
    _processSettings(settings) {
        const onClose = this._removeBrowser.bind(this);
        const finalSettings = Object.assign({ __onClose: onClose }, defaultSettings, settings);
        if (!finalSettings.args)
            finalSettings.args = [];
        if (process_1.default.env.NO_SANDBOX || finalSettings.noSandbox) {
            finalSettings.args = finalSettings.args.concat(['--no-sandbox', '--disable-setuid-sandbox']); // Required to run on some systems
        }
        if (finalSettings.proxyServer) {
            finalSettings.args.push(`--proxy-server=${settings.proxyServer}`);
        }
        return finalSettings;
    }
}
exports.default = Wendigo;
