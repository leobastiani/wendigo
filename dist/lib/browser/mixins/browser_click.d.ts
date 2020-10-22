import BrowserActions from './browser_actions';
import DomElement from '../../models/dom_element';
import { WendigoSelector } from '../../types';
export default abstract class BrowserClick extends BrowserActions {
    click(selector: WendigoSelector | number | Array<DomElement>, index?: number): Promise<number>;
    clickText(text: string | DomElement, optionalText?: string | number, index?: number): Promise<number>;
    clickTextContaining(text: string | DomElement, optionalText?: string | number, index?: number): Promise<number>;
    private _clickElements;
    private _validateAndClickElementByIndex;
    private _validateAnd_clickElements;
    private _clickCoordinates;
}
