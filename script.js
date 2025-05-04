require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' } });

let editor;

document.addEventListener('DOMContentLoaded', function () {
  require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
      value: '// Write your code here\n',
      language: 'python',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true
    });

    // Defensive check for window.editor
    document.getElementById('aiReviewBtn').addEventListener('click', async function() {
      if (!window.editor) {
        alert('Editor not loaded yet!');
        return;
      }
      const code = window.editor.getValue();
      const language = document.getElementById('languageSelect').value;
      try {
        const response = await fetch('http://localhost:3000/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        });
        const data = await response.json();
        document.getElementById('aiReviewText').textContent = data.review;
      } catch (error) {
        document.getElementById('aiReviewText').textContent = 'Error getting AI review. Please try again.';
      }
    });

    document.getElementById('runBtn').addEventListener('click', async function() {
      if (!window.editor) {
        alert('Editor not loaded yet!');
        return;
      }
      const code = window.editor.getValue();
      const language = document.getElementById('languageSelect').value;
      try {
        const response = await fetch('http://localhost:3000/api/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        });
        const data = await response.json();
        if (data.error) {
          document.getElementById('aiReviewText').textContent = `Error: ${data.error}`;
        } else {
          document.getElementById('aiReviewText').textContent = `Output:\n${data.output}`;
        }
      } catch (error) {
        document.getElementById('aiReviewText').textContent = 'Error running code. Please try again.';
      }
    });

    document.getElementById('verifyBtn').addEventListener('click', async function() {
      if (!window.editor) {
        alert('Editor not loaded yet!');
        return;
      }
      const code = window.editor.getValue();
      const language = document.getElementById('languageSelect').value;
      const courseId = getCourseFromUrl();
      const courseKey = document.querySelector('.course-item.selected')?.getAttribute('data-course');
      if (!courseKey) {
        document.getElementById('aiReviewText').textContent = 'Please select a lesson first.';
        return;
      }
      const testCases = courseData[courseId].lessons[courseKey].testCases;
      try {
        const response = await fetch('http://localhost:3000/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, testCases })
        });
        const data = await response.json();
        document.getElementById('aiReviewText').textContent = data.message;
      } catch (error) {
        document.getElementById('aiReviewText').textContent = 'Error verifying code. Please try again.';
      }
    });

    // Other event listeners (reset, copy, clear, etc.) can also be moved here if needed
  });

  // Other DOMContentLoaded logic (course initialization, etc.)
  initializeCourse();
  updateVideoAndEditorHeight();
});

