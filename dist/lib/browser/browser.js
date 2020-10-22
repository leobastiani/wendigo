"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const browser_tap_1 = __importDefault(require("./mixins/browser_tap"));
// Modules
const browser_cookies_1 = __importDefault(require("../modules/cookies/browser_cookies"));
const browser_local_storage_1 = __importDefault(require("../modules/local_storage/browser_local_storage"));
const browser_requests_1 = __importDefault(require("../modules/requests/browser_requests"));
const browser_console_1 = __importDefault(require("../modules/console/browser_console"));
const browser_webworker_1 = __importDefault(require("../modules/webworkers/browser_webworker"));
const browser_dialog_1 = __importDefault(require("../modules/dialog/browser_dialog"));
const browser_auth_1 = __importDefault(require("../modules/auth/browser_auth"));
class Browser extends browser_tap_1.default {
    constructor(context, page, settings, components = []) {
        components = components.concat(["cookies", "localStorage", "requests", "console", "webworkers", "dialog"]);
        super(context, page, settings, components);
        this.cookies = new browser_cookies_1.default(this);
        this.localStorage = new browser_local_storage_1.default(this);
        this.requests = new browser_requests_1.default(this, settings);
        this.console = new browser_console_1.default(this);
        this.webworkers = new browser_webworker_1.default(this);
        this.dialog = new browser_dialog_1.default(this);
        this.auth = new browser_auth_1.default(this);
    }
}
exports.default = Browser;
