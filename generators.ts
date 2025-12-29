import { Level, Language, Difficulty } from './types';

// Helpers for randomization
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const VARS = ['x', 'y', 'count', 'index', 'total', 'score', 'limit', 'value', 'result', 'temp'];

// Template Interface
interface BugTemplate {
  title: string;
  description: string;
  difficulty: Difficulty;
  generate: () => { code: string; bugLine: number; solution: string; explanation: string };
}

// --- Generators per Language ---

const jsTemplates: BugTemplate[] = [
  {
    title: 'String Math',
    description: 'Addition behaving strangely.',
    difficulty: 'easy',
    generate: () => {
      const v1 = getRandomItem(VARS);
      const val = getRandomInt(10, 99);
      return {
        code: `const ${v1} = "${val}";\nconst res = ${v1} + 10;\nconsole.log(res); // Prints "${val}10"`,
        bugLine: 2,
        solution: `const res = Number(${v1}) + 10;`,
        explanation: "Adding a number to a string results in concatenation."
      };
    }
  },
  {
    title: 'Const Reassignment',
    description: 'Cannot update variable.',
    difficulty: 'easy',
    generate: () => {
      const v1 = getRandomItem(VARS);
      return {
        code: `const ${v1} = ${getRandomInt(1, 10)};\n${v1} = ${getRandomInt(11, 20)};`,
        bugLine: 2,
        solution: `${v1} = ${getRandomInt(11, 20)}; // Change const to let`,
        explanation: "Variables declared with 'const' cannot be reassigned. Use 'let'."
      };
    }
  },
  {
    title: 'Off By One',
    description: 'Loop runs too many times.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `const arr = [1, 2, 3];\nfor(let i=0; i<=arr.length; i++) {\n  console.log(arr[i]);\n}`,
        bugLine: 2,
        solution: `for(let i=0; i<arr.length; i++) {`,
        explanation: "Arrays are 0-indexed. Condition should be i < arr.length."
      };
    }
  }
];

const tsTemplates: BugTemplate[] = [
  {
    title: 'Type Mismatch',
    description: 'Type error on assignment.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `let ${v}: number = ${getRandomInt(1, 10)};\n${v} = "hello";`,
        bugLine: 2,
        solution: `${v} = ${getRandomInt(11, 20)};`,
        explanation: "Cannot assign type 'string' to type 'number'."
      };
    }
  },
  {
    title: 'Optional Property',
    description: 'Object is possibly undefined.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `interface Data { val?: string }\nfunction print(d: Data) {\n  console.log(d.val.length);\n}`,
        bugLine: 3,
        solution: `console.log(d.val?.length);`,
        explanation: "Property 'val' is optional. Use optional chaining (?.) to access it safely."
      };
    }
  }
];

const pyTemplates: BugTemplate[] = [
  {
    title: 'String Concat',
    description: 'TypeError: can only concatenate str to str.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `${v} = ${getRandomInt(1, 10)}\nprint("Value: " + ${v})`,
        bugLine: 2,
        solution: `print("Value: " + str(${v}))`,
        explanation: "Python is strongly typed. You must explicitly convert numbers to strings."
      };
    }
  },
  {
    title: 'Indentation',
    description: 'SyntaxError: unexpected indent.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `def run():\nprint("Running")`,
        bugLine: 2,
        solution: `  print("Running")`,
        explanation: "Python relies on indentation. The function body must be indented."
      };
    }
  },
   {
    title: 'Mutable Default',
    description: 'List keeps growing.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `def add(x, l=[]):\n  l.append(x)\n  return l`,
        bugLine: 1,
        solution: `def add(x, l=None):`,
        explanation: "Do not use mutable objects as default arguments."
      };
    }
  }
];

const cppTemplates: BugTemplate[] = [
  {
    title: 'Missing Semicolon',
    description: 'Syntax error.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `int main() {\n  int ${v} = ${getRandomInt(1,100)}\n  return 0;\n}`,
        bugLine: 2,
        solution: `int ${v} = ${getRandomInt(1,100)};`,
        explanation: "Statements in C++ must end with a semicolon."
      };
    }
  },
  {
    title: 'Integer Division',
    description: 'Result is 0.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `double res = 1 / 2;\nstd::cout << res;`,
        bugLine: 1,
        solution: `double res = 1.0 / 2.0;`,
        explanation: "Integer division truncates decimals."
      };
    }
  }
];

