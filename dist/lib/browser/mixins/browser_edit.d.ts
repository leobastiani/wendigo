import BrowserInfo from './browser_info';
import { WendigoSelector } from '../../types';
export default abstract class BrowserEdit extends BrowserInfo {
    addClass(selector: WendigoSelector, className: string): Promise<void>;
    removeClass(selector: WendigoSelector, className: string): Promise<void>;
    setAttribute(selector: WendigoSelector, attribute: string, value: string): Promise<void>;
}
