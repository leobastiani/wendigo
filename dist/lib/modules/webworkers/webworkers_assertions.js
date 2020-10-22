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
const errors_1 = require("../../models/errors");
function default_1(webworkerModule, options, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options)
            options = {};
        let workers = webworkerModule.all();
        let urlMsg = "";
        if (options.url) {
            urlMsg = ` with url "${options.url}"`;
        }
        workers = filterByUrl(workers, options);
        if (options.count !== undefined && options.count !== null) {
            if (workers.length !== options.count) {
                if (!msg)
                    msg = `Expected ${options.count} webworkers running${urlMsg}, ${workers.length} found.`;
                throw new errors_1.AssertionError("assert.webworkers", msg);
            }
        }
        else if (workers.length === 0) {
            if (!msg)
                msg = `Expected at least 1 webworker running${urlMsg}, 0 found.`;
            throw new errors_1.AssertionError("assert.webworkers", msg);
        }
    });
}
exports.default = default_1;
function filterByUrl(workers, options) {
    if (options.url) {
        return workers.filter((w) => {
            return w.url === options.url;
        });
    }
    else
        return workers;
}
