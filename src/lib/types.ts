import { Func, Type } from "./token";
interface Token {
    type: Type;
    value: string | number | null | Func;
}

export type { Token };