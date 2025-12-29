import { Level, Language } from './types';
import { generateLevel } from './generators';

// --- Static Hand-Crafted Levels (Story Mode) ---
const staticLevels: Level[] = [
  // --- JavaScript (1-5) ---
  {
    id: 1,
    language: 'javascript',
    difficulty: 'easy',
    title: 'Basic Addition',
    description: 'This function should add two numbers, but the output is weird.',
    code: `function add(a, b) {
  return a + b
}

const result = add("5", 10); // Returns "510"`,
    bugLine: 2,
    solution: "return Number(a) + Number(b);",
    explanation: "The '+' operator concatenates if one operand is a string. You need to explicitly convert inputs to numbers."
  },
  {
    id: 2,
    language: 'javascript',
    difficulty: 'easy',
    title: 'Loop Limits',
    description: 'We want to log items 0 through 4.',
    code: `const items = [1, 2, 3, 4, 5];
for (let i = 0; i <= items.length; i++) {
  console.log(items[i]);
}`,
    bugLine: 2,
    solution: "for (let i = 0; i < items.length; i++) {",
    explanation: "Array indices are 0-based. `<= items.length` tries to access an index that doesn't exist (undefined)."
  },
  {
    id: 3,
    language: 'javascript',
    difficulty: 'medium',
    title: 'Async Confusion',
    description: 'The data isn\'t loading correctly.',
    code: `async function fetchData() {
  const data = fetch('https://api.example.com');
  console.log(data.json());
}`,
    bugLine: 2,
    solution: "const data = await fetch('https://api.example.com');",
    explanation: "fetch() returns a Promise. You must 'await' it to get the actual response object."
  },
  {
    id: 4,
    language: 'javascript',
    difficulty: 'easy',
    title: 'Object Equality',
    description: 'Why are these two objects not equal?',
    code: `const obj1 = { id: 1 };
const obj2 = { id: 1 };

if (obj1 === obj2) {
  console.log('Match!');
}`,
    bugLine: 4,
    solution: "if (obj1.id === obj2.id) {",
    explanation: "In JS, objects are compared by reference, not value. Two different objects with same content are not strict equal (===)."
  },
  {
    id: 5,
    language: 'javascript',
    difficulty: 'medium',
    title: 'Closure Trap',
    description: 'It prints 3 three times instead of 0, 1, 2.',
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    bugLine: 1,
    solution: "for (let i = 0; i < 3; i++) {",
    explanation: "'var' has function scope, sharing one 'i' variable. 'let' has block scope, creating a new 'i' for each iteration."
  },

  // --- Python (6-10) ---
  {
    id: 6,
    language: 'python',
    difficulty: 'easy',
    title: 'Indentation Error',
    description: 'The function body seems detached.',
    code: `def greet(name):
print(f"Hello, {name}")`,
    bugLine: 2,
    solution: "  print(f\"Hello, {name}\")",
    explanation: "Python relies on indentation to define blocks. The print statement must be indented."
  },
  {
    id: 7,
    language: 'python',
    difficulty: 'easy',
    title: 'Mutable Default Args',
    description: 'The list keeps growing across calls!',
    code: `def add_item(item, my_list=[]):
  my_list.append(item)
  return my_list`,
    bugLine: 1,
    solution: "def add_item(item, my_list=None):",
    explanation: "Default argument values are evaluated only once at definition time. A mutable default list is shared across all calls."
  },
  {
    id: 8,
    language: 'python',
    difficulty: 'medium',
    title: 'Dictionary Key',
    description: 'Trying to use a list as a dictionary key.',
    code: `my_dict = {}
my_key = [1, 2, 3]
my_dict[my_key] = "Value"`,
    bugLine: 3,
    solution: "my_key = (1, 2, 3)",
    explanation: "Dictionary keys must be immutable (hashable). Lists are mutable; Tuples are immutable and can be keys."
  },
  {
    id: 9,
    language: 'python',
    difficulty: 'easy',
    title: 'String Concatenation',
    description: 'Cannot add integer to string.',
    code: `age = 25
message = "I am " + age + " years old"`,
    bugLine: 2,
    solution: "message = \"I am \" + str(age) + \" years old\"",
    explanation: "Python is strongly typed and does not implicitly convert integers to strings during concatenation."
  },
  {
    id: 10,
    language: 'python',
    difficulty: 'medium',
    title: 'Scope Shadowing',
    description: 'Variable referenced before assignment.',
    code: `x = 10
def modify():
  print(x)
  x += 1`,
    bugLine: 4,
    solution: "  global x; x += 1",
    explanation: "By assigning to 'x' inside the function, Python treats 'x' as a local variable, but you tried to print it before assignment."
  },

  // --- HTML (66-70) ---
  {
    id: 66,
    language: 'html',
    difficulty: 'easy',
    title: 'Unclosed Tag',
    description: 'The layout is broken below the title.',
    code: `<h1>Welcome</h1>
<p>This is a paragraph
<div>Content</div>`,
    bugLine: 2,
    solution: "<p>This is a paragraph</p>",
    explanation: "The <p> tag is not closed, which can cause rendering issues in some browsers or layouts."
  },
  {
    id: 67,
    language: 'html',
    difficulty: 'easy',
    title: 'Image Source',
    description: 'The image is not showing up.',
    code: `<div class="card">
  <img srce="cat.jpg" alt="A cute cat" />
</div>`,
    bugLine: 2,
    solution: "<img src=\"cat.jpg\" alt=\"A cute cat\" />",
    explanation: "The attribute for the image URL is 'src', not 'srce'."
  },
  {
    id: 68,
    language: 'html',
    difficulty: 'medium',
    title: 'ID Duplication',
    description: 'JS selectors are behaving weirdly.',
    code: `<div id="header">Top</div>
<div id="content">
  <button id="header">Click me</button>
</div>`,
    bugLine: 3,
    solution: "<button id=\"btn-click\">Click me</button>",
    explanation: "IDs must be unique within a page. You cannot have two elements with id='header'."
  },

  // --- CSS (71-75) ---
  {
    id: 71,
    language: 'css',
    difficulty: 'easy',
    title: 'Missing Unit',
    description: 'The box has no width.',
    code: `.box {
  background: red;
  width: 200;
}`,
    bugLine: 3,
    solution: "width: 200px;",
    explanation: "CSS lengths (other than 0) require a unit (px, em, rem, etc.)."
  },
  {
    id: 72,
    language: 'css',
    difficulty: 'easy',
    title: 'Wrong Property',
    description: 'Text is not bold.',
    code: `p {
  font-style: bold;
  color: blue;
}`,
    bugLine: 2,
    solution: "font-weight: bold;",
    explanation: "'font-style' is for italic/oblique. Use 'font-weight' for boldness."
  },
  {
    id: 73,
    language: 'css',
    difficulty: 'medium',
    title: 'Padding Syntax',
    description: 'Padding is invalid.',
    code: `.card {
  border: 1px solid black;
  padding: 10px 20px 10px;
}`,
    bugLine: 3,
    solution: "padding: 10px 20px 10px 20px; /* Or 3 values is valid but tricky */",
    explanation: "Wait, 3 values IS valid (Top, Horizontal, Bottom). Actually, the bug here is that user likely wanted 4 values or 2. Let's make it an obvious syntax error for 'easy' level: padding: 10;"
  }
];

// Correcting the CSS logic for the static array to match the bug description better
staticLevels[staticLevels.length - 1] = {
    id: 73,
    language: 'css',
    difficulty: 'easy',
    title: 'Invalid Color',
    description: 'The hex code looks wrong.',
    code: `body {
  background-color: #ZZZZZZ;
}`,
    bugLine: 2,
    solution: "background-color: #FFFFFF;",
    explanation: "Hex colors uses characters 0-9 and A-F. 'Z' is not a valid hex character."
};

export const levels = staticLevels;

export const getLevelsByLanguage = (lang: string) => {
  const existingLevels = staticLevels.filter(l => l.language === lang);
  const needed = 50 - existingLevels.length;
  
  if (needed <= 0) {
    return existingLevels;
  }
  
  // Generate procedural levels to fill the gap
  // Start IDs at 1000 to avoid collisions with static IDs
  const generatedLevels: Level[] = [];
  for (let i = 0; i < needed; i++) {
    generatedLevels.push(generateLevel(lang as Language, 1000 + i));
  }
  
  return [...existingLevels, ...generatedLevels];
};