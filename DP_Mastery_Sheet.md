# Dynamic Programming — Complete Pattern-wise Prep Sheet

Organized basic → advanced. Question count per pattern is weighted by real interview/CP frequency, not evenly distributed. Solve in order — each pattern builds intuition for the next.

---

## 1. Foundational 1D DP (Fibonacci / Climbing Stairs family)
**Importance: High (always the entry point, but rarely asked standalone in senior interviews)** — 6 questions

1. Climbing Stairs — LeetCode 70 — https://leetcode.com/problems/climbing-stairs/
2. Min Cost Climbing Stairs — LeetCode 746 — https://leetcode.com/problems/min-cost-climbing-stairs/
3. House Robber — LeetCode 198 — https://leetcode.com/problems/house-robber/
4. House Robber II (circular) — LeetCode 213 — https://leetcode.com/problems/house-robber-ii/
5. Fibonacci Number — LeetCode 509 — https://leetcode.com/problems/fibonacci-number/
6. Nth Tribonacci Number — LeetCode 1137 — https://leetcode.com/problems/n-th-tribonacci-number/

---

## 2. Kadane's Algorithm / Max Subarray DP
**Importance: Medium** — 5 questions

1. Maximum Subarray — LeetCode 53 — https://leetcode.com/problems/maximum-subarray/
2. Maximum Product Subarray — LeetCode 152 — https://leetcode.com/problems/maximum-product-subarray/
3. Maximum Sum Circular Subarray — LeetCode 918 — https://leetcode.com/problems/maximum-sum-circular-subarray/
4. Maximum Subarray Sum after K Concatenations — GFG — https://www.geeksforgeeks.org/problems/maximum-subarray-sum-after-k-concatenations5502/1
5. Max Sum of Rectangle No Larger Than K — LeetCode 363 — https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/

---

## 3. 0/1 Knapsack Pattern
**Importance: Very High (base of ~30% of all DP interview questions)** — 11 questions

1. 0-1 Knapsack — GFG — https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1
2. Partition Equal Subset Sum — LeetCode 416 — https://leetcode.com/problems/partition-equal-subset-sum/
3. Subset Sum Problem — GFG — https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1
4. Target Sum — LeetCode 494 — https://leetcode.com/problems/target-sum/
5. Last Stone Weight II — LeetCode 1049 — https://leetcode.com/problems/last-stone-weight-ii/
6. Ones and Zeroes (2D knapsack) — LeetCode 474 — https://leetcode.com/problems/ones-and-zeroes/
7. Equal Sum Partition with Min Difference — GFG — https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1
8. Count Subsets with Given Sum — GFG — https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1
9. Number of Dice Rolls With Target Sum — LeetCode 1155 — https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/
10. Codeforces 455A — Boredom (knapsack on frequency counts) — https://codeforces.com/problemset/problem/455/A
11. Codeforces 543A — Writing Code (knapsack-style DP) — https://codeforces.com/problemset/problem/543/A

---

## 4. Unbounded Knapsack Pattern
**Importance: High** — 7 questions

1. Unbounded Knapsack — GFG — https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1
2. Coin Change (min coins) — LeetCode 322 — https://leetcode.com/problems/coin-change/
3. Coin Change II (count ways) — LeetCode 518 — https://leetcode.com/problems/coin-change-ii/
4. Combination Sum IV — LeetCode 377 — https://leetcode.com/problems/combination-sum-iv/
5. Rod Cutting — GFG — https://www.geeksforgeeks.org/problems/rod-cutting0840/1
6. Perfect Squares — LeetCode 279 — https://leetcode.com/problems/perfect-squares/
7. Codeforces 189A — Cut Ribbon — https://codeforces.com/problemset/problem/189/A

---

## 5. Longest Common Subsequence (LCS) Family
**Importance: Very High (heavily asked, many derivative problems)** — 11 questions

1. Longest Common Subsequence — LeetCode 1143 — https://leetcode.com/problems/longest-common-subsequence/
2. Longest Common Subsequence — GFG — https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1
3. Shortest Common Supersequence (length) — LeetCode 1092 — https://leetcode.com/problems/shortest-common-supersequence/
4. Delete Operation for Two Strings — LeetCode 583 — https://leetcode.com/problems/delete-operation-for-two-strings/
5. Minimum ASCII Delete Sum for Two Strings — LeetCode 712 — https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/
6. Longest Common Substring — GFG — https://www.geeksforgeeks.org/problems/longest-common-substring1452/1
7. Distinct Subsequences — LeetCode 115 — https://leetcode.com/problems/distinct-subsequences/
8. Interleaving String — LeetCode 97 — https://leetcode.com/problems/interleaving-string/
9. Edit Distance — LeetCode 72 — https://leetcode.com/problems/edit-distance/
10. Wildcard Matching — LeetCode 44 — https://leetcode.com/problems/wildcard-matching/
11. Regular Expression Matching — LeetCode 10 — https://leetcode.com/problems/regular-expression-matching/

---

## 6. Longest Increasing Subsequence (LIS) Family
**Importance: High** — 9 questions