const javaTemplates: BugTemplate[] = [
  {
    title: 'String Compare',
    description: 'Comparison failed.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `String a = new String("test");\nif (a == "test") {\n  System.out.println("Match");\n}`,
        bugLine: 2,
        solution: `if (a.equals("test")) {`,
        explanation: "Use .equals() for value comparison in Java, not ==."
      };
    }
  },
  {
    title: 'Null Pointer',
    description: 'Crash on null.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `String s = null;\nSystem.out.println(s.length());`,
        bugLine: 2,
        solution: `if (s != null) System.out.println(s.length());`,
        explanation: "Cannot call method on null object."
      };
    }
  }
];

const csharpTemplates: BugTemplate[] = [
  {
    title: 'Case Sensitivity',
    description: 'Method not found.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `Console.writeline("Hello");`,
        bugLine: 1,
        solution: `Console.WriteLine("Hello");`,
        explanation: "C# is case sensitive. Use WriteLine."
      };
    }
  },
  {
    title: 'Null Check',
    description: 'Object is null.',
    difficulty: 'medium',
    generate: () => {
       return {
        code: `string s = null;\nint l = s.Length;`,
        bugLine: 2,
        solution: `int? l = s?.Length;`,
        explanation: "Use null conditional operator (?.)."
      };
    }
  }
];

const rustTemplates: BugTemplate[] = [
  {
    title: 'Immutability',
    description: 'Cannot assign twice.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `let ${v} = 10;\n${v} = 20;`,
        bugLine: 1,
        solution: `let mut ${v} = 10;`,
        explanation: "Variables are immutable by default in Rust."
      };
    }
  },
  {
    title: 'Ownership',
    description: 'Value moved.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `let s1 = String::from("hi");\nlet s2 = s1;\nprintln!("{}", s1);`,
        bugLine: 3,
        solution: `println!("{}", s2);`,
        explanation: "s1 was moved to s2. s1 is invalid."
      };
    }
  }
];

const goTemplates: BugTemplate[] = [
  {
    title: 'Unused Var',
    description: 'Compile error.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `func main() {\n  ${v} := 10\n}`,
        bugLine: 2,
        solution: `_ = ${v}`,
        explanation: "Go does not allow unused variables."
      };
    }
  },
  {
    title: 'Assignment',
    description: 'Syntax error.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `${v} := 10\n${v} := 20`,
        bugLine: 2,
        solution: `${v} = 20`,
        explanation: "Use = for assignment, := is for declaration."
      };
    }
  }
];

const phpTemplates: BugTemplate[] = [
  {
    title: 'Missing Sigil',
    description: 'Parse error.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `${v} = 10;\necho ${v};`,
        bugLine: 1,
        solution: `$${v} = 10;`,
        explanation: "Variables in PHP must start with $."
      };
    }
  },
  {
    title: 'Concat',
    description: 'Math instead of string.',
    difficulty: 'easy',
    generate: () => {
       return {
        code: `$a = "Hello " + "World";`,
        bugLine: 1,
        solution: `$a = "Hello " . "World";`,
        explanation: "PHP uses . for concatenation, not +."
      };
    }
  }
];

const kotlinTemplates: BugTemplate[] = [
  {
    title: 'Val Reassign',
    description: 'Val cannot be reassigned.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `val ${v} = 5\n${v} = 10`,
        bugLine: 2,
        solution: `var ${v} = 5`,
        explanation: "Use var for mutable variables."
      };
    }
  },
  {
    title: 'Null Safety',
    description: 'Type mismatch.',
    difficulty: 'easy',
    generate: () => {
      const v = getRandomItem(VARS);
      return {
        code: `var ${v}: String = null`,
        bugLine: 1,
        solution: `var ${v}: String? = null`,
        explanation: "Non-nullable types cannot hold null."
      };
    }
  }
];

