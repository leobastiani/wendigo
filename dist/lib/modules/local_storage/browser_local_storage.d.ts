import WendigoModule from '../wendigo_module';
export default class BrowserLocalStorage extends WendigoModule {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    length(): Promise<number>;
    all(): Promise<{
        [k: string]: string;
    }>;
}
