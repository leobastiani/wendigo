import WendigoModule from '../wendigo_module';
import { HttpAuthCredentials } from './types';
export default class BrowserAuth extends WendigoModule {
    http(credentials?: HttpAuthCredentials): Promise<void>;
    bearer(token?: string): Promise<void>;
    clear(): Promise<void>;
    private _setAuthorizationHeader;
}
