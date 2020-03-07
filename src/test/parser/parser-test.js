import * as assert from 'assert';
import { Parser } from '../../Parser/Parser';

describe('Parser', () => {

	it('should parse a new variable declaration using keyword hi', () => {
		const parser = new Parser('hi a = 5');
		const node = parser.parse();
		assert.equal(true, node.isAssignmentNode());
		assert.equal(true, node.symbol.isSymbolNode());
		assert.equal(true, node.value.isConstantNode());
		assert.equal('a', node.symbol.name);
		assert.equal(5, node.value.value);
		assert.equal(true, node.greeted);
	});

	it('should parse a new variable declaration using keyword hola', () => {
		const parser = new Parser('hola someVar = 6');
		const node = parser.parse();
		assert.equal(true, node.isAssignmentNode());
		assert.equal(true, node.symbol.isSymbolNode());
		assert.equal(true, node.value.isConstantNode());
		assert.equal('someVar', node.symbol.name);
		assert.equal(6, node.value.value);
		assert.equal(true, node.greeted);
	});

	it('should parse a new variable declaration using keyword aloha', () => {
		const parser = new Parser('aloha mySexyHawaianVar = 10');
		const node = parser.parse();
		assert.equal(true, node.isAssignmentNode());
		assert.equal(true, node.symbol.isSymbolNode());
		assert.equal(true, node.value.isConstantNode());
		assert.equal('mySexyHawaianVar', node.symbol.name);
		assert.equal(10, node.value.value);
		assert.equal(true, node.greeted);
	});

	it('should parse a simple integer literal', () => {
		const parser = new Parser('89');
		const node = parser.parse();
		assert.equal(true, node.isConstantNode());
		assert.equal('89', node.value);
		assert.equal('integer', node.type);
	});

	it('should parse a simple decimal literal', () => {
		const parser = new Parser('5.26');
		const node = parser.parse();

		assert.equal(true, node.isConstantNode());
		assert.equal('5.26', node.value);
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

	it('should parse relational expressions', () => {
		const parser = new Parser('a > b');
		const node = parser.parse();
		assert.equal(true, node.isOperatorNode());
		assert.equal('>', node.name);
		assert.equal(true, node.left.isSymbolNode());
		assert.equal('a', node.left.name);
		assert.equal('b', node.right.name);
	});

	// Need more tests for if - else ?
	it('should parse an if/else node', () => {
		const parser = new Parser('if (true) 1 else 2');

		const node = parser.parse();

		assert.equal(true, node.isConditionalNode());

		assert.equal('true', node.condition.value);

		assert.equal(true, node.trueExpr.isConstantNode());
		assert.equal('1', node.trueExpr.value);

		assert.equal(true, node.falseExpr.isConstantNode());
		assert.equal('2', node.falseExpr.value);
	});

	it('should parse a while node', () => {
		const parser = new Parser('while (i > 0) {\n'
			+ 'y = y * 4\n'
			+ 'i = i - 1\n'
			+ '}');

		const node = parser.parse();

		assert.equal(true, node.isWhileLoopNode());

		const { body, condition } = node;
		assert.equal(true, condition.isOperatorNode());
		assert.equal('>', condition.operator);

		assert.equal(true, body.isBlockNode());
		assert.equal(2, body.blocks.length);
		assert.equal(true, body.blocks[0].isAssignmentNode());
		assert.equal(true, body.blocks[1].isAssignmentNode());
	});

	it('should parse an assignment to a constant', () => {
		const parser = new Parser('a = 5');

		const node = parser.parse();

		assert.equal(true, node.isAssignmentNode());
		assert.equal(true, node.symbol.isSymbolNode());
		assert.equal(true, node.value.isConstantNode());
		assert.equal('a', node.symbol.name);
		assert.equal(5, node.value.value);
		assert.equal(false, node.greeted);
	});

	it('should parse an assignment to an expression', () => {
		const parser = new Parser('i = i + 1');

		const node = parser.parse();

		assert.equal(true, node.isAssignmentNode());
		const { symbol, value } = node;
		assert.equal(true, symbol.isSymbolNode());
		assert.equal(true, value.isOperatorNode());
		assert.equal('i', symbol.name);
		assert.equal('+', value.operator);
		assert.equal(false, node.greeted);
	});

	it('should parse a block of nodes', () => {
		const parser = new Parser('"hello"\n'
				+ '42\n'
				+ 'true\n');

		const node = parser.parse();

		assert.equal(true, node.isBlockNode());

		const { blocks } = node;

		assert.equal(3, blocks.length);

		assert.equal(true, blocks[0].isConstantNode());
		assert.equal('"hello"', blocks[0].value);

		assert.equal(true, blocks[1].isConstantNode());
		assert.equal('42', blocks[1].value);

		assert.equal(true, blocks[2].isConstantNode());
		assert.equal('true', blocks[2].value);
	});

	it('should parse a negative node', () => {
		const parser = new Parser('-42');

		const node = parser.parse();

		assert.equal(true, node.isOperatorNode());
		assert.equal('-', node.operator);

		assert.equal(true, node.right.isConstantNode());
		assert.equal('42', node.right.value);
	});

	it('should parse a parenthesized node', () => {
		const parser = new Parser('1 + (2 - 3.14)');

		const node = parser.parse();

		assert.equal(true, node.isOperatorNode());
		assert.equal('+', node.operator);

		const { left } = node;

		assert.equal(true, left.isConstantNode());
		assert.equal('1', left.value);

		const { right } = node;

		assert.equal(true, right.isParenthesisNode());
		assert.equal(true, right.content.isOperatorNode());
		assert.equal('-', right.content.operator);
		assert.equal(true, right.content.left.isConstantNode());
		assert.equal('2', right.content.left.value);
		assert.equal(true, right.content.right.isConstantNode());
		assert.equal('3.14', right.content.right.value);
	});

	it('should parse a function call with no arguments', () => {
		const parser = new Parser('baz()');

		const node = parser.parse();

		assert.equal(true, node.isFunctionCallNode());

		const { identifier } = node;
		assert.equal(true, identifier.isSymbolNode());
		assert.equal('baz', identifier.name);

		assert.equal(0, node.args.length);
	});

	it('should parse a function call with one argument', () => {
		const parser = new Parser('foo(2)');

		const node = parser.parse();

		assert.equal(true, node.isFunctionCallNode());

		const { identifier } = node;
		assert.equal(true, identifier.isSymbolNode());
		assert.equal('foo', identifier.name);

		assert.equal(1, node.args.length);
		assert.equal(true, node.args[0].isConstantNode());
		assert.equal('2', node.args[0].value);
	});

	it('should parse a function call with more than one argument', () => {
		const parser = new Parser('bar(2,3)');

		const node = parser.parse();

		assert.equal(true, node.isFunctionCallNode());

		const { identifier } = node;
		assert.equal(true, identifier.isSymbolNode());
		assert.equal('bar', identifier.name);

		assert.equal(2, node.args.length);
		assert.equal('2', node.args[0].value);
		assert.equal('3', node.args[1].value);
	});

	it('should parse a function definition', () => {
		const parser = new Parser('foo(a,b) = {'
				+ ' if (a > b) a else b'
				+ ' }');

		const node = parser.parse();
		assert.equal(true, node.isFunctionAssignmentNode());
		assert.equal('foo', node.name);
		const { params, body } = node;
		assert.equal(2, params.length);
		assert.equal('a', params[0]);
		assert.equal('b', params[1]);
		assert.equal(true, body.isConditionalNode());
	});

	it.only('should parse a simple program', () => {
		const parser = new Parser(
			'x = 6\n'
				+ 'y = 7\n'
				+ ''
				+ 'foo(a,b) = {'
					+ ' if (a > b) a else b'
					+ ' }\n'
				+ ''
				+ 'foo(x,y)'
		);

		const node = parser.parse();
		assert.equal(true, node.isBlockNode());
		// TODO Add more assertions

	});

	it('should parse an array', () => {
		const parser = new Parser(
			'[1, 2, 3]'
		);
		const node = parser.parse();
		assert.equal(true, node.isArrayNode());
		assert.equal(3, node.size);
		const [node1, node2, node3] = node.content;
		assert.equal(true, node1.isConstantNode());
		assert.equal(true, node2.isConstantNode());
		assert.equal(true, node3.isConstantNode());
	});

	it('should parse an assignment with array on the right hand side', () => {
		const parser = new Parser(
			'arr = [1, 2, 3]'
		);
		const node = parser.parse();
		assert.equal(true, node.isAssignmentNode());
		const { value, symbol } = node;
		assert.equal(true, value.isArrayNode());
		assert.equal(true, symbol.isSymbolNode());
	});

	it('should parse an array accessor', () => {
		const parser = new Parser(
			'arr@0'
		);
		const node = parser.parse();
		assert.equal(true, node.isAccessorNode());
		const { ref, key } = node;
		assert.equal(true, ref.isSymbolNode());
		assert.equal(true, key.isConstantNode());
	});

	it('should parse a simple map map', () => {
		const parser = new Parser(
			'{a = 1, b = 2}'
		);
		const node = parser.parse();
		assert.equal(true, node.isMapNode());
		assert.equal(2, node.keyValuePairs.length);
	});

});
