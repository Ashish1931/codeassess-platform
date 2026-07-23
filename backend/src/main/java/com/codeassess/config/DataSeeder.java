package com.codeassess.config;

import com.codeassess.entity.*;
import com.codeassess.enums.DifficultyLevel;
import com.codeassess.enums.RoleName;
import com.codeassess.enums.TestStatus;
import com.codeassess.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Roles
        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT).orElseGet(() ->
                roleRepository.save(Role.builder().name(RoleName.ROLE_STUDENT).build()));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseGet(() ->
                roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build()));

        // 2. Users
        if (!userRepository.existsByEmail("admin@codeassess.com")) {
            HashSet<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(studentRole);

            userRepository.save(User.builder()
                    .firstName("Platform")
                    .lastName("Administrator")
                    .email("admin@codeassess.com")
                    .mobileNumber("9999999999")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .roles(roles)
                    .build());
        }

        if (!userRepository.existsByEmail("student@codeassess.com")) {
            HashSet<Role> roles = new HashSet<>();
            roles.add(studentRole);

            userRepository.save(User.builder()
                    .firstName("Alex")
                    .lastName("Dev")
                    .email("student@codeassess.com")
                    .mobileNumber("9876543210")
                    .subjectPreference("Data Structures")
                    .password(passwordEncoder.encode("Student@1234"))
                    .roles(roles)
                    .build());
        }

        // 3. Subjects & Seed MCQ Tests
        if (subjectRepository.count() == 0) {
            seedSubjectsAndQuestions();
        }
    }

    private void seedSubjectsAndQuestions() {
        // Subjects definitions
        Subject dsa = subjectRepository.save(Subject.builder()
                .name("Data Structures")
                .code("DSA")
                .description("Arrays, Linked Lists, Trees, Graphs, Stacks, Queues, and Algorithm Complexity.")
                .imageUrl("https://images.unsplash.com/photo-1516116211223-48a9896886a6?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject cpp = subjectRepository.save(Subject.builder()
                .name("C++")
                .code("CPP")
                .description("Pointers, Object-Oriented Programming, Memory Management, and STL.")
                .imageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject javaSub = subjectRepository.save(Subject.builder()
                .name("Java")
                .code("JAVA")
                .description("JVM internals, Multithreading, Streams, Collections framework, and Spring fundamentals.")
                .imageUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject python = subjectRepository.save(Subject.builder()
                .name("Python")
                .code("PYTHON")
                .description("Data Types, Decorators, Generators, AsyncIO, and Data Science libraries.")
                .imageUrl("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject sql = subjectRepository.save(Subject.builder()
                .name("SQL")
                .code("SQL")
                .description("Queries, Joins, Aggregation, Subqueries, Indexing, and Performance Tuning.")
                .imageUrl("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject dbms = subjectRepository.save(Subject.builder()
                .name("DBMS")
                .code("DBMS")
                .description("ACID properties, ER Modeling, Normalization, Transactions, and Concurrency Control.")
                .imageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject os = subjectRepository.save(Subject.builder()
                .name("Operating System")
                .code("OS")
                .description("Process Scheduling, Virtual Memory, Deadlocks, File Systems, and Synchronization.")
                .imageUrl("https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80")
                .build());

        Subject cn = subjectRepository.save(Subject.builder()
                .name("Computer Networks")
                .code("CN")
                .description("OSI Layer, TCP/IP, IP Subnetting, Routing Algorithms, and Network Security.")
                .imageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80")
                .build());

        // Create Seed Tests and MCQs for DSA
        Test dsaTest1 = testRepository.save(Test.builder()
                .subject(dsa)
                .title("Data Structures Core Fundamentals")
                .description("Assess your mastery of Arrays, Linked Lists, Stacks, Queues, and Big-O Time Complexity.")
                .difficulty(DifficultyLevel.EASY)
                .durationMinutes(15)
                .totalMarks(30.0)
                .passingMarks(18.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(dsaTest1,
                "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL Tree)?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Binary Search Tree",
                "In a balanced BST like an AVL or Red-Black Tree, height is bounded by O(log N). Thus searching takes O(log N) worst-case time.",
                "B",
                List.of("A) O(1)", "B) O(log N)", "C) O(N)", "D) O(N log N)"));

        addQuestion(dsaTest1,
                "Which data structure is primarily used to implement Breadth-First Search (BFS) algorithm on a graph?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Graph Algorithms",
                "BFS traverses graphs level-by-level, requiring First-In-First-Out (FIFO) ordering which is provided by a Queue.",
                "C",
                List.of("A) Stack", "B) Priority Queue", "C) Queue", "D) Hash Table"));

        addQuestion(dsaTest1,
                "Consider the following pseudocode. What is the time complexity of the snippet?",
                "for (int i = 1; i <= n; i *= 2) {\n    for (int j = 1; j <= n; j++) {\n        // O(1) operation\n    }\n}",
                DifficultyLevel.MEDIUM,
                10.0,
                "Algorithm Analysis",
                "Outer loop executes log2(N) times because 'i' doubles each iteration. Inner loop runs N times for every outer loop iteration. Overall complexity is O(N log N).",
                "A",
                List.of("A) O(N log N)", "B) O(N^2)", "C) O(log N)", "D) O(N)"));

        // Create Seed Tests for Java
        Test javaTest1 = testRepository.save(Test.builder()
                .subject(javaSub)
                .title("Java OOP & Memory Management")
                .description("Test your knowledge of Java OOP, Inheritance, Garbage Collection, and Multithreading.")
                .difficulty(DifficultyLevel.MEDIUM)
                .durationMinutes(20)
                .totalMarks(30.0)
                .passingMarks(18.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(javaTest1,
                "What will be the output of the following Java snippet?",
                "String s1 = new String(\"Java\");\nString s2 = \"Java\";\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));",
                DifficultyLevel.EASY,
                10.0,
                "Strings",
                "'s1' points to an object in heap memory created with 'new', while 's2' points to String Constant Pool. Reference check '==' yields false, but content check '.equals()' yields true.",
                "D",
                List.of("A) true, true", "B) true, false", "C) false, false", "D) false, true"));

        addQuestion(javaTest1,
                "Which of the following memory areas in JVM is shared among all threads?",
                null,
                DifficultyLevel.MEDIUM,
                10.0,
                "JVM Memory Architecture",
                "The Heap and Method/Metaspace areas are shared among all JVM threads, whereas Program Counter (PC) Registers and Native Method Stacks are thread-private.",
                "A",
                List.of("A) Heap Memory", "B) Program Counter Register", "C) JVM Stack", "D) Native Method Stack"));

        addQuestion(javaTest1,
                "What happens when an uncaught exception occurs inside a thread in Java?",
                null,
                DifficultyLevel.HARD,
                10.0,
                "Exception Handling",
                "When an uncaught exception occurs, the thread terminates immediately, and JVM invokes UncaughtExceptionHandler if registered.",
                "C",
                List.of("A) Entire JVM shuts down", "B) Main thread restarts automatically", "C) The thread terminates and JVM logs thread dump", "D) It converts to checked exception"));

        // Create Seed Tests for C++
        Test cppTest = testRepository.save(Test.builder()
                .subject(cpp)
                .title("C++ OOP & Memory Management")
                .description("Pointers, Virtual Functions, Destructors, and STL Containers.")
                .difficulty(DifficultyLevel.MEDIUM)
                .durationMinutes(15)
                .totalMarks(20.0)
                .passingMarks(12.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(cppTest,
                "Which C++ keyword is used to allow a base class pointer to invoke a derived class override function?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Polymorphism",
                "The 'virtual' keyword specifies runtime dynamic dispatch for member functions in C++.",
                "B",
                List.of("A) override", "B) virtual", "C) static", "D) inline"));

        addQuestion(cppTest,
                "What is the output of the following C++ code snippet?",
                "int a = 10;\nint *ptr = &a;\n*ptr = 20;\nstd::cout << a;",
                DifficultyLevel.EASY,
                10.0,
                "Pointers",
                "Dereferencing '*ptr = 20' modifies the memory location of 'a', changing its value to 20.",
                "C",
                List.of("A) 10", "B) Address of a", "C) 20", "D) Compilation Error"));

        // Create Seed Tests for Python
        Test pythonTest = testRepository.save(Test.builder()
                .subject(python)
                .title("Python Language Core & Decorators")
                .description("Data Types, List Comprehensions, Decorators, and Generators.")
                .difficulty(DifficultyLevel.EASY)
                .durationMinutes(15)
                .totalMarks(20.0)
                .passingMarks(12.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(pythonTest,
                "What is the output of `[x**2 for x in range(5) if x % 2 == 0]` in Python?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "List Comprehension",
                "range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.",
                "C",
                List.of("A) [1, 9]", "B) [0, 1, 4, 9, 16]", "C) [0, 4, 16]", "D) [4, 16]"));

        addQuestion(pythonTest,
                "Which builtin function is used to create an iterator from an iterable object in Python?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Iterators",
                "The 'iter()' function returns an iterator object from any supported iterable container.",
                "A",
                List.of("A) iter()", "B) next()", "C) yield()", "D) loop()"));

        // Create Seed Tests for SQL
        Test sqlTest = testRepository.save(Test.builder()
                .subject(sql)
                .title("SQL Relational Queries & Joins")
                .description("SELECT, INNER JOIN, LEFT JOIN, GROUP BY, and HAVING clauses.")
                .difficulty(DifficultyLevel.EASY)
                .durationMinutes(15)
                .totalMarks(20.0)
                .passingMarks(12.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(sqlTest,
                "Which SQL clause is used to filter aggregated group results after GROUP BY?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Aggregation",
                "HAVING filters aggregated groups, while WHERE filters individual rows before grouping.",
                "A",
                List.of("A) HAVING", "B) WHERE", "C) FILTER", "D) LIKE"));

        addQuestion(sqlTest,
                "Which type of JOIN returns all records from the left table and matched records from the right table?",
                null,
                DifficultyLevel.EASY,
                10.0,
                "Joins",
                "LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table regardless of matches in the right table.",
                "B",
                List.of("A) INNER JOIN", "B) LEFT JOIN", "C) RIGHT JOIN", "D) FULL JOIN"));

        // Create Seed Tests for OS
        Test osTest = testRepository.save(Test.builder()
                .subject(os)
                .title("Operating System Fundamentals")
                .description("Process Control Blocks, Deadlocks, Virtual Memory, and Page Faults.")
                .difficulty(DifficultyLevel.HARD)
                .durationMinutes(20)
                .totalMarks(20.0)
                .passingMarks(12.0)
                .status(TestStatus.PUBLISHED)
                .build());

        addQuestion(osTest,
                "Which condition is NOT one of the 4 necessary Coffman conditions for a Deadlock to occur?",
                null,
                DifficultyLevel.HARD,
                10.0,
                "Deadlocks",
                "Preemption PREVENTS deadlock. Non-preemption is the required condition for deadlock.",
                "D",
                List.of("A) Mutual Exclusion", "B) Hold and Wait", "C) Circular Wait", "D) Preemption"));
    }

    private void addQuestion(Test test, String text, String snippet, DifficultyLevel difficulty,
                             Double marks, String topic, String explanation, String correctAnswer, List<String> options) {
        Question q = Question.builder()
                .test(test)
                .questionText(text)
                .codeSnippet(snippet)
                .difficulty(difficulty)
                .marks(marks)
                .topic(topic)
                .explanation(explanation)
                .correctAnswer(correctAnswer)
                .build();

        List<QuestionOption> optionList = new ArrayList<>();
        char label = 'A';
        for (String optStr : options) {
            String cleanText = optStr.replaceFirst("^[A-D]\\)\\s*", "");
            optionList.add(QuestionOption.builder()
                    .question(q)
                    .optionLabel(String.valueOf(label))
                    .optionText(cleanText)
                    .build());
            label++;
        }

        q.setOptions(optionList);
        questionRepository.save(q);
    }
}
