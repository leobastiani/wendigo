import { Worker } from '../../puppeteer_wrapper/puppeteer_types';
export default class WebWoker {
    readonly worker: Worker;
    constructor(ww: Worker);
    get url(): string;
}
