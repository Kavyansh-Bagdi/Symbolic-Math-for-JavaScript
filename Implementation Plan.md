>I am still refining the implementation plan and exploring additional options to establish a robust foundation for symbolic mathematics.
# Lexer 

List of token that this Lexer will supports

| Type                            | Tokens                                                  |
| ------------------------------- | ------------------------------------------------------- |
| Symbols                         | `a-z and A-Z`                                           |
| Operators                       | `+, -, /, *, ^(Power)`                                  |
| Trigonometric Functions         | `sin cos sec csc cot tan`                               |
| Inverse Trigonometric Functions | `asin acos asec acsc acot atan `                        |
| Hyperbolic Functions            | `sinh cosh sech csch coth tanh`                         |
| Inverse Functions               | `asinh acosh asech  acsch acoth atanh`                  |
| Summation & Product             | `summation & prod`                                      |
| Integration & Differation       | `integrate & diff`                                      |
| Logratimic                      | `exp, log, ln`                                          |
| Degree                          | `degree`                                                |
| Constants                       | `pie, euler, iota, goldenRatio, catalan and eulerGamma` |
| Other                           | `(, ), and ,(comma), EOF`                               |
**Implicit Multiplication**
```JavaScript
expr> 2x
2x

Tokens:
[
  { type: 'NUMBER', value: 2 },
  { type: 'MUL', value: '*' },
  { type: 'VARIABLE', value: 'x' },
  { type: 'EOF', value: null }
]
Result: 2*x

expr> xsin(x)
xsin(x)

Tokens:
[
  { type: 'VARIABLE', value: 'x' },
  { type: 'MUL', value: '*' },
  { type: 'FUNC', value: 'sin' },
  { type: 'OPERBRACKET', value: '(' },
  { type: 'VARIABLE', value: 'x' },
  { type: 'CLOSEBRACKET', value: ')' },
  { type: 'EOF', value: null }
]

Result: x * sin(x)
```
# Parser

Implementing a Top-Down (Recursive Descent) & Operator Precedence Parser.
**Context Free Grammar**
```JavaScript
Expr → Term ((+ | -) Term)*
Term → Factor ((* | /) Factor)*
Factor → (+ | -)* Power
Power → Atom (^ Power)?
Atom →  NUM
		| VAR
		| FUNC ( Expr )
		| ( Expr )
		| Atom Atom
```
# Expression API

following are the functionalities that will be implemented.

1. expr()
	convert the given string into expression.
```JavaScript
>> expr('2x + -sin(y)')
2*x + (-sin(y))
```

2. subs()
	substitute value of variable in given expression and evaluate that.
```JavaScript
>> expr('sin(x)^2 + cos(x)^2').subs('x', 1)
1
```

3. expand()
	expand the given expression.
	```JavaScript
>> expr('sin(2x) + x(2y+3z)').expand() 
2*sin(x)*cos(x) + 2*x*y + 3*x*z
```

4. factor()
	return the factor of given expression.
	```JavaScript
>> expr('x^2 + 3*x + 2').factor()
(x + 1)*(x + 2)
```

5. simplify()
	```JavaScript
>> expr('(2 * 9 + 10)x').simplify()
28*x
```

1. **Arithmetic & Algebraic Simplification Rules**
	- `x + x` → `2*x`
	- `x * x` → `x**2`
	- `x**a * x**b` → `x**(a + b)`
	- `(a*b)/b` → `a`
	- `x**0` → `1` (if `x ≠ 0`)
	- `(x**a)**b` → `x**(a*b)`
	- `0*x` → `0`, `x + 0` → `x`
	- `x/1` → `x`, `0/x` → `0`

2. **Trigonometric Identities**
	- `sin(x)**2 + cos(x)**2` → `1`
	- `tan(x)` → `sin(x)/cos(x)`
	- `cot(x)` → `cos(x)/sin(x)`
	- `sec(x)` → `1/cos(x)`, `csc(x)` → `1/sin(x)`
	- `sin(-x)` → `-sin(x)` (odd function)
	- `cos(-x)` → `cos(x)` (even function)
	- `sin(2x)` → `2*sin(x)*cos(x)`
	- `cos(2x)` → `cos(x)**2 - sin(x)**2`
	
 3. **Logarithmic Rules**
	- `log(a) + log(b)` → `log(a*b)`
	- `log(a) - log(b)` → `log(a/b)`
	- `n*log(a)` → `log(a**n)`
	- `log(a**n)` → `n*log(a)`
	- `log(e)` → `1`
	- `log(1)` → `0`
	
4. **Exponential Rules**
	- `exp(0)` → `1`
	- `exp(a)*exp(b)` → `exp(a + b)`
	- `exp(a)/exp(b)` → `exp(a - b)`
	- `log(exp(x))` → `x`
	- `exp(log(x))` → `x` (if x > 0)
	
5.  **Radical Simplification**
	- `sqrt(a**2)` → `|a|`
	- `sqrt(a)*sqrt(b)` → `sqrt(a*b)`
	- `sqrt(a)/sqrt(b)` → `sqrt(a/b)`
	- `sqrt(x**2 + 2*x + 1)` → `|x + 1|`

6. ∑ **Summation & Product Rules**
	- `Sum(a + b)` → `Sum(a) + Sum(b)`
	- `Product(a*b)` → `Product(a) * Product(b)`
	- `Sum(0)` → `0`, `Product(1)` → `1`

6. **Common Algebraic Identities**
	- `(a + b)**2` → `a**2 + 2*a*b + b**2`
	- `(a - b)**2` → `a**2 - 2*a*b + b**2`
	- `a**2 - b**2` → `(a - b)*(a + b)`

7.  **Other Rules**
	- `simplify((x**2 + 2*x + 1)/(x + 1))` → `x + 1`
	- `abs(x)**2` → `x**2` (if x is real)
	- `x - x` → `0`

# Future Work (Post GSOC)

- Add support for **Equation API**
- Matrix expressions and operations
- Add support for **vector algebra.**