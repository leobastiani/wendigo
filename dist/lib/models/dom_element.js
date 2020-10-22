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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
class DomElement {
    constructor(elementHandle, name) {
        this.element = elementHandle;
        this.name = name;
    }
    query(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            let elementHandle;
            if (utils_1.isXPathQuery(selector)) {
                selector = this._processXPath(selector);
                const results = yield this.element.$x(selector);
                elementHandle = results[0] || null;
            }
            else
                elementHandle = yield this.element.$(selector);
            return DomElement.processQueryResult(elementHandle, selector);
        });
    }
    queryAll(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            let elements;
            if (utils_1.isXPathQuery(selector)) {
                selector = this._processXPath(selector);
                elements = yield this.element.$x(selector);
            }
            else
                elements = yield this.element.$$(selector);
            return elements.map((e) => {
                return DomElement.processQueryResult(e, selector);
            }).filter(b => Boolean(b));
        });
    }
    click() {
        return this.element.click();
    }
    tap() {
        return this.element.tap();
    }
    focus() {
        return this.element.focus();
    }
    hover() {
        return this.element.hover();
    }
    type(text, options) {
        return this.element.type(text, options);
    }
    getAttribute(attr) {
        return this.element.evaluate((e, attributeKey) => {
            return e.getAttribute(attributeKey);
        }, attr);
    }
    toString() {
        if (this.name)
            return this.name;
        else
            return `DomElement`;
    }
    static processQueryResult(element, name) {
        if (!element)
            return null;
        const elementHandle = element.asElement();
        if (elementHandle)
            return new DomElement(elementHandle, name);
        else
            return null;
    }
    _processXPath(selector) {
        if (selector[0] === '/')
            selector = `.${selector}`;
        return selector;
    }
}
exports.default = DomElement;
