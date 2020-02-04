import {TreeNode } from "./TreeNode";

class ExpressionTree {

// 	// A utility function to check if 'c'
// 	// is an operator
//



// Utility function to do inorder traversal
	inorder(node) {
		if (node != null) {
			this.inorder(node.left);
			console.log(node.value + " ");
			this.inorder(node.right);
		}
	}

// Returns root of constructed tree for given
// postfix expression


//  main() {
//
// 	ExpressionTree et = new ExpressionTree();
// 	String postfix = "ab+ef*g*-";
// 	char[] charArray = postfix.toCharArray();
// 	Node root = et.constructTree(charArray);
// 	System.out.println("infix expression is");
// 	et.inorder(root);
//
// }
}

// This code has been contributed by Mayank Jaiswal
