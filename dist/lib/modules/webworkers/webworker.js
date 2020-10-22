"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebWoker {
    constructor(ww) {
        this.worker = ww;
    }
    get url() {
        return this.worker.url();
    }
}
exports.default = WebWoker;
