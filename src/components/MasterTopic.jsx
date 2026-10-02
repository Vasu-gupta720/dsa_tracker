import React, { useState, useEffect, lazy, Suspense } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { getUserProgress, saveUserProgress } from "../services/firestoreService";

const CodeModal = lazy(() => import("./CodeModal"));

/* ─── DP DATA ────────────────────────────────────────────────────────────── */
const DP_PATTERNS = [
  {
    id: "dp-p1", title: "Foundational 1D DP", subtitle: "Fibonacci / Climbing Stairs family",
    questions: [
      { id: "dpm1q1", title: "Climbing Stairs",           link: "https://leetcode.com/problems/climbing-stairs/",        source: "LC 70",   diff: "E" },
      { id: "dpm1q2", title: "Min Cost Climbing Stairs",  link: "https://leetcode.com/problems/min-cost-climbing-stairs/",source: "LC 746",  diff: "E" },
      { id: "dpm1q3", title: "House Robber",              link: "https://leetcode.com/problems/house-robber/",            source: "LC 198",  diff: "M" },
      { id: "dpm1q4", title: "House Robber II",           link: "https://leetcode.com/problems/house-robber-ii/",         source: "LC 213",  diff: "M" },
      { id: "dpm1q5", title: "Fibonacci Number",          link: "https://leetcode.com/problems/fibonacci-number/",        source: "LC 509",  diff: "E" },
      { id: "dpm1q6", title: "Nth Tribonacci Number",     link: "https://leetcode.com/problems/n-th-tribonacci-number/",  source: "LC 1137", diff: "E" },
    ],
  },
  {
    id: "dp-p2", title: "Kadane's Algorithm", subtitle: "Max Subarray DP",
    questions: [
      { id: "dpm2q1", title: "Maximum Subarray",                            link: "https://leetcode.com/problems/maximum-subarray/",                                            source: "LC 53",  diff: "M" },
      { id: "dpm2q2", title: "Maximum Product Subarray",                    link: "https://leetcode.com/problems/maximum-product-subarray/",                                   source: "LC 152", diff: "M" },
      { id: "dpm2q3", title: "Maximum Sum Circular Subarray",               link: "https://leetcode.com/problems/maximum-sum-circular-subarray/",                             source: "LC 918", diff: "M" },
      { id: "dpm2q4", title: "Max Subarray Sum after K Concatenations",     link: "https://www.geeksforgeeks.org/problems/maximum-subarray-sum-after-k-concatenations5502/1", source: "GFG",   diff: "M" },
      { id: "dpm2q5", title: "Max Sum Rectangle No Larger Than K",          link: "https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/",                     source: "LC 363", diff: "H" },
    ],
  },
  {
    id: "dp-p3", title: "0/1 Knapsack", subtitle: "Base of ~30% of all DP interview questions",
    questions: [
      { id: "dpm3q1",  title: "0-1 Knapsack",                         link: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",           source: "GFG",     diff: "M" },
      { id: "dpm3q2",  title: "Partition Equal Subset Sum",            link: "https://leetcode.com/problems/partition-equal-subset-sum/",                   source: "LC 416",  diff: "M" },
      { id: "dpm3q3",  title: "Subset Sum Problem",                    link: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1",       source: "GFG",     diff: "M" },
      { id: "dpm3q4",  title: "Target Sum",                            link: "https://leetcode.com/problems/target-sum/",                                   source: "LC 494",  diff: "M" },
      { id: "dpm3q5",  title: "Last Stone Weight II",                  link: "https://leetcode.com/problems/last-stone-weight-ii/",                         source: "LC 1049", diff: "M" },
      { id: "dpm3q6",  title: "Ones and Zeroes (2D knapsack)",         link: "https://leetcode.com/problems/ones-and-zeroes/",                              source: "LC 474",  diff: "M" },
      { id: "dpm3q7",  title: "Equal Sum Partition – Min Difference",  link: "https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1",          source: "GFG",     diff: "M" },
      { id: "dpm3q8",  title: "Count Subsets with Given Sum",          link: "https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1",            source: "GFG",     diff: "M" },
      { id: "dpm3q9",  title: "Number of Dice Rolls With Target Sum",  link: "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/",         source: "LC 1155", diff: "M" },
      { id: "dpm3q10", title: "CF 455A — Boredom",                     link: "https://codeforces.com/problemset/problem/455/A",                             source: "CF",      diff: "M" },
      { id: "dpm3q11", title: "CF 543A — Writing Code",                link: "https://codeforces.com/problemset/problem/543/A",                             source: "CF",      diff: "M" },
    ],
  },
  {
    id: "dp-p4", title: "Unbounded Knapsack", subtitle: "Reuse items freely",
    questions: [
      { id: "dpm4q1", title: "Unbounded Knapsack",     link: "https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1", source: "GFG",    diff: "M" },
      { id: "dpm4q2", title: "Coin Change (min coins)", link: "https://leetcode.com/problems/coin-change/",                                source: "LC 322", diff: "M" },
      { id: "dpm4q3", title: "Coin Change II (ways)",   link: "https://leetcode.com/problems/coin-change-ii/",                             source: "LC 518", diff: "M" },
      { id: "dpm4q4", title: "Combination Sum IV",      link: "https://leetcode.com/problems/combination-sum-iv/",                        source: "LC 377", diff: "M" },
      { id: "dpm4q5", title: "Rod Cutting",              link: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",                 source: "GFG",    diff: "M" },
      { id: "dpm4q6", title: "Perfect Squares",          link: "https://leetcode.com/problems/perfect-squares/",                          source: "LC 279", diff: "M" },
      { id: "dpm4q7", title: "CF 189A — Cut Ribbon",     link: "https://codeforces.com/problemset/problem/189/A",                         source: "CF",     diff: "M" },
    ],
  },
  {
    id: "dp-p5", title: "LCS Family", subtitle: "Longest Common Subsequence & derivatives",
    questions: [
      { id: "dpm5q1",  title: "Longest Common Subsequence",             link: "https://leetcode.com/problems/longest-common-subsequence/",                        source: "LC 1143", diff: "M" },
      { id: "dpm5q2",  title: "Longest Common Subsequence (GFG)",       link: "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",   source: "GFG",     diff: "M" },
      { id: "dpm5q3",  title: "Shortest Common Supersequence",          link: "https://leetcode.com/problems/shortest-common-supersequence/",                     source: "LC 1092", diff: "H" },
      { id: "dpm5q4",  title: "Delete Operation for Two Strings",       link: "https://leetcode.com/problems/delete-operation-for-two-strings/",                  source: "LC 583",  diff: "M" },
      { id: "dpm5q5",  title: "Minimum ASCII Delete Sum",               link: "https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/",          source: "LC 712",  diff: "M" },
      { id: "dpm5q6",  title: "Longest Common Substring",               link: "https://www.geeksforgeeks.org/problems/longest-common-substring1452/1",            source: "GFG",     diff: "M" },
      { id: "dpm5q7",  title: "Distinct Subsequences",                  link: "https://leetcode.com/problems/distinct-subsequences/",                             source: "LC 115",  diff: "H" },
      { id: "dpm5q8",  title: "Interleaving String",                    link: "https://leetcode.com/problems/interleaving-string/",                               source: "LC 97",   diff: "M" },
      { id: "dpm5q9",  title: "Edit Distance",                          link: "https://leetcode.com/problems/edit-distance/",                                     source: "LC 72",   diff: "H" },
      { id: "dpm5q10", title: "Wildcard Matching",                      link: "https://leetcode.com/problems/wildcard-matching/",                                 source: "LC 44",   diff: "H" },
      { id: "dpm5q11", title: "Regular Expression Matching",            link: "https://leetcode.com/problems/regular-expression-matching/",                       source: "LC 10",   diff: "H" },
    ],
  },
  {
    id: "dp-p6", title: "LIS Family", subtitle: "Longest Increasing Subsequence & variants",
    questions: [
      { id: "dpm6q1", title: "Longest Increasing Subsequence",           link: "https://leetcode.com/problems/longest-increasing-subsequence/",                       source: "LC 300",  diff: "M" },
      { id: "dpm6q2", title: "Longest Increasing Subsequence (GFG)",     link: "https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1",  source: "GFG",     diff: "M" },
      { id: "dpm6q3", title: "Russian Doll Envelopes",                   link: "https://leetcode.com/problems/russian-doll-envelopes/",                               source: "LC 354",  diff: "H" },
      { id: "dpm6q4", title: "Maximum Sum Increasing Subsequence",       link: "https://www.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1",     source: "GFG",     diff: "M" },
      { id: "dpm6q5", title: "Number of LIS",                            link: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",             source: "LC 673",  diff: "M" },
      { id: "dpm6q6", title: "Longest Bitonic Subsequence",              link: "https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0007/1",            source: "GFG",     diff: "M" },
      { id: "dpm6q7", title: "Min Deletions to Make Sorted Sequence",    link: "https://www.geeksforgeeks.org/problems/minimum-number-of-deletions-to-make-a-sorted-sequence3248/1", source: "GFG", diff: "M" },
      { id: "dpm6q8", title: "Box Stacking",                             link: "https://www.geeksforgeeks.org/problems/box-stacking/1",                               source: "GFG",     diff: "H" },
      { id: "dpm6q9", title: "CF 1096D — Easy Problem",                  link: "https://codeforces.com/problemset/problem/1096/D",                                   source: "CF",      diff: "H" },
    ],
  },
  {
    id: "dp-p7", title: "Palindrome DP", subtitle: "Interviewer favourite — interval DP thinking",
    questions: [
      { id: "dpm7q1",  title: "Longest Palindromic Substring",             link: "https://leetcode.com/problems/longest-palindromic-substring/",                        source: "LC 5",    diff: "M" },
      { id: "dpm7q2",  title: "Palindromic Substrings (count)",            link: "https://leetcode.com/problems/palindromic-substrings/",                              source: "LC 647",  diff: "M" },
      { id: "dpm7q3",  title: "Longest Palindromic Subsequence",           link: "https://leetcode.com/problems/longest-palindromic-subsequence/",                     source: "LC 516",  diff: "M" },
      { id: "dpm7q4",  title: "Longest Palindromic Subsequence (GFG)",     link: "https://www.geeksforgeeks.org/problems/longest-palindromic-subsequence-1612327878/1", source: "GFG",     diff: "M" },
      { id: "dpm7q5",  title: "Palindrome Partitioning — All Partitions",  link: "https://leetcode.com/problems/palindrome-partitioning/",                            source: "LC 131",  diff: "M" },
      { id: "dpm7q6",  title: "Palindrome Partitioning II — Min Cuts",     link: "https://leetcode.com/problems/palindrome-partitioning-ii/",                         source: "LC 132",  diff: "H" },
      { id: "dpm7q7",  title: "Palindrome Partitioning (GFG)",             link: "https://www.geeksforgeeks.org/problems/palindrome-partitioning2903/1",               source: "GFG",     diff: "H" },
      { id: "dpm7q8",  title: "Min Insertions to Make String Palindrome",  link: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/", source: "LC 1312", diff: "H" },
      { id: "dpm7q9",  title: "Count Different Palindromic Subsequences",  link: "https://leetcode.com/problems/count-different-palindromic-subsequences/",            source: "LC 730",  diff: "H" },
      { id: "dpm7q10", title: "Palindrome Partitioning III (k palindromes)",link: "https://leetcode.com/problems/palindrome-partitioning-iii/",                        source: "LC 1278", diff: "H" },
      { id: "dpm7q11", title: "Palindrome Partitioning IV",                link: "https://leetcode.com/problems/palindrome-partitioning-iv/",                          source: "LC 1745", diff: "H" },
      { id: "dpm7q12", title: "Scramble String",                           link: "https://leetcode.com/problems/scramble-string/",                                     source: "LC 87",   diff: "H" },
    ],
  },
  {
    id: "dp-p8", title: "Interval DP / Matrix Chain", subtitle: "MCM, burst balloons, boolean parenthesization",
    questions: [
      { id: "dpm8q1", title: "Matrix Chain Multiplication",           link: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1", source: "GFG",     diff: "H" },
      { id: "dpm8q2", title: "Burst Balloons",                        link: "https://leetcode.com/problems/burst-balloons/",                            source: "LC 312",  diff: "H" },
      { id: "dpm8q3", title: "Min Score Triangulation of Polygon",    link: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/",    source: "LC 1039", diff: "M" },
      { id: "dpm8q4", title: "Boolean Parenthesization",              link: "https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1",    source: "GFG",     diff: "H" },
      { id: "dpm8q5", title: "Minimum Cost to Cut a Stick",           link: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",               source: "LC 1547", diff: "H" },
      { id: "dpm8q6", title: "Optimal Binary Search Tree",            link: "https://www.geeksforgeeks.org/problems/optimal-binary-search-tree1131/1",  source: "GFG",     diff: "H" },
      { id: "dpm8q7", title: "Remove Boxes",                          link: "https://leetcode.com/problems/remove-boxes/",                              source: "LC 546",  diff: "H" },
      { id: "dpm8q8", title: "Strange Printer",                       link: "https://leetcode.com/problems/strange-printer/",                           source: "LC 664",  diff: "H" },
      { id: "dpm8q9", title: "Egg Dropping Puzzle",                   link: "https://www.geeksforgeeks.org/problems/egg-dropping-puzzle-1587115620/1",  source: "GFG",     diff: "H" },
    ],
  },
  {
    id: "dp-p9", title: "Grid / Path DP", subtitle: "2D grid traversals and path optimization",
    questions: [
      { id: "dpm9q1", title: "Unique Paths",                link: "https://leetcode.com/problems/unique-paths/",        source: "LC 62",  diff: "M" },
      { id: "dpm9q2", title: "Unique Paths II (obstacles)",  link: "https://leetcode.com/problems/unique-paths-ii/",    source: "LC 63",  diff: "M" },
      { id: "dpm9q3", title: "Minimum Path Sum",             link: "https://leetcode.com/problems/minimum-path-sum/",   source: "LC 64",  diff: "M" },
      { id: "dpm9q4", title: "Triangle",                    link: "https://leetcode.com/problems/triangle/",             source: "LC 120", diff: "M" },
      { id: "dpm9q5", title: "Dungeon Game",                 link: "https://leetcode.com/problems/dungeon-game/",        source: "LC 174", diff: "H" },
      { id: "dpm9q6", title: "Maximal Square",               link: "https://leetcode.com/problems/maximal-square/",      source: "LC 221", diff: "M" },
      { id: "dpm9q7", title: "Maximal Rectangle",            link: "https://leetcode.com/problems/maximal-rectangle/",   source: "LC 85",  diff: "H" },
      { id: "dpm9q8", title: "Cherry Pickup",                link: "https://leetcode.com/problems/cherry-pickup/",       source: "LC 741", diff: "H" },
    ],
  },
  {
    id: "dp-p10", title: "DP on Trees", subtitle: "Common at product companies",
    questions: [
      { id: "dpm10q1", title: "House Robber III",                          link: "https://leetcode.com/problems/house-robber-iii/",                                 source: "LC 337",  diff: "M" },
      { id: "dpm10q2", title: "Binary Tree Maximum Path Sum",              link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",                     source: "LC 124",  diff: "H" },
      { id: "dpm10q3", title: "Binary Tree Cameras",                       link: "https://leetcode.com/problems/binary-tree-cameras/",                               source: "LC 968",  diff: "H" },
      { id: "dpm10q4", title: "Diameter of Binary Tree",                   link: "https://leetcode.com/problems/diameter-of-binary-tree/",                           source: "LC 543",  diff: "E" },
      { id: "dpm10q5", title: "Longest Path With Different Adjacent Chars",link: "https://leetcode.com/problems/longest-path-with-different-adjacent-characters/",   source: "LC 2246", diff: "H" },
      { id: "dpm10q6", title: "Unique Binary Search Trees",                link: "https://leetcode.com/problems/unique-binary-search-trees/",                        source: "LC 96",   diff: "M" },
      { id: "dpm10q7", title: "Unique Binary Search Trees II",             link: "https://leetcode.com/problems/unique-binary-search-trees-ii/",                     source: "LC 95",   diff: "M" },
    ],
  },
  {
    id: "dp-p11", title: "Bitmask DP", subtitle: "Advanced — important for CP & top-tier interviews",
    questions: [
      { id: "dpm11q1", title: "Partition to K Equal Sum Subsets", link: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",    source: "LC 698",  diff: "M" },
      { id: "dpm11q2", title: "Shortest Path Visiting All Nodes", link: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",    source: "LC 847",  diff: "H" },
      { id: "dpm11q3", title: "Smallest Sufficient Team",         link: "https://leetcode.com/problems/smallest-sufficient-team/",            source: "LC 1125", diff: "H" },
      { id: "dpm11q4", title: "Find the Shortest Superstring",    link: "https://leetcode.com/problems/find-the-shortest-superstring/",       source: "LC 943",  diff: "H" },
      { id: "dpm11q5", title: "Beautiful Arrangement",            link: "https://leetcode.com/problems/beautiful-arrangement/",               source: "LC 526",  diff: "M" },
      { id: "dpm11q6", title: "Stickers to Spell Word",           link: "https://leetcode.com/problems/stickers-to-spell-word/",              source: "LC 691",  diff: "H" },
      { id: "dpm11q7", title: "Maximum Students Taking Exam",     link: "https://leetcode.com/problems/maximum-students-taking-exam/",        source: "LC 1349", diff: "H" },
      { id: "dpm11q8", title: "Traveling Salesman Problem",       link: "https://www.geeksforgeeks.org/problems/travelling-salesman-problem/1",source: "GFG",     diff: "H" },
      { id: "dpm11q9", title: "CF 1195C — Basketball Exercise",   link: "https://codeforces.com/problemset/problem/1195/C",                   source: "CF",      diff: "M" },
    ],
  },
  {
    id: "dp-p12", title: "Stock DP", subtitle: "Buy / Sell recurring sub-family",
    questions: [
      { id: "dpm12q1", title: "Best Time to Buy & Sell Stock",        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",                     source: "LC 121", diff: "E" },
      { id: "dpm12q2", title: "Best Time to Buy & Sell Stock II",     link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",                   source: "LC 122", diff: "M" },
      { id: "dpm12q3", title: "Best Time to Buy & Sell Stock III",    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",                  source: "LC 123", diff: "H" },
      { id: "dpm12q4", title: "Best Time to Buy & Sell Stock IV",     link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",                   source: "LC 188", diff: "H" },
      { id: "dpm12q5", title: "Stock with Cooldown",                  link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",        source: "LC 309", diff: "M" },
      { id: "dpm12q6", title: "Stock with Transaction Fee",           link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/", source: "LC 714", diff: "M" },
    ],
  },
  {
    id: "dp-p13", title: "Digit DP", subtitle: "Useful for Codeforces / competitive programming",
    questions: [
      { id: "dpm13q1", title: "Numbers At Most N Given Digit Set",              link: "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/",                   source: "LC 902",  diff: "H" },
      { id: "dpm13q2", title: "Non-negative Integers without Consecutive Ones", link: "https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/",     source: "LC 600",  diff: "H" },
      { id: "dpm13q3", title: "Number of Digit One",                            link: "https://leetcode.com/problems/number-of-digit-one/",                                 source: "LC 233",  diff: "H" },
      { id: "dpm13q4", title: "Numbers With Repeated Digits",                   link: "https://leetcode.com/problems/numbers-with-repeated-digits/",                       source: "LC 1012", diff: "H" },
      { id: "dpm13q5", title: "Count of Numbers with Given Digit Sum",          link: "https://www.geeksforgeeks.org/problems/sum-of-digits-of-numbers-from-1-to-n5313/1", source: "GFG",     diff: "H" },
    ],
  },
  {
    id: "dp-p14", title: "Game Theory DP", subtitle: "Niche — shows up occasionally in interviews",
    questions: [
      { id: "dpm14q1", title: "Predict the Winner", link: "https://leetcode.com/problems/predict-the-winner/", source: "LC 486",  diff: "M" },
      { id: "dpm14q2", title: "Stone Game",          link: "https://leetcode.com/problems/stone-game/",         source: "LC 877",  diff: "M" },
      { id: "dpm14q3", title: "Stone Game II",       link: "https://leetcode.com/problems/stone-game-ii/",      source: "LC 1140", diff: "M" },
      { id: "dpm14q4", title: "Stone Game III",      link: "https://leetcode.com/problems/stone-game-iii/",     source: "LC 1406", diff: "H" },
      { id: "dpm14q5", title: "Can I Win",           link: "https://leetcode.com/problems/can-i-win/",          source: "LC 464",  diff: "M" },
    ],
  },
];

/* ─── GRAPH DATA ─────────────────────────────────────────────────────────── */
const GRAPH_PATTERNS = [
  {
    id: "gr-p1", title: "Graph Representation & BFS/DFS Basics", subtitle: "Very High — everything below builds on this",
    questions: [
      { id: "grm1q1", title: "BFS of Graph",                     link: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",            source: "GFG",     diff: "E" },
      { id: "grm1q2", title: "DFS of Graph",                     link: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1", source: "GFG",     diff: "E" },
      { id: "grm1q3", title: "Number of Islands",                link: "https://leetcode.com/problems/number-of-islands/",                          source: "LC 200",  diff: "M" },
      { id: "grm1q4", title: "Clone Graph",                      link: "https://leetcode.com/problems/clone-graph/",                                source: "LC 133",  diff: "M" },
      { id: "grm1q5", title: "Flood Fill",                       link: "https://leetcode.com/problems/flood-fill/",                                 source: "LC 733",  diff: "E" },
      { id: "grm1q6", title: "Rotting Oranges (multi-source BFS)", link: "https://leetcode.com/problems/rotting-oranges/",                           source: "LC 994",  diff: "M" },
      { id: "grm1q7", title: "01 Matrix (multi-source BFS)",     link: "https://leetcode.com/problems/01-matrix/",                                  source: "LC 542",  diff: "M" },
      { id: "grm1q8", title: "Max Area of Island",               link: "https://leetcode.com/problems/max-area-of-island/",                         source: "LC 695",  diff: "M" },
    ],
  },
  {
    id: "gr-p2", title: "Connected Components / Grid-based Graphs", subtitle: "High importance",
    questions: [
      { id: "grm2q1", title: "Number of Provinces",                               link: "https://leetcode.com/problems/number-of-provinces/",                                          source: "LC 547",  diff: "M" },
      { id: "grm2q2", title: "Number of Connected Components (Undirected Graph)",  link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",       source: "LC 323",  diff: "M" },
      { id: "grm2q3", title: "Find the Number of Islands (GFG)",                  link: "https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1",                         source: "GFG",     diff: "M" },
      { id: "grm2q4", title: "Surrounded Regions",                                link: "https://leetcode.com/problems/surrounded-regions/",                                           source: "LC 130",  diff: "M" },
      { id: "grm2q5", title: "Shortest Path in Binary Matrix",                    link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",                               source: "LC 1091", diff: "M" },
      { id: "grm2q6", title: "Flood Fill Algorithm (GFG)",                        link: "https://www.geeksforgeeks.org/problems/flood-fill-algorithm1817/1",                           source: "GFG",     diff: "M" },
      { id: "grm2q7", title: "Making A Large Island",                             link: "https://leetcode.com/problems/making-a-large-island/",                                        source: "LC 827",  diff: "H" },
    ],
  },
  {
    id: "gr-p3", title: "Topological Sort + DAG DP", subtitle: "Very High — Kahn's algo, DFS-based sort, longest path in DAG",
    questions: [
      { id: "grm3q1", title: "Topological Sort (GFG)",            link: "https://www.geeksforgeeks.org/problems/topological-sort/1",                  source: "GFG",     diff: "M" },
      { id: "grm3q2", title: "Course Schedule",                   link: "https://leetcode.com/problems/course-schedule/",                             source: "LC 207",  diff: "M" },
      { id: "grm3q3", title: "Course Schedule II",                link: "https://leetcode.com/problems/course-schedule-ii/",                          source: "LC 210",  diff: "M" },
      { id: "grm3q4", title: "Find Eventual Safe States",         link: "https://leetcode.com/problems/find-eventual-safe-states/",                   source: "LC 802",  diff: "M" },
      { id: "grm3q5", title: "Alien Dictionary (GFG)",            link: "https://www.geeksforgeeks.org/problems/alien-dictionary/1",                  source: "GFG",     diff: "H" },
      { id: "grm3q6", title: "Parallel Courses III",              link: "https://leetcode.com/problems/parallel-courses-iii/",                        source: "LC 2050", diff: "H" },
      { id: "grm3q7", title: "Longest Path in DAG (GFG)",         link: "https://www.geeksforgeeks.org/problems/longest-path-between-any-pair-of-vertices3235/1", source: "GFG", diff: "M" },
      { id: "grm3q8", title: "Fox And Names (topo sort)",          link: "https://codeforces.com/problemset/problem/510/C",                           source: "CF 510C", diff: "M" },
    ],
  },
  {
    id: "gr-p4", title: "Cycle Detection (Directed & Undirected)", subtitle: "Medium — often merged into topo-sort/DSU questions",
    questions: [
      { id: "grm4q1", title: "Detect Cycle in Undirected Graph (GFG)", link: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1", source: "GFG",     diff: "M" },
      { id: "grm4q2", title: "Detect Cycle in Directed Graph (GFG)",  link: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1",   source: "GFG",     diff: "M" },
      { id: "grm4q3", title: "Fox And Two Dots (cycle in grid)",       link: "https://codeforces.com/problemset/problem/510/B",                             source: "CF 510B", diff: "M" },
      { id: "grm4q4", title: "Course Schedule (cycle detection)",      link: "https://leetcode.com/problems/course-schedule/",                               source: "LC 207",  diff: "M" },
    ],
  },
  {
    id: "gr-p5", title: "Dijkstra's Algorithm", subtitle: "Very High — most-asked graph algorithm in interviews",
    questions: [
      { id: "grm5q1",  title: "Implementing Dijkstra (GFG)",                     link: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1", source: "GFG",      diff: "M" },
      { id: "grm5q2",  title: "Network Delay Time",                              link: "https://leetcode.com/problems/network-delay-time/",                                     source: "LC 743",   diff: "M" },
      { id: "grm5q3",  title: "Path With Minimum Effort",                        link: "https://leetcode.com/problems/path-with-minimum-effort/",                               source: "LC 1631",  diff: "M" },
      { id: "grm5q4",  title: "Path with Maximum Probability",                   link: "https://leetcode.com/problems/path-with-maximum-probability/",                          source: "LC 1514",  diff: "M" },
      { id: "grm5q5",  title: "Number of Ways to Arrive at Destination",         link: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",                source: "LC 1976",  diff: "M" },
      { id: "grm5q6",  title: "Second Minimum Time to Reach Destination",        link: "https://leetcode.com/problems/second-minimum-time-to-reach-destination/",               source: "LC 2045",  diff: "H" },
      { id: "grm5q7",  title: "Number of Restricted Paths (First to Last Node)", link: "https://leetcode.com/problems/number-of-restricted-paths-from-first-to-last-node/",    source: "LC 1786",  diff: "M" },
      { id: "grm5q8",  title: "Min Cost to Make Valid Path in Grid (0-1 BFS)",   link: "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/", source: "LC 1368",  diff: "H" },
      { id: "grm5q9",  title: "Dijkstra? (CF 20C)",                              link: "https://codeforces.com/problemset/problem/20/C",                                        source: "CF 20C",   diff: "M" },
      { id: "grm5q10", title: "Jzzhu and Cities",                                link: "https://codeforces.com/problemset/problem/449/B",                                       source: "CF 449B",  diff: "H" },
      { id: "grm5q11", title: "Reachable Nodes In Subdivided Graph",             link: "https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/",                    source: "LC 882",   diff: "H" },
      { id: "grm5q12", title: "Min Weighted Subgraph With Required Paths",       link: "https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/",      source: "LC 2203",  diff: "H" },
      { id: "grm5q13", title: "Shortest Path From 1 to N (0-1 BFS)",            link: "https://www.geeksforgeeks.org/problems/shortest-path-from-1-to-n5847/1",                source: "GFG",      diff: "E" },
      { id: "grm5q14", title: "Edge Deletion (CF 1076D)",                        link: "https://codeforces.com/problemset/problem/1076/D",                                      source: "CF 1076D", diff: "H" },
      { id: "grm5q15", title: "Sleepy Game (CF 936B)",                           link: "https://codeforces.com/problemset/problem/936/B",                                       source: "CF 936B",  diff: "H" },
    ],
  },
  {
    id: "gr-p6", title: "Bellman-Ford", subtitle: "Medium-Low — follow-up: 'what if weights are negative?'",
    questions: [
      { id: "grm6q1", title: "Bellman-Ford Algorithm (GFG)",               link: "https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1", source: "GFG",     diff: "M" },
      { id: "grm6q2", title: "Negative Weight Cycle (GFG)",                link: "https://www.geeksforgeeks.org/problems/negative-weight-cycle3707/1",                       source: "GFG",     diff: "M" },
      { id: "grm6q3", title: "Cheapest Flights Within K Stops",            link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",                           source: "LC 787",  diff: "M" },
      { id: "grm6q4", title: "Minimum Cost to Reach Destination in Time",  link: "https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/",                source: "LC 1928", diff: "H" },
    ],
  },
  {
    id: "gr-p7", title: "Floyd-Warshall (All-Pairs Shortest Path)", subtitle: "Medium importance",
    questions: [
      { id: "grm7q1", title: "Implementing Floyd Warshall (GFG)",                                 link: "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1",                           source: "GFG",    diff: "M" },
      { id: "grm7q2", title: "City With Smallest Number of Neighbors at Threshold Distance",      link: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/", source: "LC 1334", diff: "M" },
      { id: "grm7q3", title: "Evaluate Division",                                                 link: "https://leetcode.com/problems/evaluate-division/",                                                   source: "LC 399",  diff: "M" },
      { id: "grm7q4", title: "Course Schedule IV",                                                link: "https://leetcode.com/problems/course-schedule-iv/",                                                  source: "LC 1462", diff: "M" },
      { id: "grm7q5", title: "Roads in Berland (CF 25C)",                                         link: "https://codeforces.com/problemset/problem/25/C",                                                     source: "CF 25C",  diff: "M" },
    ],
  },
  {
    id: "gr-p8", title: "Minimum Spanning Tree (Prim's & Kruskal's)", subtitle: "High importance",
    questions: [
      { id: "grm8q1", title: "Minimum Spanning Tree (GFG)",                         link: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",                                          source: "GFG",      diff: "M" },
      { id: "grm8q2", title: "Kruskal's Algorithm (GFG)",                           link: "https://www.geeksforgeeks.org/problems/kruskals-minimum-spanning-tree/1",                                 source: "GFG",      diff: "M" },
      { id: "grm8q3", title: "Prim's MST for Adjacency List (GFG)",                 link: "https://www.geeksforgeeks.org/problems/prims-mst-for-adjacency-list-representation1702/1",                source: "GFG",      diff: "M" },
      { id: "grm8q4", title: "Min Cost to Connect All Points",                      link: "https://leetcode.com/problems/min-cost-to-connect-all-points/",                                          source: "LC 1584",  diff: "M" },
      { id: "grm8q5", title: "Critical and Pseudo-Critical Edges in MST",           link: "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",        source: "LC 1489",  diff: "H" },
      { id: "grm8q6", title: "Shichikuji and Lasers (CF 1245D)",                    link: "https://codeforces.com/problemset/problem/1245/D",                                                       source: "CF 1245D", diff: "M" },
      { id: "grm8q7", title: "MST for Each Edge (CF 609E)",                         link: "https://codeforces.com/problemset/problem/609/E",                                                        source: "CF 609E",  diff: "H" },
    ],
  },
  {
    id: "gr-p9", title: "Union-Find / Disjoint Set Union (DSU)", subtitle: "Very High — foundational for MST, dynamic connectivity",
    questions: [
      { id: "grm9q1",  title: "Union-Find (GFG)",                               link: "https://www.geeksforgeeks.org/problems/union-find/1",                              source: "GFG",     diff: "M" },
      { id: "grm9q2",  title: "Number of Provinces",                             link: "https://leetcode.com/problems/number-of-provinces/",                               source: "LC 547",  diff: "M" },
      { id: "grm9q3",  title: "Redundant Connection",                            link: "https://leetcode.com/problems/redundant-connection/",                              source: "LC 684",  diff: "M" },
      { id: "grm9q4",  title: "Redundant Connection II (directed)",              link: "https://leetcode.com/problems/redundant-connection-ii/",                           source: "LC 685",  diff: "H" },
      { id: "grm9q5",  title: "Operations to Make Network Connected",            link: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",    source: "LC 1319", diff: "M" },
      { id: "grm9q6",  title: "Smallest String With Swaps",                      link: "https://leetcode.com/problems/smallest-string-with-swaps/",                        source: "LC 1202", diff: "M" },
      { id: "grm9q7",  title: "Satisfiability of Equality Equations",            link: "https://leetcode.com/problems/satisfiability-of-equality-equations/",              source: "LC 990",  diff: "M" },
      { id: "grm9q8",  title: "Roads not only in Berland (CF 25D)",              link: "https://codeforces.com/problemset/problem/25/D",                                   source: "CF 25D",  diff: "M" },
      { id: "grm9q9",  title: "Accounts Merge",                                 link: "https://leetcode.com/problems/accounts-merge/",                                    source: "LC 721",  diff: "M" },
      { id: "grm9q10", title: "Most Stones Removed with Same Row or Column",    link: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",       source: "LC 947",  diff: "M" },
      { id: "grm9q11", title: "Lexicographically Smallest Equivalent String",   link: "https://leetcode.com/problems/lexicographically-smallest-equivalent-string/",      source: "LC 1061", diff: "M" },
      { id: "grm9q12", title: "Similar String Groups",                          link: "https://leetcode.com/problems/similar-string-groups/",                              source: "LC 839",  diff: "H" },
      { id: "grm9q13", title: "Restructuring Company (CF 566D)",                link: "https://codeforces.com/problemset/problem/566/D",                                   source: "CF 566D", diff: "M" },
      { id: "grm9q14", title: "Vessels (CF 371D)",                              link: "https://codeforces.com/problemset/problem/371/D",                                   source: "CF 371D", diff: "M" },
    ],
  },
  {
    id: "gr-p10", title: "Bipartite Graph Check", subtitle: "Medium-Low importance",
    questions: [
      { id: "grm10q1", title: "Is Graph Bipartite?",                             link: "https://leetcode.com/problems/is-graph-bipartite/",                                source: "LC 785",   diff: "M" },
      { id: "grm10q2", title: "Possible Bipartition",                            link: "https://leetcode.com/problems/possible-bipartition/",                              source: "LC 886",   diff: "M" },
      { id: "grm10q3", title: "Bipartite Graph (GFG)",                           link: "https://www.geeksforgeeks.org/problems/bipartite-graph/1",                         source: "GFG",      diff: "M" },
      { id: "grm10q4", title: "Mahmoud and Ehab and the Bipartiteness (CF 862B)", link: "https://codeforces.com/problemset/problem/862/B",                                 source: "CF 862B",  diff: "M" },
    ],
  },
  {
    id: "gr-p11", title: "Strongly Connected Components (Kosaraju's / Tarjan's)", subtitle: "Medium-Low — strong CS-fundamentals rounds",
    questions: [
      { id: "grm11q1", title: "SCC — Kosaraju's Algo (GFG)",                     link: "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1",       source: "GFG",     diff: "H" },
      { id: "grm11q2", title: "SCC — Tarjan's Algo (GFG)",                       link: "https://www.geeksforgeeks.org/problems/strongly-connected-component-tarjanas-algo-1587115621/1", source: "GFG",   diff: "H" },
      { id: "grm11q3", title: "Min Vertices to Reach All Nodes",                 link: "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/",                source: "LC 1557", diff: "M" },
      { id: "grm11q4", title: "Checkposts (CF 427C)",                            link: "https://codeforces.com/problemset/problem/427/C",                                              source: "CF 427C", diff: "M" },
    ],
  },
  {
    id: "gr-p12", title: "Bridges & Articulation Points", subtitle: "Medium-Low — common in CP, occasional senior SDE",
    questions: [
      { id: "grm12q1", title: "Bridge Edge in Graph (GFG)",                      link: "https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1",                    source: "GFG",      diff: "M" },
      { id: "grm12q2", title: "Articulation Point - I (GFG)",                    link: "https://www.geeksforgeeks.org/problems/articulation-point-1/1",                    source: "GFG",      diff: "H" },
      { id: "grm12q3", title: "Critical Connections in a Network",               link: "https://leetcode.com/problems/critical-connections-in-a-network/",                 source: "LC 1192",  diff: "H" },
      { id: "grm12q4", title: "We Need More Bosses (CF 1000E)",                  link: "https://codeforces.com/problemset/problem/1000/E",                                 source: "CF 1000E", diff: "H" },
      { id: "grm12q5", title: "Bertown Roads (CF 118E)",                         link: "https://codeforces.com/problemset/problem/118/E",                                  source: "CF 118E",  diff: "H" },
    ],
  },
  {
    id: "gr-p13", title: "Eulerian Path / Circuit", subtitle: "Low — niche but occasionally asked",
    questions: [
      { id: "grm13q1", title: "Reconstruct Itinerary",                           link: "https://leetcode.com/problems/reconstruct-itinerary/",                              source: "LC 332",  diff: "H" },
      { id: "grm13q2", title: "Euler Circuit and Path (GFG)",                    link: "https://www.geeksforgeeks.org/problems/euler-circuit-and-path/1",                   source: "GFG",     diff: "M" },
      { id: "grm13q3", title: "Cracking the Safe (De Bruijn sequence)",          link: "https://leetcode.com/problems/cracking-the-safe/",                                  source: "LC 753",  diff: "H" },
      { id: "grm13q4", title: "Trails and Glades (CF 209C)",                     link: "https://codeforces.com/problemset/problem/209/C",                                   source: "CF 209C", diff: "H" },
    ],
  },
  {
    id: "gr-p14", title: "Max Flow / Min Cut / Bipartite Matching", subtitle: "Low for interviews, occasionally in CP",
    questions: [
      { id: "grm14q1", title: "Maximum Bipartite Matching (GFG)",                link: "https://www.geeksforgeeks.org/problems/maximum-bipartite-matching/1",               source: "GFG", diff: "H" },
      { id: "grm14q2", title: "Find Whether Path Exist (GFG)",                  link: "https://www.geeksforgeeks.org/problems/find-whether-path-exist2448/1",              source: "GFG", diff: "E" },
    ],
  },
];

/* ─── GREEDY DATA ────────────────────────────────────────────────────────── */
const GREEDY_PATTERNS = [
  {
    id: "gr-p1", title: "Greedy Foundations — Activity Selection & Intervals", subtitle: "Very High — FAANG staple, asked at every level",
    questions: [
      { id: "gry1q1",  title: "Activity Selection Problem",                      link: "https://www.geeksforgeeks.org/problems/activity-selection-2/1",                                  source: "GFG",     diff: "M" },
      { id: "gry1q2",  title: "N Meetings in One Room",                          link: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",                    source: "GFG",     diff: "E" },
      { id: "gry1q3",  title: "Merge Intervals",                                 link: "https://leetcode.com/problems/merge-intervals/",                                              source: "LC 56",   diff: "M" },
      { id: "gry1q4",  title: "Non-overlapping Intervals",                       link: "https://leetcode.com/problems/non-overlapping-intervals/",                                    source: "LC 435",  diff: "M" },
      { id: "gry1q5",  title: "Insert Interval",                                 link: "https://leetcode.com/problems/insert-interval/",                                              source: "LC 57",   diff: "M" },
      { id: "gry1q6",  title: "Minimum Number of Arrows to Burst Balloons",     link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",                   source: "LC 452",  diff: "M" },
      { id: "gry1q7",  title: "Meeting Rooms",                                   link: "https://leetcode.com/problems/meeting-rooms/",                                                source: "LC 252",  diff: "E" },
      { id: "gry1q8",  title: "Meeting Rooms II",                                link: "https://leetcode.com/problems/meeting-rooms-ii/",                                             source: "LC 253",  diff: "M" },
      { id: "gry1q9",  title: "Car Pooling",                                     link: "https://leetcode.com/problems/car-pooling/",                                                  source: "LC 1094", diff: "M" },
      { id: "gry1q10", title: "Minimum Interval to Include Each Query",          link: "https://leetcode.com/problems/minimum-interval-to-include-each-query/",                       source: "LC 1851", diff: "H" },
    ],
  },
  {
    id: "gr-p2", title: "Greedy on Arrays — Sorting-based Strategies", subtitle: "Very High — core greedy thinking, 60%+ of greedy interviews",
    questions: [
      { id: "gry2q1",  title: "Assign Cookies",                                  link: "https://leetcode.com/problems/assign-cookies/",                                               source: "LC 455",  diff: "E" },
      { id: "gry2q2",  title: "Largest Number",                                  link: "https://leetcode.com/problems/largest-number/",                                               source: "LC 179",  diff: "M" },
      { id: "gry2q3",  title: "Maximum Units on a Truck",                        link: "https://leetcode.com/problems/maximum-units-on-a-truck/",                                     source: "LC 1710", diff: "E" },
      { id: "gry2q4",  title: "Two City Scheduling",                             link: "https://leetcode.com/problems/two-city-scheduling/",                                          source: "LC 1029", diff: "M" },
      { id: "gry2q5",  title: "Minimum Cost to Move Chips",                     link: "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/",               source: "LC 1217", diff: "E" },
      { id: "gry2q6",  title: "Boats to Save People",                            link: "https://leetcode.com/problems/boats-to-save-people/",                                         source: "LC 881",  diff: "M" },
      { id: "gry2q7",  title: "Minimum Absolute Difference",                    link: "https://leetcode.com/problems/minimum-absolute-difference/",                                  source: "LC 1200", diff: "E" },
      { id: "gry2q8",  title: "Largest Perimeter Triangle",                     link: "https://leetcode.com/problems/largest-perimeter-triangle/",                                   source: "LC 976",  diff: "M" },
      { id: "gry2q9",  title: "Maximum Product of Three Numbers",               link: "https://leetcode.com/problems/maximum-product-of-three-numbers/",                             source: "LC 628",  diff: "E" },
      { id: "gry2q10", title: "Maximum Sum Combination",                         link: "https://www.geeksforgeeks.org/problems/maximum-sum-combination/0",                           source: "GFG",     diff: "M" },
      { id: "gry2q11", title: "Partition Labels",                                link: "https://leetcode.com/problems/partition-labels/",                                             source: "LC 763",  diff: "M" },
      { id: "gry2q12", title: "Sort Array by Parity",                            link: "https://leetcode.com/problems/sort-array-by-parity/",                                         source: "LC 905",  diff: "E" },
    ],
  },
  {
    id: "gr-p3", title: "Greedy on Strings", subtitle: "High — string + greedy, common in Google/Amazon rounds",
    questions: [
      { id: "gry3q1",  title: "Remove K Digits",                                 link: "https://leetcode.com/problems/remove-k-digits/",                                              source: "LC 402",  diff: "M" },
      { id: "gry3q2",  title: "Remove Duplicate Letters",                        link: "https://leetcode.com/problems/remove-duplicate-letters/",                                     source: "LC 316",  diff: "M" },
      { id: "gry3q3",  title: "Smallest Subsequence of Distinct Characters",    link: "https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/",                  source: "LC 1081", diff: "M" },
      { id: "gry3q4",  title: "Reorganize String",                               link: "https://leetcode.com/problems/reorganize-string/",                                            source: "LC 767",  diff: "M" },
      { id: "gry3q5",  title: "Task Scheduler",                                  link: "https://leetcode.com/problems/task-scheduler/",                                               source: "LC 621",  diff: "M" },
      { id: "gry3q6",  title: "Min Steps to Make Two Strings Anagram",          link: "https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/",           source: "LC 1347", diff: "M" },
      { id: "gry3q7",  title: "Minimum Add to Make Parentheses Valid",          link: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",                        source: "LC 921",  diff: "M" },
      { id: "gry3q8",  title: "Minimum Insertions to Balance Parentheses",      link: "https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/",            source: "LC 1541", diff: "M" },
      { id: "gry3q9",  title: "Check if String Can Break Another String",       link: "https://leetcode.com/problems/check-if-string-can-break-another-string/",                     source: "LC 1433", diff: "M" },
      { id: "gry3q10", title: "Construct K Palindromes",                         link: "https://leetcode.com/problems/construct-k-palindromes/",                                      source: "LC 1400", diff: "M" },
    ],
  },
  {
    id: "gr-p4", title: "Jump Game Family", subtitle: "Very High — classic greedy reachability, always asked",
    questions: [
      { id: "gry4q1", title: "Jump Game",    link: "https://leetcode.com/problems/jump-game/",     source: "LC 55",   diff: "M" },
      { id: "gry4q2", title: "Jump Game II", link: "https://leetcode.com/problems/jump-game-ii/",  source: "LC 45",   diff: "M" },
      { id: "gry4q3", title: "Jump Game III",link: "https://leetcode.com/problems/jump-game-iii/", source: "LC 1306", diff: "M" },
      { id: "gry4q4", title: "Jump Game IV", link: "https://leetcode.com/problems/jump-game-iv/",  source: "LC 1345", diff: "H" },
      { id: "gry4q5", title: "Jump Game V",  link: "https://leetcode.com/problems/jump-game-v/",   source: "LC 1340", diff: "H" },
      { id: "gry4q6", title: "Jump Game VI", link: "https://leetcode.com/problems/jump-game-vi/",  source: "LC 1696", diff: "M" },
      { id: "gry4q7", title: "Jump Game VII",link: "https://leetcode.com/problems/jump-game-vii/", source: "LC 1871", diff: "M" },
    ],
  },
  {
    id: "gr-p5", title: "Fractional Knapsack & Job Scheduling", subtitle: "High — pure greedy logic, campus + SDE interviews",
    questions: [
      { id: "gry5q1", title: "Fractional Knapsack",                  link: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",  source: "GFG",     diff: "M" },
      { id: "gry5q2", title: "Job Sequencing Problem",               link: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",source: "GFG",     diff: "M" },
      { id: "gry5q3", title: "Minimum Platforms",                    link: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",     source: "GFG",     diff: "M" },
      { id: "gry5q4", title: "Minimize the Heights II",              link: "https://www.geeksforgeeks.org/problems/minimize-the-heights3351/1",         source: "GFG",     diff: "M" },
      { id: "gry5q5", title: "Maximize Sum after K Negations",       link: "https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/",   source: "LC 1005", diff: "E" },
      { id: "gry5q6", title: "IPO",                                  link: "https://leetcode.com/problems/ipo/",                                        source: "LC 502",  diff: "H" },
    ],
  },
  {
    id: "gr-p6", title: "Greedy with Priority Queue (Heap-based)", subtitle: "Very High — greedy + heap combo dominates FAANG interviews",
    questions: [
      { id: "gry6q1",  title: "Kth Largest Element in an Array",       link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",       source: "LC 215",  diff: "M" },
      { id: "gry6q2",  title: "K Closest Points to Origin",            link: "https://leetcode.com/problems/k-closest-points-to-origin/",            source: "LC 973",  diff: "M" },
      { id: "gry6q3",  title: "Top K Frequent Elements",               link: "https://leetcode.com/problems/top-k-frequent-elements/",               source: "LC 347",  diff: "M" },
      { id: "gry6q4",  title: "Task Scheduler (Heap)",                 link: "https://leetcode.com/problems/task-scheduler/",                        source: "LC 621",  diff: "M" },
      { id: "gry6q5",  title: "Find Median from Data Stream",          link: "https://leetcode.com/problems/find-median-from-data-stream/",          source: "LC 295",  diff: "H" },
      { id: "gry6q6",  title: "Sliding Window Maximum",               link: "https://leetcode.com/problems/sliding-window-maximum/",                source: "LC 239",  diff: "H" },
      { id: "gry6q7",  title: "Furthest Building You Can Reach",      link: "https://leetcode.com/problems/furthest-building-you-can-reach/",       source: "LC 1642", diff: "M" },
      { id: "gry6q8",  title: "Maximum Frequency Stack",              link: "https://leetcode.com/problems/maximum-frequency-stack/",               source: "LC 895",  diff: "H" },
      { id: "gry6q9",  title: "Minimize Deviation in Array",          link: "https://leetcode.com/problems/minimize-deviation-in-array/",           source: "LC 1675", diff: "H" },
      { id: "gry6q10", title: "The Skyline Problem",                  link: "https://leetcode.com/problems/the-skyline-problem/",                   source: "LC 218",  diff: "H" },
      { id: "gry6q11", title: "Process Tasks Using Servers",          link: "https://leetcode.com/problems/process-tasks-using-servers/",           source: "LC 1882", diff: "M" },
      { id: "gry6q12", title: "Maximum Subsequence Score",            link: "https://leetcode.com/problems/maximum-subsequence-score/",             source: "LC 2542", diff: "M" },
    ],
  },
  {
    id: "gr-p7", title: "Greedy with Monotonic Stack", subtitle: "High — greedy + stack, asked at top companies",
    questions: [
      { id: "gry7q1", title: "Next Greater Element I",                link: "https://leetcode.com/problems/next-greater-element-i/",               source: "LC 496",  diff: "E" },
      { id: "gry7q2", title: "Next Greater Element II",               link: "https://leetcode.com/problems/next-greater-element-ii/",              source: "LC 503",  diff: "M" },
      { id: "gry7q3", title: "Daily Temperatures",                    link: "https://leetcode.com/problems/daily-temperatures/",                   source: "LC 739",  diff: "M" },
      { id: "gry7q4", title: "Largest Rectangle in Histogram",       link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",       source: "LC 84",   diff: "H" },
      { id: "gry7q5", title: "Trapping Rain Water",                   link: "https://leetcode.com/problems/trapping-rain-water/",                  source: "LC 42",   diff: "H" },
      { id: "gry7q6", title: "Sum of Subarray Minimums",             link: "https://leetcode.com/problems/sum-of-subarray-minimums/",             source: "LC 907",  diff: "M" },
      { id: "gry7q7", title: "Online Stock Span",                     link: "https://leetcode.com/problems/online-stock-span/",                    source: "LC 901",  diff: "M" },
      { id: "gry7q8", title: "Maximum Width Ramp",                    link: "https://leetcode.com/problems/maximum-width-ramp/",                   source: "LC 962",  diff: "M" },
      { id: "gry7q9", title: "132 Pattern",                           link: "https://leetcode.com/problems/132-pattern/",                          source: "LC 456",  diff: "M" },
    ],
  },
  {
    id: "gr-p8", title: "Candy / Greedy Distribution Problems", subtitle: "Medium-High — forward + backward sweeps, tricky to get right",
    questions: [
      { id: "gry8q1", title: "Candy",                                          link: "https://leetcode.com/problems/candy/",                                               source: "LC 135",  diff: "H" },
      { id: "gry8q2", title: "Lemonade Change",                                 link: "https://leetcode.com/problems/lemonade-change/",                                     source: "LC 860",  diff: "E" },
      { id: "gry8q3", title: "Queue Reconstruction by Height",                 link: "https://leetcode.com/problems/queue-reconstruction-by-height/",                      source: "LC 406",  diff: "M" },
      { id: "gry8q4", title: "Hand of Straights",                              link: "https://leetcode.com/problems/hand-of-straights/",                                   source: "LC 846",  diff: "M" },
      { id: "gry8q5", title: "Divide Array in Sets of K Consecutive Numbers", link: "https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/",       source: "LC 1296", diff: "M" },
      { id: "gry8q6", title: "Gas Station",                                    link: "https://leetcode.com/problems/gas-station/",                                         source: "LC 134",  diff: "M" },
    ],
  },
  {
    id: "gr-p9", title: "Greedy on Transactions & Exchanges", subtitle: "High — buy low sell high, job scheduling",
    questions: [
      { id: "gry9q1", title: "Best Time to Buy and Sell Stock II",                    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",                          source: "LC 122",  diff: "M" },
      { id: "gry9q2", title: "Best Time to Buy and Sell Stock with Transaction Fee",  link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",       source: "LC 714",  diff: "M" },
      { id: "gry9q3", title: "Maximum Profit in Job Scheduling",                     link: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",                          source: "LC 1235", diff: "H" },
      { id: "gry9q4", title: "Minimum Cost For Tickets",                             link: "https://leetcode.com/problems/minimum-cost-for-tickets/",                                  source: "LC 983",  diff: "M" },
      { id: "gry9q5", title: "Minimum Number of Taps to Water a Garden",             link: "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",           source: "LC 1326", diff: "H" },
      { id: "gry9q6", title: "Video Stitching",                                      link: "https://leetcode.com/problems/video-stitching/",                                            source: "LC 1024", diff: "M" },
    ],
  },
  {
    id: "gr-p10", title: "Constructive Greedy — Build the Answer Greedily", subtitle: "High — creative greedy, common at Google & CF",
    questions: [
      { id: "gry10q1",  title: "Wiggle Subsequence",                                link: "https://leetcode.com/problems/wiggle-subsequence/",                                       source: "LC 376",  diff: "M" },
      { id: "gry10q2",  title: "Non-decreasing Array",                             link: "https://leetcode.com/problems/non-decreasing-array/",                                     source: "LC 665",  diff: "M" },
      { id: "gry10q3",  title: "Create Maximum Number",                             link: "https://leetcode.com/problems/create-maximum-number/",                                    source: "LC 321",  diff: "H" },
      { id: "gry10q4",  title: "Split Array into Consecutive Subsequences",         link: "https://leetcode.com/problems/split-array-into-consecutive-subsequences/",                source: "LC 659",  diff: "M" },
      { id: "gry10q5",  title: "Min Deletions to Make Char Frequencies Unique",    link: "https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/",   source: "LC 1647", diff: "M" },
      { id: "gry10q6",  title: "Minimum Operations to Reduce X to Zero",           link: "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",                  source: "LC 1658", diff: "M" },
      { id: "gry10q7",  title: "Dota2 Senate",                                      link: "https://leetcode.com/problems/dota2-senate/",                                             source: "LC 649",  diff: "M" },
      { id: "gry10q8",  title: "Monotone Increasing Digits",                        link: "https://leetcode.com/problems/monotone-increasing-digits/",                               source: "LC 738",  diff: "M" },
      { id: "gry10q9",  title: "Advantage Shuffle",                                 link: "https://leetcode.com/problems/advantage-shuffle/",                                        source: "LC 870",  diff: "M" },
      { id: "gry10q10", title: "CF 1392C — Omkar and Baseball",                    link: "https://codeforces.com/problemset/problem/1392/C",                                        source: "CF",      diff: "M" },
    ],
  },
  {
    id: "gr-p11", title: "Greedy on Graphs — MST & Connectivity", subtitle: "High — Prim's & Kruskal's are pure greedy",
    questions: [
      { id: "gry11q1", title: "Minimum Spanning Tree (Kruskal/Prim)",                       link: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",                                                          source: "GFG",     diff: "M" },
      { id: "gry11q2", title: "Min Cost to Connect All Points",                            link: "https://leetcode.com/problems/min-cost-to-connect-all-points/",                                                         source: "LC 1584", diff: "M" },
      { id: "gry11q3", title: "Connecting Cities with Minimum Cost",                       link: "https://leetcode.com/problems/connecting-cities-with-minimum-cost/",                                                     source: "LC 1135", diff: "M" },
      { id: "gry11q4", title: "Optimize Water Distribution in a Village",                 link: "https://leetcode.com/problems/optimize-water-distribution-in-a-village/",                                                 source: "LC 1168", diff: "H" },
      { id: "gry11q5", title: "Find Critical and Pseudo-Critical Edges in MST",           link: "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",                        source: "LC 1489", diff: "H" },
      { id: "gry11q6", title: "Minimum Number of Visited Cells in a Grid",               link: "https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid/",                                               source: "LC 2617", diff: "H" },
    ],
  },
  {
    id: "gr-p12", title: "Advanced Greedy — Competitive Programming Level", subtitle: "Medium-Low for SDE; crucial for CP & senior interviews",
    questions: [
      { id: "gry12q1",  title: "Minimum Cost to Hire K Workers",                       link: "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/",                        source: "LC 857",  diff: "H" },
      { id: "gry12q2",  title: "Smallest Range Covering Elements from K Lists",        link: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",        source: "LC 632",  diff: "H" },
      { id: "gry12q3",  title: "Minimum Number of Refueling Stops",                    link: "https://leetcode.com/problems/minimum-number-of-refueling-stops/",                    source: "LC 871",  diff: "H" },
      { id: "gry12q4",  title: "Patching Array",                                       link: "https://leetcode.com/problems/patching-array/",                                       source: "LC 330",  diff: "H" },
      { id: "gry12q5",  title: "Maximum Number of Events That Can Be Attended",        link: "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/",        source: "LC 1353", diff: "M" },
      { id: "gry12q6",  title: "Maximum Number of Events That Can Be Attended II",     link: "https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended-ii/",     source: "LC 1751", diff: "H" },
      { id: "gry12q7",  title: "Minimum Moves to Reach Target Score",                  link: "https://leetcode.com/problems/minimum-moves-to-reach-target-score/",                  source: "LC 2139", diff: "M" },
      { id: "gry12q8",  title: "CF 1208C — Magic Grid",                               link: "https://codeforces.com/problemset/problem/1208/C",                                    source: "CF",      diff: "M" },
      { id: "gry12q9",  title: "CF 1209C — Paint the Numbers",                         link: "https://codeforces.com/problemset/problem/1209/C",                                    source: "CF",      diff: "M" },
      { id: "gry12q10", title: "CF 1092F — Tree with Maximum Cost",                    link: "https://codeforces.com/problemset/problem/1092/F",                                    source: "CF",      diff: "H" },
    ],
  },
];

/* ─── Colour tokens ──────────────────────────────────────────────────────── */
// Light: warm white + indigo
const L = {
  pageBg:    "#f5f6fa",
  card:      "#ffffff",
  cardHov:   "#f0f2ff",
  border:    "#e4e6f0",
  borderSub: "#eef0f8",
  headerBg:  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  accent:    "#5b5ef4",   // indigo
  accentBg:  "#eef0ff",
  text1:     "#16172b",
  text2:     "#4a4d6a",
  text3:     "#9496b0",
  notePreBg: "#f7f8ff",
  notePreBorder: "#c7caff",
  // diff
  eBg: "#e6faf0", eColor: "#0a7c42", eBorder: "#6ee7b7",
  mBg: "#fff8e6", mColor: "#a16207", mBorder: "#fcd34d",
  hBg: "#fff1f1", hColor: "#b91c1c", hBorder: "#fca5a5",
  // source
  srcBg: "#eef0f8", srcColor: "#5560a0",
  // modal
  modalBg: "#ffffff",
};
// Dark: deep navy + violet-indigo
const D = {
  pageBg:    "#0d1117",
  card:      "#161b22",
  cardHov:   "#1c2333",
  border:    "#30363d",
  borderSub: "#21262d",
  headerBg:  "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
  accent:    "#818cf8",   // indigo-400
  accentBg:  "#1e1b4b",
  text1:     "#e6edf3",
  text2:     "#8b949e",
  text3:     "#484f58",
  notePreBg: "#1a1f2c",
  notePreBorder: "#2d3560",
  // diff
  eBg: "#0a2e1a", eColor: "#3fb950", eBorder: "#238636",
  mBg: "#2e1f00", mColor: "#d29922", mBorder: "#9e6a03",
  hBg: "#2e0f0f", hColor: "#f85149", hBorder: "#6e1313",
  // source
  srcBg: "#1c2333", srcColor: "#8b949e",
  // modal
  modalBg: "#161b22",
};

/* ─── Topic cards ────────────────────────────────────────────────────────── */
const TOPICS = [
  { key: "arrays", label: "Arrays & Matrix",     emoji: "🔢", phases: 10, description: "Fundamentals, matrix, two-pointer, sorting tricks." },
  { key: "sw",     label: "Sliding Window",      emoji: "🪟", phases: 8,  description: "Fixed & variable windows, at-most K distinct, anagram tricks." },
  { key: "ps",     label: "Prefix Sum",          emoji: "➕", phases: 8,  description: "1D/2D prefix sums, hash map combos, modulo & XOR prefix." },
  { key: "bs",     label: "Binary Search",       emoji: "🔍", phases: 7,  description: "Classic BS, rotated arrays, peak finding, BS on answer." },
  { key: "rb",     label: "Recursion & BT",      emoji: "🔄", phases: 8,  description: "Subsets, combinations, permutations, grid backtracking." },
  { key: "dp",     label: "Dynamic Programming", emoji: "🧠", phases: 14, description: "1D/2D DP, knapsack, LCS, LIS, palindrome, bitmask, digit, game theory." },
  { key: "graph",  label: "Graphs",              emoji: "🕸️", phases: 14, description: "DFS/BFS, cycle detection, topo sort, shortest path, MST, DSU." },
  { key: "greedy", label: "Greedy Algorithms",   emoji: "🏆", phases: 12, description: "Intervals, jump games, heap greedy, monotonic stack, constructive, advanced CP." },
  { key: "bit",    label: "Bit Manipulation",    emoji: "⚡", phases: 7,  description: "XOR tricks, bitmask DP, Trie + XOR, math + bit patterns." },
  { key: "sq",     label: "Stack & Queue",       emoji: "⚙️", phases: 10, description: "Monotonic stack, histogram, parentheses, expression eval." },
  { key: "tree",   label: "Binary Tree",         emoji: "🌳", phases: 10, description: "Traversals, path problems, LCA, BST, tree DP, Morris." },
];

/* ─── Diff badge ─────────────────────────────────────────────────────────── */
function DiffBadge({ diff, tk }) {
  const cfg = diff === "E"
    ? { bg: tk.eBg, color: tk.eColor, border: tk.eBorder, label: "Easy" }
    : diff === "M"
    ? { bg: tk.mBg, color: tk.mColor, border: tk.mBorder, label: "Med" }
    : { bg: tk.hBg, color: tk.hColor, border: tk.hBorder, label: "Hard" };
  return (
    <span style={{
      fontSize: 10.5, padding: "2px 7px", borderRadius: 5,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      fontWeight: 600, letterSpacing: "0.01em", flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  );
}

/* ─── DP Detail view ─────────────────────────────────────────────────────── */
function DPDetailView({ isDark, onBack, checked, notes, onToggle, onOpenNote, onOpenCode, user }) {
  const [collapsed, setCollapsed] = useState({});
  const tk = isDark ? D : L;

  const allQ   = DP_PATTERNS.flatMap(p => p.questions);
  const doneQ  = allQ.filter(q => checked[q.id]).length;
  const totalQ = allQ.length;
  const pct    = totalQ > 0 ? Math.round((doneQ / totalQ) * 100) : 0;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1rem 4rem", fontFamily: "inherit" }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginBottom: "1.25rem",
          background: "none", border: "none", cursor: "pointer",
          color: tk.text2, fontSize: 13, padding: 0,
        }}
      >
        ← Back
      </button>

      {/* Hero header with gradient */}
      <div style={{
        background: tk.headerBg,
        borderRadius: 14, padding: "1.5rem 1.75rem",
        marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 26 }}>🧠</span>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                Dynamic Programming
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              14 patterns · {totalQ} problems · sorted basic → advanced
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{doneQ} / {totalQ}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 5, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: "#fff",
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>
      </div>

      {/* Pattern sections */}
      {DP_PATTERNS.map((pattern, patIdx) => {
        const isOpen   = !collapsed[pattern.id];
        const secDone  = pattern.questions.filter(q => checked[q.id]).length;
        const secTotal = pattern.questions.length;
        const secPct   = Math.round((secDone / secTotal) * 100);
        const allDone  = secDone === secTotal;

        return (
          <div
            key={pattern.id}
            style={{
              background: tk.card,
              border: `1px solid ${tk.border}`,
              borderLeft: `3px solid ${allDone ? (isDark ? D.eColor : L.eColor) : tk.accent}`,
              borderRadius: 10,
              marginBottom: 8,
              overflow: "hidden",
              transition: "box-shadow 0.15s",
            }}
          >
            {/* Section header */}
            <button
              onClick={() => setCollapsed(p => ({ ...p, [pattern.id]: !p[pattern.id] }))}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: "12px 16px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              {/* Index badge */}
              <span style={{
                fontSize: 10, fontWeight: 700, color: tk.accent,
                background: tk.accentBg,
                borderRadius: 5, padding: "2px 7px",
                flexShrink: 0, letterSpacing: "0.04em",
              }}>
                {String(patIdx + 1).padStart(2, "0")}
              </span>

              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: tk.text1, lineHeight: 1.3 }}>
                  {pattern.title}
                </div>
                <div style={{ fontSize: 11.5, color: tk.text3, marginTop: 2 }}>
                  {pattern.subtitle}
                </div>
              </div>

              {/* Progress + chevron */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {/* Mini ring / fraction */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 32, height: 5, borderRadius: 999,
                    background: isDark ? "#21262d" : "#e4e6f0",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${secPct}%`, height: "100%",
                      background: allDone ? (isDark ? D.eColor : L.eColor) : tk.accent,
                      borderRadius: 999, transition: "width 0.4s",
                    }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: allDone ? (isDark ? D.eColor : L.eColor) : tk.text3, fontWeight: allDone ? 600 : 400, minWidth: 28 }}>
                    {secDone}/{secTotal}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: tk.text3 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* Questions */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${tk.borderSub}` }}>
                {pattern.questions.map((q, qi) => {
                  const isDone  = !!checked[q.id];
                  const hasNote = !!notes[q.id];

                  return (
                    <div
                      key={q.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 11,
                        padding: "10px 16px 10px 44px",
                        borderTop: qi > 0 ? `1px solid ${tk.borderSub}` : "none",
                        background: isDone ? (isDark ? "#0d1117" : "#f7f9ff") : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={() => onToggle(q.id)}
                        title={isDone ? "Mark as pending" : "Mark as solved"}
                        style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isDone ? tk.accent : tk.border}`,
                          background: isDone ? tk.accent : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {isDone && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title + tags row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 13.5, fontWeight: 500,
                              color: isDone ? tk.text3 : tk.text1,
                              textDecoration: isDone ? "line-through" : "none",
                              textDecorationColor: tk.text3,
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={e => { if (!isDone) e.currentTarget.style.color = tk.accent; }}
                            onMouseLeave={e => { e.currentTarget.style.color = isDone ? tk.text3 : tk.text1; }}
                          >
                            {q.title}
                          </a>

                          {/* Source tag */}
                          <span style={{
                            fontSize: 10.5, padding: "2px 7px", borderRadius: 5,
                            background: tk.srcBg, color: tk.srcColor,
                            fontWeight: 500, flexShrink: 0,
                          }}>
                            {q.source}
                          </span>

                          {/* Difficulty */}
                          <DiffBadge diff={q.diff} tk={tk} />
                        </div>

                        {/* Note preview */}
                        {hasNote && (
                          <div style={{
                            marginBottom: 6, fontSize: 12, lineHeight: 1.55,
                            color: tk.text2, padding: "6px 10px",
                            background: tk.notePreBg,
                            border: `1px solid ${tk.notePreBorder}`,
                            borderRadius: 7,
                          }}>
                            📝 {notes[q.id]}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            onClick={() => onOpenNote(q.id, notes[q.id] || "")}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                              border: `1px solid ${hasNote ? tk.accent + "80" : tk.border}`,
                              background: hasNote ? tk.accentBg : (isDark ? "#1c2333" : "#f0f2f9"),
                              color: hasNote ? tk.accent : tk.text2,
                              fontFamily: "inherit", fontWeight: 500,
                              transition: "all 0.12s",
                            }}
                          >
                            {hasNote ? "✏️ Edit Note" : "📝 Add Note"}
                          </button>

                          {user && (
                            <button
                              onClick={() => onOpenCode(q)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                                border: `1px solid ${tk.border}`,
                                background: isDark ? "#1c2333" : "#f0f2f9",
                                color: tk.text2,
                                fontFamily: "inherit", fontWeight: 500,
                                transition: "all 0.12s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#21262d" : "#e8ecff"; e.currentTarget.style.color = tk.accent; e.currentTarget.style.borderColor = tk.accent + "60"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "#1c2333" : "#f0f2f9"; e.currentTarget.style.color = tk.text2; e.currentTarget.style.borderColor = tk.border; }}
                            >
                              💻 Save Code
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Graph Detail view ──────────────────────────────────────────────────── */
function GraphDetailView({ isDark, onBack, checked, notes, onToggle, onOpenNote, onOpenCode, user }) {
  const [collapsed, setCollapsed] = useState({});
  const tk = isDark ? D : L;

  const allQ   = GRAPH_PATTERNS.flatMap(p => p.questions);
  const doneQ  = allQ.filter(q => checked[q.id]).length;
  const totalQ = allQ.length;
  const pct    = totalQ > 0 ? Math.round((doneQ / totalQ) * 100) : 0;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1rem 4rem", fontFamily: "inherit" }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginBottom: "1.25rem",
          background: "none", border: "none", cursor: "pointer",
          color: tk.text2, fontSize: 13, padding: 0,
        }}
      >
        ← Back
      </button>

      {/* Hero header with gradient */}
      <div style={{
        background: "linear-gradient(135deg, #0d9488 0%, #065f46 100%)",
        borderRadius: 14, padding: "1.5rem 1.75rem",
        marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 26 }}>🕸️</span>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                Graphs
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              14 patterns · {totalQ} problems · sorted basic → advanced
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{doneQ} / {totalQ}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 5, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: "#fff",
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>
      </div>

      {/* Pattern sections */}
      {GRAPH_PATTERNS.map((pattern, patIdx) => {
        const isOpen   = !collapsed[pattern.id];
        const secDone  = pattern.questions.filter(q => checked[q.id]).length;
        const secTotal = pattern.questions.length;
        const secPct   = Math.round((secDone / secTotal) * 100);
        const allDone  = secDone === secTotal;

        return (
          <div
            key={pattern.id}
            style={{
              background: tk.card,
              border: `1px solid ${tk.border}`,
              borderLeft: `3px solid ${allDone ? (isDark ? D.eColor : L.eColor) : tk.accent}`,
              borderRadius: 10,
              marginBottom: 8,
              overflow: "hidden",
              transition: "box-shadow 0.15s",
            }}
          >
            {/* Section header */}
            <button
              onClick={() => setCollapsed(p => ({ ...p, [pattern.id]: !p[pattern.id] }))}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: "12px 16px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              {/* Index badge */}
              <span style={{
                fontSize: 10, fontWeight: 700, color: tk.accent,
                background: tk.accentBg,
                borderRadius: 5, padding: "2px 7px",
                flexShrink: 0, letterSpacing: "0.04em",
              }}>
                {String(patIdx + 1).padStart(2, "0")}
              </span>

              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: tk.text1, lineHeight: 1.3 }}>
                  {pattern.title}
                </div>
                <div style={{ fontSize: 11.5, color: tk.text3, marginTop: 2 }}>
                  {pattern.subtitle}
                </div>
              </div>

              {/* Progress + chevron */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {/* Mini ring / fraction */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 32, height: 5, borderRadius: 999,
                    background: isDark ? "#21262d" : "#e4e6f0",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${secPct}%`, height: "100%",
                      background: allDone ? (isDark ? D.eColor : L.eColor) : tk.accent,
                      borderRadius: 999, transition: "width 0.4s",
                    }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: allDone ? (isDark ? D.eColor : L.eColor) : tk.text3, fontWeight: allDone ? 600 : 400, minWidth: 28 }}>
                    {secDone}/{secTotal}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: tk.text3 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* Questions */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${tk.borderSub}` }}>
                {pattern.questions.map((q, qi) => {
                  const isDone  = !!checked[q.id];
                  const hasNote = !!notes[q.id];

                  return (
                    <div
                      key={q.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 11,
                        padding: "10px 16px 10px 44px",
                        borderTop: qi > 0 ? `1px solid ${tk.borderSub}` : "none",
                        background: isDone ? (isDark ? "#0d1117" : "#f7f9ff") : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={() => onToggle(q.id)}
                        title={isDone ? "Mark as pending" : "Mark as solved"}
                        style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isDone ? tk.accent : tk.border}`,
                          background: isDone ? tk.accent : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {isDone && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title + tags row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 13.5, fontWeight: 500,
                              color: isDone ? tk.text3 : tk.text1,
                              textDecoration: isDone ? "line-through" : "none",
                              textDecorationColor: tk.text3,
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={e => { if (!isDone) e.currentTarget.style.color = tk.accent; }}
                            onMouseLeave={e => { e.currentTarget.style.color = isDone ? tk.text3 : tk.text1; }}
                          >
                            {q.title}
                          </a>

                          {/* Source tag */}
                          <span style={{
                            fontSize: 10.5, padding: "2px 7px", borderRadius: 5,
                            background: tk.srcBg, color: tk.srcColor,
                            fontWeight: 500, flexShrink: 0,
                          }}>
                            {q.source}
                          </span>

                          {/* Difficulty */}
                          <DiffBadge diff={q.diff} tk={tk} />
                        </div>

                        {/* Note preview */}
                        {hasNote && (
                          <div style={{
                            marginBottom: 6, fontSize: 12, lineHeight: 1.55,
                            color: tk.text2, padding: "6px 10px",
                            background: tk.notePreBg,
                            border: `1px solid ${tk.notePreBorder}`,
                            borderRadius: 7,
                          }}>
                            📝 {notes[q.id]}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            onClick={() => onOpenNote(q.id, notes[q.id] || "")}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                              border: `1px solid ${hasNote ? tk.accent + "80" : tk.border}`,
                              background: hasNote ? tk.accentBg : (isDark ? "#1c2333" : "#f0f2f9"),
                              color: hasNote ? tk.accent : tk.text2,
                              fontFamily: "inherit", fontWeight: 500,
                              transition: "all 0.12s",
                            }}
                          >
                            {hasNote ? "✏️ Edit Note" : "📝 Add Note"}
                          </button>

                          {user && (
                            <button
                              onClick={() => onOpenCode(q)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                                border: `1px solid ${tk.border}`,
                                background: isDark ? "#1c2333" : "#f0f2f9",
                                color: tk.text2,
                                fontFamily: "inherit", fontWeight: 500,
                                transition: "all 0.12s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#21262d" : "#e8ecff"; e.currentTarget.style.color = tk.accent; e.currentTarget.style.borderColor = tk.accent + "60"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "#1c2333" : "#f0f2f9"; e.currentTarget.style.color = tk.text2; e.currentTarget.style.borderColor = tk.border; }}
                            >
                              💻 Save Code
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Greedy Detail view ─────────────────────────────────────────────────── */
function GreedyDetailView({ isDark, onBack, checked, notes, onToggle, onOpenNote, onOpenCode, user }) {
  const [collapsed, setCollapsed] = useState({});
  const tk = isDark ? D : L;

  const allQ   = GREEDY_PATTERNS.flatMap(p => p.questions);
  const doneQ  = allQ.filter(q => checked[q.id]).length;
  const totalQ = allQ.length;
  const pct    = totalQ > 0 ? Math.round((doneQ / totalQ) * 100) : 0;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 1rem 4rem", fontFamily: "inherit" }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginBottom: "1.25rem",
          background: "none", border: "none", cursor: "pointer",
          color: tk.text2, fontSize: 13, padding: 0,
        }}
      >
        ← Back
      </button>

      {/* Hero header — orange/amber gradient */}
      <div style={{
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 100%)",
        borderRadius: 14, padding: "1.5rem 1.75rem",
        marginBottom: "1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 26 }}>🏆</span>
              <h1 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                Greedy Algorithms
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              12 patterns · {totalQ} problems · sorted basic → advanced
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{doneQ} / {totalQ}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.25)", borderRadius: 999, height: 5, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: "#fff",
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>
      </div>

      {/* Pattern sections */}
      {GREEDY_PATTERNS.map((pattern, patIdx) => {
        const isOpen   = !collapsed[pattern.id];
        const secDone  = pattern.questions.filter(q => checked[q.id]).length;
        const secTotal = pattern.questions.length;
        const secPct   = Math.round((secDone / secTotal) * 100);
        const allDone  = secDone === secTotal;

        return (
          <div
            key={pattern.id}
            style={{
              background: tk.card,
              border: `1px solid ${tk.border}`,
              borderLeft: `3px solid ${allDone ? (isDark ? D.eColor : L.eColor) : "#f59e0b"}`,
              borderRadius: 10,
              marginBottom: 8,
              overflow: "hidden",
              transition: "box-shadow 0.15s",
            }}
          >
            {/* Section header */}
            <button
              onClick={() => setCollapsed(p => ({ ...p, [pattern.id]: !p[pattern.id] }))}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 12, padding: "12px 16px",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
              }}
            >
              {/* Index badge */}
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#b45309",
                background: isDark ? "#2d1f00" : "#fef3c7",
                borderRadius: 5, padding: "2px 7px",
                flexShrink: 0, letterSpacing: "0.04em",
                border: `1px solid ${isDark ? "#78350f" : "#fcd34d"}`,
              }}>
                {String(patIdx + 1).padStart(2, "0")}
              </span>

              {/* Title */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: tk.text1, lineHeight: 1.3 }}>
                  {pattern.title}
                </div>
                <div style={{ fontSize: 11.5, color: tk.text3, marginTop: 2 }}>
                  {pattern.subtitle}
                </div>
              </div>

              {/* Progress + chevron */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 32, height: 5, borderRadius: 999,
                    background: isDark ? "#21262d" : "#e4e6f0",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${secPct}%`, height: "100%",
                      background: allDone ? (isDark ? D.eColor : L.eColor) : "#f59e0b",
                      borderRadius: 999, transition: "width 0.4s",
                    }} />
                  </div>
                  <span style={{ fontSize: 11.5, color: allDone ? (isDark ? D.eColor : L.eColor) : tk.text3, fontWeight: allDone ? 600 : 400, minWidth: 28 }}>
                    {secDone}/{secTotal}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: tk.text3 }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* Questions */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${tk.borderSub}` }}>
                {pattern.questions.map((q, qi) => {
                  const isDone  = !!checked[q.id];
                  const hasNote = !!notes[q.id];

                  return (
                    <div
                      key={q.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 11,
                        padding: "10px 16px 10px 44px",
                        borderTop: qi > 0 ? `1px solid ${tk.borderSub}` : "none",
                        background: isDone ? (isDark ? "#0d1117" : "#fffbf0") : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={() => onToggle(q.id)}
                        title={isDone ? "Mark as pending" : "Mark as solved"}
                        style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isDone ? "#f59e0b" : tk.border}`,
                          background: isDone ? "#f59e0b" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                      >
                        {isDone && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 13.5, fontWeight: 500,
                              color: isDone ? tk.text3 : tk.text1,
                              textDecoration: isDone ? "line-through" : "none",
                              textDecorationColor: tk.text3,
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={e => { if (!isDone) e.currentTarget.style.color = "#d97706"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = isDone ? tk.text3 : tk.text1; }}
                          >
                            {q.title}
                          </a>

                          <span style={{
                            fontSize: 10.5, padding: "2px 7px", borderRadius: 5,
                            background: tk.srcBg, color: tk.srcColor,
                            fontWeight: 500, flexShrink: 0,
                          }}>
                            {q.source}
                          </span>

                          <DiffBadge diff={q.diff} tk={tk} />
                        </div>

                        {hasNote && (
                          <div style={{
                            marginBottom: 6, fontSize: 12, lineHeight: 1.55,
                            color: tk.text2, padding: "6px 10px",
                            background: tk.notePreBg,
                            border: `1px solid ${tk.notePreBorder}`,
                            borderRadius: 7,
                          }}>
                            📝 {notes[q.id]}
                          </div>
                        )}

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            onClick={() => onOpenNote(q.id, notes[q.id] || "")}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                              border: `1px solid ${hasNote ? "#f59e0b80" : tk.border}`,
                              background: hasNote ? (isDark ? "#2d1f00" : "#fef3c7") : (isDark ? "#1c2333" : "#f0f2f9"),
                              color: hasNote ? "#d97706" : tk.text2,
                              fontFamily: "inherit", fontWeight: 500,
                              transition: "all 0.12s",
                            }}
                          >
                            {hasNote ? "✏️ Edit Note" : "📝 Add Note"}
                          </button>

                          {user && (
                            <button
                              onClick={() => onOpenCode(q)}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontSize: 11.5, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
                                border: `1px solid ${tk.border}`,
                                background: isDark ? "#1c2333" : "#f0f2f9",
                                color: tk.text2,
                                fontFamily: "inherit", fontWeight: 500,
                                transition: "all 0.12s",
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = isDark ? "#21262d" : "#fef3c7"; e.currentTarget.style.color = "#d97706"; e.currentTarget.style.borderColor = "#f59e0b60"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? "#1c2333" : "#f0f2f9"; e.currentTarget.style.color = tk.text2; e.currentTarget.style.borderColor = tk.border; }}
                            >
                              💻 Save Code
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main MasterTopic ───────────────────────────────────────────────────── */
export default function MasterTopic() {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const tk         = isDark ? D : L;

  const [checked,     setChecked]     = useState({});
  const [notes,       setNotes]       = useState({});
  const [loaded,      setLoaded]      = useState(false);
  const [openNote,    setOpenNote]    = useState(null);
  const [noteText,    setNoteText]    = useState("");
  const [codeModal,   setCodeModal]   = useState(null);
  const [hovered,     setHovered]     = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    (async () => {
      try {
        const data = await getUserProgress(user.uid);
        setChecked(data.checked || {});
        setNotes(data.notes    || {});
      } catch (e) { console.error(e); }
      setLoaded(true);
    })();
  }, [user]);

  const persist = async (nc, nn) => {
    if (!user) return;
    try { await saveUserProgress(user.uid, nc, nn); } catch (e) { console.error(e); }
  };

  const handleToggle    = (id) => { const n = { ...checked, [id]: !checked[id] }; setChecked(n); persist(n, notes); };
  const handleOpenNote  = (id, val) => { setNoteText(val); setOpenNote(id); };
  const handleSaveNote  = () => { const n = { ...notes, [openNote]: noteText }; setNotes(n); persist(checked, n); setOpenNote(null); setNoteText(""); };
  const handleDeleteNote= () => { const n = { ...notes }; delete n[openNote]; setNotes(n); persist(checked, n); setOpenNote(null); setNoteText(""); };

  if (!loaded) return (
    <div style={{ padding: "3rem", textAlign: "center", color: tk.text3, fontSize: 13 }}>Loading…</div>
  );

  /* ── DP Detail ── */
  if (activeTopic === "dp") {
    return (
      <>
        <DPDetailView
          isDark={isDark} onBack={() => setActiveTopic(null)}
          checked={checked} notes={notes}
          onToggle={handleToggle} onOpenNote={handleOpenNote}
          onOpenCode={q => setCodeModal(q)} user={user}
        />

        {/* Note modal */}
        {openNote && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{
              background: tk.modalBg, borderRadius: 14,
              border: `1px solid ${tk.border}`,
              padding: "1.5rem", width: "100%", maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: tk.text1 }}>
                  {notes[openNote] ? "✏️ Edit Note" : "📝 Add Note"}
                </span>
                <button onClick={() => setOpenNote(null)} style={{ background: "none", border: "none", cursor: "pointer", color: tk.text3, fontSize: 20, lineHeight: 1, padding: 2 }}>×</button>
              </div>
              <textarea
                autoFocus value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Approach, complexity, key insight, similar problems…"
                rows={5}
                style={{
                  width: "100%", resize: "vertical", fontSize: 13, padding: "10px 12px",
                  borderRadius: 8, border: `1.5px solid ${tk.border}`,
                  background: isDark ? "#0d1117" : "#f5f6fa",
                  color: tk.text1, fontFamily: "inherit", boxSizing: "border-box",
                  outline: "none", lineHeight: 1.6, transition: "border 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = tk.accent}
                onBlur={e => e.target.style.borderColor = tk.border}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                {notes[openNote] && (
                  <button onClick={handleDeleteNote} style={{ fontSize: 12, color: isDark ? D.hColor : L.hColor, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${isDark ? D.hBorder : L.hBorder}`, background: isDark ? D.hBg : L.hBg }}>
                    Delete
                  </button>
                )}
                <button onClick={() => setOpenNote(null)} style={{ fontSize: 12, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${tk.border}`, background: "transparent", color: tk.text2 }}>
                  Cancel
                </button>
                <button onClick={handleSaveNote} style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "6px 18px", borderRadius: 7, background: tk.accent, color: "#fff", border: "none" }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {codeModal && (
          <Suspense fallback={null}>
            <CodeModal question={codeModal} onClose={() => setCodeModal(null)} />
          </Suspense>
        )}
      </>
    );
  }

  /* ── Graph Detail ── */
  if (activeTopic === "graph") {
    return (
      <>
        <GraphDetailView
          isDark={isDark} onBack={() => setActiveTopic(null)}
          checked={checked} notes={notes}
          onToggle={handleToggle} onOpenNote={handleOpenNote}
          onOpenCode={q => setCodeModal(q)} user={user}
        />

        {/* Note modal */}
        {openNote && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{
              background: tk.modalBg, borderRadius: 14,
              border: `1px solid ${tk.border}`,
              padding: "1.5rem", width: "100%", maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: tk.text1 }}>
                  {notes[openNote] ? "✏️ Edit Note" : "📝 Add Note"}
                </span>
                <button onClick={() => setOpenNote(null)} style={{ background: "none", border: "none", cursor: "pointer", color: tk.text3, fontSize: 20, lineHeight: 1, padding: 2 }}>×</button>
              </div>
              <textarea
                autoFocus value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Approach, complexity, key insight, similar problems…"
                rows={5}
                style={{
                  width: "100%", resize: "vertical", fontSize: 13, padding: "10px 12px",
                  borderRadius: 8, border: `1.5px solid ${tk.border}`,
                  background: isDark ? "#0d1117" : "#f5f6fa",
                  color: tk.text1, fontFamily: "inherit", boxSizing: "border-box",
                  outline: "none", lineHeight: 1.6, transition: "border 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = tk.accent}
                onBlur={e => e.target.style.borderColor = tk.border}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                {notes[openNote] && (
                  <button onClick={handleDeleteNote} style={{ fontSize: 12, color: isDark ? D.hColor : L.hColor, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${isDark ? D.hBorder : L.hBorder}`, background: isDark ? D.hBg : L.hBg }}>
                    Delete
                  </button>
                )}
                <button onClick={() => setOpenNote(null)} style={{ fontSize: 12, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${tk.border}`, background: "transparent", color: tk.text2 }}>
                  Cancel
                </button>
                <button onClick={handleSaveNote} style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "6px 18px", borderRadius: 7, background: tk.accent, color: "#fff", border: "none" }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {codeModal && (
          <Suspense fallback={null}>
            <CodeModal question={codeModal} onClose={() => setCodeModal(null)} />
          </Suspense>
        )}
      </>
    );
  }

  /* ── Greedy Detail ── */
  if (activeTopic === "greedy") {
    return (
      <>
        <GreedyDetailView
          isDark={isDark} onBack={() => setActiveTopic(null)}
          checked={checked} notes={notes}
          onToggle={handleToggle} onOpenNote={handleOpenNote}
          onOpenCode={q => setCodeModal(q)} user={user}
        />

        {/* Note modal */}
        {openNote && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{
              background: tk.modalBg, borderRadius: 14,
              border: `1px solid ${tk.border}`,
              padding: "1.5rem", width: "100%", maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: tk.text1 }}>
                  {notes[openNote] ? "✏️ Edit Note" : "📝 Add Note"}
                </span>
                <button onClick={() => setOpenNote(null)} style={{ background: "none", border: "none", cursor: "pointer", color: tk.text3, fontSize: 20, lineHeight: 1, padding: 2 }}>×</button>
              </div>
              <textarea
                autoFocus value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Approach, complexity, key insight, similar problems…"
                rows={5}
                style={{
                  width: "100%", resize: "vertical", fontSize: 13, padding: "10px 12px",
                  borderRadius: 8, border: `1.5px solid ${tk.border}`,
                  background: isDark ? "#0d1117" : "#f5f6fa",
                  color: tk.text1, fontFamily: "inherit", boxSizing: "border-box",
                  outline: "none", lineHeight: 1.6, transition: "border 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#f59e0b"}
                onBlur={e => e.target.style.borderColor = tk.border}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                {notes[openNote] && (
                  <button onClick={handleDeleteNote} style={{ fontSize: 12, color: isDark ? D.hColor : L.hColor, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${isDark ? D.hBorder : L.hBorder}`, background: isDark ? D.hBg : L.hBg }}>
                    Delete
                  </button>
                )}
                <button onClick={() => setOpenNote(null)} style={{ fontSize: 12, cursor: "pointer", padding: "6px 14px", borderRadius: 7, border: `1px solid ${tk.border}`, background: "transparent", color: tk.text2 }}>
                  Cancel
                </button>
                <button onClick={handleSaveNote} style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "6px 18px", borderRadius: 7, background: "#f59e0b", color: "#fff", border: "none" }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {codeModal && (
          <Suspense fallback={null}>
            <CodeModal question={codeModal} onClose={() => setCodeModal(null)} />
          </Suspense>
        )}
      </>
    );
  }

  /* ── Topic grid ── */
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem 4rem", fontFamily: "inherit" }}>

      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: tk.text1, letterSpacing: "-0.03em" }}>
          🎯 Master a Topic
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: tk.text2 }}>
          Pick a topic to go deep — curated problems, patterns and notes.
        </p>
      </div>

      {/* Topics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {TOPICS.map((topic) => {
          const isHov   = hovered === topic.key;
          const isReady = topic.key === "dp" || topic.key === "graph" || topic.key === "greedy";

          return (
            <div
              key={topic.key}
              onClick={() => isReady && setActiveTopic(topic.key)}
              onMouseEnter={() => setHovered(topic.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 16px",
                borderRadius: 11,
                border: `1px solid ${isHov && isReady ? tk.accent + "80" : tk.border}`,
                background: isHov && isReady ? (isDark ? "#1c2333" : "#f0f2ff") : tk.card,
                cursor: isReady ? "pointer" : "default",
                transition: "all 0.15s",
                opacity: isReady ? 1 : 0.5,
                boxShadow: isHov && isReady ? `0 4px 20px ${tk.accent}20` : "none",
              }}
            >
              {/* Emoji */}
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{topic.emoji}</span>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: tk.text1 }}>{topic.label}</span>
                  {isReady && (
                    <span style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 5,
                      background: isDark ? "#0a2e1a" : "#e6faf0",
                      color: isDark ? D.eColor : L.eColor,
                      fontWeight: 700, letterSpacing: "0.05em", border: `1px solid ${isDark ? D.eBorder : L.eBorder}`,
                    }}>
                      READY
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: tk.text3, lineHeight: 1.4 }}>
                  {topic.description}
                </div>
              </div>

              {/* Phases */}
              <span style={{ fontSize: 12, color: tk.text3, flexShrink: 0 }}>
                {topic.phases} phases
              </span>

              {/* Arrow */}
              {isReady && (
                <span style={{ fontSize: 16, color: isHov ? tk.accent : tk.text3, flexShrink: 0, transition: "color 0.15s" }}>→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
