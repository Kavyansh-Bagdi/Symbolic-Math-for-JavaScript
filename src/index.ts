import Lexer from "./Lexer";
import Parser from "./Parser";
import { Type } from "./lib/token";
import type { Token } from "./lib/types";

const expression = "sin(x)log(x)";

const lexer = new Lexer(expression);

const tokens: Token[] = [];
let token: Token;

do {
    token = lexer.getNextToken();
    tokens.push(token);
} while (token.type !== Type.EOF);

console.log("Tokens:");
console.dir(tokens, { depth: null });

const parser = new Parser(new Lexer(expression));

const ast = parser.parse();
console.log("\nAST:");
console.dir(ast, { depth: null });
