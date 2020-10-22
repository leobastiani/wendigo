import BrowserCore from '../browser_core';
import DomElement from '../../models/dom_element';
import { WendigoSelector } from '../../types';
export default abstract class BrowserQueries extends BrowserCore {
    query(selector: WendigoSelector, optionalSelector?: string): Promise<DomElement | null>;
    queryAll(selector: WendigoSelector, optionalSelector?: string): Promise<Array<DomElement>>;
    findByText(text: string | DomElement, optionalText?: string): Promise<Array<DomElement>>;
    findByLabelText(text: string): Promise<Array<DomElement>>;
    findByTextContaining(text: string | DomElement, optionalText?: string): Promise<Array<DomElement>>;
    findByAttribute(attributeName: string, attributeValue?: string): Promise<Array<DomElement>>;
    findCssPath(domElement: DomElement): Promise<string>;
    findXPath(domElement: DomElement): Promise<string>;
    elementFromPoint(x: number, y: number): Promise<DomElement | null>;
}
