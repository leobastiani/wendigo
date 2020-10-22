import BrowserEdit from './browser_edit';
import { WendigoSelector } from '../../types';
export default abstract class BrowserEvents extends BrowserEdit {
    triggerEvent(selector: WendigoSelector, eventName: string, options: EventInit): Promise<void>;
}
