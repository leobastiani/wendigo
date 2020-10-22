"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    constructor(consoleMessage, text) {
        this.message = consoleMessage;
        this.text = text || consoleMessage.text();
    }
    get type() {
        return this.message.type();
    }
}
exports.default = Log;
