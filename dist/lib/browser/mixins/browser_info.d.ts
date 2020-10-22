/// <reference types="node" />
import BrowserClick from './browser_click';
import { WendigoSelector, GeoLocationCoords } from '../../types';
import { PDFOptions } from '../../puppeteer_wrapper/puppeteer_types';
export default abstract class BrowserInfo extends BrowserClick {
    text(selector: WendigoSelector): Promise<Array<string>>;
    title(): Promise<string>;
    html(): string;
    tag(selector: WendigoSelector): Promise<string | null>;
    innerHtml(selector: WendigoSelector): Promise<Array<string>>;
    elementHtml(selector: WendigoSelector): Promise<Array<string>>;
    options(selector: WendigoSelector): Promise<Array<string>>;
    selectedOptions(selector: WendigoSelector): Promise<Array<string>>;
    class(selector: WendigoSelector): Promise<Array<string>>;
    value(selector: WendigoSelector): Promise<string | null>;
    attribute(selector: WendigoSelector, attributeName: string): Promise<string | null>;
    styles(selector: WendigoSelector): Promise<{
        [s: string]: string;
    }>;
    style(selector: WendigoSelector, styleName: string): Promise<string>;
    checked(selector: WendigoSelector): Promise<boolean | undefined>;
    geolocation(): Promise<GeoLocationCoords>;
    pdf(options?: PDFOptions | string): Promise<Buffer>;
}
