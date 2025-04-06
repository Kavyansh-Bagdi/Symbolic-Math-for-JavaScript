import type { Token } from "../lib/types";
import { Type, Func } from "../lib/token";

class Lexer {
    pos: number;
    text: string;
    currentChar: string | null;
    tokenBuffer: Array<Token>;

    constructor(text: string) {
        this.pos = 0;
        this.text = text;
        this.currentChar = this.text[this.pos];
        this.tokenBuffer = [];
    }

    error(message: string): void {
        throw new Error(message);
    }

    /*
        advance function is use to get new token by upating position and assign new token to currentChar
    */
    advance(): void {
        this.pos += 1;
        this.currentChar = this.pos < this.text.length ? this.text[this.pos] : null;
    }

    /*
        skip white spaces to provide a consistent expression representation.
        repl> 3   + x
        repl> 3 + x
    */
    skipWhiteSpace(): void {
        while (this.currentChar && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    /*
        create token for NUMBER 
        repl> 3.14
        repl> 3.14

        repl> 3.12.1
        repl> Invalid number format near position 5: multiple dots in number
   */
    number(): Token {
        let result = '';
        let hasDecimalPoint = false;

        while (this.currentChar && (/\d/.test(this.currentChar) || this.currentChar === '.')) {
            if (this.currentChar === '.') {
                if (hasDecimalPoint) {
                    this.error(`Invalid number format near position ${this.pos}: multiple dots in number`);
                }
                hasDecimalPoint = true;
            }
            result += this.currentChar;
            this.advance();
        }

        const value = hasDecimalPoint ? parseFloat(result) : parseInt(result);
        return { type: Type.NUMBER, value };
    }

    symbol(): Token {
        let result = '';

        while (this.currentChar && /[a-zA-Z]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }

        const MATH_FUNCTIONS = Object.values(Func);
        let tokens: Array<Token> = [];
        let i: number = 0;

        while (i < result.length) {
            let matched = false;

            for (let fn of MATH_FUNCTIONS) {
                if (result.startsWith(fn, i)) {
                    if (i > 0 && tokens.length > 0) {
                        tokens.push({ type: Type.MUL, value: '*' });
                    }
                    tokens.push({ type: Type.FUNC, value: fn });
                    i += fn.length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                const char = result[i];
                if (/[a-zA-Z]/.test(char)) {
                    if (tokens.length > 0) {
                        tokens.push({ type: Type.MUL, value: '*' });
                    }
                    tokens.push({ type: Type.VARIABLE, value: char });
                    i++;
                } else {
                    this.error(`Invalid character in symbol: ${char}`);
                }
            }
        }

        this.tokenBuffer = tokens.slice(1);
        return tokens[0];
    }

    getNextToken(): Token {
        if (this.tokenBuffer.length > 0) {
            return this.tokenBuffer.shift()!;
        }

        this.skipWhiteSpace();

        if (!this.currentChar) {
            return { type: Type.EOF, value: null };
        }

        if (/\d/.test(this.currentChar)) {
            const token = this.number();
            const nextChar = this.currentChar;
            if (nextChar && (/[a-zA-Z(]/.test(nextChar))) {
                this.tokenBuffer.unshift({ type: Type.MUL, value: '*' });
            }

            return token;
        }


        if (/[a-zA-Z]/.test(this.currentChar)) {
            return this.symbol();
        }

        switch (this.currentChar) {
            case '+':
                this.advance();
                return { type: Type.PLUS, value: '+' };
            case '-':
                this.advance();
                return { type: Type.MINUS, value: '-' };
            case '*':
                this.advance();
                return { type: Type.MUL, value: '*' };
            case '/':
                this.advance();
                return { type: Type.DIV, value: '/' };
            case '^':
                this.advance();
                return { type: Type.POW, value: '^' };
            case '(':
                this.advance();
                return { type: Type.OPERBRACKET, value: '(' };
            case ')':
                this.advance();
                const nextChar = this.text[this.pos];
                if (nextChar && (/[a-zA-Z(0-9]/.test(nextChar))) {
                    this.tokenBuffer.unshift({ type: Type.MUL, value: '*' });
                }
                return { type: Type.CLOSEBRACKET, value: ')' };
            default:
                this.error(`Unknown character: ${this.currentChar}`);
        }

        return { type: Type.EOF, value: null };
    }
}

export default Lexer;
