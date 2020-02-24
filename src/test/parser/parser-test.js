import * as assert from 'assert';
// import { Expression } from '../../main/ast/node'
import { Parser } from '../../Parser/Parser';
import { Token } from '../../Lexer/token';

describe('Parser', () => {

	describe('#parseExpression', () => {

		it('should parse a simple integer literal', () => {
			const parser = new Parser('42');
			const node = parser.parse();
			assert.equal(true, node.isConstantNode());
			assert.equal('42', node.value);
			assert.equal('integer', node.type);
		});

		it('should parse a simple decimal literal', () => {
			const parser = new Parser('3.14159');

			const node = parser.parse();

			assert.equal(true, node.isConstantNode());
			assert.equal('3.14159', node.value);
			assert.equal('decimal', node.type);
		});

		it('should parse a simple string literal', () => {
			const parser = new Parser('"Hello, World!"');

			const node = parser.parse();

			assert.equal(true, node.isConstantNode());
			assert.equal('"Hello, World!"', node.value);
			assert.equal('string', node.type);
		});

		it('should parse a null literal', () => {
			const parser = new Parser('null');

			const node = parser.parse();

			assert.equal(true, node.isConstantNode());
			assert.equal('null', node.value);
			assert.equal('null', node.type);
		});

		it('should parse the boolean literal "true"', () => {
			const parser = new Parser('true');

			const node = parser.parse();

			assert.equal(true, node.isConstantNode());
			assert.equal('true', node.value);
			assert.equal('true', node.type);
		});

		it('should parse the boolean literal "false"', () => {
			const parser = new Parser('false');

			const node = parser.parse();

			assert.equal(true, node.isConstantNode());
			assert.equal('false', node.value);
			assert.equal('false', node.type);
		});

		it('should parse a simple addition', () => {
			const parser = new Parser('1 + 2');

			const node = parser.parse();
			assert.equal(true, node.isOperatorNode());

			assert.equal('+', node.operator);

			assert.equal(true, node.left.isConstantNode());
			assert.equal('1', node.left.value);

			assert.equal(true, node.right.isConstantNode());
			assert.equal('2', node.right.value);
		});

		it('should correctly handle left associativity for arithmetic operators', () => {
			const parser = new Parser('7 - 4 + 2');

			const node = parser.parse();

			assert.equal(true, node.isOperatorNode());

			assert.equal('+', node.operator);

			assert.equal('-', node.left.operator);

			assert.equal(true, node.left.left.isConstantNode());
			assert.equal('7', node.left.left.value);

			assert.equal(true, node.left.right.isConstantNode());
			assert.equal('4', node.left.right.value);

			assert.equal(true, node.right.isConstantNode());
			assert.equal('2', node.right.value);
		});

		it('should correctly handle operator precedence', () => {
			const parser = new Parser('1 + 3 * 5 - 8');

			const node = parser.parse();

			assert.equal(true, node.isOperatorNode());
			assert.equal('-', node.operator);

			const { left } = node;

			assert.equal(true, left.isOperatorNode());
			assert.equal('+', left.operator);
			assert.equal(true, left.left.isConstantNode());
			assert.equal('1', left.left.value);

			const multiplication = left.right;

			assert.equal(true, multiplication.isOperatorNode());
			assert.equal('*', multiplication.operator);
			assert.equal(true, multiplication.left.isConstantNode());
			assert.equal('3', multiplication.left.value);
			assert.equal(true, multiplication.right.isConstantNode());
			assert.equal('5', multiplication.right.value);

			const { right } = node;
			assert.equal(true, right.isConstantNode());
			assert.equal('8', right.value);
		});

		// Need more tests for if - else ?
		it('should parse an if/else node', () => {
			const parser = new Parser('if (true) 1 else 2');

			const node = parser.parse();
			console.log('node ', node);

			assert.equal(true, node.isConditionalNode());

			assert.equal('true', node.condition.value);

			assert.equal(true, node.trueExpr.isConstantNode());
			assert.equal('1', node.trueExpr.value);

			assert.equal(true, node.falseExpr.isConstantNode());
			assert.equal('2', node.falseExpr.value);
		});

		it('should parse a while node', () => {
			const parser = new Parser('while (true) 42');

			const node = parser.parse();

			assert.equal(true, node.isWhileLoopNode());

			assert.equal(true, node.condition.isConstantNode());
			assert.equal('true', node.condition.value);

			assert.equal(true, node.body.isConstantNode());
			assert.equal('42', node.body.value);
		});

		it.only('should parse a let node', () => {
			const parser = new Parser('let a: Int = 2, b = 3 in a + b');

			const node = parser.parse();

			assert.equal(true, node.isLet());

			const { initializations } = node;
			assert.equal(2, initializations.length);

			assert.equal(initializations[0].identifier, 'a');
			assert.equal(initializations[0].type, 'Int');
			assert.equal(true, initializations[0].value.isConstantNode());
			assert.equal('2', initializations[0].value.value);

			assert.equal(initializations[1].identifier, 'b');
			assert.equal(initializations[1].type, undefined);
			assert.equal(true, initializations[1].value.isConstantNode());
			assert.equal('3', initializations[1].value.value);

			const { body } = node;

			assert.equal(true, body.isBinaryExpression());

			assert.equal('+', body.operator);
			assert.equal(true, body.left.isReference());
			assert.equal('a', body.left.identifier);

			assert.equal(true, body.right.isReference());
			assert.equal('b', body.right.identifier);
		});

		it('should parse a this node', () => {
			const parser = new Parser('this');

			const node = parser.parse();

			assert.equal(true, node.isThis());
		});

		it('should parse a block of nodes', () => {
			const parser = new Parser('{\n'
				+ '"hello"\n'
				+ '42\n'
				+ 'true\n'
				+ '}');

			const node = parser.parse();

			assert.equal(true, node.isBlock());

			const { nodes } = node;

			assert.equal(3, nodes.length);

			assert.equal(true, nodes[0].isStringLiteral());
			assert.equal('"hello"', nodes[0].value);

			assert.equal(true, nodes[1].isConstantNode());
			assert.equal('42', nodes[1].value);

			assert.equal(true, nodes[2].isConstantNode());
			assert.equal('true', nodes[2].value);
		});

		it('should parse a constructor call', () => {
			const parser = new Parser('new Integer(42)');

			const node = parser.parse();

			assert.equal(true, node.isConstructorCall());
			assert.equal('Integer', node.type);
			assert.equal(1, node.args.length);
			assert.equal(true, node.args[0].isConstantNode());
			assert.equal('42', node.args[0].value);
		});

		it('should parse a negative node', () => {
			const parser = new Parser('-42');

			const node = parser.parse();

			assert.equal(true, node.isUnaryExpression());
			assert.equal('-', node.operator);

			assert.equal(true, node.node.isConstantNode());
			assert.equal('42', node.node.value);
		});

		it('should parse a negated boolean node', () => {
			const parser = new Parser('!true');

			const node = parser.parse();

			assert.equal(true, node.isUnaryExpression());
			assert.equal('!', node.operator);

			assert.equal(true, node.node.isConstantNode());
			assert.equal('true', node.node.value);
		});

		it('should parse a parenthesized node', () => {
			const parser = new Parser('1 + (2 - 3.14)');

			const node = parser.parse();

			assert.equal(true, node.isBinaryExpression());
			assert.equal('+', node.operator);

			const { left } = node;

			assert.equal(true, left.isConstantNode());
			assert.equal('1', left.value);

			const { right } = node;

			assert.equal(true, right.isBinaryExpression());
			assert.equal('-', right.operator);
			assert.equal(true, right.left.isConstantNode());
			assert.equal('2', right.left.value);
			assert.equal(true, right.right.isDecimalLiteral());
			assert.equal('3.14', right.right.value);
		});

		it('should parse a simple method call', () => {
			const parser = new Parser('car.drive(2)');

			const node = parser.parse();

			assert.equal(true, node.isFunctionCall());

			const { object } = node;
			assert.equal(true, object.isReference());
			assert.equal('car', object.identifier);

			assert.equal(node.functionName, 'drive');

			assert.equal(1, node.args.length);
			assert.equal(true, node.args[0].isConstantNode());
			assert.equal('2', node.args[0].value);
		});

		it('should parse chain method calls', () => {
			const parser = new Parser('node.add(42).push("Hello")');

			const node = parser.parse();

			assert.equal(true, node.isFunctionCall());

			assert.equal(node.functionName, 'push');

			const { object } = node;

			assert.equal(true, object.isFunctionCall());
			assert.equal('add', object.functionName);
			assert.equal(true, object.object.isReference());
			assert.equal('node', object.object.identifier);
			assert.equal(1, object.args.length);
			assert.equal(true, object.args[0].isConstantNode());
			assert.equal('42', object.args[0].value);

			assert.equal(1, node.args.length);
			assert.equal(true, node.args[0].isStringLiteral());
			assert.equal('"Hello"', node.args[0].value);
		});
	});

	describe('#parseFunction', () => {

		it('should parse a function definition', () => {
			const parser = new Parser('func max(a: Int, b: Int): Int = {'
				+ 'if (a > b) a else b'
				+ '}');

			const func = parser.parseFunction();

			assert.equal(true, func.isFunction());

			assert.equal('max', func.name);

			const { parameters } = func;

			assert.equal(2, parameters.length);

			assert.equal('a', parameters[0].identifier);
			assert.equal('Int', parameters[0].type);
			assert.equal('b', parameters[1].identifier);
			assert.equal('Int', parameters[1].type);

			assert.equal('Int', func.returnType);

			const { body } = func;

			assert.equal(true, body.isBlock());

			const { nodes } = body;

			assert.equal(1, nodes.length);

			assert.equal(true, nodes[0].isIfElse());
		});
	});

	describe('#parseClass', () => {

		it('should parse a class definition', () => {
			const parser = new Parser('class Fraction(n: Int, d: Int) {\n'
				+ 'var num: Int = n\n'
				+ ''
				+ 'var den: Int = d\n'
				+ ''
				+ 'func gcd(): Int = {\n'
				+ '    let a = num, b = den in {\n'
				+ '        if (b == 0) a else gcd(b, a % b)\n'
				+ '    }\n'
				+ '}\n'
				+ ''
				+ 'override func toString(): String = n.toString() + "/" + d.toString()'
				+ '}');

			const klass = parser.parseClass();

			assert.equal('Fraction', klass.name);

			const { parameters } = klass;

			assert.equal(2, parameters.length);

			assert.equal('n', parameters[0].identifier);
			assert.equal('Int', parameters[0].type);

			assert.equal('d', parameters[1].identifier);
			assert.equal('Int', parameters[1].type);

			const variables = klass.properties;

			assert.equal(2, variables.length);

			assert.equal('num', variables[0].name);
			assert.equal('Int', variables[0].type);
			assert.equal(true, variables[0].value.isReference());
			assert.equal('n', variables[0].value.identifier);

			assert.equal('den', variables[1].name);
			assert.equal('Int', variables[1].type);
			assert.equal(true, variables[1].value.isReference());
			assert.equal('d', variables[1].value.identifier);

			const { functions } = klass;

			assert.equal(2, functions.length);

			assert.equal('gcd', functions[0].name);
			assert.equal('toString', functions[1].name);
			assert.equal(true, functions[1].override);
		});
	});

	describe('#parseProgram', () => {

		it('should parse multiple class definitions', () => {
			const parser = new Parser(
				'class Fraction(n: Int, d: Int) {\n'
				+ 'var num: Int = n\n'
				+ ''
				+ 'var den: Int = d\n'
				+ ''
				+ 'func gcd(): Int = {\n'
				+ '    let a = num, b = den in {\n'
				+ '        if (b == 0) a else gcd(b, a % b)\n'
				+ '    }\n'
				+ '}\n'
				+ ''
				+ 'override func toString(): String = n.toString() + "/" + d.toString()'
				+ '}\n'
				+ '\n'
				+ 'class Complex(a: Double, b: Double) {\n'
				+ 'var x: Double = a\n'
				+ ''
				+ 'var y: Double = b\n'
				+ ''
				+ 'override func toString(): String = x.toString() + " + " + b.toString() + "i"'
				+ '}'
			);

			const program = parser.parseProgram();

			assert.equal(2, program.classesCount());

			const fraction = program.classes[0];

			assert.equal('Fraction', fraction.name);

			const fractionParameters = fraction.parameters;

			assert.equal(2, fractionParameters.length);

			assert.equal('n', fractionParameters[0].identifier);
			assert.equal('Int', fractionParameters[0].type);

			assert.equal('d', fractionParameters[1].identifier);
			assert.equal('Int', fractionParameters[1].type);

			const fractionVariables = fraction.properties;

			assert.equal(2, fractionVariables.length);

			assert.equal('num', fractionVariables[0].name);
			assert.equal('Int', fractionVariables[0].type);
			assert.equal(true, fractionVariables[0].value.isReference());
			assert.equal('n', fractionVariables[0].value.identifier);

			assert.equal('den', fractionVariables[1].name);
			assert.equal('Int', fractionVariables[1].type);
			assert.equal(true, fractionVariables[1].value.isReference());
			assert.equal('d', fractionVariables[1].value.identifier);

			const fractionFunctions = fraction.functions;

			assert.equal(2, fractionFunctions.length);

			assert.equal('gcd', fractionFunctions[0].name);
			assert.equal('toString', fractionFunctions[1].name);
			assert.equal(true, fractionFunctions[1].override);

			const complex = program.classes[1];

			assert.equal('Complex', complex.name);

			const complexParameters = complex.parameters;

			assert.equal(2, complexParameters.length);

			assert.equal('a', complexParameters[0].identifier);
			assert.equal('Double', complexParameters[0].type);

			assert.equal('b', complexParameters[1].identifier);
			assert.equal('Double', complexParameters[1].type);

			const complexVariables = complex.properties;

			assert.equal(2, complexVariables.length);

			assert.equal('x', complexVariables[0].name);
			assert.equal('Double', complexVariables[0].type);
			assert.equal(true, complexVariables[0].value.isReference());
			assert.equal('a', complexVariables[0].value.identifier);

			assert.equal('y', complexVariables[1].name);
			assert.equal('Double', complexVariables[1].type);
			assert.equal(true, complexVariables[1].value.isReference());
			assert.equal('b', complexVariables[1].value.identifier);

			const complexFunctions = complex.functions;

			assert.equal(1, complexFunctions.length);

			assert.equal('toString', complexFunctions[0].name);
			assert.equal(true, complexFunctions[0].override);

		});
	});

});