1. Longest Increasing Subsequence — LeetCode 300 — https://leetcode.com/problems/longest-increasing-subsequence/
2. Longest Increasing Subsequence — GFG — https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1
3. Russian Doll Envelopes — LeetCode 354 — https://leetcode.com/problems/russian-doll-envelopes/
4. Maximum Sum Increasing Subsequence — GFG — https://www.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1
5. Number of Longest Increasing Subsequences — LeetCode 673 — https://leetcode.com/problems/number-of-longest-increasing-subsequence/
6. Longest Bitonic Subsequence — GFG — https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0007/1
7. Minimum Number of Deletions to Make a Sorted Sequence — GFG — https://www.geeksforgeeks.org/problems/minimum-number-of-deletions-to-make-a-sorted-sequence3248/1
8. Box Stacking Problem — GFG — https://www.geeksforgeeks.org/problems/box-stacking/1
9. Codeforces 1096D — Easy Problem (LIS-based counting) — https://codeforces.com/problemset/problem/1096/D

---

## 7. Palindrome DP
**Importance: Very High (interviewer favorite — tests interval DP thinking)** — 12 questions

1. Longest Palindromic Substring — LeetCode 5 — https://leetcode.com/problems/longest-palindromic-substring/
2. Palindromic Substrings (count) — LeetCode 647 — https://leetcode.com/problems/palindromic-substrings/
3. Longest Palindromic Subsequence — LeetCode 516 — https://leetcode.com/problems/longest-palindromic-subsequence/
4. Longest Palindromic Subsequence — GFG — https://www.geeksforgeeks.org/problems/longest-palindromic-subsequence-1612327878/1
5. Palindrome Partitioning (all partitions) — LeetCode 131 — https://leetcode.com/problems/palindrome-partitioning/
6. Palindrome Partitioning II (min cuts) — LeetCode 132 — https://leetcode.com/problems/palindrome-partitioning-ii/
7. Palindrome Partitioning — GFG — https://www.geeksforgeeks.org/problems/palindrome-partitioning2903/1
8. Minimum Insertion Steps to Make a String Palindrome — LeetCode 1312 — https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/
9. Count Different Palindromic Subsequences — LeetCode 730 — https://leetcode.com/problems/count-different-palindromic-subsequences/
10. Palindrome Partitioning III (min changes for k palindromes) — LeetCode 1278 — https://leetcode.com/problems/palindrome-partitioning-iii/
11. Palindrome Partitioning IV — LeetCode 1745 — https://leetcode.com/problems/palindrome-partitioning-iv/
12. Scramble String (interval + palindrome-adjacent) — LeetCode 87 — https://leetcode.com/problems/scramble-string/

---

## 8. Matrix Chain Multiplication / Interval (Range) DP
**Importance: High (core "MCM pattern" — burst balloons, boolean parenthesization all derive from this)** — 9 questions

1. Matrix Chain Multiplication — GFG — https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1
2. Burst Balloons — LeetCode 312 — https://leetcode.com/problems/burst-balloons/
3. Minimum Score Triangulation of Polygon — LeetCode 1039 — https://leetcode.com/problems/minimum-score-triangulation-of-polygon/
4. Boolean Parenthesization — GFG — https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1
5. Minimum Cost to Cut a Stick — LeetCode 1547 — https://leetcode.com/problems/minimum-cost-to-cut-a-stick/
6. Optimal Binary Search Tree — GFG — https://www.geeksforgeeks.org/problems/optimal-binary-search-tree1131/1
7. Remove Boxes — LeetCode 546 — https://leetcode.com/problems/remove-boxes/
8. Strange Printer — LeetCode 664 — https://leetcode.com/problems/strange-printer/
9. Egg Dropping Puzzle — GFG — https://www.geeksforgeeks.org/problems/egg-dropping-puzzle-1587115620/1

---

## 9. DP on Grids / Paths
**Importance: High** — 8 questions

1. Unique Paths — LeetCode 62 — https://leetcode.com/problems/unique-paths/
2. Unique Paths II (obstacles) — LeetCode 63 — https://leetcode.com/problems/unique-paths-ii/
3. Minimum Path Sum — LeetCode 64 — https://leetcode.com/problems/minimum-path-sum/
4. Triangle — LeetCode 120 — https://leetcode.com/problems/triangle/
5. Dungeon Game — LeetCode 174 — https://leetcode.com/problems/dungeon-game/
6. Maximal Square — LeetCode 221 — https://leetcode.com/problems/maximal-square/
7. Maximal Rectangle — LeetCode 85 — https://leetcode.com/problems/maximal-rectangle/
8. Cherry Pickup — LeetCode 741 — https://leetcode.com/problems/cherry-pickup/

---

## 10. DP on Trees
**Importance: Medium-High (common at product-based companies)** — 7 questions