// Course data with different languages
const courseData = {
  python: {
    title: "Python Programming Bootcamp",
    level: "Beginner",
    image: "https://img-c.udemycdn.com/course/480x270/567828_67d0.jpg",
    instructor: {
      name: "John Smith",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.8,
      students: 15000
    },
    category: "Programming",
    lessons: {
      intro: {
        title: "Introduction",
        desc: "Welcome to LearnX! In this module, you'll get an overview of Python and what you'll learn in this bootcamp.",
        code: "# Print Hello World\nprint('Hello, World!')",
        video: "https://www.youtube.com/embed/rfscVS0vtbw",
        duration: "12:34",
        testCases: [
          { input: "", expected: "Hello, World!" }
        ]
      },
      setup: {
        title: "Setup Environment",
        desc: "Learn how to set up Python and your development environment for coding.",
        code: "# Check Python version\nimport sys\nprint(sys.version)",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "08:45",
        testCases: [
          { input: "", expected: "3." }
        ]
      },
      "first-func": {
        title: "Writing First Function",
        desc: "Let's write your first Python function and understand how functions work.",
        code: "def greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('LearnX'))",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "15:20",
        testCases: [
          { input: "LearnX", expected: "Hello, LearnX!" }
        ]
      },
      debug: {
        title: "Debugging Tips",
        desc: "Debugging is an essential skill. Learn how to find and fix errors in your code.",
        code: "# This code has a bug!\ndef add(a, b):\n    return a + b\n\nprint(add(2, '3'))",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "10:15",
        testCases: [
          { input: "2,3", expected: "5" }
        ]
      },
      final: {
        title: "Final Project",
        desc: "Apply everything you've learned in a final project. Good luck!",
        code: "# Your final project code goes here\n",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "25:00",
        testCases: []
      }
    }
  },
  javascript: {
    title: "JavaScript Mastery",
    level: "Intermediate",
    image: "https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg",
    instructor: {
      name: "Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4.9,
      students: 20000
    },
    category: "Programming",
    lessons: {
      intro: {
        title: "Introduction to JavaScript",
        desc: "Welcome to JavaScript! Learn the basics of this powerful programming language.",
        code: "// Print Hello World\nconsole.log('Hello, World!');",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "10:00",
        testCases: [
          { input: "", expected: "Hello, World!" }
        ]
      },
      setup: {
        title: "JavaScript Environment",
        desc: "Set up your JavaScript development environment and tools.",
        code: "// Check Node.js version\nconsole.log(process.version);",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "08:00",
        testCases: [
          { input: "", expected: "v" }
        ]
      },
      "first-func": {
        title: "Functions in JavaScript",
        desc: "Learn how to write and use functions in JavaScript.",
        code: "function greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconsole.log(greet('LearnX'));",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "15:00",
        testCases: [
          { input: "LearnX", expected: "Hello, LearnX!" }
        ]
      },
      debug: {
        title: "Debugging JavaScript",
        desc: "Master the art of debugging JavaScript code.",
        code: "// This code has a bug!\nfunction add(a, b) {\n    return a + b;\n}\n\nconsole.log(add(2, '3'));",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "12:00",
        testCases: [
          { input: "2,3", expected: "5" }
        ]
      },
      final: {
        title: "JavaScript Project",
        desc: "Build a complete JavaScript project using everything you've learned.",
        code: "// Your JavaScript project code goes here\n",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        duration: "30:00",
        testCases: []
      }
    }
  },
  react: {
    title: "React - The Complete Guide",
    level: "Intermediate",
    image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
    instructor: {
      name: "Mike Wilson",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 4.7,
      students: 18000
    },
    category: "Web Development",
    lessons: {
      intro: {
        title: "Introduction to React",
        desc: "Get an overview of React and what you'll learn in this course.",
        code: "// Welcome to React\nconsole.log('Hello, React!');",
        video: "https://www.youtube.com/embed/dGcsHMXbSOA",
        duration: "10:00",
        testCases: []
      },
      jsx: {
        title: "JSX and Rendering",
        desc: "Learn about JSX syntax and how React renders UI.",
        code: "// JSX Example\nconst element = <h1>Hello, world!</h1>;",
        video: "https://www.youtube.com/embed/Ke90Tje7VS0",
        duration: "12:00",
        testCases: []
      },
      components: {
        title: "Components and Props",
        desc: "Understand React components and how to use props.",
        code: "function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}",
        video: "https://www.youtube.com/embed/MhkGQAoc7bc",
        duration: "15:00",
        testCases: []
      },
      state: {
        title: "State and Lifecycle",
        desc: "Learn about state management and lifecycle methods in React.",
        code: "class Clock extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {date: new Date()};\n  }\n}",
        video: "https://www.youtube.com/embed/DPnqb74Smug",
        duration: "14:00",
        testCases: []
      },
      events: {
        title: "Handling Events",
        desc: "Handle user events in React components.",
        code: "<button onClick={activateLasers}>Activate Lasers</button>",
        video: "https://www.youtube.com/embed/3e1GHCA3GP0",
        duration: "11:00",
        testCases: []
      },
      hooks: {
        title: "React Hooks",
        desc: "Introduction to React Hooks like useState and useEffect.",
        code: "import React, { useState } from 'react';\nconst [count, setCount] = useState(0);",
        video: "https://www.youtube.com/embed/f687hBjwFcM",
        duration: "13:00",
        testCases: []
      },
      router: {
        title: "React Router",
        desc: "Learn how to use React Router for navigation.",
        code: "import { BrowserRouter, Route } from 'react-router-dom';",
        video: "https://www.youtube.com/embed/Law7wfdg_ls",
        duration: "12:00",
        testCases: []
      },
      context: {
        title: "Context API",
        desc: "Manage global state with React Context API.",
        code: "const MyContext = React.createContext();",
        video: "https://www.youtube.com/embed/35lXWvCuM8o",
        duration: "10:00",
        testCases: []
      },
      redux: {
        title: "Redux Basics",
        desc: "Introduction to Redux for state management.",
        code: "import { createStore } from 'redux';",
        video: "https://www.youtube.com/embed/poQXNp9ItL4",
        duration: "15:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Build a complete React app as your final project.",
        code: "// Your React project code goes here\n",
        video: "https://www.youtube.com/embed/4UZrsTqkcW4",
        duration: "20:00",
        testCases: []
      }
    }
  },
  datascience: {
    title: "Data Science & Machine Learning",
    level: "Advanced",
    image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
    instructor: {
      name: "David Brown",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      rating: 4.8,
      students: 19000
    },
    category: "Data Science",
    lessons: {
      intro: {
        title: "Introduction to Data Science",
        desc: "Overview of data science and its applications.",
        code: "# Data Science\nprint('Welcome to Data Science!')",
        video: "https://www.youtube.com/embed/ua-CiDNNj30",
        duration: "10:00",
        testCases: []
      },
      python: {
        title: "Python for Data Science",
        desc: "Learn Python basics for data science.",
        code: "import numpy as np\nprint(np.array([1,2,3]))",
        video: "https://www.youtube.com/embed/r-uOLxNrNk8",
        duration: "12:00",
        testCases: []
      },
      pandas: {
        title: "Data Analysis with Pandas",
        desc: "Analyze data using the Pandas library.",
        code: "import pandas as pd\ndf = pd.DataFrame()",
        video: "https://www.youtube.com/embed/vmEHCJofslg",
        duration: "15:00",
        testCases: []
      },
      numpy: {
        title: "Numerical Computing with NumPy",
        desc: "Learn about arrays and numerical operations with NumPy.",
        code: "import numpy as np\na = np.array([1,2,3])",
        video: "https://www.youtube.com/embed/8Mpc9ukltVA",
        duration: "14:00",
        testCases: []
      },
      viz: {
        title: "Data Visualization",
        desc: "Visualize data using Matplotlib and Seaborn.",
        code: "import matplotlib.pyplot as plt\nplt.plot([1,2,3],[4,5,6])",
        video: "https://www.youtube.com/embed/0P7QnIQDBJY",
        duration: "11:00",
        testCases: []
      },
      ml: {
        title: "Machine Learning Basics",
        desc: "Introduction to machine learning concepts.",
        code: "from sklearn.linear_model import LinearRegression",
        video: "https://www.youtube.com/embed/GwIo3gDZCVQ",
        duration: "13:00",
        testCases: []
      },
      regression: {
        title: "Regression Analysis",
        desc: "Learn about regression techniques in ML.",
        code: "# Linear Regression Example",
        video: "https://www.youtube.com/embed/nk2CQITm_eo",
        duration: "12:00",
        testCases: []
      },
      classification: {
        title: "Classification Techniques",
        desc: "Explore classification algorithms.",
        code: "# Classification Example",
        video: "https://www.youtube.com/embed/AoeEHqVSNOw",
        duration: "10:00",
        testCases: []
      },
      clustering: {
        title: "Clustering Algorithms",
        desc: "Learn about clustering in ML.",
        code: "# KMeans Example",
        video: "https://www.youtube.com/embed/4b5d3muPQmA",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Apply your knowledge in a data science project.",
        code: "# Your data science project code goes here\n",
        video: "https://www.youtube.com/embed/aircAruvnKk",
        duration: "20:00",
        testCases: []
      }
    }
  },
  java: {
    title: "Java Programming Masterclass",
    level: "Intermediate",
    image: "https://img-c.udemycdn.com/course/480x270/2196488_8fc7_10.jpg",
    instructor: {
      name: "Robert Taylor",
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      rating: 4.7,
      students: 17000
    },
    category: "Programming",
    lessons: {
      intro: {
        title: "Introduction to Java",
        desc: "Overview of Java and its ecosystem.",
        code: "// Java Hello World\npublic class Main { public static void main(String[] args) { System.out.println(\"Hello, Java!\"); } }",
        video: "https://www.youtube.com/embed/eIrMbAQSU34",
        duration: "10:00",
        testCases: []
      },
      basics: {
        title: "Java Basics",
        desc: "Learn Java syntax and basic programming.",
        code: "int a = 5; int b = 10; System.out.println(a + b);",
        video: "https://www.youtube.com/embed/grEKMHGYyns",
        duration: "12:00",
        testCases: []
      },
      oop: {
        title: "Object-Oriented Programming",
        desc: "Understand OOP concepts in Java.",
        code: "class Dog { String name; }",
        video: "https://www.youtube.com/embed/UmnCZ7-9yDY",
        duration: "15:00",
        testCases: []
      },
      collections: {
        title: "Collections Framework",
        desc: "Learn about Java collections.",
        code: "import java.util.ArrayList;",
        video: "https://www.youtube.com/embed/0s__qw6wzSQ",
        duration: "14:00",
        testCases: []
      },
      exceptions: {
        title: "Exception Handling",
        desc: "Handle errors and exceptions in Java.",
        code: "try { ... } catch(Exception e) { ... }",
        video: "https://www.youtube.com/embed/CMd8lH8g1WA",
        duration: "11:00",
        testCases: []
      },
      gui: {
        title: "Java GUI Programming",
        desc: "Create GUIs with Java Swing.",
        code: "import javax.swing.JFrame;",
        video: "https://www.youtube.com/embed/5o3fMLPY7qY",
        duration: "13:00",
        testCases: []
      },
      threads: {
        title: "Multithreading",
        desc: "Learn about threads and concurrency.",
        code: "Thread t = new Thread();",
        video: "https://www.youtube.com/embed/0hvmK5K3Qac",
        duration: "12:00",
        testCases: []
      },
      files: {
        title: "File I/O",
        desc: "Read and write files in Java.",
        code: "File file = new File(\"test.txt\");",
        video: "https://www.youtube.com/embed/1uFY60CESlM",
        duration: "10:00",
        testCases: []
      },
      jdbc: {
        title: "JDBC and Databases",
        desc: "Connect Java to databases with JDBC.",
        code: "import java.sql.Connection;",
        video: "https://www.youtube.com/embed/htp6jz6gGzA",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Build a Java application as your final project.",
        code: "// Your Java project code goes here\n",
        video: "https://www.youtube.com/embed/GoXwIVyNvX0",
        duration: "20:00",
        testCases: []
      }
    }
  },
  cpp: {
    title: "C++ Fundamentals",
    level: "Beginner",
    image: "https://img-c.udemycdn.com/course/480x270/1561458_7f3b_2.jpg",
    instructor: {
      name: "Lisa Anderson",
      image: "https://randomuser.me/api/portraits/women/7.jpg",
      rating: 4.6,
      students: 16000
    },
    category: "Programming",
    lessons: {
      intro: {
        title: "Introduction to C++",
        desc: "Overview of C++ and its features.",
        code: "// C++ Hello World\n#include <iostream>\nint main() { std::cout << \"Hello, C++!\"; return 0; }",
        video: "https://www.youtube.com/embed/vLnPwxZdW4Y",
        duration: "10:00",
        testCases: []
      },
      basics: {
        title: "C++ Basics",
        desc: "Learn C++ syntax and basic programming.",
        code: "int a = 5; int b = 10; std::cout << a + b;",
        video: "https://www.youtube.com/embed/18c3MTX0PK0",
        duration: "12:00",
        testCases: []
      },
      oop: {
        title: "Object-Oriented Programming",
        desc: "Understand OOP concepts in C++.",
        code: "class Dog { public: std::string name; };",
        video: "https://www.youtube.com/embed/xnqTKD8uD64",
        duration: "15:00",
        testCases: []
      },
      pointers: {
        title: "Pointers and References",
        desc: "Learn about pointers and references in C++.",
        code: "int* p = &a;",
        video: "https://www.youtube.com/embed/DTxHyVn0ODg",
        duration: "14:00",
        testCases: []
      },
      stl: {
        title: "Standard Template Library (STL)",
        desc: "Use STL containers and algorithms.",
        code: "#include <vector>\nstd::vector<int> v;",
        video: "https://www.youtube.com/embed/3e1GHCA3GP0",
        duration: "11:00",
        testCases: []
      },
      files: {
        title: "File I/O",
        desc: "Read and write files in C++.",
        code: "#include <fstream>\nstd::ofstream file(\"test.txt\");",
        video: "https://www.youtube.com/embed/WR31ByTzAVQ",
        duration: "13:00",
        testCases: []
      },
      templates: {
        title: "Templates",
        desc: "Learn about templates in C++.",
        code: "template <typename T> T add(T a, T b) { return a + b; }",
        video: "https://www.youtube.com/embed/1v_4dL8l5DI",
        duration: "12:00",
        testCases: []
      },
      exceptions: {
        title: "Exception Handling",
        desc: "Handle errors and exceptions in C++.",
        code: "try { ... } catch(std::exception& e) { ... }",
        video: "https://www.youtube.com/embed/1v_4dL8l5DI",
        duration: "10:00",
        testCases: []
      },
      algorithms: {
        title: "Algorithms",
        desc: "Use STL algorithms in C++.",
        code: "#include <algorithm>\nstd::sort(v.begin(), v.end());",
        video: "https://www.youtube.com/embed/8jLOx1hD3_o",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Build a C++ application as your final project.",
        code: "// Your C++ project code goes here\n",
        video: "https://www.youtube.com/embed/GoXwIVyNvX0",
        duration: "20:00",
        testCases: []
      }
    }
  },
  sql: {
    title: "SQL & Databases",
    level: "Intermediate",
    image: "https://img-c.udemycdn.com/course/480x270/1463348_52a4_2.jpg",
    instructor: {
      name: "James Wilson",
      image: "https://randomuser.me/api/portraits/men/8.jpg",
      rating: 4.8,
      students: 18000
    },
    category: "Data Science",
    lessons: {
      intro: {
        title: "Introduction to SQL",
        desc: "Overview of SQL and relational databases.",
        code: "-- SQL Hello World\nSELECT 'Hello, SQL!';",
        video: "https://www.youtube.com/embed/7S_tz1z_5bA",
        duration: "10:00",
        testCases: []
      },
      basics: {
        title: "SQL Basics",
        desc: "Learn SQL syntax and basic queries.",
        code: "SELECT * FROM users;",
        video: "https://www.youtube.com/embed/9Pzj7Aj25lw",
        duration: "12:00",
        testCases: []
      },
      joins: {
        title: "Joins in SQL",
        desc: "Learn about different types of joins.",
        code: "SELECT * FROM a JOIN b ON a.id = b.id;",
        video: "https://www.youtube.com/embed/9yeOJ0ZMUYw",
        duration: "15:00",
        testCases: []
      },
      groupby: {
        title: "GROUP BY and Aggregations",
        desc: "Use GROUP BY and aggregate functions.",
        code: "SELECT COUNT(*), city FROM users GROUP BY city;",
        video: "https://www.youtube.com/embed/9Pzj7Aj25lw",
        duration: "14:00",
        testCases: []
      },
      subqueries: {
        title: "Subqueries",
        desc: "Write subqueries in SQL.",
        code: "SELECT * FROM users WHERE id IN (SELECT id FROM orders);",
        video: "https://www.youtube.com/embed/7S_tz1z_5bA",
        duration: "11:00",
        testCases: []
      },
      indexes: {
        title: "Indexes and Performance",
        desc: "Learn about indexes and query optimization.",
        code: "CREATE INDEX idx_name ON users(name);",
        video: "https://www.youtube.com/embed/9Pzj7Aj25lw",
        duration: "13:00",
        testCases: []
      },
      transactions: {
        title: "Transactions",
        desc: "Understand transactions in SQL.",
        code: "BEGIN; UPDATE users SET name='A' WHERE id=1; COMMIT;",
        video: "https://www.youtube.com/embed/7S_tz1z_5bA",
        duration: "12:00",
        testCases: []
      },
      nosql: {
        title: "NoSQL Overview",
        desc: "Introduction to NoSQL databases.",
        code: "// NoSQL Example",
        video: "https://www.youtube.com/embed/ujwCw5pdrTM",
        duration: "10:00",
        testCases: []
      },
      orm: {
        title: "ORMs and SQL in Code",
        desc: "Use ORMs to interact with databases in code.",
        code: "// ORM Example",
        video: "https://www.youtube.com/embed/9Pzj7Aj25lw",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Build a database-driven application as your final project.",
        code: "-- Your SQL project code goes here\n",
        video: "https://www.youtube.com/embed/GoXwIVyNvX0",
        duration: "20:00",
        testCases: []
      }
    }
  },
  cybersecurity: {
    title: "Cybersecurity Essentials",
    level: "Advanced",
    image: "https://img-c.udemycdn.com/course/480x270/1565838_e54e_16.jpg",
    instructor: {
      name: "Patricia Moore",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      rating: 4.9,
      students: 15000
    },
    category: "Cybersecurity",
    lessons: {
      intro: {
        title: "Introduction to Cybersecurity",
        desc: "Overview of cybersecurity and its importance.",
        code: "# Cybersecurity\nprint('Welcome to Cybersecurity!')",
        video: "https://www.youtube.com/embed/inWWhr5tnEA",
        duration: "10:00",
        testCases: []
      },
      threats: {
        title: "Types of Threats",
        desc: "Learn about different types of cyber threats.",
        code: "# Threats Example",
        video: "https://www.youtube.com/embed/2e--5cGJ4Ik",
        duration: "12:00",
        testCases: []
      },
      malware: {
        title: "Malware and Viruses",
        desc: "Understand malware and how to protect against it.",
        code: "# Malware Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "15:00",
        testCases: []
      },
      phishing: {
        title: "Phishing Attacks",
        desc: "Learn about phishing and how to avoid it.",
        code: "# Phishing Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "14:00",
        testCases: []
      },
      firewalls: {
        title: "Firewalls and Network Security",
        desc: "Introduction to firewalls and securing networks.",
        code: "# Firewall Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "11:00",
        testCases: []
      },
      encryption: {
        title: "Encryption Basics",
        desc: "Learn about encryption and cryptography.",
        code: "# Encryption Example",
        video: "https://www.youtube.com/embed/AQDCe585Lnc",
        duration: "13:00",
        testCases: []
      },
      passwords: {
        title: "Password Security",
        desc: "Best practices for password security.",
        code: "# Password Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "12:00",
        testCases: []
      },
      pentesting: {
        title: "Penetration Testing",
        desc: "Introduction to penetration testing.",
        code: "# Pentesting Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "10:00",
        testCases: []
      },
      compliance: {
        title: "Compliance and Standards",
        desc: "Learn about cybersecurity compliance.",
        code: "# Compliance Example",
        video: "https://www.youtube.com/embed/28ZbKFxj6E0",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Apply your knowledge in a cybersecurity project.",
        code: "# Your cybersecurity project code goes here\n",
        video: "https://www.youtube.com/embed/GoXwIVyNvX0",
        duration: "20:00",
        testCases: []
      }
    }
  },
  cloud: {
    title: "Cloud Computing & AWS",
    level: "Advanced",
    image: "https://img-c.udemycdn.com/course/480x270/2196488_8fc7_10.jpg",
    instructor: {
      name: "Thomas Clark",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      rating: 4.7,
      students: 20000
    },
    category: "Cloud Computing",
    lessons: {
      intro: {
        title: "Introduction to Cloud Computing",
        desc: "Overview of cloud computing and AWS.",
        code: "# Cloud Computing\nprint('Welcome to the Cloud!')",
        video: "https://www.youtube.com/embed/2LaAJq1lB1Q",
        duration: "10:00",
        testCases: []
      },
      basics: {
        title: "Cloud Basics",
        desc: "Learn the basics of cloud computing.",
        code: "# Cloud Basics Example",
        video: "https://www.youtube.com/embed/2LaAJq1lB1Q",
        duration: "12:00",
        testCases: []
      },
      aws: {
        title: "Getting Started with AWS",
        desc: "Introduction to AWS services.",
        code: "# AWS Example",
        video: "https://www.youtube.com/embed/ulprqHHWlng",
        duration: "15:00",
        testCases: []
      },
      s3: {
        title: "Amazon S3",
        desc: "Learn about Amazon S3 storage.",
        code: "# S3 Example",
        video: "https://www.youtube.com/embed/2LaAJq1lB1Q",
        duration: "14:00",
        testCases: []
      },
      ec2: {
        title: "Amazon EC2",
        desc: "Introduction to Amazon EC2 compute service.",
        code: "# EC2 Example",
        video: "https://www.youtube.com/embed/ulprqHHWlng",
        duration: "11:00",
        testCases: []
      },
      lambda: {
        title: "AWS Lambda",
        desc: "Learn about serverless computing with Lambda.",
        code: "# Lambda Example",
        video: "https://www.youtube.com/embed/2LaAJq1lB1Q",
        duration: "13:00",
        testCases: []
      },
      devops: {
        title: "DevOps in the Cloud",
        desc: "Introduction to DevOps practices in cloud.",
        code: "# DevOps Example",
        video: "https://www.youtube.com/embed/ulprqHHWlng",
        duration: "12:00",
        testCases: []
      },
      security: {
        title: "Cloud Security",
        desc: "Learn about security in the cloud.",
        code: "# Cloud Security Example",
        video: "https://www.youtube.com/embed/2LaAJq1lB1Q",
        duration: "10:00",
        testCases: []
      },
      monitoring: {
        title: "Monitoring and Management",
        desc: "Monitor and manage cloud resources.",
        code: "# Monitoring Example",
        video: "https://www.youtube.com/embed/ulprqHHWlng",
        duration: "11:00",
        testCases: []
      },
      final: {
        title: "Final Project",
        desc: "Build a cloud-based project as your final project.",
        code: "# Your cloud project code goes here\n",
        video: "https://www.youtube.com/embed/GoXwIVyNvX0",
        duration: "20:00",
        testCases: []
      }
    }
  }
};

