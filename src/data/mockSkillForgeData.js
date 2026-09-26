export const INITIAL_VALUE1 = {
  totalLessonsCompleted: 24,
  totalPracticeQuestionsSolved: 148,
  learningHours: 36.5,
  currentSkillLevel: "Level 4 - Placement Ready",
  readinessPercentage: 84,
  streakDays: 7,
  weeklyProgress: [
    { day: "Mon", hours: 2.5, questions: 15 },
    { day: "Tue", hours: 3.8, questions: 24 },
    { day: "Wed", hours: 4.2, questions: 30 },
    { day: "Thu", hours: 3.0, questions: 18 },
    { day: "Fri", hours: 5.1, questions: 35 },
    { day: "Sat", hours: 4.0, questions: 26 },
    { day: "Sun", hours: 2.0, questions: 10 }
  ]
};

export const INITIAL_VALUE2 = {
  topicsStudied: [
    "Python OOP & Classes",
    "Binary Search Trees",
    "DBMS: SQL Basics",
    "Verbal: PREP Framework",
    "Quantitative: Time & Work"
  ],
  difficultyLevelsMastered: { Easy: 92, Medium: 78, Hard: 58 },
  weakAreas: ["SQL Joins & Indexing", "Dynamic Programming", "Grammar: Complex Prepositions"],
  strongAreas: ["Binary Trees", "Time & Work Problems", "Python OOP", "Hash Tables"],
  frequentlyIncorrectConcepts: ["Left Outer Join vs Subqueries", "Knapsack Space Optimization"],
  accuracyPercentage: 81,
  practiceHistory: [
    { id: "ph1", topic: "Binary Search Trees", category: "Data Structures", difficulty: "Medium", correct: 4, total: 5, timeTaken: "6m 10s", date: "2026-09-25T10:30:00Z" },
    { id: "ph2", topic: "SQL Joins & Indexing", category: "DBMS", difficulty: "Hard", correct: 2, total: 5, timeTaken: "8m 45s", date: "2026-09-25T14:15:00Z" },
    { id: "ph3", topic: "Time & Work", category: "Aptitude", difficulty: "Easy", correct: 5, total: 5, timeTaken: "4m 20s", date: "2026-09-26T09:00:00Z" }
  ],
  testHistory: [
    {
      id: "th1",
      title: "TCS & Infosys Placement Diagnostic Test",
      scorePct: 76, accuracyPct: 79, timeTaken: "18m 40s",
      rankPrediction: "#38 / 1,450 Candidates",
      strengths: ["Quantitative Aptitude", "Binary Tree Traversal"],
      weaknesses: ["SQL Subqueries", "Pointers"],
      date: "2026-09-25T16:00:00Z"
    }
  ],
  communicationLogs: [],
  leetCodeSolvedCases: ["lc_1", "lc_206", "lc_175"]
};

