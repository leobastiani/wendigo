/* global WendigoUtils */
"use strict";

const path = require('path');
const BrowserAssertions = require('../assertions/browser_assertions');
const BrowserBase = require('./browser_base');

module.exports = class Browser extends BrowserBase {
    constructor(page, settings) {
        super(page, settings);
        this.assert = new BrowserAssertions(this);
    }

    open(url) {
        return this.page.goto(url).then(() => {
            return this.page.content().then((content) => {
                this._originalHtml = content;
                return this.page.addScriptTag({path: path.join(__dirname, "../..", "injection_scripts/wendigo_utils.js")});
            });
        });
    }

    close() {
        return this.page.close();
    }

    text(selector) {
        return this.page.evaluate((q) => {
            const elements = WendigoUtils.queryAll(q);
            const result = [];
            for(let i = 0;i < elements.length;i++) {
                result.push(elements[i].textContent);
            }
            return result;
        }, selector);
    }

    click(selector, index) {
        return this.queryAll(selector).then((elements) => {
            if(index !== undefined) {
                if(index > elements.length || index < 0) {
                    return Promise.reject(new Error(`browser.click, invalid index "${index}" for selector "${selector}", ${elements.length} elements found.`));
                }
                elements[index].click();
                return 1;
            } else{
                if(elements.length <= 0) return Promise.reject(new Error(`No element "${selector}" found when trying to click.`));
                return Promise.all(elements.map((e) => e.click())).then(() => {
                    return elements.length;
                });
            }
        });
    }

    clickText(text) {
        return this.findByText(text).then((elements) => {
            if(elements.length <= 0) return Promise.reject(new Error(`No element with text "${text}" found when trying to click.`));
            return this.click(elements);
        });
    }

    title() {
        return this.page.title();
    }

    html() {
        return this._originalHtml;
    }

    url() {
        return this.page.evaluate(() => window.location.href).then((url) => {
            if(url === "about:blank") url = null;
            return url;
        });
    }

    wait(ms = 250) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }

    waitFor(selector, timeout = 500) {
        return this.page.waitForSelector(selector, {timeout: timeout, visible: true}).catch(() => {
            return Promise.reject(new Error(`Waiting for element "${selector}" failed, timeout of ${timeout}ms exceeded`));
        });
    }

    waitUntilNotVisible(selector, timeout = 500) {
        return this.page.waitForFunction((selector) => {
            const element = WendigoUtils.queryElement(selector);
            return !WendigoUtils.isVisible(element);
        }, {timeout: timeout}, selector).catch(() => {
            return Promise.reject(new Error(`Waiting for element "${selector}" not to be visible, timeout of ${timeout}ms exceeded`));
        });
    }

    findByText(text) {
        const xPath = `//*[text()='${text}']`;
        return this.queryXPath(xPath);
    }

    findByTextContaining(text) {
        const xPath = `//*[contains(text(),'${text}')]`;
        return this.queryXPath(xPath);
    }

    type(selector, text) {
        if(typeof selector === "string") {
            return this.page.type(selector, text);
        }else {
            return selector.type(text);
        }
    }

    clearValue(selector) {
        return this.page.evaluate((q) => {
            const elements = WendigoUtils.queryAll(q);
            for(const element of elements) {
                element.value = "";
            }
        }, selector);
    }
};