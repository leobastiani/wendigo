import BrowserWait from './browser_wait';
import { WendigoSelector } from '../../types';
export default abstract class BrowserTap extends BrowserWait {
    tap(selector: WendigoSelector | number, index?: number): Promise<number>;
    private _tapElements;
    private _validateAndTapElementByIndex;
    private _validateAndTapElements;
    private _tapCoordinates;
    waitAndTap(selector: string, timeout?: number): Promise<number>;
}
