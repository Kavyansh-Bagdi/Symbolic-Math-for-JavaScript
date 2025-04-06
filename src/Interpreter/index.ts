import { create, all } from 'mathjs';
import { BinOpr, Num, SymbolNode, FuncNode, UnaryOpr } from '../Parser/ast';
import type Parser from '../Parser';

const math = create(all);

class NodeVisitor {
    visit(node: any): any {
        const methodName = 'visit_' + node.constructor.name;
        const visitor = (this as any)[methodName] || this.generic_visit;
        return visitor.call(this, node);
    }

    generic_visit(node: any): never {
        throw new Error(`No visit_${node.constructor.name} method`);
    }
}

class Interpreter extends NodeVisitor {
    parser: Parser;

    constructor(parser: Parser) {
        super();
        this.parser = parser;
    }

    visit_BinOpr(node: BinOpr): any {
        const left = this.visit(node.left);
        const right = this.visit(node.right);
        const op = node.opr;
        if (typeof left === 'number' && typeof right === 'number') {
            switch (op) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '^': return Math.pow(left, right);
                default: throw new Error(`Unsupported operator: ${op}`);
            }
        } else {
            let leftStr = typeof left === 'number' ? left.toString() : left;
            let rightStr = typeof right === 'number' ? right.toString() : right;
            if (op === '*') {
                if (typeof left === 'number' && typeof right === 'string') {
                    return leftStr + rightStr;
                }
                if (typeof left === 'string' && typeof right === 'number') {
                    return leftStr + rightStr;
                }
            }
            return `${leftStr} ${op} ${rightStr}`;
        }
    }

    visit_UnaryOpr(node: UnaryOpr): any {
        const val = this.visit(node.value);
        if (typeof val === 'number') {
            return node.type === 'MINUS' ? -val : +val;
        } else {
            return node.type === 'MINUS' ? `-${val}` : `+${val}`;
        }
    }

    visit_Num(node: Num): number {
        return node.value;
    }

    visit_SymbolNode(node: SymbolNode): string {
        return node.value;
    }

    visit_FuncNode(node: FuncNode): any {
        const arg = this.visit(node.value);
        if (typeof arg === 'number') {
            switch (node.func) {
                case 'sin': return math.sin(arg);
                case 'cos': return math.cos(arg);
                case 'tan': return math.tan(arg);
                case 'cosec': return 1 / math.sin(arg);
                case 'sec': return 1 / math.cos(arg);
                case 'abs': return math.abs(arg);
                case 'log': return math.log10(arg);
                case 'ln': return math.log(arg);
                case 'exp': return math.exp(arg);
                case 'sqrt': return math.sqrt(arg);
                default: throw new Error(`Unknown function: ${node.func}`);
            }
        } else {
            return `${node.func}(${arg})`;
        }
    }

    interpret(): any {
        const tree = this.parser.parse();
        return this.visit(tree);
    }
}

export default Interpreter;
