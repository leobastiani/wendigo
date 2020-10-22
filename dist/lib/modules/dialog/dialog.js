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
class Dialog {
    constructor(dialog) {
        this._dialog = dialog;
    }
    get text() {
        return this._dialog.message();
    }
    get type() {
        return this._dialog.type();
    }
    get handled() {
        return Boolean(this._dialog._handled);
    }
    dismiss() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.handled)
                return this._dialog.dismiss();
        });
    }
    accept(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.handled)
                return this._dialog.accept(text);
        });
    }
}
exports.default = Dialog;
