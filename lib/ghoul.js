"use strict";

const phantom = require('phantom');
const Browser = require('./browser');

module.exports = class Ghoul {

    static async createBrowser() {
        await this._setInstance();
        const page = await this.instance.createPage();
        return new Browser(page);
    }

    static async stop() {
        this.instance.exit();
        this.instance = null;
    }

    static async _setInstance() {
        if(!this.instance) this.instance = await phantom.create();
    }

};