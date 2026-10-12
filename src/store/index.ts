import {atomWithStorage} from "jotai/utils";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const methodAtom = atomWithStorage<HttpMethod>('method', 'GET');
export const endpointAtom = atomWithStorage<string>('endpoint', '');
export const responseAtom = atomWithStorage<string>('response', '');
// Storage key of the mock loaded into the form with "Edit", so saving under a new
// method or path moves the mock instead of creating a copy
export const editingKeyAtom = atomWithStorage<string | null>('editingKey', null);
