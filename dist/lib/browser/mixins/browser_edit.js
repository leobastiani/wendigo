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
const browser_info_1 = __importDefault(require("./browser_info"));
const errors_1 = require("../../models/errors");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
// Mixin with methods to edit the DOM and state
class BrowserEdit extends browser_info_1.default {
    addClass(selector, className) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawClasses = yield this.attribute(selector, "class");
            yield this.setAttribute(selector, "class", `${rawClasses} ${className}`);
        });
    }
    removeClass(selector, className) {
        return __awaiter(this, void 0, void 0, function* () {
            const classList = yield this.class(selector);
            const finalClassList = classList.filter((cl) => {
                return cl !== className;
            });
            yield this.setAttribute(selector, "class", finalClassList.join(" "));
        });
    }
    setAttribute(selector, attribute, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.evaluate((q, attr, val) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        throw new Error();
                    if (val === null)
                        element.removeAttribute(attr);
                    else
                        element.setAttribute(attr, val);
                }, selector, attribute, value);
            }
            catch (err) {
                throw new errors_1.QueryError("setAttribute", `Element "${selector}" not found.`);
            }
        });
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserEdit.prototype, "addClass", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BrowserEdit.prototype, "removeClass", null);
__decorate([
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BrowserEdit.prototype, "setAttribute", null);
exports.default = BrowserEdit;
