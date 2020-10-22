import { WendigoSelector } from '../../types';
declare enum CountCase {
    equal = "equal",
    atLeast = "atLeast",
    atMost = "atMost",
    both = "both"
}
interface CountConfig {
    equal?: number;
    atLeast?: number;
    atMost?: number;
}
export declare function parseCountInput(count: CountConfig | number): CountConfig;
export declare function getCountCase(count: CountConfig): CountCase | null;
export declare function makeAssertion(selector: WendigoSelector, countData: CountConfig, countCase: CountCase, elementsFound: number, msg?: string): Promise<void>;
export {};
