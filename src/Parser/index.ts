/*
Expr        → Term ((+ | -) Term)*
Term        → Factor ((* | /) Factor)*
Factor      → (+ | -)* Power
Power       → Atom (^ Power)?
Atom        → NUM
            | VAR
            | FUNC ( Expr )
            | ( Expr )
            | Atom Atom
*/
import { UnaryOpr, SymbolNode, BinOpr, FuncNode, Num } from './ast';
import Lexer from '../Lexer';
import { Token } from '../lib/types';
import { Type } from '../lib/token';

class Parser {
    lexer: Lexer;
    currToken: Token;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currToken = this.lexer.getNextToken();
    }

    error(message: string): never {
        throw new Error(message);
    }

    eat(tokenType: Type) {
        if (this.currToken.type === tokenType) {
            this.currToken = this.lexer.getNextToken();
        } else {
            this.error(`Invalid Syntax at position ${this.lexer.pos}. Expected ${tokenType}, got ${this.currToken.type}`);
        }
    }

    parse() {
        const node = this.Expr();
        if (this.currToken.type !== Type.EOF) {
            this.error("Unexpected input after expression");
        }
        return node;
    }

    Expr(): any {
        let node = this.Term();

        while (this.currToken.type === Type.PLUS || this.currToken.type === Type.MINUS) {
            const token = this.currToken;
            this.eat(token.type);
            const right = this.Term();
            node = new BinOpr(node, right, token.value as string);
        }

        return node;
    }

    Term(): any {
        let node = this.Factor();

        while (this.currToken.type === Type.MUL || this.currToken.type === Type.DIV) {
            const token = this.currToken;
            this.eat(token.type);
            const right = this.Factor();
            node = new BinOpr(node, right, token.value as string);
        }

        return node;
    }

    Factor(): any {
        const unaryTokens: Token[] = [];

        while (this.currToken.type === Type.PLUS || this.currToken.type === Type.MINUS) {
            unaryTokens.push(this.currToken);
            this.eat(this.currToken.type);
        }

        let node = this.Power();

        while (unaryTokens.length > 0) {
            const token = unaryTokens.pop()!;
            node = new UnaryOpr(token.type, node);
        }

        return node;
    }

    Power(): any {
        let node = this.Atom();

        if (this.currToken.type === Type.POW) {
            const token = this.currToken;
            this.eat(Type.POW);
            const right = this.Power();
            node = new BinOpr(node, right, token.value as string);
        }

        return node;
    }

    Atom(): any {
        let node = this.SingleAtom();

        while (
            this.currToken.type === Type.NUMBER ||
            this.currToken.type === Type.VARIABLE ||
            this.currToken.type === Type.FUNC ||
            this.currToken.type === Type.OPERBRACKET
        ) {
            const right = this.SingleAtom();
            node = new BinOpr(node, right, '*');
        }

        return node;
    }

    SingleAtom(): any {
        const token = this.currToken;

        if (token.type === Type.NUMBER || token.type === Type.CONSTANT) {
            this.eat(token.type);
            return new Num(Number(token.value));
        }

        if (token.type === Type.VARIABLE) {
            this.eat(Type.VARIABLE);
            return new SymbolNode(token.type, String(token.value));
        }

        if (token.type === Type.FUNC) {
            const funcName = String(token.value);
            this.eat(Type.FUNC);
            this.eat(Type.OPERBRACKET);
            const arg = this.Expr();
            this.eat(Type.CLOSEBRACKET);
            return new FuncNode(token.type, funcName, arg);
        }


        if (token.type === Type.OPERBRACKET) {
            this.eat(Type.OPERBRACKET);
            const node = this.Expr();
            this.eat(Type.CLOSEBRACKET);
            return node;
        }

        this.error(`Unexpected token at position ${this.lexer.pos}: ${token.type}`);
    }
}

export default Parser;
