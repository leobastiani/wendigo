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
const browser_actions_1 = __importDefault(require("./browser_actions"));
const errors_1 = require("../../models/errors");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class BrowserClick extends browser_actions_1.default {
    click(selector, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof selector === 'number') {
                if (!index || typeof index !== 'number')
                    throw new errors_1.WendigoError("click", `Invalid coordinates [${selector}, ${index}]`);
                yield this._clickCoordinates(selector, index);
                return 1; // Returns always one click made
            }
            else {
                let elements;
                if (Array.isArray(selector))
                    elements = selector;
                else
                    elements = yield this.queryAll(selector);
                const indexErrorMsg = `Invalid index "${index}" for selector "${selector}", ${elements.length} elements found.`;
                const notFoundMsg = `No element "${selector}" found.`;
                return this._clickElements(elements, index, new errors_1.WendigoError("click", indexErrorMsg), new errors_1.QueryError("click", notFoundMsg));
            }
        });
    }
    clickText(text, optionalText, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof optionalText === 'number') {
                index = optionalText;
                optionalText = undefined;
            }
            let elements;
            elements = yield this.findByText(text, optionalText);
            const indexErrorMsg = `Invalid index "${index}" for text "${optionalText || text}", ${elements.length} elements found.`;
            const notFoundMsg = `No element with text "${optionalText || text}" found.`;
            return this._clickElements(elements, index, new errors_1.WendigoError("clickText", indexErrorMsg), new errors_1.QueryError("clickText", notFoundMsg));
        });
    }
    clickTextContaining(text, optionalText, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof optionalText === 'number') {
                index = optionalText;
                optionalText = undefined;
            }
            let elements;
            elements = yield this.findByTextContaining(text, optionalText);
            const indexErrorMsg = `Invalid index "${index}" for text containing "${optionalText || text}", ${elements.length} elements found.`;
            const notFoundMsg = `No element with text containing "${optionalText || text}" found.`;
            return this._clickElements(elements, index, new errors_1.WendigoError("clickTextContaining", indexErrorMsg), new errors_1.QueryError("clickTextContaining", notFoundMsg));
        });
    }
    _clickElements(elements, index, indexError, notFoundError) {
        if (index !== undefined) {
            return this._validateAndClickElementByIndex(elements, index, indexError);
        }
        else {
            return this._validateAnd_clickElements(elements, notFoundError);
        }
    }
    _validateAndClickElementByIndex(elements, index, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index > elements.length || index < 0 || !elements[index]) {
                throw error;
            }
            yield elements[index].click();
            return 1;
        });
    }
    _validateAnd_clickElements(elements, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (elements.length <= 0 || !elements[0]) {
                throw error;
            }
            for (const e of elements) {
                yield e.click();
            }
            return elements.length;
        });
    }
    _clickCoordinates(x, y) {
        return this._page.mouse.click(x, y);
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserClick.prototype, "click", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserClick.prototype, "clickText", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserClick.prototype, "clickTextContaining", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Error, Error]),
    __metadata("design:returntype", Promise)
], BrowserClick.prototype, "_clickElements", null);
exports.default = BrowserClick;
