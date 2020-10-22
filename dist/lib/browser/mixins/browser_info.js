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
const browser_click_1 = __importDefault(require("./browser_click"));
const errors_1 = require("../../models/errors");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
class BrowserInfo extends browser_click_1.default {
    text(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.evaluate((q) => {
                const elements = WendigoUtils.queryAll(q);
                const result = [];
                for (const e of elements) {
                    result.push(e.textContent);
                }
                return result;
            }, selector);
        });
    }
    title() {
        return this._page.title();
    }
    html() {
        return this._originalHtml || "";
    }
    tag(selector) {
        return this.evaluate((q) => {
            const element = WendigoUtils.queryElement(q);
            if (!element)
                return null;
            else
                return element.tagName.toLowerCase();
        }, selector);
    }
    innerHtml(selector) {
        return this.evaluate((q) => {
            const elements = WendigoUtils.queryAll(q);
            return elements.map(e => e.innerHTML);
        }, selector);
    }
    elementHtml(selector) {
        return this.evaluate((q) => {
            const elements = WendigoUtils.queryAll(q);
            return elements.map(e => e.outerHTML);
        }, selector);
    }
    options(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    const options = element.options || [];
                    const result = [];
                    for (let i = 0; i < options.length; i++) {
                        result.push(options[i].value);
                    }
                    return result;
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("options", `Element "${selector}" not found.`);
            }
        });
    }
    selectedOptions(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.evaluate((q) => {
                    const elements = WendigoUtils.queryElement(q);
                    return Array.from(elements.options).filter((option) => {
                        return option.selected;
                    }).map((option) => {
                        return option.value || option.text;
                    });
                }, selector);
                return result;
            }
            catch (err) {
                throw new errors_1.QueryError("selectedOptions", `Element "${selector}" not found.`);
            }
        });
    }
    class(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        throw new Error();
                    else
                        return Array.from(element.classList);
                }, selector);
                return result;
            }
            catch (err) {
                throw new errors_1.QueryError("class", `Selector "${selector}" doesn't match any elements.`);
            }
        });
    }
    value(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    else if (element.value === undefined)
                        return null;
                    else
                        return element.value;
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("value", `Element "${selector}" not found.`);
            }
        });
    }
    attribute(selector, attributeName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q, attr) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    return element.getAttribute(attr);
                }, selector, attributeName);
            }
            catch (err) {
                throw new errors_1.QueryError("attribute", `Element "${selector}" not found.`);
            }
        });
    }
    styles(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    return WendigoUtils.getStyles(element);
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("styles", `Element "${selector}" not found.`);
            }
        });
    }
    style(selector, styleName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.styles(selector).then((styles) => {
                    return styles[styleName];
                });
            }
            catch (err) {
                throw new errors_1.QueryError("style", `Element "${selector}" not found.`);
            }
        });
    }
    checked(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.evaluate((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return Promise.reject();
                    return element.checked;
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("checked", `Element "${selector}" not found.`);
            }
        });
    }
    geolocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.evaluate(() => {
                return new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition((res) => {
                        resolve({
                            accuracy: res.coords.accuracy,
                            altitude: res.coords.altitude,
                            altitudeAccuracy: res.coords.altitudeAccuracy,
                            heading: res.coords.heading,
                            latitude: res.coords.latitude,
                            longitude: res.coords.longitude,
                            speed: res.coords.speed,
                        });
                    });
                });
            });
            return location;
        });
    }
    pdf(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof options === 'string') {
                options = {
                    path: options
                };
            }
            return this._page.pdf(options);
        });
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "text", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "title", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], BrowserInfo.prototype, "html", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "tag", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "innerHtml", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "elementHtml", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "options", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "selectedOptions", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "class", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "value", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "attribute", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "styles", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "style", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "checked", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "geolocation", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrowserInfo.prototype, "pdf", null);
exports.default = BrowserInfo;
