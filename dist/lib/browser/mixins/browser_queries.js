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
const browser_core_1 = __importDefault(require("../browser_core"));
const dom_element_1 = __importDefault(require("../../models/dom_element"));
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class BrowserQueries extends browser_core_1.default {
    query(selector, optionalSelector) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (typeof selector === 'string') {
                let elementHandle;
                if (utils_1.isXPathQuery(selector)) {
                    const results = yield this._page.$x(selector);
                    elementHandle = results[0] || null;
                }
                else
                    elementHandle = yield this._page.$(selector);
                result = dom_element_1.default.processQueryResult(elementHandle, selector);
            }
            else if (selector instanceof dom_element_1.default)
                result = selector;
            else
                throw new errors_1.WendigoError("query", "Invalid selector.");
            if (!optionalSelector)
                return result;
            else {
                if (!result)
                    return null;
                else
                    return result.query(optionalSelector);
            }
        });
    }
    queryAll(selector, optionalSelector) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (typeof selector === 'string') {
                let rawElements;
                if (utils_1.isXPathQuery(selector))
                    rawElements = yield this._page.$x(selector);
                else
                    rawElements = yield this._page.$$(selector);
                result = rawElements.map((e) => {
                    return dom_element_1.default.processQueryResult(e, selector);
                }).filter(b => Boolean(b));
            }
            else if (selector instanceof dom_element_1.default)
                result = [selector];
            else
                throw new errors_1.WendigoError("queryAll", "Invalid selector.");
            if (!optionalSelector)
                return result;
            else {
                const subQueryPromises = result.map((r) => {
                    return r.queryAll(optionalSelector);
                });
                const nestedResults = yield Promise.all(subQueryPromises);
                return nestedResults.reduce((acc, res) => {
                    return acc.concat(res);
                }, []);
            }
        });
    }
    findByText(text, optionalText) {
        return __awaiter(this, void 0, void 0, function* () {
            const xPathText = optionalText || text;
            const xPath = utils_1.createFindTextXPath(xPathText);
            if (optionalText) {
                return yield this.queryAll(text, xPath);
            }
            else {
                return this.queryAll(xPath);
            }
        });
    }
    findByLabelText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const xPath = utils_1.createFindTextXPath(text, false, "label");
            const labels = yield this.queryAll(xPath);
            const forAttributes = yield Promise.all(labels.map(e => e.getAttribute("for")));
            const elements = yield Promise.all(utils_1.filterTruthy(forAttributes).map((id) => this.query(`#${id}`)));
            return utils_1.filterTruthy(elements);
        });
    }
    findByTextContaining(text, optionalText) {
        return __awaiter(this, void 0, void 0, function* () {
            const xPathText = optionalText || text;
            const xPath = utils_1.createFindTextXPath(xPathText, true);
            if (optionalText) {
                return yield this.queryAll(text, xPath);
            }
            else {
                const result = this.queryAll(xPath);
                return result;
            }
        });
    }
    findByAttribute(attributeName, attributeValue) {
        if (attributeValue === undefined) {
            attributeValue = "";
        }
        else {
            attributeValue = `='${attributeValue}'`;
        }
        return this.queryAll(`[${attributeName}${attributeValue}]`);
    }
    findCssPath(domElement) {
        if (!(domElement instanceof dom_element_1.default))
            return Promise.reject(new errors_1.WendigoError("findCssPath", "Invalid element for css path query."));
        else
            return this.evaluate((e) => {
                return WendigoUtils.findCssPath(e);
            }, domElement);
    }
    findXPath(domElement) {
        if (!(domElement instanceof dom_element_1.default))
            return Promise.reject(new errors_1.WendigoError("findXPath", "Invalid element for xPath query."));
        else
            return this.evaluate((e) => {
                return WendigoUtils.findXPath(e);
            }, domElement);
    }
    elementFromPoint(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number')
            return Promise.reject(new errors_1.FatalError("elementFromPoint", `Invalid coordinates [${x},${y}].`));
        return this.evaluate((evalX, evalY) => {
            const element = document.elementFromPoint(evalX, evalY);
            return element;
        }, x, y);
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "query", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "queryAll", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findByText", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findByLabelText", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findByTextContaining", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findByAttribute", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dom_element_1.default]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findCssPath", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dom_element_1.default]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "findXPath", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BrowserQueries.prototype, "elementFromPoint", null);
exports.default = BrowserQueries;
