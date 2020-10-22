"use strict";
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
const compositer_1 = __importDefault(require("compositer"));
const is_class_1 = __importDefault(require("is-class"));
const browser_1 = __importDefault(require("./browser/browser"));
const browser_assertions_1 = __importDefault(require("./browser/browser_assertions"));
const errors_1 = require("./models/errors");
class BrowserFactory {
    static createBrowser(context, settings, plugins) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._browserClass) {
                this._setupBrowserClass(plugins);
            }
            if (!this._browserClass)
                throw new errors_1.FatalError("BrowserFactory", "Error on setupBrowserClass");
            const page = yield context.getDefaultPage();
            return new this._browserClass(context, page, settings);
        });
    }
    static clearCache() {
        this._browserClass = undefined;
    }
    static _setupBrowserClass(plugins) {
        const components = {};
        const assertComponents = {};
        for (const p of plugins) {
            if (p.plugin) {
                components[p.name] = p.plugin;
            }
            if (p.assertions) {
                assertComponents[p.name] = this._setupAssertionModule(p.assertions, p.name);
            }
        }
        const assertionClass = compositer_1.default(browser_assertions_1.default, assertComponents);
        const finalComponents = Object.assign({}, components, { assert: assertionClass });
        this._browserClass = compositer_1.default(browser_1.default, finalComponents);
    }
    static _setupAssertionModule(assertionPlugin, name) {
        if (is_class_1.default(assertionPlugin)) {
            return this._setupAssertionClass(assertionPlugin, name);
        }
        else if (typeof assertionPlugin === 'function') {
            return this._setupAssertionFunction(assertionPlugin, name);
        }
        else {
            return null;
        }
    }
    static _setupAssertionFunction(assertionFunction, name) {
        return function (assertionModule, ...params) {
            const browser = assertionModule._browser;
            return assertionFunction(browser, browser[name], ...params);
        };
    }
    static _setupAssertionClass(assertionClass, name) {
        return class extends assertionClass {
            constructor(assertionModule) {
                super(assertionModule._browser, assertionModule._browser[name]);
            }
        };
    }
}
exports.default = BrowserFactory;
