# Gallant

✨ Welcome to Gallant, a courteous programming language! ✨

###Basic language specifications

Gallant is a courteous language and a lot of its rules are based around behaving politely. Gallant is interpreted
to Javascript.

- Variable declaration is achieved via greeting. In order to use a new variable, you need to greet (declare) it.
Following keywords / emojis are acceptable forms of greeting: 'hello', 'hi', 'aloha', 'hola', 👋.

For example,

```
👋 x = 8;
👋 y = 12;
```
Failure to greet a variable will result in an interpreter error.
This only applies to the first use of the variable, variable reassignment does not require a greeting.

- Function invocation happens using one of the plead tokens: 'please', 🙏 or 🥺. For example, assuming we
have a function called "giveMax", we can invoke it by:

```🙏 giveMax 4 and 3```

Function parameters are separated by keyword `and`.

- Any code blocks longer then 1 line need to finish with a gratitude token. Allowed gratitude tokens are: 
'thank you', 'thanks', 'cheers','🤗', '❤️' and'🥰'. Failure to finish a code block with a gratitude token
will result in an interpreter error. Only single line expressions are exempted from this rule (this applies
 to one line of logic, not one line of writing).
 
 Examples:
 
 GOOD 
 ```
 👋 x = 8;
 👋 y = 12;
 🥰
 ```
 
 GOOD (A single line of logic does not require a gratitude token)
 ```
 👋 x = 8
 ```

 BAD (interpreter error) 
 ```
 👋 x = 8;
 👋 y = 12;
 ```

 - As you have already seen in previous examples, Gallant supports basic emojis. There are two types
 of emojis: the ones that bear special meaning (for example greeting, function invocation etc) and the ones
 that don't. If you use an emoji that does not have any special meaning, the interpreter will console.log
 a random dad joke for you.
 
 - Gallant does not have a built-in garbage collector. If you want to free memory from variables you 
 no longer need, you need to farewell them. Acceptable farewell tokens are: 'goodbye', 'bye', 'ciao',
 ✋ and 😘. For example (assuming we have earlier declared a variable called `a`):
 
 ```
✋ a
```

- Function declarations in Gallant must adhere to following syntax: 

```
add() {
...
}
```

It is a recommended practice to use meaningful verbs as function names so that the code reads nicely
when the function is invoked ("Please add 2 and 4").

- Arrays are declared as follows:

```👋 arr = [1, 2, 3]```

Like other variables, arrays need to be greeted when first declared. In order to access an element at
a specific index, we use `@` token. For example,

```
arr@0
```

In order to access length of an array, we use `size` keyword:

```
arr@size
```

You can modify elements inside of an array.

- Objects (maps) are declared as follows:

```
👋 myMap = {a = 1, b = 2}
```

In order to access an element at
a specific index, we use `@` token. For example,

```
myMap@a
```

In order to obtain the size of the map, we use `size` keyword:

```
myMap@size
```

Objects (maps) are implemented as Javascript `Map` under the hood, therefore keys can be any value 
(including functions, objects, or any primitive). You can modify elements inside of a map.

- Gallant supports if statements and while loops.

Single-line if statement:

`if (a > b) a else b`

Multi-line if statement:

```
if (x > 0) {
    x = x + 1;
} else {
    x = x - 1;
    y = y * 5;
}
```

While loop:

```
while (x > 0) {
    y = y + 4;
    x = x - 1;
}
```

- All strings need to be declares using double quotes

- Gallant ignores whitespace (spaces and tabs)

- All statements must terminate with semicolon character. Newline character is also supported however cannot be
used inside repl. Newline is optional after curly braces.

- Gallant supports integers, floating point numbers, booleans as well as basic mathematical and logical operators.
 

### How to get started

First steps:

- npm install
- npm run test

You have following options to get started with Gallant: 

- Play around with tests
- Use repl (Repl section)
- Looks at code samples in "code-samples" folder
- Upload a file (Read code from a file section)

I strongly recommend looking at the tests sets to gain an understanding of what Gallant is capable of.
Bear in mind that only Interpreter tests are fully working code examples, while Lexer and Parser only test
their respective parts in isolation and may not be fully coherent from semantic analysis/ interpretation point of view.
(For example, a parser test might assert that it correctly parses function call - but it wouldn't work as a 
standalone program because the function hasn't been declared before). All tests are located in `test` folder.

### Repl

You can easily test out small snippets of code using repl! To start repl, run the command `npm run repl`.

How to use Repl:
- Hit enter to execute your code
- If you want to write more than one line, put semicolon at the end. Engine will interpret this 
as a signal to wait for more code
- If you want your code to execute immediately, do not put a semicolon at the end. Alternatively you can also hit Enter twice.
- If you wish to use emoji in your code, you have following options:
   1. Copy and paste it from somewhere
   2. Write a text representation of the emoji. For example, :grapes: for 🍇
   3. Start the line with `:emoji` followed by the name of the emoji you are looking for (for example `:emoji cat`). This
      will trigger a simple emoji search tool. Respond by typing the number of emoji you wish to choose. The emoji will get
      copied to your clipboard and you can then paste it whenever you wish.

Have fun!

### Read code from a file

In order to process a code from a file, `npm run load [path to file]`. For example, from the root directory
`npm run load src/code-samples/sample1.csv`. File is expected to be in csv format.

####Kudos

Thank you to the authors of following resources that helped me complete this project

- [Compilers: Theory and Practice](https://www.udacity.com/course/compilers-theory-and-practice--ud168)
- [Blink](https://github.com/ftchirou/blink/tree/master/src/main)
- [Math.js](https://github.com/josdejong/mathjs)
