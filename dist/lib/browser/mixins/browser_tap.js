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
const browser_wait_1 = __importDefault(require("./browser_wait"));
const errors_1 = require("../../models/errors");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class BrowserTap extends browser_wait_1.default {
    tap(selector, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof selector === 'number') {
                if (typeof index !== 'number')
                    throw new errors_1.WendigoError("tap", "Invalid coordinates");
                return this._tapCoordinates(selector, index);
            }
            return this.queryAll(selector).then((elements) => {
                const indexErrorMsg = `invalid index "${index}" for selector "${selector}", ${elements.length} elements found.`;
                const notFoundMsg = `No element "${selector}" found.`;
                return this._tapElements(elements, index, new errors_1.WendigoError("tap", indexErrorMsg), new errors_1.QueryError("tap", notFoundMsg));
            });
        });
    }
    _tapElements(elements, index, indexError, notFoundError) {
        if (index !== undefined) {
            return this._validateAndTapElementByIndex(elements, index, indexError);
        }
        else {
            return this._validateAndTapElements(elements, notFoundError);
        }
    }
    _validateAndTapElementByIndex(elements, index, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index > elements.length || index < 0 || !elements[index]) {
                throw error;
            }
            yield elements[index].tap();
            return 1;
        });
    }
    _validateAndTapElements(elements, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (elements.length <= 0 || !elements[0]) {
                return Promise.reject(error);
            }
            for (const e of elements) {
                yield e.tap();
            }
            return elements.length;
        });
    }
    _tapCoordinates(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._page.touchscreen.tap(x, y);
            return 1;
        });
    }
    waitAndTap(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitFor(selector, timeout);
            return yield this.tap(selector);
        });
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserTap.prototype, "tap", null);
__decorate([
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BrowserTap.prototype, "waitAndTap", null);
exports.default = BrowserTap;
