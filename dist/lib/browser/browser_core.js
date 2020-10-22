"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const path_1 = __importDefault(require("path"));
const querystring_1 = __importDefault(require("querystring"));
const puppeteer_utils_1 = require("../puppeteer_wrapper/puppeteer_utils");
const dom_element_1 = __importDefault(require("../models/dom_element"));
const errors_1 = require("../models/errors");
const puppeteer_page_1 = __importDefault(require("../puppeteer_wrapper/puppeteer_page"));
const fail_if_not_loaded_1 = __importDefault(require("../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../decorators/override_error"));
const selector_query_1 = __importDefault(require("../../injection_scripts/selector_query"));
const wendigo_utils_1 = __importDefault(require("../../injection_scripts/wendigo_utils"));
const selector_finder_1 = __importDefault(require("../../injection_scripts/selector_finder"));
const utils_1 = require("../utils/utils");
const header_helper_1 = __importDefault(require("./helpers/header_helper"));
function pageLog(log) {
    return __awaiter(this, void 0, void 0, function* () {
        if (log) {
            const text = yield puppeteer_utils_1.stringifyLogText(log);
            let logType = log.type();
            if (logType === 'warning')
                logType = 'warn';
            const con = console;
            if (!(con[logType]))
                logType = 'log';
            con[logType](text);
        }
    });
}
const defaultOpenOptions = {
    viewport: {
        width: 1440,
        height: 900,
        isMobile: false
    }
};
class BrowserCore {
    constructor(context, page, settings, components = []) {
        this._openSettings = defaultOpenOptions;
        this._page = page;
        this._context = context;
        this._settings = settings;
        this._loaded = false;
        this.initialResponse = null;
        this._disabled = false;
        this._cache = settings.cache !== undefined ? settings.cache : true;
        this._components = components;
        this._headerHelper = new header_helper_1.default(this._page);
        this._setEventListeners();
    }
    get page() {
        return this._page.page;
    }
    get context() {
        return this._context.context;
    }
    get loaded() {
        return this._loaded && !this._disabled;
    }
    get incognito() {
        return Boolean(this._settings.incognito);
    }
    get cacheEnabled() {
        return this._cache;
    }
    open(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loaded = false;
            this._openSettings = Object.assign({}, defaultOpenOptions, options);
            url = this._processUrl(url);
            yield this.setCache(this._cache);
            if (this._openSettings.queryString) {
                const qs = this._generateQueryString(this._openSettings.queryString);
                url = `${url}${qs}`;
            }
            try {
                yield this._beforeOpen(this._openSettings);
                const response = yield this._page.goto(url);
                this.initialResponse = response;
                return this._afterPageLoad();
            }
            catch (err) {
                if (err instanceof errors_1.FatalError)
                    return Promise.reject(err);
                return Promise.reject(new errors_1.FatalError("open", `Failed to open "${url}". ${err.message}`));
            }
        });
    }
    openFile(filepath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const absolutePath = path_1.default.resolve(filepath);
                yield this.open(`file://${absolutePath}`, options);
            }
            catch (err) {
                throw new errors_1.FatalError("openFile", `Failed to open "${filepath}". File not found.`);
            }
        });
    }
    setContent(html) {
        return __awaiter(this, void 0, void 0, function* () {
            this._loaded = false;
            yield this.setCache(this._cache);
            try {
                yield this._beforeOpen({});
                yield this.page.setContent(html);
                return this._afterPageLoad();
            }
            catch (err) {
                if (err instanceof errors_1.FatalError)
                    return Promise.reject(err);
                return Promise.reject(new errors_1.FatalError("setContent", `Failed to set content. ${err.message}`));
            }
        });
    }
    setMedia(mediaOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mediaOptions === undefined)
                return undefined;
            if (typeof mediaOptions === 'string' || mediaOptions === null) {
                mediaOptions = {
                    type: mediaOptions
                };
            }
            if (mediaOptions.type !== undefined) {
                this._page.emulateMediaType(mediaOptions.type);
            }
            if (mediaOptions.features) {
                this._page.emulateMediaFeatures(mediaOptions.features);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disabled)
                return Promise.resolve();
            const p = this._beforeClose(); // Minor race condition with this._loaded if moved
            this._disabled = true;
            this._loaded = false;
            this.initialResponse = null;
            this._originalHtml = undefined;
            try {
                yield p;
                yield this._page.browser().close();
            }
            catch (err) {
                return Promise.reject(new errors_1.FatalError("close", `Failed to close browser. ${err.message}`));
            }
        });
    }
    evaluate(cb, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            args = this._setupEvaluateArguments(args);
            const rawResult = yield this._page.evaluateHandle(cb, ...args);
            const resultAsElement = rawResult.asElement();
            if (resultAsElement) {
                return new dom_element_1.default(resultAsElement);
            }
            else
                return rawResult.jsonValue();
        });
    }
    pages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._context.pages();
        });
    }
    selectPage(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this._context.getPage(index);
            if (!page)
                throw new errors_1.FatalError("selectPage", `Invalid page index "${index}".`);
            this._page = page;
            // TODO: Avoid reload
            // await this.page.reload(); // Required to enable bypassCSP
            yield this._beforeOpen(this._openSettings);
            yield this._afterPageLoad();
        });
    }
    closePage(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this._context.getPage(index);
            if (!page)
                throw new errors_1.FatalError("closePage", `Invalid page index "${index}".`);
            yield page.close();
            try {
                yield this.selectPage(0);
            }
            catch (err) {
                this.close();
            }
        });
    }
    setViewport(config = {}) {
        return this._page.setViewport(config);
    }
    setTimezone(tz) {
        return this._page.emulateTimezone(tz);
    }
    setGeolocation(geolocation) {
        return this._page.setGeolocation(geolocation);
    }
    overridePermissions(url, permissions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._context.overridePermissions(url, utils_1.arrayfy(permissions));
        });
    }
    url() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = yield this.evaluate(() => window.location.href);
            if (url === "about:blank")
                url = null;
            return url;
        });
    }
    frames() {
        return this._page.frames();
    }
    mockDate(date, options = { freeze: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.evaluate((d, f) => {
                WendigoUtils.mockDate(d, f);
            }, date.getTime(), options.freeze);
        });
    }
    clearDateMock() {
        return this.evaluate(() => {
            WendigoUtils.clearDateMock();
        });
    }
    addScript(scriptPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._page.addScriptTag({
                    path: scriptPath
                });
            }
            catch (err) {
                if (err.message === "Evaluation failed: Event") {
                    const cspWarning = "This may be caused by the page Content Security Policy. Make sure the option bypassCSP is set to true in Wendigo.";
                    throw new errors_1.InjectScriptError("addScript", `Error injecting scripts. ${cspWarning}`); // CSP error
                }
                else
                    throw new errors_1.InjectScriptError("addScript", err);
            }
        });
    }
    setCache(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._page.setCache(value);
            this._cache = value;
        });
    }
    _beforeClose() {
        return __awaiter(this, void 0, void 0, function* () {
            this._settings.__onClose(this);
            if (!this._loaded)
                return Promise.resolve();
            yield this._callComponentsMethod("_beforeClose");
        });
    }
    _beforeOpen(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._settings.userAgent) {
                yield this._page.setUserAgent(this._settings.userAgent);
            }
            if (this._settings.bypassCSP) {
                yield this._page.setBypassCSP(true);
            }
            if (options.geolocation) {
                yield this.setGeolocation(options.geolocation);
            }
            yield this.setViewport(options.viewport);
            yield this._callComponentsMethod("_beforeOpen", options);
        });
    }
    _afterPageLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this._page.content();
            this._originalHtml = content;
            yield this._addJsScripts();
            this._loaded = true;
            yield this._callComponentsMethod("_afterOpen");
        });
    }
    _addJsScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this._page.evaluateHandle(selector_query_1.default),
                this._page.evaluateHandle(wendigo_utils_1.default),
                this._page.evaluateHandle(selector_finder_1.default)
            ]);
        });
    }
    _setupEvaluateArguments(args) {
        return args.map((e) => {
            if (e instanceof dom_element_1.default)
                return e.element;
            else
                return e;
        });
    }
    _callComponentsMethod(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this._components.map((c) => {
                const anyThis = this;
                if (typeof anyThis[c][method] === 'function')
                    return anyThis[c][method](options);
            }));
        });
    }
    _generateQueryString(qs) {
        if (typeof qs === 'string') {
            if (qs[0] !== "?")
                qs = `?${qs}`;
            return qs;
        }
        else {
            return `?${querystring_1.default.stringify(qs)}`;
        }
    }
    _processUrl(url) {
        if (url.split("://").length === 1) {
            return `http://${url}`;
        }
        else
            return url;
    }
    _setEventListeners() {
        if (this._settings.log) {
            this._page.on("console", pageLog);
        }
        // TODO: move to private method
        this._context.on('targetcreated', (target) => __awaiter(this, void 0, void 0, function* () {
            const createdPage = yield target.page();
            if (createdPage) {
                const puppeteerPage = new puppeteer_page_1.default(createdPage);
                try {
                    yield puppeteerPage.setBypassCSP(true);
                    if (this._settings.userAgent)
                        yield puppeteerPage.setUserAgent(this._settings.userAgent);
                }
                catch (err) {
                    // Will fail if browser is closed before finishing
                }
            }
        }));
        this._page.on('load', () => __awaiter(this, void 0, void 0, function* () {
            if (this._loaded) {
                try {
                    yield this._afterPageLoad();
                }
                catch (err) {
                    // Will fail if browser is closed
                }
            }
        }));
    }
}
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "open", null);
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "openFile", null);
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "setContent", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "evaluate", null);
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "selectPage", null);
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "overridePermissions", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "url", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date, Object]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "mockDate", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "clearDateMock", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrowserCore.prototype, "addScript", null);
exports.default = BrowserCore;
