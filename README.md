# Gallant

✨ Welcome to Gallant, a courteous programming language! ✨

###Basic language rules

Gallant is a courteous language and a lot of its rules are based around being polite.

- Variable declaration is achieved via variable greeting. In order to use a new variable, you need to greet (declare) it.
Following keywords / emojis are acceptable forms of greeting: 'hello', 'hi', 'aloha', 'hola', 👋.

For example,

```
👋 x = 8;
👋 y = 12;
```
This only applies to the first use of the variable, variable reassignment does not require a greeting.

- Function invocation happens using one of the plead tokens: 'please', 🙏 or 🥺. For example, assuming we
have a function called "giveMax", we can invoke it by:

```🙏 giveMax 4 and 3```

### How to get started

- npm install
- npm run test

Looking at test sets for Lexer, Parser and Interpreter is the quickest way to gain an understanding of how 
Gallant works and what commands / programs it can interpret. Alternatively, have a look at some sample programs
in "samples" folder. If you look at the tests, bear in mind that only Interpreter tests are fully working code examples, 
while Lexer and Parser only test their respective parts in isolation and may not be fully coherent from semantic analysis
 / interpretation point of view.
(For example, a parser test might assert that it correctly parses function call - but it wouldn't work as a 
standalone program because the function hasn't been declared before). 