1. House Robber III — LeetCode 337 — https://leetcode.com/problems/house-robber-iii/
2. Binary Tree Maximum Path Sum — LeetCode 124 — https://leetcode.com/problems/binary-tree-maximum-path-sum/
3. Binary Tree Cameras — LeetCode 968 — https://leetcode.com/problems/binary-tree-cameras/
4. Diameter of Binary Tree — LeetCode 543 — https://leetcode.com/problems/diameter-of-binary-tree/
5. Longest Path With Different Adjacent Characters — LeetCode 2246 — https://leetcode.com/problems/longest-path-with-different-adjacent-characters/
6. Unique Binary Search Trees — LeetCode 96 — https://leetcode.com/problems/unique-binary-search-trees/
7. Unique Binary Search Trees II — LeetCode 95 — https://leetcode.com/problems/unique-binary-search-trees-ii/

---

## 11. Bitmask DP
**Importance: High for advanced/CP interviews, less common in standard SDE rounds — but important to know at least the pattern** — 9 questions

1. Partition to K Equal Sum Subsets — LeetCode 698 — https://leetcode.com/problems/partition-to-k-equal-sum-subsets/
2. Shortest Path Visiting All Nodes (TSP-style) — LeetCode 847 — https://leetcode.com/problems/shortest-path-visiting-all-nodes/
3. Smallest Sufficient Team — LeetCode 1125 — https://leetcode.com/problems/smallest-sufficient-team/
4. Find the Shortest Superstring — LeetCode 943 — https://leetcode.com/problems/find-the-shortest-superstring/
5. Beautiful Arrangement — LeetCode 526 — https://leetcode.com/problems/beautiful-arrangement/
6. Stickers to Spell Word — LeetCode 691 — https://leetcode.com/problems/stickers-to-spell-word/
7. Maximum Students Taking Exam — LeetCode 1349 — https://leetcode.com/problems/maximum-students-taking-exam/
8. Traveling Salesman Problem — GFG — https://www.geeksforgeeks.org/problems/travelling-salesman-problem/1
9. Codeforces 1195C — Basketball Exercise (small-state DP, good warm-up before bitmask) — https://codeforces.com/problemset/problem/1195/C

---

## 12. Stock Buy/Sell DP
**Importance: Medium-High (its own recurring sub-family in interviews)** — 6 questions

1. Best Time to Buy and Sell Stock — LeetCode 121 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
2. Best Time to Buy and Sell Stock II — LeetCode 122 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
3. Best Time to Buy and Sell Stock III — LeetCode 123 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/
4. Best Time to Buy and Sell Stock IV — LeetCode 188 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/
5. Best Time to Buy and Sell Stock with Cooldown — LeetCode 309 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
6. Best Time to Buy and Sell Stock with Transaction Fee — LeetCode 714 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/

---

## 13. Digit DP
**Importance: Low-Medium in interviews, moderate in CF/advanced CP** — 5 questions

1. Numbers At Most N Given Digit Set — LeetCode 902 — https://leetcode.com/problems/numbers-at-most-n-given-digit-set/
2. Non-negative Integers without Consecutive Ones — LeetCode 600 — https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/
3. Number of Digit One — LeetCode 233 — https://leetcode.com/problems/number-of-digit-one/
4. Numbers With Repeated Digits — LeetCode 1012 — https://leetcode.com/problems/numbers-with-repeated-digits/
5. Count of Numbers with Given Digit Sum in a Range — GFG — https://www.geeksforgeeks.org/problems/sum-of-digits-of-numbers-from-1-to-n5313/1

---

## 14. Game Theory DP
**Importance: Low-Medium (niche but shows up occasionally)** — 5 questions

1. Predict the Winner — LeetCode 486 — https://leetcode.com/problems/predict-the-winner/
2. Stone Game — LeetCode 877 — https://leetcode.com/problems/stone-game/
3. Stone Game II — LeetCode 1140 — https://leetcode.com/problems/stone-game-ii/
4. Stone Game III — LeetCode 1406 — https://leetcode.com/problems/stone-game-iii/
5. Can I Win — LeetCode 464 — https://leetcode.com/problems/can-i-win/

---

## Suggested Order of Attack
1. Foundational 1D DP → Kadane's
2. 0/1 Knapsack → Unbounded Knapsack
3. LCS family → Edit Distance/Wildcard (string DP)
4. LIS family
5. Palindrome DP (this is where most interviewers push hardest)
6. Matrix Chain / Interval DP
7. Grid DP
8. Tree DP
9. Stock DP (quick standalone family, do anytime)
10. Bitmask DP → Digit DP → Game Theory DP (only after the above are solid — these are "extra depth" for top-tier interviews/CP)

## Notes
- GFG links point to their "Practice" portal problems, which are the standard versions used in interview prep — if a link ever 404s (GFG occasionally renames slugs), search the exact title on geeksforgeeks.org/problems.
- For deeper Codeforces practice beyond the ones listed (I kept CF entries to problems I'm fully confident are correctly linked), use the tag filter: https://codeforces.com/problemset?tags=dp — sort by difficulty rating and grind 800–1500 rated DP problems first, then 1600–1900.
- Given your current LeetCode-medium level, I'd start today from Section 3 (0/1 Knapsack) since Sections 1–2 you've likely already internalized through your recent array/DP practice.