// Categories data
const categories = [
  { id: "programming", name: "Programming", icon: "💻" },
  { id: "webdev", name: "Web Development", icon: "🌐" },
  { id: "datascience", name: "Data Science", icon: "📊" },
  { id: "cybersecurity", name: "Cybersecurity", icon: "🔒" },
  { id: "cloud", name: "Cloud Computing", icon: "☁️" }
];

// Instructors data
const instructors = [
  {
    id: "john-smith",
    name: "John Smith",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.8,
    students: 15000,
    courses: ["python", "javascript"]
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.9,
    students: 20000,
    courses: ["react", "webdev"]
  },
  // ... more instructors ...
];

// Get course from URL parameter
function getCourseFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('course') || 'python';
}

// Initialize course
function initializeCourse() {
  const courseId = getCourseFromUrl();
  const course = courseData[courseId];
  
  if (!course) {
    window.location.href = 'index.html';
    return;
  }

  // Update course title and level
  document.getElementById('courseTitle').textContent = course.title;
  document.querySelector('.text-xs.bg-indigo-500').textContent = course.level;
  
  // Set default language
  const languageSelect = document.getElementById('languageSelect');
  languageSelect.value = courseId === 'javascript' ? 'javascript' : 'python';
}

// Handle course selection
document.querySelectorAll('.course-item').forEach(item => {
  item.addEventListener('click', function() {
    // Remove previous selection
    document.querySelectorAll('.course-item').forEach(i => i.classList.remove('selected'));
    this.classList.add('selected');

    // Show course details
    const courseKey = this.getAttribute('data-course');
    const courseId = getCourseFromUrl();
    const details = courseData[courseId].lessons[courseKey];
    const courseDetails = document.getElementById('courseDetails');
    courseDetails.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-indigo-400">${details.title}</h3>
        <button class="text-gray-400 hover:text-white" onclick="document.getElementById('courseDetails').classList.add('hidden')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <p class="mb-2 text-gray-200">${details.desc}</p>
      <div class="flex items-center gap-2 text-sm text-gray-400">
        <i class="fas fa-clock"></i>
        <span>${details.duration}</span>
      </div>
    `;
    courseDetails.classList.remove('hidden');

    // Update video source
    const video = document.querySelector('video');
    video.src = details.video;
    video.load();

    // Update current lesson title
    document.getElementById('currentLesson').textContent = details.title;

    // Set code in editor
    if (window.editor) {
      window.editor.setValue(details.code);
    }
  });
});

// Handle language selection
document.getElementById('languageSelect').addEventListener('change', function(e) {
  const language = e.target.value;
  monaco.editor.setModelLanguage(window.editor.getModel(), language);
});

// Reset code button
document.querySelector('.bg-gray-800.text-white.p-2.rounded').addEventListener('click', function() {
  const courseId = getCourseFromUrl();
  const courseKey = document.querySelector('.course-item.selected')?.getAttribute('data-course');
  if (courseKey) {
    const details = courseData[courseId].lessons[courseKey];
    window.editor.setValue(details.code);
  }
});

// Copy feedback button
document.querySelector('.fa-copy').parentElement.addEventListener('click', function() {
  const feedbackText = document.getElementById('aiReviewText');
  navigator.clipboard.writeText(feedbackText.textContent)
    .then(() => {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        this.innerHTML = originalText;
      }, 2000);
    });
});

// Clear feedback button
document.querySelector('.fa-trash').parentElement.addEventListener('click', function() {
  document.getElementById('aiReviewText').textContent = 'Write some code and click "Get AI Review"';
});

// --- Video Resize Keyboard Shortcuts ---

// Initial video height percent
let videoHeightPercent = 65; // default 65%
const minPercent = 30;
const maxPercent = 85;

function updateVideoAndEditorHeight() {
  // Use IDs instead of invalid selectors
  const leftSide = document.getElementById('leftPanel');
  const videoSection = document.getElementById('videoSection');
  const editorSection = leftSide.querySelector('.flex-1.p-5');

  // Set video section height
  videoSection.style.height = `${videoHeightPercent}%`;
  // Set editor section height to fill remaining
  editorSection.style.height = `${100 - videoHeightPercent}%`;
}

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault();
    if (e.key === 'ArrowUp' && videoHeightPercent < maxPercent) {
      videoHeightPercent += 5;
    } else if (e.key === 'ArrowDown' && videoHeightPercent > minPercent) {
      videoHeightPercent -= 5;
    }
    updateVideoAndEditorHeight();
  }
});

// On page load, set initial heights
window.addEventListener('DOMContentLoaded', updateVideoAndEditorHeight);

let isFullScreen = false;

function toggleFullScreen() {
  const leftPanel = document.getElementById('leftPanel');
  const rightPanel = document.querySelector('aside.w-[35%]');
  if (!isFullScreen) {
    // Expand left panel to full width
    leftPanel.style.width = '100vw';
    leftPanel.style.position = 'fixed';
    leftPanel.style.left = '0';
    leftPanel.style.top = '72px'; // header height
    leftPanel.style.height = 'calc(100vh - 72px)';
    leftPanel.style.zIndex = '50';
    // Hide right panel
    rightPanel.style.display = 'none';
    isFullScreen = true;
  } else {
    // Restore original styles
    leftPanel.style.width = '';
    leftPanel.style.position = '';
    leftPanel.style.left = '';
    leftPanel.style.top = '';
    leftPanel.style.height = '';
    leftPanel.style.zIndex = '';
    rightPanel.style.display = '';
    isFullScreen = false;
  }
}

document.addEventListener('keydown', function(e) {
  // Ignore if typing in an input or textarea or Monaco editor
  if (
    e.key.toLowerCase() === 'f' &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    !e.shiftKey &&
    !document.activeElement.matches('input, textarea, [contenteditable="true"]')
  ) {
    e.preventDefault();
    toggleFullScreen();
  }
});

// Handle video resize
let isVideoResizing = false;
let startY = 0;
let startHeight = 0;

const videoSection = document.getElementById('videoSection');
const editorSection = document.querySelector('.flex-1');

videoSection.addEventListener('mousedown', function(e) {
  if (e.target === this) {
    isVideoResizing = true;
    startY = e.clientY;
    startHeight = this.offsetHeight;
    document.body.style.cursor = 'row-resize';
  }
});

document.addEventListener('mousemove', function(e) {
  if (isVideoResizing) {
    const delta = e.clientY - startY;
    const newHeight = Math.max(200, Math.min(window.innerHeight - 200, startHeight + delta));
    videoSection.style.height = `${newHeight}px`;
    editorSection.style.height = `calc(100% - ${newHeight}px)`;
  }
});

document.addEventListener('mouseup', function() {
  isVideoResizing = false;
  document.body.style.cursor = '';
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl + Enter to run code
  if (e.ctrlKey && e.key === 'Enter') {
    document.getElementById('runBtn').click();
  }
  // Ctrl + Shift + Enter for AI review
  if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
    document.getElementById('aiReviewBtn').click();
  }
  // Ctrl + Alt + Enter to verify code
  if (e.ctrlKey && e.altKey && e.key === 'Enter') {
    document.getElementById('verifyBtn').click();
  }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Initialize course cards
  initializeCourseCards();
  
  // Initialize category filters
  initializeCategoryFilters();
  
  // Initialize instructor section
  initializeInstructors();
  
  // Add search functionality
  initializeSearch();
});

// Initialize course cards with dynamic data
function initializeCourseCards() {
  const courseGrid = document.getElementById('courseGrid');
  if (!courseGrid) return;

  // Clear existing cards
  courseGrid.innerHTML = '';

  // Create cards for each course
  Object.entries(courseData).forEach(([courseId, course]) => {
    const card = createCourseCard(courseId, course);
    courseGrid.appendChild(card);
  });
}

// Create a course card element
function createCourseCard(courseId, course) {
  const card = document.createElement('div');
  card.className = 'course-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer';
  card.setAttribute('data-course', courseId);
  card.setAttribute('data-category', course.category);

  card.innerHTML = `
    <div class="relative">
      <img src="${course.image || 'https://via.placeholder.com/480x270'}" alt="${course.title}" class="w-full h-48 object-cover">
      <div class="absolute top-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded">${course.level}</div>
    </div>
    <div class="p-4">
      <h4 class="text-lg font-semibold mb-2">${course.title}</h4>
      <p class="text-gray-400 text-sm mb-4">${course.description || 'Learn with interactive coding exercises and AI feedback'}</p>
      <div class="flex items-center justify-between">
        <span class="text-indigo-400 font-semibold">${course.price || 'Free'}</span>
        <a href="course.html?course=${courseId}" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Start Learning</a>
      </div>
    </div>
  `;

  // Add click event to navigate to course
  card.addEventListener('click', () => {
    window.location.href = `course.html?course=${courseId}`;
  });

  return card;
}

// Initialize category filters
function initializeCategoryFilters() {
  const categoryContainer = document.getElementById('categoryFilters');
  if (!categoryContainer) return;

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-filter px-4 py-2 rounded-full bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white transition';
    button.setAttribute('data-category', category.id);
    button.innerHTML = `${category.icon} ${category.name}`;
    
    button.addEventListener('click', () => {
      filterCoursesByCategory(category.id);
    });
    
    categoryContainer.appendChild(button);
  });
}

// Filter courses by category
function filterCoursesByCategory(categoryId) {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    if (categoryId === 'all' || card.getAttribute('data-category') === categoryId) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Initialize instructor section
function initializeInstructors() {
  const instructorContainer = document.getElementById('instructorGrid');
  if (!instructorContainer) return;

  instructors.forEach(instructor => {
    const card = document.createElement('div');
    card.className = 'instructor-card bg-gray-800 rounded-lg p-4 flex items-center gap-4';
    
    card.innerHTML = `
      <img src="${instructor.image}" alt="${instructor.name}" class="w-16 h-16 rounded-full">
      <div>
        <h4 class="font-semibold">${instructor.name}</h4>
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <span>⭐ ${instructor.rating}</span>
          <span>👥 ${instructor.students.toLocaleString()} students</span>
        </div>
      </div>
    `;
    
    instructorContainer.appendChild(card);
  });
}

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.querySelector('input[type="text"]');
  const searchButton = document.querySelector('button');
  
  if (!searchInput || !searchButton) return;

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterCoursesBySearch(searchTerm);
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.toLowerCase();
      filterCoursesBySearch(searchTerm);
    }
  });
}

// Filter courses by search term
function filterCoursesBySearch(searchTerm) {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    const title = card.querySelector('h4').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
