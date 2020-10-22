"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function WendigoUtilsLoader() {
    if (!window.WendigoUtils) {
        const _origDate = Date;
        window.WendigoUtils = {
            isVisible(element) {
                if (!element)
                    return false;
                if (element === document)
                    return true; // Top element, always visible
                else {
                    const style = window.getComputedStyle(element);
                    if (style.display === 'none' ||
                        style.visibility === 'hidden' ||
                        style.opacity === '0')
                        return false;
                    return this.isVisible(element.parentNode);
                }
            },
            queryElement(selector) {
                return WendigoQuery.query(selector);
            },
            queryAll(selector) {
                return WendigoQuery.queryAll(selector);
            },
            xPathQuery(xPath) {
                return WendigoQuery.queryXPathAll(xPath);
            },
            getStyles(element) {
                const rawStyles = getComputedStyle(element);
                const result = {};
                for (let i = 0; i < rawStyles.length; i++) {
                    const name = rawStyles[i];
                    result[name] = rawStyles.getPropertyValue(name);
                }
                return result;
            },
            mockDate(timestamp, freeze) {
                let baseTimestamp = 0;
                if (!freeze) {
                    baseTimestamp = new _origDate().getTime();
                }
                function getCurrentTimestamp() {
                    if (!freeze) {
                        const currentTimestamp = new _origDate().getTime();
                        const timeDiff = currentTimestamp - baseTimestamp;
                        return timestamp + timeDiff;
                    }
                    else
                        return timestamp;
                }
                // Based on https://github.com/capaj/proxy-date
                window.Date = new Proxy(_origDate, {
                    construct(target, args) {
                        if (args.length === 0) {
                            return new target(getCurrentTimestamp());
                        }
                        // @ts-ignore
                        return new target(...args);
                    },
                    get(_target, prop) {
                        if (prop === 'now') {
                            return () => getCurrentTimestamp();
                        }
                        // @ts-ignore
                        return Reflect.get(...arguments);
                    },
                    apply(target) {
                        return new target(getCurrentTimestamp()).toString();
                    }
                });
            },
            clearDateMock() {
                window.Date = _origDate;
            },
            findCssPath(node) {
                return WendigoPathFinder.cssPath(node);
            },
            findXPath(node) {
                return WendigoPathFinder.xPath(node);
            },
        };
    }
}
exports.default = WendigoUtilsLoader;
