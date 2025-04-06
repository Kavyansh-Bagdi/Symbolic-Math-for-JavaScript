import readline from 'readline';
import Lexer from '../src/Lexer';
import Parser from '../src/Parser';
import Interpreter from '../src/Interpreter';
import { Type } from '../src/lib/token';
import type { Token } from '../src/lib/types';

function getTokens(expression: string): Token[] {
    const lexer = new Lexer(expression);
    const tokens: Token[] = [];
    let token: Token;

    do {
        token = lexer.getNextToken();
        tokens.push(token);
    } while (token.type !== Type.EOF);

    return tokens;
}

function parseAndInterpret(expression: string) {
    try {
        const tokens = getTokens(expression);
        console.log("\nTokens:");
        console.dir(tokens, { depth: null });

        const parser = new Parser(new Lexer(expression));
        const ast = parser.parse();
        console.log("\nAST:");
        console.dir(ast, { depth: null });

        const interpreter = new Interpreter(new Parser(new Lexer(expression)));
        const result = interpreter.interpret();
        console.log("\nResult:", result);
    } catch (err: any) {
        console.error(`\nError: ${err.message}`);
    }
}

function startRepl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'expr> '
    });

    console.log("Math Expression REPL");
    console.log("Type a math expression to see tokens, AST, and result.\nType 'exit' to quit.\n");

    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();
        if (input.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        parseAndInterpret(input);
        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
    });
}

startRepl();
