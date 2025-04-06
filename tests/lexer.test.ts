import { describe, it, expect } from 'vitest';
import Lexer from '../src/Lexer/index';
import { Type } from '../src/lib/token';
import type { Token } from '../src/lib/types';

function collectTokens(expression: string): Token[] {
    const lexer = new Lexer(expression);
    const tokens: Token[] = [];
    let token;
    do {
        token = lexer.getNextToken();
        tokens.push(token);
    } while (token.type !== Type.EOF);
    return tokens;
}

describe('Lexer Tests', () => {
    it('parses simple addition', () => {
        const tokens = collectTokens('2 + 3');

        expect(tokens).toEqual([
            { type: Type.NUMBER, value: 2 },
            { type: Type.PLUS, value: '+' },
            { type: Type.NUMBER, value: 3 },
            { type: Type.EOF, value: null }
        ]);
    });

    it('handles implicit multiplication like 2x', () => {
        const tokens = collectTokens('2x');

        expect(tokens).toEqual([
            { type: Type.NUMBER, value: 2 },
            { type: Type.MUL, value: '*' },
            { type: Type.VARIABLE, value: 'x' },
            { type: Type.EOF, value: null }
        ]);
    });

    it('handles implicit multiplication with function like 2xsin(x)', () => {
        const tokens = collectTokens('2xsin(x)');

        expect(tokens).toEqual([
            { type: Type.NUMBER, value: 2 },
            { type: Type.MUL, value: '*' },
            { type: Type.VARIABLE, value: 'x' },
            { type: Type.MUL, value: '*' },
            { type: Type.FUNC, value: 'sin' },
            { type: Type.OPERBRACKET, value: '(' },
            { type: Type.VARIABLE, value: 'x' },
            { type: Type.CLOSEBRACKET, value: ')' },
            { type: Type.EOF, value: null }
        ]);
    });

    it('handles implicit multiplication with function like sin(x)log(x)', () => {
        const tokens = collectTokens('sin(x)log(x)');

        expect(tokens).toEqual([
            { type: Type.FUNC, value: 'sin' },
            { type: Type.OPERBRACKET, value: '(' },
            { type: Type.VARIABLE, value: 'x' },
            { type: Type.CLOSEBRACKET, value: ')' },
            { type: Type.MUL, value: '*' },
            { type: Type.FUNC, value: 'log' },
            { type: Type.OPERBRACKET, value: '(' },
            { type: Type.VARIABLE, value: 'x' },
            { type: Type.CLOSEBRACKET, value: ')' },
            { type: Type.EOF, value: null }
        ]);
    });
});
