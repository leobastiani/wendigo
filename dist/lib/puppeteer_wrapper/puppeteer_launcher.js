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
exports.PuppeteerLauncher = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_context_1 = __importDefault(require("./puppeteer_context"));
class PuppeteerLauncher {
    launch(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance;
            try {
                instance = yield puppeteer_1.default.launch(settings);
            }
            catch (err) {
                // retry to avoid one-off _dl_allocate_tls_init error
                instance = yield puppeteer_1.default.launch(settings);
            }
            let context;
            if (settings.incognito) {
                context = yield instance.createIncognitoBrowserContext();
            }
            else
                context = instance.defaultBrowserContext();
            return new puppeteer_context_1.default(context);
        });
    }
}
exports.PuppeteerLauncher = PuppeteerLauncher;
