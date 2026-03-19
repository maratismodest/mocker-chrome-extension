import {atomWithStorage} from "jotai/utils";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const methodAtom = atomWithStorage<HttpMethod>('method', 'GET');
export const endpointAtom = atomWithStorage<string>('endpoint', '');
export const responseAtom = atomWithStorage<string>('response', '');