const scalaTemplates: BugTemplate[] = [
  {
    title: 'Val Reassign',
    description: 'Reassignment to val.',
    difficulty: 'easy',
    generate: () => {
       const v = getRandomItem(VARS);
       return {
         code: `val ${v} = 1\n${v} = 2`,
         bugLine: 2,
         solution: `var ${v} = 1`,
         explanation: "Use var for mutable variables."
       };
    }
  },
  {
    title: 'List Add',
    description: 'Immutable list.',
    difficulty: 'medium',
    generate: () => {
      return {
        code: `val l = List(1,2)\nl += 3`,
        bugLine: 2,
        solution: `val l2 = l :+ 3`,
        explanation: "List is immutable. Create a new list."
      };
    }
  }
];

const swiftTemplates: BugTemplate[] = [
  {
    title: 'Force Unwrap',
    description: 'Fatal error.',
    difficulty: 'easy',
    generate: () => {
       return {
         code: `var s: String? = nil\nprint(s!)`,
         bugLine: 2,
         solution: `if let v = s { print(v) }`,
         explanation: "Force unwrapping nil causes a crash."
       };
    }
  },
   {
    title: 'Let Reassign',
    description: 'Constant mutation.',
    difficulty: 'easy',
    generate: () => {
       const v = getRandomItem(VARS);
       return {
         code: `let ${v} = 10\n${v} = 20`,
         bugLine: 2,
         solution: `var ${v} = 10`,
         explanation: "Use var for variables that change."
       };
    }
  }
];

const rubyTemplates: BugTemplate[] = [
  {
    title: 'Concat',
    description: 'Type error.',
    difficulty: 'easy',
    generate: () => {
       return {
         code: `puts "Age: " + 25`,
         bugLine: 1,
         solution: `puts "Age: " + 25.to_s`,
         explanation: "Explicitly convert numbers to string."
       };
    }
  },
  {
    title: 'Missing End',
    description: 'Syntax error.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `if true\n  puts "ok"`,
        bugLine: 2,
        solution: `end`,
        explanation: "Blocks must be closed with end."
      };
    }
  }
];

const htmlTemplates: BugTemplate[] = [
  {
    title: 'Unclosed Tag',
    description: 'Breaking the layout.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `<div>\n  <p>Hello World\n</div>`,
        bugLine: 2,
        solution: `  <p>Hello World</p>`,
        explanation: "Paragraph tag <p> must be closed with </p>."
      };
    }
  },
  {
    title: 'Invalid Attribute',
    description: 'Link not working.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `<a href="https://example.com">\n  Link\n</a href>`,
        bugLine: 3,
        solution: `</a>`,
        explanation: "Closing tags do not contain attributes. Just use </a>."
      };
    }
  }
];

const cssTemplates: BugTemplate[] = [
  {
    title: 'Missing Unit',
    description: 'Layout ignored.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `.box {\n  width: 100;\n  height: 100px;\n}`,
        bugLine: 2,
        solution: `  width: 100px;`,
        explanation: "Non-zero values in CSS must have a unit (e.g., px, em, %)."
      };
    }
  },
  {
    title: 'Invalid Property',
    description: 'Text color not changing.',
    difficulty: 'easy',
    generate: () => {
      return {
        code: `.text {\n  text-color: red;\n}`,
        bugLine: 2,
        solution: `  color: red;`,
        explanation: "The property to change text color is 'color', not 'text-color'."
      };
    }
  }
];


const TEMPLATES: Record<Language, BugTemplate[]> = {
  javascript: jsTemplates,
  typescript: tsTemplates,
  python: pyTemplates,
  cpp: cppTemplates,
  java: javaTemplates,
  csharp: csharpTemplates,
  rust: rustTemplates,
  go: goTemplates,
  php: phpTemplates,
  kotlin: kotlinTemplates,
  scala: scalaTemplates,
  swift: swiftTemplates,
  ruby: rubyTemplates,
  html: htmlTemplates,
  css: cssTemplates
};

export const generateLevel = (lang: Language, id: number): Level => {
  const templates = TEMPLATES[lang] || jsTemplates;
  const template = getRandomItem(templates);
  const data = template.generate();
  
  return {
    id,
    language: lang,
    difficulty: template.difficulty,
    title: `${template.title} #${id}`,
    description: template.description,
    code: data.code,
    bugLine: data.bugLine,
    solution: data.solution,
    explanation: data.explanation
  };
};