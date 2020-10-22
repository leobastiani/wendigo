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
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
class BrowserCookies extends wendigo_module_1.default {
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield this._page.cookies();
            return cookies.reduce((acc, cookie) => {
                acc[cookie.name] = cookie.value;
                return acc;
            }, {});
        });
    }
    get(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let cookies;
            if (url) {
                cookies = yield this._page.cookies(url);
            }
            else
                cookies = yield this._page.cookies();
            return cookies.find((cookie) => {
                return cookie.name === name;
            });
        });
    }
    set(name, value) {
        let data;
        if (typeof value === 'string') {
            data = {
                name: name,
                value: value
            };
        }
        else {
            data = Object.assign({}, value, { name: name });
        }
        return this._page.setCookie(data);
    }
    delete(name) {
        if (name === undefined || name === null)
            throw new errors_1.WendigoError("cookies.delete", "Delete cookie name missing");
        if (this._isDeleteCookieInterface(name)) {
            return this._page.deleteCookie(name);
        }
        const cookiesList = utils_1.arrayfy(name);
        if (cookiesList.length === 0)
            return Promise.resolve();
        const cookiesObjects = cookiesList.map((n) => {
            return { name: n };
        });
        return this._page.deleteCookie(...cookiesObjects);
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield this._page.cookies();
            const cookiesList = cookies.map(c => c.name);
            return this.delete(cookiesList);
        });
    }
    _isDeleteCookieInterface(data) {
        if (data.name)
            return true;
        else
            return false;
    }
}
exports.default = BrowserCookies;
