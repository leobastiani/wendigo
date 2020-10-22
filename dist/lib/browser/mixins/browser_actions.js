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
const browser_queries_1 = __importDefault(require("./browser_queries"));
const utils_1 = require("../../utils/utils");
const errors_1 = require("../../models/errors");
const dom_element_1 = __importDefault(require("../../models/dom_element"));
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
// Mixin with user actions
class BrowserActions extends browser_queries_1.default {
    type(selector, text, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof text !== "string")
                return Promise.reject(new errors_1.WendigoError("type", `Invalid text.`));
            const element = yield this.query(selector);
            if (!element)
                throw new errors_1.QueryError("type", `Element "${selector}" not found.`);
            yield element.type(text, options);
        });
    }
    keyPress(key, count = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = utils_1.arrayfy(key);
            try {
                for (let i = 0; i < count; i++) {
                    for (const k of keys) {
                        yield this._page.keyboard.press(k);
                    }
                }
            }
            catch (err) {
                return Promise.reject(new errors_1.WendigoError("keyPress", `Could not press keys "${keys.join(", ")}"`));
            }
        });
    }
    uploadFile(selector, path) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(selector).then(fileInput => {
                if (fileInput) {
                    return fileInput.element.uploadFile(path);
                }
                else {
                    const error = new errors_1.QueryError("uploadFile", `Selector "${selector}" doesn't match any element to upload file.`);
                    return Promise.reject(error);
                }
            });
        });
    }
    select(selector, values) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(values))
                values = [values];
            try {
                let cssPath;
                // Native select only support css selectors
                if (selector instanceof dom_element_1.default || utils_1.isXPathQuery(selector)) {
                    const element = yield this.query(selector);
                    if (!element)
                        throw new Error();
                    cssPath = yield this.findCssPath(element);
                }
                else
                    cssPath = selector;
                return yield this._page.select(cssPath, ...values);
            }
            catch (err) {
                throw new errors_1.QueryError("select", `Element "${selector}" not found.`);
            }
        });
    }
    clearValue(selector) {
        return this.evaluate((q) => {
            const elements = WendigoUtils.queryAll(q);
            for (const element of elements) {
                element.value = "";
            }
        }, selector);
    }
    setValue(selector, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q, v) => {
                    const elements = WendigoUtils.queryAll(q);
                    if (elements.length === 0)
                        return Promise.reject();
                    for (const element of elements) {
                        element.value = v;
                    }
                    return elements.length;
                }, selector, value);
            }
            catch (err) {
                throw new errors_1.QueryError("setValue", `Element "${selector}" not found.`);
            }
        });
    }
    check(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    element.checked = true;
                    return Promise.resolve();
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("check", `Element "${selector}" not found.`);
            }
        });
    }
    uncheck(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    element.checked = false;
                    return Promise.resolve();
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("uncheck", `Element "${selector}" not found.`);
            }
        });
    }
    focus(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.query(selector);
            if (!element)
                throw new errors_1.QueryError("focus", `Element "${selector}" not found.`);
            else {
                yield element.focus();
            }
        });
    }
    hover(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.query(selector);
            if (!element)
                throw new errors_1.QueryError("hover", `Element "${selector}" not found.`);
            yield element.hover();
        });
    }
    scroll(value, xvalue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.evaluate((val, xval) => {
                    if (typeof val === 'number') {
                        if (typeof xval !== 'number')
                            xval = window.scrollX;
                        window.scroll(xval, val);
                    }
                    else {
                        const element = WendigoUtils.queryElement(val);
                        if (!element)
                            throw new Error();
                        element.scrollIntoView();
                    }
                }, value, xvalue);
            }
            catch (err) {
                return Promise.reject(new errors_1.QueryError("scroll", `Selector "${value}" doesn't match any element to scroll.`));
            }
        });
    }
    screenshot(args) {
        return this._page.screenshot(args);
    }
    screenshotOfElement(selector, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const element = yield this.query(selector);
            if (!element)
                throw new errors_1.QueryError("screenshotOfElement", `Selector "${selector}" not found.`);
            return element.element.screenshot(options);
        });
    }
    blur(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        throw new Error();
                    element.blur();
                }, selector);
                return result;
            }
            catch (err) {
                throw new errors_1.QueryError("blur", `Element "${selector}" not found.`);
            }
        });
    }
    dragAndDrop(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.evaluate((q1, q2) => {
                    // Based on https://stackoverflow.com/questions/49772472/how-to-simulate-a-drag-and-drop-action-in-puppeteer
                    const source = WendigoUtils.queryElement(q1);
                    const target = WendigoUtils.queryElement(q2);
                    if (!source || !target)
                        throw new Error();
                    let event = document.createEvent("CustomEvent");
                    event.initCustomEvent("mousedown", true, true, null);
                    event.clientX = source.getBoundingClientRect().top;
                    event.clientY = source.getBoundingClientRect().left;
                    source.dispatchEvent(event);
                    event = document.createEvent("CustomEvent");
                    event.initCustomEvent("dragstart", true, true, null);
                    event.clientX = source.getBoundingClientRect().top;
                    event.clientY = source.getBoundingClientRect().left;
                    source.dispatchEvent(event);
                    event = document.createEvent("CustomEvent");
                    event.initCustomEvent("drag", true, true, null);
                    event.clientX = source.getBoundingClientRect().top;
                    event.clientY = source.getBoundingClientRect().left;
                    source.dispatchEvent(event);
                    event = document.createEvent("CustomEvent");
                    event.initCustomEvent("dragover", true, true, null);
                    event.clientX = target.getBoundingClientRect().top;
                    event.clientY = target.getBoundingClientRect().left;
                    target.dispatchEvent(event);
                    event = document.createEvent("CustomEvent");
                    event.initCustomEvent("drop", true, true, null);
                    event.clientX = target.getBoundingClientRect().top;
                    event.clientY = target.getBoundingClientRect().left;
                    target.dispatchEvent(event);
                    event = document.createEvent("CustomEvent");
                    event.initCustomEvent("dragend", true, true, null);
                    event.clientX = target.getBoundingClientRect().top;
                    event.clientY = target.getBoundingClientRect().left;
                    target.dispatchEvent(event);
                }, from, to);
            }
            catch (err) {
                throw new errors_1.QueryError("dragAndDrop", `Element not found.`);
            }
        });
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "type", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "keyPress", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "uploadFile", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "select", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "clearValue", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "setValue", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "check", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "uncheck", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "focus", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "hover", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "scroll", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "screenshot", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "screenshotOfElement", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "blur", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BrowserActions.prototype, "dragAndDrop", null);
exports.default = BrowserActions;
