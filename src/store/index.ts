import {atomWithStorage} from "jotai/utils";

export const endpointAtom = atomWithStorage<string>('endpoint', '')
export const responseAtom = atomWithStorage<string>('response', '')