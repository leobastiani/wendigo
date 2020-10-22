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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_1 = __importDefault(require("./dialog"));
const errors_1 = require("../../models/errors");
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
const defaultOptions = {
    dismissAllDialogs: false
};
class BrowserDialog extends wendigo_module_1.default {
    constructor(browser) {
        super(browser);
        this._dialogs = [];
        this._options = Object.assign({}, defaultOptions);
        browser.page.on("dialog", (rawDialog) => {
            const newDialog = new dialog_1.default(rawDialog);
            this._dialogs.push(newDialog);
            if (this._onDialogCB) {
                this._onDialogCB(newDialog);
                this._onDialogCB = undefined;
                this._lastDialog = undefined;
            }
            else {
                this._lastDialog = newDialog;
            }
            if (this._options.dismissAllDialogs)
                newDialog.dismiss();
        });
    }
    all() {
        return this._dialogs;
    }
    clear() {
        this._dialogs = [];
        this._lastDialog = undefined;
    }
    waitForDialog(timeout = 500) {
        if (this._lastDialog) {
            const result = Promise.resolve(this._lastDialog);
            this._lastDialog = undefined;
            return result;
        }
        else {
            return new Promise((resolve, reject) => {
                const tid = setTimeout(() => {
                    if (this._onDialogCB) {
                        this._onDialogCB = undefined;
                        reject(new errors_1.TimeoutError("dialog.waitForDialog", "", timeout));
                    }
                }, timeout);
                this._onDialogCB = (dialog) => {
                    clearTimeout(tid);
                    resolve(dialog);
                };
            });
        }
    }
    dismissLast() {
        if (this._dialogs.length === 0)
            return Promise.resolve();
        return this._dialogs[this._dialogs.length - 1].dismiss();
    }
    _beforeOpen(options) {
        const _super = Object.create(null, {
            _beforeOpen: { get: () => super._beforeOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super._beforeOpen.call(this, options);
            this.clear();
            this._options = Object.assign({}, defaultOptions);
            if (options.dismissAllDialogs)
                this._options.dismissAllDialogs = true;
        });
    }
}
exports.default = BrowserDialog;
