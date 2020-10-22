import BrowserEvents from './browser_events';
export default abstract class BrowserNavigation extends BrowserEvents {
    back(): Promise<void>;
    forward(): Promise<void>;
    refresh(): Promise<void>;
    waitForPageLoad(): Promise<void>;
}
