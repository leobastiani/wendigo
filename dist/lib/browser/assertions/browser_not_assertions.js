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
const utils_1 = require("../../utils/utils");
const assert_utils_1 = require("../../utils/assert_utils");
const errors_1 = require("../../models/errors");
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class BrowserNotAssertions {
    constructor(assertions, browser) {
        this._assertions = assertions;
        this._browser = browser;
    }
    exists(selector, msg) {
        if (!msg)
            msg = `Expected element "${selector}" to not exists.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.exists(selector, "x");
        }, "assert.not.exists", msg);
    }
    visible(selector, msg) {
        if (!msg)
            msg = `Expected element "${selector}" to not be visible.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.visible(selector, "x");
        }, "assert.not.visible", msg);
    }
    tag(selector, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" to not have "${expected}" tag.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.tag(selector, expected, "x");
        }, "assert.not.tag", msg);
    }
    text(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!expected && expected !== "") || (Array.isArray(expected) && expected.length === 0)) {
                throw new errors_1.WendigoError("assert.not.text", `Missing expected text for assertion.`);
            }
            const processedExpected = utils_1.arrayfy(expected);
            const texts = yield this._browser.text(selector);
            for (const expectedText of processedExpected) {
                if (utils_1.matchTextList(texts, expectedText)) {
                    if (!msg)
                        msg = `Expected element "${selector}" not to have text "${expectedText}".`;
                    throw new errors_1.AssertionError("assert.not.text", msg);
                }
            }
        });
    }
    textContains(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!expected && expected !== "") || (Array.isArray(expected) && expected.length === 0)) {
                throw new errors_1.WendigoError("assert.not.textContains", `Missing expected text for assertion.`);
            }
            const processedExpected = utils_1.arrayfy(expected);
            const texts = yield this._browser.text(selector);
            for (const expectedText of processedExpected) {
                if (utils_1.matchTextContainingList(texts, expectedText)) {
                    if (!msg) {
                        msg = `Expected element "${selector}" to not contain text "${expectedText}".`;
                    }
                    throw new errors_1.AssertionError("assert.not.textContains", msg);
                }
            }
        });
    }
    title(expected, msg) {
        if (!msg)
            msg = `Expected page title not to be "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.title(expected, "x");
        }, "assert.not.title", msg);
    }
    class(selector, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to contain class "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.class(selector, expected, "x");
        }, "assert.not.class", msg);
    }
    url(expected, msg) {
        if (!msg)
            msg = `Expected url not to be "${expected}"`;
        return assert_utils_1.invertify(() => {
            return this._assertions.url(expected, "x");
        }, "assert.not.url", msg);
    }
    value(selector, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to have value "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.value(selector, expected, "x");
        }, "assert.not.value", msg);
    }
    attribute(selector, attribute, expectedValue, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const customMessage = Boolean(msg);
            if (!customMessage) {
                msg = `Expected element "${selector}" not to have attribute "${attribute}"`;
                if (expectedValue)
                    msg = `${msg} with value "${expectedValue}"`;
            }
            const elementFound = yield this._browser.query(selector);
            if (elementFound === null) {
                if (!customMessage) {
                    msg = `${msg}, no element found.`;
                }
                throw new errors_1.AssertionError("assert.not.attribute", msg);
            }
            if (!customMessage)
                msg = `${msg}.`;
            return assert_utils_1.invertify(() => {
                return this._assertions.attribute(selector, attribute, expectedValue, "x");
            }, "assert.not.attribute", msg);
        });
    }
    style(selector, style, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to have style "${style}" with value "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.style(selector, style, expected, "x");
        }, "assert.not.style", msg);
    }
    href(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.attribute(selector, "href", expected, msg);
        });
    }
    innerHtml(selector, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to have inner html "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.innerHtml(selector, expected, "x");
        }, "assert.not.innerHtml", msg);
    }
    elementHtml(selector, expected, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to have html "${expected}".`;
        return assert_utils_1.invertify(() => {
            return this._assertions.elementHtml(selector, expected, "x");
        }, "assert.not.elementHtml", msg);
    }
    selectedOptions(selector, expected, msg) {
        if (!msg) {
            const parsedExpected = utils_1.arrayfy(expected);
            const expectedText = parsedExpected.join(", ");
            msg = `Expected element "${selector}" not to have options "${expectedText}" selected.`;
        }
        return assert_utils_1.invertify(() => {
            return this._assertions.selectedOptions(selector, expected, "x");
        }, "assert.not.selectedOptions", msg);
    }
    global(key, expected, msg) {
        if (!msg) {
            if (expected === undefined)
                msg = `Expected "${key}" not to be defined as global variable.`;
            else
                msg = `Expected "${key}" not to be defined as global variable with value "${expected}".`;
        }
        return assert_utils_1.invertify(() => {
            return this._assertions.global(key, expected, "x");
        }, "assert.not.global", msg);
    }
    checked(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            try {
                value = yield this._browser.checked(selector);
            }
            catch (err) {
                throw new errors_1.QueryError("assert.not.checked", `Element "${selector}" not found.`);
            }
            if (value !== false) {
                if (!msg)
                    msg = `Expected element "${selector}" to not be checked.`;
                throw new errors_1.AssertionError("assert.not.checked", msg, value, false);
            }
        });
    }
    disabled(selector, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to be disabled.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.disabled(selector, "x");
        }, "assert.not.disabled", msg);
    }
    enabled(selector, msg) {
        if (!msg)
            msg = `Expected element "${selector}" not to be enabled.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.enabled(selector, "x");
        }, "assert.not.enabled", msg);
    }
    focus(selector, msg) {
        if (!msg)
            msg = `Expected element "${selector}" to be unfocused.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.focus(selector, "x");
        }, "assert.not.focus", msg);
    }
    redirect(msg) {
        if (!msg)
            msg = `Expected current url not to be a redirection.`;
        return assert_utils_1.invertify(() => {
            return this._assertions.redirect("x");
        }, "assert.not.redirect", msg);
    }
    element(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg)
                msg = `Expected selector "${selector}" not to find any elements.`;
            yield this._assertions.elements(selector, 0, msg);
        });
    }
}
__decorate([
    override_error_1.default("assert.not"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BrowserNotAssertions.prototype, "href", null);
__decorate([
    override_error_1.default("assert.not"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserNotAssertions.prototype, "element", null);
exports.default = BrowserNotAssertions;
