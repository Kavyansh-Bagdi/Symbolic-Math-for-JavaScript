import { describe, it, expect } from 'vitest';
import Parser from '../src/Parser';
import Lexer from '../src/Lexer';
import { BinOpr, Num, SymbolNode, FuncNode } from '../src/Parser/ast';

function parse(expression: string) {
    const lexer = new Lexer(expression);
    const parser = new Parser(lexer);
    return parser.parse();
}

describe('Parser Tests', () => {
    it('parses simple addition: 2 + 3', () => {
        const ast = parse('2 + 3');
        expect(ast).toBeInstanceOf(BinOpr);
        const bin = ast as BinOpr;
        expect(bin.opr).toBe('+');
        expect(bin.left).toBeInstanceOf(Num);
        expect((bin.left as Num).value).toBe(2);
        expect(bin.right).toBeInstanceOf(Num);
        expect((bin.right as Num).value).toBe(3);
    });

    it('parses implicit multiplication: 2x', () => {
        const ast = parse('2x');
        expect(ast).toBeInstanceOf(BinOpr);
        const bin = ast as BinOpr;
        expect(bin.opr).toBe('*');
        expect(bin.left).toBeInstanceOf(Num);
        expect((bin.left as Num).value).toBe(2);
        expect(bin.right).toBeInstanceOf(SymbolNode);
        expect((bin.right as SymbolNode).value).toBe('x');
    });

    it('parses function with variable: sin(x)', () => {
        const ast = parse('sin(x)');
        expect(ast).toBeInstanceOf(FuncNode);
        const func = ast as FuncNode;
        expect(func.func).toBe('sin');
        expect(func.value).toBeInstanceOf(SymbolNode);
        expect((func.value as SymbolNode).value).toBe('x');
    });

    it('parses nested functions with implicit multiplication: sin(x)log(x)', () => {
        const ast = parse('sin(x)log(x)');
        expect(ast).toBeInstanceOf(BinOpr);
        const bin = ast as BinOpr;
        expect(bin.opr).toBe('*');

        expect(bin.left).toBeInstanceOf(FuncNode);
        const leftFunc = bin.left as FuncNode;
        expect(leftFunc.func).toBe('sin');
        expect(leftFunc.value).toBeInstanceOf(SymbolNode);
        expect((leftFunc.value as SymbolNode).value).toBe('x');

        expect(bin.right).toBeInstanceOf(FuncNode);
        const rightFunc = bin.right as FuncNode;
        expect(rightFunc.func).toBe('log');
        expect(rightFunc.value).toBeInstanceOf(SymbolNode);
        expect((rightFunc.value as SymbolNode).value).toBe('x');
    });

    it('parses expression with brackets: (2 + x) * 5', () => {
        const ast = parse('(2 + x) * 5');
        expect(ast).toBeInstanceOf(BinOpr);
        const outer = ast as BinOpr;
        expect(outer.opr).toBe('*');
        expect(outer.right).toBeInstanceOf(Num);
        expect((outer.right as Num).value).toBe(5);
        expect(outer.left).toBeInstanceOf(BinOpr);
        const inner = outer.left as BinOpr;
        expect(inner.opr).toBe('+');
        expect(inner.left).toBeInstanceOf(Num);
        expect((inner.left as Num).value).toBe(2);
        expect(inner.right).toBeInstanceOf(SymbolNode);
        expect((inner.right as SymbolNode).value).toBe('x');
    });

    it('parses exponentiation: 2^3^4 (right-associative)', () => {
        const ast = parse('2^3^4');
        expect(ast).toBeInstanceOf(BinOpr);
        const outer = ast as BinOpr;
        expect(outer.opr).toBe('^');
        expect(outer.left).toBeInstanceOf(Num);
        expect((outer.left as Num).value).toBe(2);

        const inner = outer.right as BinOpr;
        expect(inner).toBeInstanceOf(BinOpr);
        expect(inner.opr).toBe('^');
        expect(inner.left).toBeInstanceOf(Num);
        expect((inner.left as Num).value).toBe(3);
        expect(inner.right).toBeInstanceOf(Num);
        expect((inner.right as Num).value).toBe(4);
    });
});
