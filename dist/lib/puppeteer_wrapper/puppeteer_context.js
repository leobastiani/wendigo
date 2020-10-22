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
const puppeteer_page_1 = __importDefault(require("./puppeteer_page"));
class PuppeteerContext {
    constructor(context) {
        this.context = context;
    }
    getDefaultPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield this.pages();
            if (pages.length > 0)
                return new puppeteer_page_1.default(pages[0]);
            else
                return this.newPage();
        });
    }
    pages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.context.pages();
        });
    }
    getPage(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield this.pages();
            const rawPage = pages[index];
            if (!rawPage)
                return undefined;
            return new puppeteer_page_1.default(rawPage);
        });
    }
    newPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.context.newPage();
            return new puppeteer_page_1.default(page);
        });
    }
    on(eventName, cb) {
        this.context.on(eventName, cb);
    }
    off(eventName, cb) {
        this.context.off(eventName, cb);
    }
    overridePermissions(url, permissions) {
        return this.context.overridePermissions(url, permissions);
    }
}
exports.default = PuppeteerContext;