export const LEETCODE_STUDY_CASES = [
  {
    id: "lc_1",
    title: "1. Two Sum",
    difficulty: "Easy",
    status: "Completed",
    tags: ["Array", "Hash Table"],
    learnedTopicRef: "Python OOP & Classes",
    acceptance: "52.4%",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    codeDescription: "The core idea is to avoid a nested O(n^2) brute force loop. Instead, as we scan through each number, we ask: has the complement (target - current) already been seen? A Hash Map lets us answer this in O(1), transforming the algorithm to O(n) overall. We store each element with its index as we go, so when we find the complement, we can instantly return both indices.",
    hint: "Think about what information you need to store as you scan through the array. For each number x, you need to quickly check if (target - x) has been seen before. What data structure gives you O(1) lookup by value?",
    learningQuestion: {
      question: "What data structure is BEST for achieving O(1) lookup when solving Two Sum?",
      options: ["Sorted Array with Binary Search", "Hash Map (Dictionary)", "Linked List", "Stack"],
      correctIndex: 1,
      explanation: "A Hash Map stores each number and its index, enabling O(1) lookup to check if the complement (target - current) already exists. Binary Search on a sorted array gives O(log n) but also changes indices. Hash Map is optimal at O(n) time and O(n) space."
    },
    steps: [
      "Step 1: Understand the problem - find two indices i, j such that nums[i] + nums[j] == target.",
      "Step 2: Brute force: for every pair (i,j), check if nums[i] + nums[j] == target. Time: O(n^2).",
      "Step 3: Optimized: Use a Hash Map. For each element nums[i], compute complement = target - nums[i].",
      "Step 4: If complement exists in the map, return [map[complement], i]. Otherwise, store nums[i] -> i in the map.",
      "Step 5: This runs in O(n) time and O(n) space - one pass through the array."
    ],
    solutions: {
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
    return [];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement))
            return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`
    }
  },
  {
    id: "lc_206",
    title: "206. Reverse Linked List",
    difficulty: "Easy",
    status: "Completed",
    tags: ["Linked List", "Recursion"],
    learnedTopicRef: "Binary Search Trees",
    acceptance: "75.8%",
    description: "Given the head of a singly linked list, reverse the list and return the reversed list's head. The reversal must be done in-place without using extra data structures.",
    codeDescription: "The trick is to redirect each node's next pointer to point to the previous node instead of the next. We use three pointers: prev (starts as null), curr (starts at head), and a temp next variable. At each step we save curr.next before overwriting it, then redirect curr.next = prev, then advance both prev and curr forward. When curr becomes null, prev is the new head.",
    hint: "Draw out a small linked list: 1 -> 2 -> 3. To reverse it, you need 3 -> 2 -> 1. Think about what happens to node 1's next pointer. You need to save the original next before you change it - that is why a temporary variable is essential.",
    learningQuestion: {
      question: "When reversing a linked list iteratively, what is the minimum number of pointers you need?",
      options: ["1 pointer (just current)", "2 pointers (prev, curr)", "3 pointers (prev, curr, next)", "4 or more pointers"],
      correctIndex: 2,
      explanation: "You need prev, curr, and a temporary next pointer. Without saving next before redirecting curr.next, you lose access to the rest of the list. prev tracks the reversed portion, curr is the current node, and next is temporarily saved before the pointer redirection."
    },
    steps: [
      "Step 1: Initialize prev = null and curr = head.",
      "Step 2: Save curr.next to a temp variable (next) BEFORE modifying anything.",
      "Step 3: Redirect curr.next = prev (reverse the link).",
      "Step 4: Advance prev = curr, then curr = next.",
      "Step 5: Repeat until curr == null. At that point prev is the new head - return prev."
    ],
    solutions: {
      python: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
      javascript: `function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`
    }
  },
  {
    id: "lc_175",
    title: "175. Combine Two Tables (SQL)",
    difficulty: "Easy",
    status: "Completed",
    tags: ["Database", "SQL Joins"],
    learnedTopicRef: "DBMS: SQL Basics",
    acceptance: "76.1%",
    description: "Write a SQL query to report the firstName, lastName, city, and state of each person. If the address of a personId is not present in the Address table, report null instead. The Person table has personId, lastName, firstName. The Address table has addressId, personId, city, state.",
    codeDescription: "The key insight is that we need ALL persons, regardless of whether they have an address. An INNER JOIN would silently drop people without addresses. A LEFT JOIN keeps every row from the left table (Person) and fills NULL for any unmatched Address columns. We join on personId which is the foreign key relationship between both tables.",
    hint: "Ask yourself: what happens to a person who has no entry in the Address table? Should they appear in the result? YES - the problem says report null for missing addresses. Which JOIN type keeps all rows from the left table and fills NULL for missing right-table data?",
    learningQuestion: {
      question: "Which SQL JOIN type keeps ALL persons even if they have no matching address row?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
      correctIndex: 1,
      explanation: "LEFT JOIN returns ALL rows from the left table (Person) and matched rows from the right table (Address). If no address exists, NULL is returned for city and state. INNER JOIN would exclude persons with no address, giving wrong results."
    },
    steps: [
      "Step 1: Identify that we need ALL Person rows - even those without an Address entry.",
      "Step 2: Choose LEFT JOIN to preserve all Person records regardless of address presence.",
      "Step 3: The ON clause uses personId as the join key between Person and Address tables.",
      "Step 4: Persons with no address get NULL for city and state automatically with LEFT JOIN.",
      "Step 5: Select only the 4 required columns: firstName, lastName, city, state."
    ],
    solutions: {
      mysql: `SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a
ON p.personId = a.personId;`,
      postgresql: `SELECT p."firstName", p."lastName", a.city, a.state
FROM "Person" p
LEFT JOIN "Address" a
ON p."personId" = a."personId";`,
      mssql: `SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT OUTER JOIN Address a
ON p.personId = a.personId;`,
      sqlite: `SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a
USING (personId);`
    }
  },
  {
    id: "lc_98",
    title: "98. Validate Binary Search Tree",
    difficulty: "Medium",
    status: "Unsolved",
    tags: ["Tree", "Depth-First Search", "BST"],
    learnedTopicRef: "Binary Search Trees",
    acceptance: "32.9%",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST requires: the left subtree of a node contains ONLY nodes with keys strictly less than the node's key, and the right subtree ONLY nodes with keys strictly greater. Both subtrees must also be valid BSTs.",
    codeDescription: "The naive approach of just checking left < root < right for each node is WRONG. A node can satisfy its parent's constraint but violate a grandparent's. The correct approach passes down min/max bounds. Every node must satisfy: min < node.val < max. For the left child we tighten the max (can't exceed current node). For the right child we tighten the min. Initially bounds are -infinity and +infinity.",
    hint: "Consider this tree: root=5, left=4, right=6, and 6's left child=3. Locally 3 < 6 looks fine, but 3 < 5 violates the BST property for the root. How can we track these global constraints? What if we passed the allowed range [min, max] down each recursive call?",
    learningQuestion: {
      question: "To validate a BST correctly, you must propagate min/max bounds. For a right child, which bound gets updated?",
      options: [
        "Update max to the current node's value",
        "Update min to the current node's value",
        "Update both min and max",
        "Neither - the bounds stay the same"
      ],
      correctIndex: 1,
      explanation: "For the RIGHT child, update min = current node's value, because all nodes in the right subtree must be GREATER than the current node. For the LEFT child, update max = current node's value, because all nodes in the left subtree must be LESS than the current node."
    },
    steps: [
      "Step 1: Naive check (left < root AND right > root) is INSUFFICIENT - it only checks immediate children.",
      "Step 2: Use recursive DFS with min and max bounds propagated to each node.",
      "Step 3: At each node, check: min < node.val < max. If violated, return false.",
      "Step 4: Recurse left with same min but max = node.val (left subtree must all be less than current).",
      "Step 5: Recurse right with min = node.val but same max (right subtree must all be greater than current)."
    ],
    solutions: {
      python: `def isValidBST(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return (isValidBST(root.left, min_val, root.val) and
            isValidBST(root.right, root.val, max_val))`,
      javascript: `function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;
    if (root.val <= min || root.val >= max) return false;
    return isValidBST(root.left, min, root.val) &&
           isValidBST(root.right, root.val, max);
}`,
      cpp: `bool isValidBST(TreeNode* root,
                long min = LONG_MIN, long max = LONG_MAX) {
    if (!root) return true;
    if (root->val <= min || root->val >= max) return false;
    return isValidBST(root->left, min, root->val) &&
           isValidBST(root->right, root->val, max);
}`,
      java: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) &&
           validate(node.right, node.val, max);
}`
    }
  },
  {
    id: "lc_322",
    title: "322. Coin Change (DP)",
    difficulty: "Medium",
    status: "Unsolved",
    tags: ["Dynamic Programming", "Breadth-First Search"],
    learnedTopicRef: "SQL Joins, Indexing & Subqueries",
    acceptance: "44.1%",
    description: "Given an array of coin denominations and a total amount, return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of coins, return -1. You may assume you have an infinite number of each coin.",
    codeDescription: "This is a classic bottom-up Dynamic Programming problem. We build a dp array where dp[i] = minimum coins to make amount i. We initialize dp[0] = 0 (no coins needed for amount 0) and all others to Infinity. For each coin, we iterate through all amounts from coin to target, updating dp[i] = min(dp[i], dp[i - coin] + 1). This builds optimal solutions from smaller subproblems up to the full amount.",
    hint: "Think recursively first: to make amount 10 using coins [1,2,5], you could use coin 5 and then solve for amount 5. The key insight is that subproblems overlap heavily - you compute the same sub-amounts many times. DP avoids recomputation by storing results. What is the base case? What does dp[0] equal?",
    learningQuestion: {
      question: "In the Coin Change DP, dp[i] = min(dp[i], dp[i - coin] + 1). What does the +1 represent?",
      options: [
        "The index offset for zero-based arrays",
        "Using one coin (the current coin denomination) in the solution",
        "The minimum number of coins used so far",
        "A penalty for choosing the wrong coin"
      ],
      correctIndex: 1,
      explanation: "The +1 represents using ONE coin of the current denomination. dp[i - coin] gives the minimum coins needed for the remaining amount (i - coin), and adding 1 accounts for the current coin we just used. We take the minimum across all coin choices."
    },
    steps: [
      "Step 1: Create dp[] of size (amount+1), initialize all to Infinity except dp[0] = 0.",
      "Step 2: Outer loop: iterate through each coin denomination.",
      "Step 3: Inner loop: for each amount i from coin to amount, compute dp[i - coin] + 1.",
      "Step 4: Update dp[i] = min(dp[i], dp[i - coin] + 1).",
      "Step 5: After all iterations, dp[amount] is the answer. If still Infinity, return -1."
    ],
    solutions: {
      python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            if (dp[i - coin] != INT_MAX)
                dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      java: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`
    }
  }
];

export const LEARN_MODULES = [
  {
    id: "dbms_joins",
    category: "DBMS",
    title: "SQL Joins, Indexing & Subqueries",
    duration: "45 mins",
    level: "Medium",
    videoThumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    summary: "Master INNER, LEFT, RIGHT, and FULL OUTER joins alongside B-Tree indexing strategies used in relational database placement evaluations.",
    linkedLeetCodeId: "lc_322",
    notes: [
      "INNER JOIN returns records that have matching values in both tables.",
      "LEFT JOIN returns all records from the left table, and matched records from the right table.",
      "B-Tree Indexes reduce search time from O(N) to O(log N) for large tables.",
      "Correlated subqueries evaluate once for each row processed by the outer query statement."
    ],
    interactiveSnippet: `SELECT e.employee_id, e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 75000;`
  },
  {
    id: "dsa_trees",
    category: "Data Structures",
    title: "Binary Search Trees",
    duration: "50 mins",
    level: "Medium",
    videoThumbnail: "https://images.unsplash.com/photo-1516116211223-48a12725222e?auto=format&fit=crop&w=800&q=80",
    summary: "Learn Inorder, Preorder, Postorder traversals, Level-order BFS, and Binary Search Tree insertion and deletion algorithms.",
    linkedLeetCodeId: "lc_98",
    notes: [
      "Inorder traversal of BST yields sorted elements in ascending order.",
      "Preorder traversal (Root, Left, Right) is ideal for copying a tree structure.",
      "Height of a balanced BST is O(log N), guaranteeing fast search operations."
    ],
    interactiveSnippet: `class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}`
  },
  {
    id: "aptitude_time_work",
    category: "Aptitude",
    title: "Quantitative: Time & Work",
    duration: "35 mins",
    level: "Easy",
    videoThumbnail: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
    summary: "Essential placement aptitude shortcuts for calculating individual vs joint work rates and pipe inlet/outlet capacities.",
    linkedLeetCodeId: null,
    notes: [
      "If A can do a job in X days, A's 1-day work = 1/X.",
      "If A and B work together, combined 1-day work = (1/X + 1/Y).",
      "Total days to complete job = (X * Y) / (X + Y)."
    ],
    interactiveSnippet: `// Quick Formula Demonstration:
const daysA = 10, daysB = 15;
const combinedDays = (daysA * daysB) / (daysA + daysB);
console.log("Combined Days:", combinedDays); // 6 days`
  },
  {
    id: "prog_python_oop",
    category: "Programming",
    title: "Python OOP & Classes",
    duration: "40 mins",
    level: "Medium",
    videoThumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    summary: "Inheritance, Polymorphism, Encapsulation, Abstract Base Classes, and Dunder methods (__init__, __str__, __repr__).",
    linkedLeetCodeId: "lc_1",
    notes: [
      "Encapsulation hides internal implementation using single leading or double leading underscores.",
      "Polymorphism enables methods to have identical names across different subclass implementations."
    ],
    interactiveSnippet: `class PlacementCandidate:
    def __init__(self, name, target_company):
        self.name = name
        self.target_company = target_company
        
    def announce(self):
        return f"{self.name} is preparing for {self.target_company}!"`
  }
];

