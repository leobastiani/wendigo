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
exports.stringifyLogText = void 0;
function stringifyLogText(log) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = log.text();
        if (text.includes('JSHandle@object')) {
            const args = yield Promise.all(log.args().map(stringifyLogArg));
            return args.join(' ');
        }
        return text;
    });
}
exports.stringifyLogText = stringifyLogText;
function stringifyLogArg(arg) {
    return arg.executionContext().evaluate(element => {
        if (typeof element === 'object' && !(element instanceof RegExp)) {
            try {
                element = JSON.stringify(element);
            }
            catch (err) {
                if (err instanceof TypeError) { // Converting circular structure
                }
                else
                    throw err;
            }
        }
        return String(element);
    }, arg);
}
