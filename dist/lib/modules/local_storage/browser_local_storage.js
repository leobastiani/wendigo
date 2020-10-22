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
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class BrowserLocalStorage extends wendigo_module_1.default {
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._browser.evaluate((k) => {
                return localStorage.getItem(k);
            }, key);
        });
    }
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._browser.evaluate((k, v) => {
                return localStorage.setItem(k, v);
            }, key, value);
        });
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._browser.evaluate((k) => {
                return localStorage.removeItem(k);
            }, key);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._browser.evaluate(() => {
                return localStorage.clear();
            });
        });
    }
    length() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._browser.evaluate(() => {
                return localStorage.length;
            });
            return result;
        });
    }
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._browser.evaluate(() => {
                return Object.keys(localStorage).reduce((acc, k) => {
                    acc[k] = localStorage.getItem(k);
                    return acc;
                }, {});
            });
            return result;
        });
    }
}
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "getItem", null);
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "setItem", null);
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "removeItem", null);
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "clear", null);
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "length", null);
__decorate([
    override_error_1.default("localStorage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowserLocalStorage.prototype, "all", null);
exports.default = BrowserLocalStorage;
