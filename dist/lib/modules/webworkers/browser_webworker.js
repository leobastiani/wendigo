"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webworker_1 = __importDefault(require("./webworker"));
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
class BrowserWebWorker extends wendigo_module_1.default {
    all() {
        return this._page.workers().map((ww) => {
            return new webworker_1.default(ww);
        });
    }
}
exports.default = BrowserWebWorker;
