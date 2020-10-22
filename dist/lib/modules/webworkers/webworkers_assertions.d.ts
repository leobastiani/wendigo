import BrowserWebWorker from './browser_webworker';
interface WebWorkersOptions {
    url?: string;
    count?: number;
}
export default function (webworkerModule: BrowserWebWorker, options?: WebWorkersOptions, msg?: string): Promise<void>;
export {};
