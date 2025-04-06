import { Func, Type } from "../lib/token";

abstract class AST { }

export class UnaryOpr extends AST {
    type: Type;
    value: string;
    constructor(type: Type, value: string) {
        super();
        this.type = type;
        this.value = value;
    }
}

export class SymbolNode extends AST {
    type: Type;
    value: string;
    constructor(type: Type, value: string) {
        super();
        this.type = type;
        this.value = value;
    }
}

export class FuncNode extends AST {
    type: Type;
    func: string;
    value: AST;
    constructor(type: Type, func: string, value: AST) {
        super();
        this.type = type;
        this.func = func;
        this.value = value;
    }
}


export class BinOpr extends AST {
    opr: string;
    left: AST;
    right: AST;
    constructor(left: AST, right: AST, opr: string) {
        super();
        this.opr = opr;
        this.left = left;
        this.right = right;
    }
}

export class Num extends AST {
    type: Type;
    value: number;
    constructor(value: number) {
        super();
        this.type = Type.NUMBER;
        this.value = value;
    }
}
