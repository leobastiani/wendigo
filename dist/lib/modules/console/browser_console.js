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
const log_1 = __importDefault(require("./log"));
const utils_1 = require("../../utils/utils");
const puppeteer_utils_1 = require("../../puppeteer_wrapper/puppeteer_utils");
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
const types_1 = require("./types");
class BrowserConsole extends wendigo_module_1.default {
    constructor(browser) {
        super(browser);
        this._logs = [];
        this._page.on("console", (log) => __awaiter(this, void 0, void 0, function* () {
            if (log) {
                const text = yield puppeteer_utils_1.stringifyLogText(log);
                this._logs.push(new log_1.default(log, text));
            }
        }));
    }
    get LogType() {
        return types_1.LogType;
    }
    all() {
        return this._logs;
    }
    filter(filters = {}) {
        return this._logs.filter((l) => {
            if (filters.type && l.type !== filters.type)
                return false;
            if (filters.text && !utils_1.matchText(l.text, filters.text))
                return false;
            return true;
        });
    }
    clear() {
        this._logs = [];
    }
    _beforeOpen(options) {
        const _super = Object.create(null, {
            _beforeOpen: { get: () => super._beforeOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super._beforeOpen.call(this, options);
            this.clear();
        });
    }
}
exports.default = BrowserConsole;