export const PRACTICE_QUESTIONS = [
  {
    id: "pq1", category: "DBMS", type: "MCQ", title: "SQL Join Types",
    question: "Which SQL Join clause returns all records from the left table even if there are no matching records in the right table?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
    correctIndex: 1, difficulty: "Medium",
    explanation: "LEFT JOIN returns all rows from the left table with matching rows from the right table (or NULL if no match exists)."
  },
  {
    id: "pq2", category: "Programming", type: "Coding Problem", title: "Reverse a Linked List",
    question: "Given the head of a singly linked list, reverse the list in O(N) time and O(1) auxiliary space.",
    initialCode: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}`,
    difficulty: "Hard",
    explanation: "Using three pointers (prev, curr, next) allows reversing pointers in-place in a single pass."
  },
  {
    id: "pq3", category: "Aptitude", type: "Aptitude Questions", title: "Speed & Distance",
    question: "A train 150 meters long passes a telegraph post in 12 seconds. What is the speed of the train in km/h?",
    options: ["45 km/h", "50 km/h", "60 km/h", "72 km/h"],
    correctIndex: 0, difficulty: "Easy",
    explanation: "Speed = Distance / Time = 150m / 12s = 12.5 m/s. Convert to km/h: 12.5 * (18 / 5) = 45 km/h."
  },
  {
    id: "pq4", category: "Data Structures", type: "MCQ", title: "BST Inorder Traversal",
    question: "In a Binary Search Tree (BST), which traversal algorithm visits nodes in strictly ascending sorted order?",
    options: ["Preorder Traversal", "Inorder Traversal", "Postorder Traversal", "Level-order BFS"],
    correctIndex: 1, difficulty: "Medium",
    explanation: "Inorder Traversal (Left, Root, Right) processes nodes in ascending order in a Binary Search Tree."
  }
];

export const COMMUNICATION_SCENARIOS = [];
