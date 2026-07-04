import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import { getUserProgress, saveUserProgress } from "./services/firestoreService";

// Lazy-load CodeModal so Monaco is never on the critical path
const CodeModal = lazy(() => import("./components/CodeModal"));

const DIFF_LIGHT = {
  E: { label: "Easy",   bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
  M: { label: "Medium", bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27" },
  H: { label: "Hard",   bg: "#FCEBEB", color: "#A32D2D", border: "#F09595" },
};

const DIFF_DARK = {
  E: { label: "Easy",   bg: "#1a2e0f", color: "#86efac", border: "#22633a" },
  M: { label: "Medium", bg: "#3d2f0e", color: "#fbbf24", border: "#a16207" },
  H: { label: "Hard",   bg: "#3b1111", color: "#fca5a5", border: "#991b1b" },
};

const getDIFF = (isDark) => isDark ? DIFF_DARK : DIFF_LIGHT;

const ALL_SECTIONS = [
  {
    id: "phase1", topic: "arrays", title: "Phase 1 — Basics", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "p1q1",  title: "Largest Element in Array",               link: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1",           important: false, diff: "E" },
      { id: "p1q2",  title: "Second Largest Element",                  link: "https://www.geeksforgeeks.org/problems/second-largest3735/1",                     important: false, diff: "E" },
      { id: "p1q3",  title: "Check if Array is Sorted",                link: "https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted0701/1",        important: false, diff: "E" },
      { id: "p1q4",  title: "Remove Duplicates from Sorted Array",     link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",             important: false, diff: "E" },
      { id: "p1q5",  title: "Left Rotate Array by One",                link: "https://www.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1", important: false, diff: "E" },
      { id: "p1q6",  title: "Rotate Array by K",                       link: "https://leetcode.com/problems/rotate-array/",                                    important: false, diff: "M" },
      { id: "p1q7",  title: "Move Zeroes",                             link: "https://leetcode.com/problems/move-zeroes/",                                     important: false, diff: "E" },
      { id: "p1q8",  title: "Missing Number",                          link: "https://leetcode.com/problems/missing-number/",                                  important: true,  diff: "E" },
      { id: "p1q9",  title: "Union of Two Sorted Arrays",              link: "https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1", important: false, diff: "M" },
      { id: "p1q10", title: "Maximum Consecutive Ones",                link: "https://leetcode.com/problems/max-consecutive-ones/",                            important: false, diff: "E" },
    ]
  },
  {
    id: "phase2", topic: "arrays", title: "Phase 2 — Core Interview Questions", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "p2q1",  title: "Single Number",                           link: "https://leetcode.com/problems/single-number/",                                   important: true,  diff: "E" },
      { id: "p2q2",  title: "Two Sum",                                 link: "https://leetcode.com/problems/two-sum/",                                         important: true,  diff: "E" },
      { id: "p2q3",  title: "Sort Colors (Dutch National Flag)",        link: "https://leetcode.com/problems/sort-colors/",                                    important: true,  diff: "M" },
      { id: "p2q4",  title: "Majority Element (Moore's Voting)",        link: "https://leetcode.com/problems/majority-element/",                               important: true,  diff: "E" },
      { id: "p2q5",  title: "Kadane's Algorithm — Maximum Subarray",   link: "https://leetcode.com/problems/maximum-subarray/",                               important: true,  diff: "M" },
      { id: "p2q6",  title: "Best Time to Buy and Sell Stock",         link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",                important: true,  diff: "E" },
      { id: "p2q7",  title: "Rearrange Array Elements by Sign",        link: "https://leetcode.com/problems/rearrange-array-elements-by-sign/",               important: false, diff: "M" },
      { id: "p2q8",  title: "Next Permutation",                        link: "https://leetcode.com/problems/next-permutation/",                               important: true,  diff: "M" },
      { id: "p2q9",  title: "Leaders in an Array",                     link: "https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1",       important: false, diff: "E" },
      { id: "p2q10", title: "Longest Consecutive Sequence",            link: "https://leetcode.com/problems/longest-consecutive-sequence/",                   important: true,  diff: "M" },
    ]
  },
  {
    id: "phase3", topic: "arrays", title: "Phase 3 — Matrix Problems", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "p3q1", title: "Set Matrix Zeroes",   link: "https://leetcode.com/problems/set-matrix-zeroes/", important: true,  diff: "M" },
      { id: "p3q2", title: "Rotate Image (90°)",  link: "https://leetcode.com/problems/rotate-image/",      important: true,  diff: "M" },
      { id: "p3q3", title: "Spiral Matrix",        link: "https://leetcode.com/problems/spiral-matrix/",     important: true,  diff: "M" },
      { id: "p3q4", title: "Pascal's Triangle",   link: "https://leetcode.com/problems/pascals-triangle/",  important: false, diff: "E" },
    ]
  },
  {
    id: "phase4", topic: "arrays", title: "Phase 4 — Prefix Sum + Hashing", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "p4q1", title: "Longest Subarray with Sum K (Positive)", link: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1", important: true, diff: "M" },
      { id: "p4q2", title: "Subarray Sum Equals K",                  link: "https://leetcode.com/problems/subarray-sum-equals-k/",                    important: true, diff: "M" },
      { id: "p4q3", title: "Count Subarrays with Given XOR",         link: "https://www.naukri.com/code360/problems/subarrays-with-xor-k_6826258",    important: true, diff: "M" },
    ]
  },
  {
    id: "phase5", topic: "arrays", title: "Phase 5 — Medium / Hard (Important)", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "p5q1", title: "Majority Element II (n/3 times)",     link: "https://leetcode.com/problems/majority-element-ii/",                       important: true, diff: "M" },
      { id: "p5q2", title: "3Sum",                                 link: "https://leetcode.com/problems/3sum/",                                     important: true, diff: "M" },
      { id: "p5q3", title: "4Sum",                                 link: "https://leetcode.com/problems/4sum/",                                     important: true, diff: "M" },
      { id: "p5q4", title: "Merge Intervals",                      link: "https://leetcode.com/problems/merge-intervals/",                          important: true, diff: "M" },
      { id: "p5q5", title: "Merge Sorted Array",                   link: "https://leetcode.com/problems/merge-sorted-array/",                       important: true, diff: "E" },
      { id: "p5q6", title: "Find Missing and Repeating Number",    link: "https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1", important: true, diff: "M" },
      { id: "p5q7", title: "Count Inversions (Merge Sort)",        link: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1",  important: true, diff: "H" },
      { id: "p5q8", title: "Reverse Pairs",                        link: "https://leetcode.com/problems/reverse-pairs/",                           important: true, diff: "H" },
    ]
  },
  {
    id: "phase6", topic: "arrays", title: "Phase 6 — Sliding Window / Advanced", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "p6q1", title: "Maximum Product Subarray",  link: "https://leetcode.com/problems/maximum-product-subarray/",                 important: true,  diff: "M" },
      { id: "p6q2", title: "Sliding Window Maximum",    link: "https://leetcode.com/problems/sliding-window-maximum/",                   important: true,  diff: "H" },
      { id: "p6q3", title: "Maximum Points from Cards", link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", important: false, diff: "M" },
    ]
  },
  {
    id: "phase7", topic: "arrays", title: "Phase 7 — Famous Hard Problems", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "p7q1", title: "Trapping Rain Water",           link: "https://leetcode.com/problems/trapping-rain-water/",          important: true, diff: "H" },
      { id: "p7q2", title: "Container With Most Water",     link: "https://leetcode.com/problems/container-with-most-water/",    important: true, diff: "M" },
      { id: "p7q3", title: "Product of Array Except Self",  link: "https://leetcode.com/problems/product-of-array-except-self/", important: true, diff: "M" },
      { id: "p7q4", title: "First Missing Positive",        link: "https://leetcode.com/problems/first-missing-positive/",       important: true, diff: "H" },
      { id: "p7q5", title: "Jump Game",                     link: "https://leetcode.com/problems/jump-game/",                    important: true, diff: "M" },
      { id: "p7q6", title: "Jump Game II",                  link: "https://leetcode.com/problems/jump-game-ii/",                 important: true, diff: "M" },
      { id: "p7q7", title: "Gas Station",                   link: "https://leetcode.com/problems/gas-station/",                  important: true, diff: "M" },
    ]
  },
  {
    id: "array_extra", topic: "arrays", title: "Arrays — Extra Must-Know", color: "#5F5E5A", bg: "#F1EFE8",
    questions: [
      { id: "aeq1",  title: "Reverse an Array / String",                      link: "https://www.geeksforgeeks.org/write-a-program-to-reverse-an-array-or-string/",                    important: false, diff: "E" },
      { id: "aeq2",  title: "Find Max and Min in Array",                       link: "https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/",                                 important: false, diff: "E" },
      { id: "aeq3",  title: "Kth Max and Min Element",                         link: "https://www.geeksforgeeks.org/kth-smallestlargest-element-unsorted-array/",                      important: true,  diff: "M" },
      { id: "aeq4",  title: "Sort 0s 1s 2s (Dutch Flag)",                      link: "https://leetcode.com/problems/sort-colors/",                                                    important: true,  diff: "M" },
      { id: "aeq5",  title: "Move Negative Elements to One Side",              link: "https://www.geeksforgeeks.org/move-negative-numbers-beginning-positive-end-constant-extra-space/", important: false, diff: "E" },
      { id: "aeq6",  title: "Union and Intersection of Two Sorted Arrays",     link: "https://www.geeksforgeeks.org/union-and-intersection-of-two-sorted-arrays-2/",                  important: true,  diff: "M" },
      { id: "aeq7",  title: "Cyclically Rotate Array by One",                  link: "https://www.geeksforgeeks.org/c-program-cyclically-rotate-array-one/",                          important: false, diff: "E" },
      { id: "aeq8",  title: "Largest Sum Contiguous Subarray (Kadane's)",      link: "https://leetcode.com/problems/maximum-subarray/",                                              important: true,  diff: "M" },
      { id: "aeq9",  title: "Minimize Maximum Difference Between Heights",     link: "https://www.geeksforgeeks.org/minimize-the-maximum-difference-between-the-heights/",            important: true,  diff: "M" },
      { id: "aeq10", title: "Minimum Jumps to Reach End",                      link: "https://leetcode.com/problems/jump-game-ii/",                                                  important: true,  diff: "M" },
      { id: "aeq11", title: "Find Duplicate in Array of N+1 Integers",         link: "https://leetcode.com/problems/find-the-duplicate-number/",                                    important: true,  diff: "M" },
      { id: "aeq12", title: "Merge 2 Sorted Arrays Without Extra Space",       link: "https://www.geeksforgeeks.org/merge-two-sorted-arrays-o1-extra-space/",                       important: true,  diff: "H" },
      { id: "aeq13", title: "Find All Pairs with Sum Equal to X",              link: "https://www.geeksforgeeks.org/find-all-pairs-possible-from-the-given-array/",                 important: false, diff: "E" },
      { id: "aeq14", title: "Find Common Elements in 3 Sorted Arrays",         link: "https://www.geeksforgeeks.org/find-common-elements-three-sorted-arrays/",                     important: false, diff: "E" },
      { id: "aeq15", title: "Rearrange +ve and -ve Alternately (O(1) space)",  link: "https://www.geeksforgeeks.org/rearrange-array-alternating-positive-negative-items-o1-extra-space/", important: false, diff: "M" },
      { id: "aeq16", title: "Subarray with Sum Equal to 0",                    link: "https://www.geeksforgeeks.org/find-if-there-is-a-subarray-with-0-sum/",                       important: true,  diff: "M" },
      { id: "aeq17", title: "Factorial of a Large Number",                     link: "https://www.geeksforgeeks.org/factorial-large-number/",                                       important: false, diff: "M" },
      { id: "aeq18", title: "Maximum Product Subarray",                        link: "https://leetcode.com/problems/maximum-product-subarray/",                                    important: true,  diff: "M" },
      { id: "aeq19", title: "Longest Consecutive Subsequence",                 link: "https://leetcode.com/problems/longest-consecutive-sequence/",                                important: true,  diff: "M" },
      { id: "aeq20", title: "Elements Appearing More Than n/k Times",          link: "https://www.geeksforgeeks.org/given-an-array-of-of-size-n-finds-all-the-elements-that-appear-more-than-nk-times/", important: true, diff: "M" },
      { id: "aeq21", title: "Max Profit by Buying & Selling Stock Twice",      link: "https://www.geeksforgeeks.org/maximum-profit-by-buying-and-selling-a-share-at-most-twice/",   important: true,  diff: "H" },
      { id: "aeq22", title: "Check if Array is Subset of Another",             link: "https://www.geeksforgeeks.org/find-whether-an-array-is-subset-of-another-array/",            important: false, diff: "E" },
      { id: "aeq23", title: "Triplet Sum to Given Value (3Sum)",               link: "https://leetcode.com/problems/3sum/",                                                        important: true,  diff: "M" },
      { id: "aeq24", title: "Trapping Rain Water",                             link: "https://leetcode.com/problems/trapping-rain-water/",                                         important: true,  diff: "H" },
      { id: "aeq25", title: "Chocolate Distribution Problem",                  link: "https://www.geeksforgeeks.org/chocolate-distribution-problem/",                              important: false, diff: "E" },
      { id: "aeq26", title: "Smallest Subarray with Sum Greater than X",       link: "https://www.geeksforgeeks.org/minimum-length-subarray-sum-greater-given-value/",             important: true,  diff: "M" },
      { id: "aeq27", title: "Three-Way Partitioning Around a Value",           link: "https://www.geeksforgeeks.org/three-way-partitioning-of-an-array-around-a-given-value/",    important: false, diff: "M" },
      { id: "aeq28", title: "Minimum Swaps to Bring Elements <= K Together",  link: "https://www.geeksforgeeks.org/minimum-swaps-required-bring-elements-less-equal-k-together/",important: false, diff: "M" },
      { id: "aeq29", title: "Min Operations to Make Array Palindrome",         link: "https://www.geeksforgeeks.org/minimum-number-of-moves-to-make-a-palindrome/",               important: false, diff: "M" },
      { id: "aeq30", title: "Median of 2 Sorted Arrays (Equal Size)",          link: "https://www.geeksforgeeks.org/median-of-two-sorted-arrays/",                               important: true,  diff: "H" },
      { id: "aeq31", title: "Median of 2 Sorted Arrays (Different Size)",      link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",                              important: true,  diff: "H" },
    ]
  },
  {
    id: "matrix", topic: "arrays", title: "Matrix Problems", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "mq1",  title: "Spiral Traversal on a Matrix",                       link: "https://leetcode.com/problems/spiral-matrix/",                                               important: true,  diff: "M" },
      { id: "mq2",  title: "Search an Element in a Matrix",                      link: "https://leetcode.com/problems/search-a-2d-matrix/",                                         important: true,  diff: "M" },
      { id: "mq3",  title: "Find Median in Row-Wise Sorted Matrix",              link: "https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/",                         important: true,  diff: "H" },
      { id: "mq4",  title: "Find Row with Maximum Number of 1s",                 link: "https://www.geeksforgeeks.org/find-the-row-with-maximum-number-1s/",                        important: false, diff: "E" },
      { id: "mq5",  title: "Print Elements in Sorted Order (Row-Column Sorted)", link: "https://www.geeksforgeeks.org/print-elements-sorted-order-row-column-wise-sorted-matrix/", important: false, diff: "M" },
      { id: "mq6",  title: "Maximum Size Rectangle (Histogram)",                 link: "https://leetcode.com/problems/maximal-rectangle/",                                          important: true,  diff: "H" },
      { id: "mq7",  title: "Find a Specific Pair in Matrix",                     link: "https://www.geeksforgeeks.org/find-a-specific-pair-in-matrix/",                            important: false, diff: "M" },
      { id: "mq8",  title: "Rotate Matrix by 90 Degrees",                        link: "https://leetcode.com/problems/rotate-image/",                                               important: true,  diff: "M" },
      { id: "mq9",  title: "Kth Smallest in Row-Column Sorted Matrix",           link: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",                   important: true,  diff: "M" },
      { id: "mq10", title: "Common Elements in All Rows of Matrix",              link: "https://www.geeksforgeeks.org/common-elements-in-all-rows-of-a-given-matrix/",             important: false, diff: "M" },
    ]
  },
  {
    id: "sw1", topic: "sw", title: "Sliding Window — Phase 1: Fixed Window Basics", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "sw1q1", title: "Maximum Average Subarray I",                  link: "https://leetcode.com/problems/maximum-average-subarray-i/",                       important: true,  diff: "E", pattern: "Fixed window" },
      { id: "sw1q2", title: "Find K-Beauty of a Number",                   link: "https://leetcode.com/problems/find-the-k-beauty-of-a-number/",                    important: false, diff: "E", pattern: "Fixed window" },
      { id: "sw1q3", title: "Substrings of Size Three with Distinct Chars",link: "https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/",important: false, diff: "E", pattern: "Fixed window" },
      { id: "sw1q4", title: "Sliding Window Maximum",                      link: "https://leetcode.com/problems/sliding-window-maximum/",                           important: true,  diff: "H", pattern: "Monotonic deque" },
    ]
  },
  {
    id: "sw2", topic: "sw", title: "Sliding Window — Phase 2: Variable Window Basics", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "sw2q1", title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", important: true, diff: "M", pattern: "Variable window + hashmap" },
      { id: "sw2q2", title: "Maximum Consecutive Ones III",                   link: "https://leetcode.com/problems/max-consecutive-ones-iii/",                       important: true, diff: "M", pattern: "Variable window" },
      { id: "sw2q3", title: "Fruit Into Baskets",                             link: "https://leetcode.com/problems/fruit-into-baskets/",                             important: true, diff: "M", pattern: "At most K distinct" },
      { id: "sw2q4", title: "Longest Repeating Character Replacement",        link: "https://leetcode.com/problems/longest-repeating-character-replacement/",        important: true, diff: "M", pattern: "Variable window + frequency" },
    ]
  },
  {
    id: "sw3", topic: "sw", title: "Sliding Window — Phase 3: At Most K Distinct Pattern", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "sw3q1", title: "Longest Substring with At Most K Distinct Characters", link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/", important: true, diff: "M", pattern: "At most K distinct" },
      { id: "sw3q2", title: "Subarrays with K Different Integers",                  link: "https://leetcode.com/problems/subarrays-with-k-different-integers/",                   important: true, diff: "H", pattern: "Exact K = atMost(K) - atMost(K-1)" },
    ]
  },
  {
    id: "sw4", topic: "sw", title: "Sliding Window — Phase 4: Minimum Window Type", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "sw4q1", title: "Minimum Size Subarray Sum",  link: "https://leetcode.com/problems/minimum-size-subarray-sum/",  important: true, diff: "M", pattern: "Shrinking window" },
      { id: "sw4q2", title: "Minimum Window Substring",   link: "https://leetcode.com/problems/minimum-window-substring/",   important: true, diff: "H", pattern: "Shrinking window + frequency map" },
    ]
  },
  {
    id: "sw5", topic: "sw", title: "Sliding Window — Phase 5: Anagram Window", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "sw5q1", title: "Permutation in String",       link: "https://leetcode.com/problems/permutation-in-string/",       important: true, diff: "M", pattern: "Fixed window + frequency" },
      { id: "sw5q2", title: "Find All Anagrams in a String",link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",important: true, diff: "M", pattern: "Fixed window + frequency" },
    ]
  },
  {
    id: "sw6", topic: "sw", title: "Sliding Window — Phase 6: Prefix Sum + Window Hybrid", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "sw6q1", title: "Binary Subarrays With Sum",       link: "https://leetcode.com/problems/binary-subarrays-with-sum/",       important: true, diff: "M", pattern: "Exact K = atMost(K) - atMost(K-1)" },
      { id: "sw6q2", title: "Count Number of Nice Subarrays",  link: "https://leetcode.com/problems/count-number-of-nice-subarrays/",  important: true, diff: "M", pattern: "Exact K pattern" },
      { id: "sw6q3", title: "Subarray Product Less Than K",    link: "https://leetcode.com/problems/subarray-product-less-than-k/",    important: true, diff: "M", pattern: "Variable window (product)" },
    ]
  },
  {
    id: "sw7", topic: "sw", title: "Sliding Window — Phase 7: Advanced", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "sw7q1", title: "Maximum Points You Can Obtain from Cards", link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",   important: true, diff: "M", pattern: "Reverse fixed window" },
      { id: "sw7q2", title: "Frequency of Most Frequent Element",       link: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",    important: true, diff: "M", pattern: "Sorting + sliding window" },
      { id: "sw7q3", title: "Take K of Each Character From Left & Right",link: "https://leetcode.com/problems/take-k-of-each-character-from-left-and-right/",important: true, diff: "M", pattern: "Reverse window" },
    ]
  },
  {
    id: "sw8", topic: "sw", title: "Sliding Window — Phase 8: Hard / Top Company", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "sw8q1", title: "Sliding Window Median",                     link: "https://leetcode.com/problems/sliding-window-median/",                    important: true, diff: "H", pattern: "Fixed window + two heaps" },
      { id: "sw8q2", title: "Minimum Operations to Reduce X to Zero",    link: "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",  important: true, diff: "M", pattern: "Complement max window" },
      { id: "sw8q3", title: "Count Vowel Substrings of a String",        link: "https://leetcode.com/problems/count-vowel-substrings-of-a-string/",       important: false, diff: "E", pattern: "Variable window + set" },
    ]
  },
  {
    id: "ps1", topic: "ps", title: "Prefix Sum — Level 1: Fundamentals", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "ps1q1", title: "Range Sum Query - Immutable (LC 303)",  link: "https://leetcode.com/problems/range-sum-query-immutable/", important: false, diff: "E", pattern: "Basic prefix sum" },
      { id: "ps1q2", title: "Find Pivot Index (LC 724)",             link: "https://leetcode.com/problems/find-pivot-index/",          important: true,  diff: "E", pattern: "Left sum = right sum" },
    ]
  },
  {
    id: "ps2", topic: "ps", title: "Prefix Sum — Level 2: Core + HashMap", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "ps2q1", title: "Subarray Sum Equals K (LC 560)",             link: "https://leetcode.com/problems/subarray-sum-equals-k/",                                    important: true, diff: "M", pattern: "prefixSum - k in hashmap" },
      { id: "ps2q2", title: "Longest Subarray with Sum K (GFG)",          link: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1",               important: true, diff: "M", pattern: "Store first occurrence" },
      { id: "ps2q3", title: "Maximum Size Subarray Sum Equals K (LC 325)", link: "https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/",                      important: true, diff: "M", pattern: "prefixSum - k (longest)" },
    ]
  },
  {
    id: "ps3", topic: "ps", title: "Prefix Sum — Level 3: Zero Sum Pattern", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "ps3q1", title: "Largest Subarray with 0 Sum (GFG)", link: "https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1",  important: true,  diff: "M", pattern: "prefixSum seen before → 0 sum" },
      { id: "ps3q2", title: "Zero Sum Subarrays — Count (GFG)",  link: "https://www.geeksforgeeks.org/problems/zero-sum-subarrays1825/1",       important: false, diff: "M", pattern: "Count occurrences of prefixSum" },
    ]
  },
  {
    id: "ps4", topic: "ps", title: "Prefix Sum — Level 4: Modulo Pattern", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "ps4q1", title: "Continuous Subarray Sum (LC 523)",     link: "https://leetcode.com/problems/continuous-subarray-sum/",       important: true, diff: "M", pattern: "prefix % k" },
      { id: "ps4q2", title: "Subarray Sums Divisible by K (LC 974)", link: "https://leetcode.com/problems/subarray-sums-divisible-by-k/", important: true, diff: "M", pattern: "prefix % k — count" },
      { id: "ps4q3", title: "Make Sum Divisible by P (LC 1590)",    link: "https://leetcode.com/problems/make-sum-divisible-by-p/",       important: true, diff: "H", pattern: "prefix % p — advanced" },
    ]
  },
  {
    id: "ps5", topic: "ps", title: "Prefix Sum — Level 5: Binary Array Transforms", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "ps5q1", title: "Binary Subarrays With Sum (LC 930)",              link: "https://leetcode.com/problems/binary-subarrays-with-sum/",       important: true, diff: "M", pattern: "Exact K via atMost(K) - atMost(K-1)" },
      { id: "ps5q2", title: "Count Number of Nice Subarrays (LC 1248)",        link: "https://leetcode.com/problems/count-number-of-nice-subarrays/",  important: true, diff: "M", pattern: "Same as LC 930" },
      { id: "ps5q3", title: "Contiguous Array — Equal 0s and 1s (LC 525)",     link: "https://leetcode.com/problems/contiguous-array/",               important: true, diff: "M", pattern: "0 → -1, 1 → +1 transform" },
    ]
  },
  {
    id: "ps6", topic: "ps", title: "Prefix Sum — Level 6: Prefix XOR", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "ps6q1", title: "XOR Queries of a Subarray (LC 1310)",                          link: "https://leetcode.com/problems/xor-queries-of-a-subarray/",                        important: false, diff: "M", pattern: "Prefix XOR array" },
      { id: "ps6q2", title: "Count Triplets — Two Arrays of Equal XOR (LC 1442)",           link: "https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/", important: true, diff: "M", pattern: "Prefix XOR + math" },
    ]
  },
  {
    id: "ps7", topic: "ps", title: "Prefix Sum — Level 7: Advanced Prefix + Bitmask", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "ps7q1", title: "Number of Wonderful Substrings (LC 1915)", link: "https://leetcode.com/problems/number-of-wonderful-substrings/", important: true, diff: "H", pattern: "Bitmask + prefix XOR" },
    ]
  },
  {
    id: "ps8", topic: "ps", title: "Prefix Sum — Level 8: 2D Prefix Sum", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "ps8q1", title: "Range Sum Query 2D - Immutable (LC 304)", link: "https://leetcode.com/problems/range-sum-query-2d-immutable/", important: true,  diff: "M", pattern: "2D prefix sum" },
      { id: "ps8q2", title: "Matrix Block Sum (LC 1314)",               link: "https://leetcode.com/problems/matrix-block-sum/",            important: false, diff: "M", pattern: "2D prefix sum window" },
    ]
  },
  {
    id: "bs1", topic: "bs", title: "Binary Search — Level 1: Basic Foundations", color: "#1A5E8A", bg: "#E3F2FD",
    questions: [
      { id: "bs1q1", title: "Binary Search (LC 704 / GFG)",          link: "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",     important: true,  diff: "E", pattern: "low <= high, mid, shrink space" },
      { id: "bs1q2", title: "Lower Bound (GFG)",                     link: "https://www.geeksforgeeks.org/problems/implement-lower-bound/1",         important: true,  diff: "E", pattern: "First index where arr[i] >= x" },
      { id: "bs1q3", title: "Upper Bound (GFG)",                     link: "https://www.geeksforgeeks.org/problems/implement-upper-bound/1",         important: true,  diff: "E", pattern: "First index where arr[i] > x" },
      { id: "bs1q4", title: "Floor in a Sorted Array (GFG)",         link: "https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1", important: true, diff: "E", pattern: "Largest element <= x" },
      { id: "bs1q5", title: "Ceil in a Sorted Array (GFG)",          link: "https://www.geeksforgeeks.org/problems/ceiling-in-a-sorted-array/1",    important: true,  diff: "E", pattern: "Smallest element >= x" },
      { id: "bs1q6", title: "Search Insert Position (LC 35)",        link: "https://leetcode.com/problems/search-insert-position/",                 important: true,  diff: "E", pattern: "Lower bound application" },
      { id: "bs1q7", title: "First Bad Version (LC 278)",            link: "https://leetcode.com/problems/first-bad-version/",                      important: false, diff: "E", pattern: "First true in boolean space" },
      { id: "bs1q8", title: "Guess Number Higher or Lower (LC 374)", link: "https://leetcode.com/problems/guess-number-higher-or-lower/",           important: false, diff: "E", pattern: "Classic binary search variant" },
    ]
  },
  {
    id: "bs2", topic: "bs", title: "Binary Search — Level 2: First / Last Occurrence", color: "#2E7D32", bg: "#E8F5E9",
    questions: [
      { id: "bs2q1", title: "Number of Occurrence (GFG)",                          link: "https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1",                important: true, diff: "E", pattern: "last - first + 1 occurrences" },
      { id: "bs2q2", title: "Find First and Last Position of Element (LC 34)",     link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", important: true, diff: "M", pattern: "Lower bound + upper bound" },
    ]
  },
  {
    id: "bs3", topic: "bs", title: "Binary Search — Level 3: Rotated Sorted Arrays", color: "#6A1B9A", bg: "#F3E5F5",
    questions: [
      { id: "bs3q1", title: "Search in Rotated Sorted Array (LC 33)",       link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",      important: true,  diff: "M", pattern: "Identify sorted half, search it" },
      { id: "bs3q2", title: "Search in Rotated Sorted Array II (LC 81)",    link: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",   important: true,  diff: "M", pattern: "Duplicates — shrink both ends" },
      { id: "bs3q3", title: "Find Minimum in Rotated Sorted Array (LC 153)", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",important: true,  diff: "M", pattern: "Pivot tracking" },
      { id: "bs3q4", title: "Single Element in a Sorted Array (LC 540)",    link: "https://leetcode.com/problems/single-element-in-a-sorted-array/",    important: true,  diff: "M", pattern: "Even/odd index parity check" },
      { id: "bs3q5", title: "Rotation Count (GFG)",                         link: "https://www.geeksforgeeks.org/problems/rotation4723/1",               important: false, diff: "M", pattern: "Index of minimum = rotation count" },
    ]
  },
  {
    id: "bs4", topic: "bs", title: "Binary Search — Level 4: Peak Problems", color: "#E65100", bg: "#FFF3E0",
    questions: [
      { id: "bs4q1", title: "Peak Element (GFG)",                     link: "https://www.geeksforgeeks.org/problems/peak-element/1",          important: true,  diff: "E", pattern: "Move toward greater neighbor" },
      { id: "bs4q2", title: "Find Peak Element (LC 162)",             link: "https://leetcode.com/problems/find-peak-element/",              important: true,  diff: "M", pattern: "Any peak, log n" },
      { id: "bs4q3", title: "Peak Index in Mountain Array (LC 852)",  link: "https://leetcode.com/problems/peak-index-in-a-mountain-array/", important: false, diff: "M", pattern: "Guaranteed single peak" },
    ]
  },
  {
    id: "bs5", topic: "bs", title: "Binary Search — Level 5: BS on Answer (Most Important)", color: "#880E4F", bg: "#FCE4EC",
    questions: [
      { id: "bs5q1",  title: "Square Root of a Number (GFG)",                   link: "https://www.geeksforgeeks.org/problems/square-root/1",                                   important: true,  diff: "E", pattern: "Answer in [1, n] range" },
      { id: "bs5q2",  title: "Nth Root of M (GFG)",                             link: "https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1",                       important: true,  diff: "M", pattern: "Binary search + power check" },
      { id: "bs5q3",  title: "Koko Eating Bananas (LC 875)",                    link: "https://leetcode.com/problems/koko-eating-bananas/",                                    important: true,  diff: "M", pattern: "Min speed, feasibility check" },
      { id: "bs5q4",  title: "Minimum Days to Make m Bouquets (LC 1482)",       link: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",             important: true,  diff: "M", pattern: "BS on days, greedy check" },
      { id: "bs5q5",  title: "Find Smallest Divisor Given Threshold (LC 1283)", link: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",           important: true,  diff: "M", pattern: "BS on divisor value" },
      { id: "bs5q6",  title: "Capacity to Ship Packages in D Days (LC 1011)",   link: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",               important: true,  diff: "M", pattern: "BS on capacity, greedy ship" },
      { id: "bs5q7",  title: "Aggressive Cows (GFG)",                           link: "https://www.geeksforgeeks.org/problems/aggressive-cows/1",                              important: true,  diff: "M", pattern: "Maximize min distance" },
      { id: "bs5q8",  title: "Allocate Minimum Number of Pages (GFG)",          link: "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1",        important: true,  diff: "M", pattern: "Minimize max pages per student" },
      { id: "bs5q9",  title: "Painter's Partition Problem (GFG)",               link: "https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1",           important: true,  diff: "M", pattern: "Same pattern as Allocate Pages" },
      { id: "bs5q10", title: "Magnetic Force Between Two Balls (LC 1552)",      link: "https://leetcode.com/problems/magnetic-force-between-two-balls/",                      important: true,  diff: "M", pattern: "Maximize min distance" },
      { id: "bs5q11", title: "Split Array Largest Sum (LC 410)",                link: "https://leetcode.com/problems/split-array-largest-sum/",                               important: true,  diff: "H", pattern: "Minimize max subarray sum (hard)" },
    ]
  },
  {
    id: "bs6", topic: "bs", title: "Binary Search — Level 6: Matrix Binary Search", color: "#004D40", bg: "#E0F2F1",
    questions: [
      { id: "bs6q1", title: "Search a 2D Matrix (LC 74)",                    link: "https://leetcode.com/problems/search-a-2d-matrix/",                                  important: true,  diff: "M", pattern: "Flatten matrix index trick" },
      { id: "bs6q2", title: "Search a 2D Matrix II (LC 240)",                link: "https://leetcode.com/problems/search-a-2d-matrix-ii/",                              important: true,  diff: "M", pattern: "Start from top-right corner" },
      { id: "bs6q3", title: "Median in Row-Wise Sorted Matrix (GFG)",        link: "https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1028/1",   important: true,  diff: "H", pattern: "BS on value + count <= mid" },
      { id: "bs6q4", title: "Kth Smallest in Sorted Matrix (LC 378)",        link: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",            important: true,  diff: "M", pattern: "BS on value + count check" },
    ]
  },
  {
    id: "bs7", topic: "bs", title: "Binary Search — Level 7: Hard Interview Questions", color: "#B71C1C", bg: "#FFEBEE",
    questions: [
      { id: "bs7q1", title: "K-th Element of Two Sorted Arrays (GFG)", link: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1", important: true,  diff: "H", pattern: "Binary search on partition" },
      { id: "bs7q2", title: "Median of Two Sorted Arrays (LC 4)",      link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",                   important: true,  diff: "H", pattern: "Binary search on smaller array" },
      { id: "bs7q3", title: "Find K Closest Elements (LC 658)",        link: "https://leetcode.com/problems/find-k-closest-elements/",                       important: false, diff: "M", pattern: "BS to find left boundary of window" },
    ]
  },
  {
    id: "rb1", topic: "rb", title: "Recursion & Backtracking — Phase 1: Pick / Not Pick", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "rb1q1", title: "Subset Sums (GFG)",  link: "https://www.geeksforgeeks.org/problems/subset-sums2234/1",      important: true,  diff: "M", pattern: "Include / Exclude" },
      { id: "rb1q2", title: "Subsets (LC 78)",     link: "https://leetcode.com/problems/subsets/",                       important: true,  diff: "M", pattern: "Recursion tree — all 2^n subsets" },
      { id: "rb1q3", title: "Subsets II (LC 90)",  link: "https://leetcode.com/problems/subsets-ii/",                    important: true,  diff: "M", pattern: "Duplicate handling via sort + skip" },
    ]
  },
  {
    id: "rb2", topic: "rb", title: "Recursion & Backtracking — Phase 2: Combination Pattern", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "rb2q1", title: "Combination Sum (LC 39)",                      link: "https://leetcode.com/problems/combination-sum/",                    important: true,  diff: "M", pattern: "Reuse elements, unbounded pick" },
      { id: "rb2q2", title: "Combination Sum II (LC 40)",                   link: "https://leetcode.com/problems/combination-sum-ii/",                 important: true,  diff: "M", pattern: "No reuse + duplicate pruning" },
      { id: "rb2q3", title: "Combination Sum III (LC 216)",                 link: "https://leetcode.com/problems/combination-sum-iii/",                important: true,  diff: "M", pattern: "Exactly K numbers summing to N" },
      { id: "rb2q4", title: "Letter Combinations of a Phone Number (LC 17)",link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", important: true, diff: "M", pattern: "Multi-choice recursion per digit" },
    ]
  },
  {
    id: "rb3", topic: "rb", title: "Recursion & Backtracking — Phase 3: Permutation Pattern", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "rb3q1", title: "Permutations (LC 46)",             link: "https://leetcode.com/problems/permutations/",                                             important: true,  diff: "M", pattern: "Visited array / in-place swap" },
      { id: "rb3q2", title: "Permutations II (LC 47)",          link: "https://leetcode.com/problems/permutations-ii/",                                          important: true,  diff: "M", pattern: "Duplicate elimination via sort" },
      { id: "rb3q3", title: "String Permutations (GFG)",        link: "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1",             important: false, diff: "M", pattern: "In-place swap on string" },
    ]
  },
  {
    id: "rb4", topic: "rb", title: "Recursion & Backtracking — Phase 4: Partitioning Pattern", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "rb4q1", title: "Palindrome Partitioning (LC 131)", link: "https://leetcode.com/problems/palindrome-partitioning/", important: true, diff: "M", pattern: "Partition recursion + palindrome check" },
      { id: "rb4q2", title: "Restore IP Addresses (LC 93)",     link: "https://leetcode.com/problems/restore-ip-addresses/",   important: true, diff: "M", pattern: "Partition recursion + validity check" },
    ]
  },
  {
    id: "rb5", topic: "rb", title: "Recursion & Backtracking — Phase 5: Grid Backtracking", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "rb5q1", title: "Word Search (LC 79)",              link: "https://leetcode.com/problems/word-search/",                               important: true,  diff: "M", pattern: "Visited marking + undo step" },
      { id: "rb5q2", title: "Path with Maximum Gold (LC 1219)", link: "https://leetcode.com/problems/path-with-maximum-gold/",                    important: true,  diff: "M", pattern: "Direction arrays + backtrack" },
      { id: "rb5q3", title: "Rat in a Maze (GFG)",             link: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",           important: true,  diff: "M", pattern: "4-directional DFS + undo" },
    ]
  },
  {
    id: "rb6", topic: "rb", title: "Recursion & Backtracking — Phase 6: Constraint Satisfaction", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "rb6q1", title: "N-Queens (LC 51)",         link: "https://leetcode.com/problems/n-queens/",                                          important: true,  diff: "H", pattern: "Row / col / diagonal pruning" },
      { id: "rb6q2", title: "N-Queens II (LC 52)",      link: "https://leetcode.com/problems/n-queens-ii/",                                       important: true,  diff: "H", pattern: "Count solutions of N-Queens" },
      { id: "rb6q3", title: "Sudoku Solver (LC 37)",    link: "https://leetcode.com/problems/sudoku-solver/",                                     important: true,  diff: "H", pattern: "Constraint pruning per cell" },
      { id: "rb6q4", title: "M-Coloring Problem (GFG)", link: "https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1",          important: true,  diff: "M", pattern: "Feasibility + constraint check" },
    ]
  },
  {
    id: "rb7", topic: "rb", title: "Recursion & Backtracking — Phase 7: Advanced Interview Favorites", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "rb7q1", title: "Generate Parentheses (LC 22)",                               link: "https://leetcode.com/problems/generate-parentheses/",                                            important: true,  diff: "M", pattern: "open/close count pruning" },
      { id: "rb7q2", title: "Expression Add Operators (LC 282)",                          link: "https://leetcode.com/problems/expression-add-operators/",                                        important: true,  diff: "H", pattern: "Multi-choice + eval on the fly" },
      { id: "rb7q3", title: "Split String Into Max Unique Substrings (LC 1593)",          link: "https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/",         important: false, diff: "M", pattern: "Backtrack + set for uniqueness" },
      { id: "rb7q4", title: "Max Length Concatenated String with Unique Chars (LC 1239)", link: "https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/", important: false, diff: "M", pattern: "Pick/not-pick + bitmask check" },
    ]
  },
  {
    id: "rb8", topic: "rb", title: "Recursion & Backtracking — Phase 8: Hard / Top Company", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "rb8q1", title: "Word Break II (LC 140)",              link: "https://leetcode.com/problems/word-break-ii/",              important: true, diff: "H", pattern: "Backtrack + memoisation" },
      { id: "rb8q2", title: "Remove Invalid Parentheses (LC 301)", link: "https://leetcode.com/problems/remove-invalid-parentheses/", important: true, diff: "H", pattern: "BFS / backtrack with pruning" },
      { id: "rb8q3", title: "Word Search II (LC 212)",             link: "https://leetcode.com/problems/word-search-ii/",             important: true, diff: "H", pattern: "Trie + backtracking on grid" },
    ]
  },
  // ─── DYNAMIC PROGRAMMING ───────────────────────────────────────────────────
  {
    id: "dp0", topic: "dp", title: "DP — Phase 0: Foundation (Must Know)", color: "#1B5E20", bg: "#E8F5E9",
    questions: [
      { id: "dp0q1", title: "Climbing Stairs (LC 70)",       link: "https://leetcode.com/problems/climbing-stairs/",                                             important: true,  diff: "E", pattern: "Classic 1D DP / memoization intro" },
      { id: "dp0q2", title: "Frog Jump — Classic (GFG)",     link: "https://www.geeksforgeeks.org/problems/geek-jump/1",                                          important: true,  diff: "E", pattern: "Recursion → memoization → tabulation" },
      { id: "dp0q3", title: "Frog Jump with K Distance (GFG)",link: "https://www.geeksforgeeks.org/problems/minimal-cost/1",                                      important: true,  diff: "M", pattern: "Variable jump DP" },
    ]
  },
  {
    id: "dp1", topic: "dp", title: "DP — Phase 1: 1D DP (Very Important)", color: "#0D47A1", bg: "#E3F2FD",
    questions: [
      { id: "dp1q1", title: "House Robber (LC 198)",                      link: "https://leetcode.com/problems/house-robber/",                                  important: true,  diff: "M", pattern: "Pick / not-pick on 1D" },
      { id: "dp1q2", title: "House Robber II (LC 213)",                   link: "https://leetcode.com/problems/house-robber-ii/",                               important: true,  diff: "M", pattern: "Circular array — two linear DP calls" },
      { id: "dp1q3", title: "Maximum Sum Non Adjacent (GFG)",             link: "https://www.geeksforgeeks.org/problems/max-sum-without-adjacents2430/1",        important: true,  diff: "M", pattern: "Same as House Robber" },
      { id: "dp1q4", title: "Delete and Earn (LC 740)",                   link: "https://leetcode.com/problems/delete-and-earn/",                               important: true,  diff: "M", pattern: "Reduce to House Robber" },
      { id: "dp1q5", title: "Solving Questions With Brainpower (LC 2140)",link: "https://leetcode.com/problems/solving-questions-with-brainpower/",              important: true,  diff: "M", pattern: "Skip interval DP" },
    ]
  },
  {
    id: "dp2", topic: "dp", title: "DP — Phase 2: Grid DP (Extremely Common)", color: "#4A148C", bg: "#F3E5F5",
    questions: [
      { id: "dp2q1", title: "Unique Paths (LC 62)",           link: "https://leetcode.com/problems/unique-paths/",                                               important: true,  diff: "M", pattern: "2D DP — count paths" },
      { id: "dp2q2", title: "Unique Paths II (LC 63)",        link: "https://leetcode.com/problems/unique-paths-ii/",                                            important: true,  diff: "M", pattern: "Obstacles in grid" },
      { id: "dp2q3", title: "Minimum Path Sum (LC 64)",       link: "https://leetcode.com/problems/minimum-path-sum/",                                           important: true,  diff: "M", pattern: "Min cost grid DP" },
      { id: "dp2q4", title: "Triangle (LC 120)",              link: "https://leetcode.com/problems/triangle/",                                                   important: true,  diff: "M", pattern: "Bottom-up triangle DP" },
      { id: "dp2q5", title: "Ninja Training (GFG)",           link: "https://www.geeksforgeeks.org/problems/geeks-training/1",                                   important: true,  diff: "M", pattern: "3-column grid DP with skip" },
      { id: "dp2q6", title: "Cherry Pickup II (LC 1463)",     link: "https://leetcode.com/problems/cherry-pickup-ii/",                                           important: true,  diff: "H", pattern: "Two simultaneous agents on grid" },
    ]
  },
  {
    id: "dp3", topic: "dp", title: "DP — Phase 3: Subsequence DP (Most Important Interview Pattern)", color: "#BF360C", bg: "#FBE9E7",
    questions: [
      { id: "dp3q1", title: "Subset Sum (GFG)",                          link: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1",         important: true,  diff: "M", pattern: "Boolean DP on sum" },
      { id: "dp3q2", title: "Partition Equal Subset Sum (LC 416)",       link: "https://leetcode.com/problems/partition-equal-subset-sum/",                      important: true,  diff: "M", pattern: "Subset sum with target = total/2" },
      { id: "dp3q3", title: "Count Subsets With Sum K (GFG)",            link: "https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1",               important: true,  diff: "M", pattern: "Count DP on sum" },
      { id: "dp3q4", title: "Target Sum (LC 494)",                       link: "https://leetcode.com/problems/target-sum/",                                      important: true,  diff: "M", pattern: "Assign +/- to reduce to subset count" },
      { id: "dp3q5", title: "Partition With Given Difference (GFG)",     link: "https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1",      important: true,  diff: "M", pattern: "Count subsets with fixed difference" },
      { id: "dp3q6", title: "Coin Change (LC 322)",                      link: "https://leetcode.com/problems/coin-change/",                                     important: true,  diff: "M", pattern: "Unbounded knapsack — min coins" },
      { id: "dp3q7", title: "Coin Change II (LC 518)",                   link: "https://leetcode.com/problems/coin-change-ii/",                                  important: true,  diff: "M", pattern: "Unbounded knapsack — count ways" },
      { id: "dp3q8", title: "Rod Cutting (GFG)",                         link: "https://www.geeksforgeeks.org/problems/rod-cutting0840/1",                       important: true,  diff: "M", pattern: "Unbounded knapsack on lengths" },
    ]
  },
  {
    id: "dp4", topic: "dp", title: "DP — Phase 4: Knapsack Family (Mandatory)", color: "#E65100", bg: "#FFF3E0",
    questions: [
      { id: "dp4q1", title: "0/1 Knapsack (GFG)",              link: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",                       important: true,  diff: "M", pattern: "Classic 0/1 knapsack" },
      { id: "dp4q2", title: "Unbounded Knapsack (GFG)",        link: "https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1",              important: true,  diff: "M", pattern: "Unbounded — reuse items" },
      { id: "dp4q3", title: "Ones and Zeroes (LC 474)",        link: "https://leetcode.com/problems/ones-and-zeroes/",                                          important: true,  diff: "M", pattern: "2D knapsack on 0s and 1s count" },
    ]
  },
  {
    id: "dp5", topic: "dp", title: "DP — Phase 5: String DP (Very Frequently Asked)", color: "#006064", bg: "#E0F7FA",
    questions: [
      { id: "dp5q1", title: "Longest Common Subsequence (LC 1143)",    link: "https://leetcode.com/problems/longest-common-subsequence/",                        important: true,  diff: "M", pattern: "LCS 2D DP" },
      { id: "dp5q2", title: "Print LCS (GFG)",                         link: "https://www.geeksforgeeks.org/problems/print-lcs5204/1",                           important: true,  diff: "M", pattern: "Backtrack LCS table" },
      { id: "dp5q3", title: "Longest Common Substring (GFG)",          link: "https://www.geeksforgeeks.org/problems/longest-common-substring1452/1",            important: true,  diff: "M", pattern: "LCS variant — contiguous" },
      { id: "dp5q4", title: "Shortest Common Supersequence (LC 1092)", link: "https://leetcode.com/problems/shortest-common-supersequence/",                     important: true,  diff: "H", pattern: "SCS = len(s1)+len(s2) - LCS" },
      { id: "dp5q5", title: "Edit Distance (LC 72)",                   link: "https://leetcode.com/problems/edit-distance/",                                     important: true,  diff: "H", pattern: "Insert/Delete/Replace DP" },
      { id: "dp5q6", title: "Distinct Subsequences (LC 115)",          link: "https://leetcode.com/problems/distinct-subsequences/",                             important: true,  diff: "H", pattern: "Count subsequences matching pattern" },
      { id: "dp5q7", title: "Wildcard Matching (LC 44)",               link: "https://leetcode.com/problems/wildcard-matching/",                                 important: true,  diff: "H", pattern: "? and * pattern matching DP" },
      { id: "dp5q8", title: "Regular Expression Matching (LC 10)",     link: "https://leetcode.com/problems/regular-expression-matching/",                       important: true,  diff: "H", pattern: "Regex . and * DP (Google/Amazon)" },
    ]
  },
  {
    id: "dp6", topic: "dp", title: "DP — Phase 6: LIS Pattern (Very Common)", color: "#1A237E", bg: "#E8EAF6",
    questions: [
      { id: "dp6q1", title: "Longest Increasing Subsequence (LC 300)",  link: "https://leetcode.com/problems/longest-increasing-subsequence/",                   important: true,  diff: "M", pattern: "O(n²) DP / O(n log n) patience sort" },
      { id: "dp6q2", title: "Number of LIS (LC 673)",                   link: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",         important: true,  diff: "M", pattern: "Count DP alongside LIS DP" },
      { id: "dp6q3", title: "Largest Divisible Subset (LC 368)",        link: "https://leetcode.com/problems/largest-divisible-subset/",                         important: true,  diff: "M", pattern: "LIS on divisibility" },
      { id: "dp6q4", title: "Longest String Chain (LC 1048)",           link: "https://leetcode.com/problems/longest-string-chain/",                             important: true,  diff: "M", pattern: "LIS on word predecessors" },
      { id: "dp6q5", title: "Russian Doll Envelopes (LC 354)",          link: "https://leetcode.com/problems/russian-doll-envelopes/",                           important: true,  diff: "H", pattern: "Sort + LIS on second dimension" },
    ]
  },
  {
    id: "dp7", topic: "dp", title: "DP — Phase 7: Partition DP (High Interview Value)", color: "#880E4F", bg: "#FCE4EC",
    questions: [
      { id: "dp7q1", title: "Matrix Chain Multiplication (GFG)",        link: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",        important: true,  diff: "H", pattern: "Interval DP — split at every k" },
      { id: "dp7q2", title: "Minimum Cost to Cut a Stick (LC 1547)",    link: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",                      important: true,  diff: "H", pattern: "Interval DP on sorted cut positions" },
      { id: "dp7q3", title: "Burst Balloons (LC 312)",                  link: "https://leetcode.com/problems/burst-balloons/",                                   important: true,  diff: "H", pattern: "Think last balloon to burst in range" },
      { id: "dp7q4", title: "Palindrome Partitioning II (LC 132)",      link: "https://leetcode.com/problems/palindrome-partitioning-ii/",                       important: true,  diff: "H", pattern: "Min cuts with palindrome precompute" },
    ]
  },
  {
    id: "dp8", topic: "dp", title: "DP — Phase 8: DP on Stocks (Asked a Lot)", color: "#827717", bg: "#F9FBE7",
    questions: [
      { id: "dp8q1", title: "Best Time to Buy and Sell Stock II (LC 122)", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",            important: true,  diff: "M", pattern: "Unlimited transactions DP" },
      { id: "dp8q2", title: "Stock III — At Most 2 Transactions (LC 123)", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",           important: true,  diff: "H", pattern: "3D DP: day × txn × hold state" },
      { id: "dp8q3", title: "Stock IV — At Most K Transactions (LC 188)",  link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",            important: true,  diff: "H", pattern: "Generalized k-transaction DP" },
      { id: "dp8q4", title: "Stock with Cooldown (LC 309)",                link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/", important: true,  diff: "M", pattern: "Skip day after sell state" },
      { id: "dp8q5", title: "Stock with Transaction Fee (LC 714)",         link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/", important: true, diff: "M", pattern: "Deduct fee on each sell" },
    ]
  },
  {
    id: "dp9", topic: "dp", title: "DP — Phase 9: Hard DP That Gives Massive ROI", color: "#B71C1C", bg: "#FFEBEE",
    questions: [
      { id: "dp9q1", title: "Longest Valid Parentheses (LC 32)",  link: "https://leetcode.com/problems/longest-valid-parentheses/",  important: true,  diff: "H", pattern: "Stack / 1D DP on parentheses" },
      { id: "dp9q2", title: "Decode Ways (LC 91)",                link: "https://leetcode.com/problems/decode-ways/",                important: true,  diff: "M", pattern: "Fibonacci-style digit DP" },
      { id: "dp9q3", title: "Interleaving String (LC 97)",        link: "https://leetcode.com/problems/interleaving-string/",        important: true,  diff: "M", pattern: "2D DP on two string positions" },
      { id: "dp9q4", title: "Word Break (LC 139)",                link: "https://leetcode.com/problems/word-break/",                 important: true,  diff: "M", pattern: "DP + set lookup at every split" },
      { id: "dp9q5", title: "Frog Jump — Stones (LC 403)",        link: "https://leetcode.com/problems/frog-jump/",                  important: true,  diff: "H", pattern: "DP + set of reachable k values" },
    ]
  },
  // ─── GRAPHS ──────────────────────────────────────────────────────────────
  {
    id: "gr1", topic: "graph", title: "Graph — Phase 1: Representation + Basic DFS/BFS", color: "#0D47A1", bg: "#E3F2FD",
    questions: [
      { id: "gr1q1", title: "DFS of Graph (GFG)",                link: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1",  important: false, diff: "E", pattern: "Recursive DFS + visited array" },
      { id: "gr1q2", title: "BFS of Graph (GFG)",                link: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",             important: false, diff: "E", pattern: "Queue + level-order traversal" },
      { id: "gr1q3", title: "Find if Path Exists in Graph",      link: "https://leetcode.com/problems/find-if-path-exists-in-graph/",                important: false, diff: "E", pattern: "DFS / BFS path check" },
      { id: "gr1q4", title: "Number of Provinces",               link: "https://leetcode.com/problems/number-of-provinces/",                         important: true,  diff: "M", pattern: "Connected components via DFS" },
    ]
  },
  {
    id: "gr2", topic: "graph", title: "Graph — Phase 2: Grid Graphs (Must Master)", color: "#1565C0", bg: "#E3F2FD",
    questions: [
      { id: "gr2q1", title: "Number of Islands",                 link: "https://leetcode.com/problems/number-of-islands/",                           important: true,  diff: "M", pattern: "DFS / BFS on grid" },
      { id: "gr2q2", title: "Max Area of Island",                link: "https://leetcode.com/problems/max-area-of-island/",                          important: false, diff: "M", pattern: "DFS with area tracking" },
      { id: "gr2q3", title: "Flood Fill",                        link: "https://leetcode.com/problems/flood-fill/",                                  important: false, diff: "E", pattern: "DFS / BFS flood fill" },
      { id: "gr2q4", title: "Surrounded Regions",                link: "https://leetcode.com/problems/surrounded-regions/",                          important: true,  diff: "M", pattern: "Border-connected DFS" },
      { id: "gr2q5", title: "Rotting Oranges",                   link: "https://leetcode.com/problems/rotting-oranges/",                              important: true,  diff: "M", pattern: "Multi-source BFS" },
      { id: "gr2q6", title: "01 Matrix",                         link: "https://leetcode.com/problems/01-matrix/",                                   important: false, diff: "M", pattern: "Multi-source BFS" },
      { id: "gr2q7", title: "As Far from Land as Possible",      link: "https://leetcode.com/problems/as-far-from-land-as-possible/",                 important: false, diff: "M", pattern: "Multi-source BFS" },
    ]
  },
  {
    id: "gr3", topic: "graph", title: "Graph — Phase 3: Cycle Detection (Very Important)", color: "#C62828", bg: "#FFEBEE",
    questions: [
      { id: "gr3q1", title: "Detect Cycle in Undirected Graph (BFS)", link: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1", important: true, diff: "M", pattern: "BFS + parent tracking" },
      { id: "gr3q2", title: "Detect Cycle in Undirected Graph (DFS)", link: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1", important: true, diff: "M", pattern: "DFS + parent tracking" },
      { id: "gr3q3", title: "Detect Cycle in Directed Graph",        link: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1",  important: true, diff: "M", pattern: "DFS + recursion stack" },
      { id: "gr3q4", title: "Course Schedule",                       link: "https://leetcode.com/problems/course-schedule/",                              important: true, diff: "M", pattern: "Cycle detection in DAG" },
      { id: "gr3q5", title: "Course Schedule II",                    link: "https://leetcode.com/problems/course-schedule-ii/",                           important: true, diff: "M", pattern: "Topological order + cycle check" },
    ]
  },
  {
    id: "gr4", topic: "graph", title: "Graph — Phase 4: Topological Sort", color: "#6A1B9A", bg: "#F3E5F5",
    questions: [
      { id: "gr4q1", title: "Topological Sort (DFS)",                link: "https://www.geeksforgeeks.org/problems/topological-sort/1",                   important: true,  diff: "M", pattern: "DFS + stack" },
      { id: "gr4q2", title: "Topological Sort (Kahn's Algorithm)",   link: "https://www.geeksforgeeks.org/problems/topological-sort/1",                   important: true,  diff: "M", pattern: "BFS + indegree array" },
      { id: "gr4q3", title: "Alien Dictionary",                      link: "https://www.geeksforgeeks.org/problems/alien-dictionary/1",                   important: true,  diff: "H", pattern: "Topological sort on char order" },
      { id: "gr4q4", title: "Find Eventual Safe States",             link: "https://leetcode.com/problems/find-eventual-safe-states/",                    important: false, diff: "M", pattern: "Reverse graph + topo sort" },
    ]
  },
  {
    id: "gr5", topic: "graph", title: "Graph — Phase 5: Shortest Path", color: "#E65100", bg: "#FFF3E0",
    questions: [
      { id: "gr5q1", title: "Shortest Path in Binary Matrix",            link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",              important: true,  diff: "M", pattern: "BFS shortest path" },
      { id: "gr5q2", title: "Word Ladder",                               link: "https://leetcode.com/problems/word-ladder/",                                 important: true,  diff: "H", pattern: "BFS word transformation" },
      { id: "gr5q3", title: "Network Delay Time",                        link: "https://leetcode.com/problems/network-delay-time/",                           important: true,  diff: "M", pattern: "Dijkstra's algorithm" },
      { id: "gr5q4", title: "Path With Minimum Effort",                  link: "https://leetcode.com/problems/path-with-minimum-effort/",                     important: false, diff: "M", pattern: "Dijkstra on grid" },
      { id: "gr5q5", title: "Cheapest Flights Within K Stops",           link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",              important: true,  diff: "M", pattern: "Modified Dijkstra / Bellman-Ford" },
      { id: "gr5q6", title: "Minimum Cost to Make at Least One Valid Path", link: "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/", important: false, diff: "H", pattern: "0-1 BFS / Dijkstra" },
    ]
  },
  {
    id: "gr6", topic: "graph", title: "Graph — Phase 6: Disjoint Set Union (DSU)", color: "#2E7D32", bg: "#E8F5E9",
    questions: [
      { id: "gr6q1", title: "Redundant Connection",                             link: "https://leetcode.com/problems/redundant-connection/",                        important: true,  diff: "M", pattern: "Union-Find cycle detection" },
      { id: "gr6q2", title: "Number of Operations to Make Network Connected",   link: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/", important: false, diff: "M", pattern: "DSU + component count" },
      { id: "gr6q3", title: "Accounts Merge",                                   link: "https://leetcode.com/problems/accounts-merge/",                              important: true,  diff: "M", pattern: "DSU + email grouping" },
      { id: "gr6q4", title: "Most Stones Removed with Same Row or Column",      link: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/", important: false, diff: "M", pattern: "DSU on coordinates" },
      { id: "gr6q5", title: "Number of Islands II",                              link: "https://leetcode.com/problems/number-of-islands-ii/",                        important: false, diff: "H", pattern: "Online DSU" },
    ]
  },
  {
    id: "gr7", topic: "graph", title: "Graph — Phase 7: Minimum Spanning Tree", color: "#004D40", bg: "#E0F2F1",
    questions: [
      { id: "gr7q1", title: "Kruskal's Algorithm (GFG)",               link: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",              important: true,  diff: "M", pattern: "Sort edges + DSU" },
      { id: "gr7q2", title: "Prim's Algorithm (GFG)",                  link: "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",              important: true,  diff: "M", pattern: "Priority queue + greedy" },
      { id: "gr7q3", title: "Min Cost to Connect All Points",          link: "https://leetcode.com/problems/min-cost-to-connect-all-points/",               important: true,  diff: "M", pattern: "Prim's / Kruskal's MST" },
    ]
  },
  {
    id: "gr8", topic: "graph", title: "Graph — Phase 8: Advanced Graphs (Frequently Asked)", color: "#B71C1C", bg: "#FFEBEE",
    questions: [
      { id: "gr8q1", title: "Clone Graph",                             link: "https://leetcode.com/problems/clone-graph/",                                 important: true,  diff: "M", pattern: "BFS / DFS + hashmap clone" },
      { id: "gr8q2", title: "Reconstruct Itinerary",                   link: "https://leetcode.com/problems/reconstruct-itinerary/",                       important: false, diff: "H", pattern: "Eulerian path (Hierholzer)" },
      { id: "gr8q3", title: "Critical Connections in a Network",       link: "https://leetcode.com/problems/critical-connections-in-a-network/",            important: true,  diff: "H", pattern: "Tarjan's bridge algorithm" },
      { id: "gr8q4", title: "Articulation Point (GFG)",                link: "https://www.geeksforgeeks.org/problems/articulation-point2616/1",             important: true,  diff: "H", pattern: "Tarjan's algorithm" },
      { id: "gr8q5", title: "Strongly Connected Components (Kosaraju)", link: "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1", important: true, diff: "H", pattern: "Kosaraju's two-pass DFS" },
    ]
  },
  {
    id: "bit1", topic: "bit", title: "Bit Manipulation — Phase 1: Fundamentals", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "bit1q1",  title: "Single Number (LC 136)",              link: "https://leetcode.com/problems/single-number/",                                              important: false, diff: "E", pattern: "XOR all elements" },
      { id: "bit1q2",  title: "Number of 1 Bits (LC 191)",           link: "https://leetcode.com/problems/number-of-1-bits/",                                           important: false, diff: "E", pattern: "n & (n-1) loop" },
      { id: "bit1q3",  title: "Counting Bits (LC 338)",              link: "https://leetcode.com/problems/counting-bits/",                                              important: false, diff: "E", pattern: "DP + popcount" },
      { id: "bit1q4",  title: "Reverse Bits (LC 190)",               link: "https://leetcode.com/problems/reverse-bits/",                                               important: false, diff: "E", pattern: "Shift + mask" },
      { id: "bit1q5",  title: "Power of Two (LC 231)",               link: "https://leetcode.com/problems/power-of-two/",                                               important: false, diff: "E", pattern: "n & (n-1) == 0" },
      { id: "bit1q6",  title: "Power of Four (LC 342)",              link: "https://leetcode.com/problems/power-of-four/",                                              important: false, diff: "E", pattern: "Power of 2 + bit position check" },
      { id: "bit1q7",  title: "Missing Number (LC 268)",             link: "https://leetcode.com/problems/missing-number/",                                             important: true,  diff: "E", pattern: "XOR index and value" },
      { id: "bit1q8",  title: "Find First Set Bit (GFG)",            link: "https://www.geeksforgeeks.org/problems/find-first-set-bit-1587115620/1",                   important: false, diff: "E", pattern: "n & (-n)" },
      { id: "bit1q9",  title: "Check Whether K-th Bit is Set (GFG)", link: "https://www.geeksforgeeks.org/problems/check-whether-k-th-bit-is-set-or-not-1587115620/1", important: false, diff: "E", pattern: "(n >> k) & 1" },
      { id: "bit1q10", title: "Bit Difference (GFG)",                link: "https://www.geeksforgeeks.org/problems/bit-difference-1587115620/1",                      important: false, diff: "E", pattern: "Count set bits in XOR" },
    ]
  },
  {
    id: "bit2", topic: "bit", title: "Bit Manipulation — Phase 2: XOR Pattern", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "bit2q1", title: "Single Number II (LC 137)",          link: "https://leetcode.com/problems/single-number-ii/",                 important: true,  diff: "M", pattern: "Bitwise count mod 3" },
      { id: "bit2q2", title: "Single Number III (LC 260)",         link: "https://leetcode.com/problems/single-number-iii/",                important: true,  diff: "M", pattern: "XOR + split by set bit" },
      { id: "bit2q3", title: "XOR Queries of a Subarray (LC 1310)",link: "https://leetcode.com/problems/xor-queries-of-a-subarray/",       important: true,  diff: "M", pattern: "Prefix XOR" },
      { id: "bit2q4", title: "Decode XORed Array (LC 1720)",       link: "https://leetcode.com/problems/decode-xored-array/",              important: false, diff: "E", pattern: "Reverse XOR" },
      { id: "bit2q5", title: "Decode XORed Permutation (LC 1734)", link: "https://leetcode.com/problems/decode-xored-permutation/",        important: true,  diff: "M", pattern: "XOR of all + partial" },
      { id: "bit2q6", title: "XOR Operation in an Array (LC 1486)",link: "https://leetcode.com/problems/xor-operation-in-an-array/",       important: false, diff: "E", pattern: "Iterate and XOR" },
      { id: "bit2q7", title: "Maximum XOR for Each Query (LC 1829)",link: "https://leetcode.com/problems/maximum-xor-for-each-query/",     important: true,  diff: "M", pattern: "Prefix XOR + bitmask" },
    ]
  },
  {
    id: "bit3", topic: "bit", title: "Bit Manipulation — Phase 3: Bitmask Basics", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "bit3q1", title: "Subsets (LC 78)",                        link: "https://leetcode.com/problems/subsets/",                          important: true,  diff: "M", pattern: "Enumerate 2^n masks" },
      { id: "bit3q2", title: "Gray Code (LC 89)",                      link: "https://leetcode.com/problems/gray-code/",                        important: false, diff: "M", pattern: "i ^ (i >> 1)" },
      { id: "bit3q3", title: "Binary Watch (LC 401)",                  link: "https://leetcode.com/problems/binary-watch/",                     important: false, diff: "E", pattern: "Count bits <= threshold" },
      { id: "bit3q4", title: "Letter Case Permutation (LC 784)",       link: "https://leetcode.com/problems/letter-case-permutation/",          important: false, diff: "M", pattern: "Bitmask over letter positions" },
      { id: "bit3q5", title: "Find Kth Bit in Nth Binary String (LC 1545)",link: "https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/",important: false, diff: "M", pattern: "Recursion + bit flip" },
    ]
  },
  {
    id: "bit4", topic: "bit", title: "Bit Manipulation — Phase 4: Advanced", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "bit4q1", title: "Maximum Product of Word Lengths (LC 318)",                link: "https://leetcode.com/problems/maximum-product-of-word-lengths/",                 important: true,  diff: "M", pattern: "Bitmask per word char set" },
      { id: "bit4q2", title: "Maximum XOR of Two Numbers in an Array (LC 421) ⭐",      link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",           important: true,  diff: "M", pattern: "Greedy + bitmask / Trie" },
      { id: "bit4q3", title: "Count Triplets — Equal XOR Arrays (LC 1442)",            link: "https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/",important: true, diff: "M", pattern: "Prefix XOR + math" },
      { id: "bit4q4", title: "Sum of All Subset XOR Totals (LC 1863)",                 link: "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",                     important: false, diff: "E", pattern: "Contribution per bit" },
      { id: "bit4q5", title: "Minimize XOR (LC 2429)",                                 link: "https://leetcode.com/problems/minimize-xor/",                                     important: false, diff: "M", pattern: "Greedy bit placement" },
      { id: "bit4q6", title: "Neighboring Bitwise XOR (LC 2683)",                      link: "https://leetcode.com/problems/neighboring-bitwise-xor/",                          important: false, diff: "M", pattern: "XOR prefix parity" },
    ]
  },
  {
    id: "bit5", topic: "bit", title: "Bit Manipulation — Phase 5: Bitmask DP", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "bit5q1", title: "Can I Win (LC 464)",                         link: "https://leetcode.com/problems/can-i-win/",                          important: false, diff: "M", pattern: "Bitmask DP on state" },
      { id: "bit5q2", title: "Matchsticks to Square (LC 473)",              link: "https://leetcode.com/problems/matchsticks-to-square/",               important: false, diff: "M", pattern: "Bitmask DP / backtracking" },
      { id: "bit5q3", title: "Partition to K Equal Sum Subsets (LC 698) ⭐",link: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",   important: true,  diff: "M", pattern: "Bitmask DP" },
      { id: "bit5q4", title: "Beautiful Arrangement (LC 526)",              link: "https://leetcode.com/problems/beautiful-arrangement/",               important: false, diff: "M", pattern: "Bitmask DP + permutation" },
      { id: "bit5q5", title: "Shortest Path Visiting All Nodes (LC 847) ⭐",link: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",   important: true,  diff: "H", pattern: "BFS + bitmask state" },
      { id: "bit5q6", title: "Smallest Sufficient Team (LC 1125) ⭐",       link: "https://leetcode.com/problems/smallest-sufficient-team/",            important: true,  diff: "H", pattern: "Bitmask DP on skill set" },
      { id: "bit5q7", title: "Parallel Courses II (LC 1494)",               link: "https://leetcode.com/problems/parallel-courses-ii/",                 important: false, diff: "H", pattern: "Bitmask DP + topological" },
      { id: "bit5q8", title: "Stickers to Spell Word (LC 691)",             link: "https://leetcode.com/problems/stickers-to-spell-word/",              important: false, diff: "H", pattern: "Bitmask DP on char coverage" },
    ]
  },
  {
    id: "bit6", topic: "bit", title: "Bit Manipulation — Phase 6: Trie + XOR", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "bit6q1", title: "Maximum XOR of Two Numbers in an Array (LC 421)", link: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",  important: true,  diff: "M", pattern: "Binary Trie" },
      { id: "bit6q2", title: "Maximum XOR With an Element From Array (LC 1707)",link: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/", important: true,  diff: "H", pattern: "Offline queries + Trie" },
      { id: "bit6q3", title: "Count Pairs With XOR in a Range (LC 1803)",       link: "https://leetcode.com/problems/count-pairs-with-xor-in-a-range/",        important: true,  diff: "H", pattern: "Trie + count in range" },
    ]
  },
  {
    id: "bit7", topic: "bit", title: "Bit Manipulation — Phase 7: Math + Bit", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "bit7q1", title: "Divide Two Integers (LC 29) ⭐",                                    link: "https://leetcode.com/problems/divide-two-integers/",                                   important: true,  diff: "M", pattern: "Bit-shift based division" },
      { id: "bit7q2", title: "Bitwise AND of Numbers Range (LC 201) ⭐",                          link: "https://leetcode.com/problems/bitwise-and-of-numbers-range/",                          important: true,  diff: "M", pattern: "Strip lowest differing bits" },
      { id: "bit7q3", title: "Integer Replacement (LC 397)",                                      link: "https://leetcode.com/problems/integer-replacement/",                                    important: false, diff: "M", pattern: "Greedy on LSB" },
      { id: "bit7q4", title: "Minimum One Bit Operations to Make Integers Zero (LC 1611)",        link: "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",        important: false, diff: "H", pattern: "Gray code recursion" },
      { id: "bit7q5", title: "Minimum Flips to Make a OR b Equal c (LC 1318)",                   link: "https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/",                 important: false, diff: "M", pattern: "Check each bit pair" },
    ]
  },
  {
    id: "sq1", topic: "sq", title: "Stack & Queue — Phase 1: Fundamentals", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "sq1q1", title: "Implement Stack using Queues (LC 225)",             link: "https://leetcode.com/problems/implement-stack-using-queues/",            important: false, diff: "E", pattern: "Single queue + rotate" },
      { id: "sq1q2", title: "Implement Queue using Stacks (LC 232)",             link: "https://leetcode.com/problems/implement-queue-using-stacks/",            important: false, diff: "E", pattern: "Two stacks" },
      { id: "sq1q3", title: "Valid Parentheses (LC 20) ⭐",                      link: "https://leetcode.com/problems/valid-parentheses/",                      important: true,  diff: "E", pattern: "Stack match open/close" },
      { id: "sq1q4", title: "Min Stack (LC 155) ⭐",                             link: "https://leetcode.com/problems/min-stack/",                              important: true,  diff: "M", pattern: "Auxiliary min stack" },
      { id: "sq1q5", title: "Baseball Game (LC 682)",                            link: "https://leetcode.com/problems/baseball-game/",                         important: false, diff: "E", pattern: "Stack simulation" },
      { id: "sq1q6", title: "Backspace String Compare (LC 844)",                 link: "https://leetcode.com/problems/backspace-string-compare/",               important: false, diff: "E", pattern: "Stack or two-pointer" },
      { id: "sq1q7", title: "Make The String Great (LC 1544)",                  link: "https://leetcode.com/problems/make-the-string-great/",                  important: false, diff: "E", pattern: "Stack pop on adjacent mismatch" },
      { id: "sq1q8", title: "Remove All Adjacent Duplicates In String (LC 1047)",link: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",important: false, diff: "E", pattern: "Stack collapse duplicates" },
      { id: "sq1q9", title: "Remove Outermost Parentheses (LC 1021)",           link: "https://leetcode.com/problems/remove-outermost-parentheses/",           important: false, diff: "E", pattern: "Depth counter" },
    ]
  },
  {
    id: "sq2", topic: "sq", title: "Stack & Queue — Phase 2: Monotonic Stack", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "sq2q1", title: "Next Greater Element I (LC 496) ⭐",             link: "https://leetcode.com/problems/next-greater-element-i/",                      important: true,  diff: "E", pattern: "Monotonic stack + hashmap" },
      { id: "sq2q2", title: "Next Greater Element II (LC 503) ⭐",             link: "https://leetcode.com/problems/next-greater-element-ii/",                     important: true,  diff: "M", pattern: "Monotonic stack + circular array" },
      { id: "sq2q3", title: "Daily Temperatures (LC 739) ⭐",                  link: "https://leetcode.com/problems/daily-temperatures/",                         important: true,  diff: "M", pattern: "Monotonic decreasing stack" },
      { id: "sq2q4", title: "Final Prices With Special Discount (LC 1475)",    link: "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/",important: false, diff: "E", pattern: "Monotonic stack (next smaller)" },
      { id: "sq2q5", title: "Online Stock Span (LC 901) ⭐",                   link: "https://leetcode.com/problems/online-stock-span/",                          important: true,  diff: "M", pattern: "Monotonic stack + span count" },
      { id: "sq2q6", title: "Number of Visible People in a Queue (LC 1944)",   link: "https://leetcode.com/problems/number-of-visible-people-in-a-queue/",        important: false, diff: "H", pattern: "Monotonic decreasing stack" },
      { id: "sq2q7", title: "Steps to Make Array Non-decreasing (LC 2289)",    link: "https://leetcode.com/problems/steps-to-make-array-non-decreasing/",         important: false, diff: "H", pattern: "Monotonic stack + DP" },
      { id: "sq2q8", title: "Beautiful Towers I (LC 2865)",                    link: "https://leetcode.com/problems/beautiful-towers-i/",                         important: false, diff: "M", pattern: "Monotonic stack prefix/suffix" },
    ]
  },
  {
    id: "sq3", topic: "sq", title: "Stack & Queue — Phase 3: Histogram Pattern", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "sq3q1", title: "Largest Rectangle in Histogram (LC 84) ⭐⭐⭐",  link: "https://leetcode.com/problems/largest-rectangle-in-histogram/", important: true,  diff: "H", pattern: "Monotonic stack + area" },
      { id: "sq3q2", title: "Maximal Rectangle (LC 85) ⭐⭐⭐",               link: "https://leetcode.com/problems/maximal-rectangle/",              important: true,  diff: "H", pattern: "LC 84 applied per row" },
      { id: "sq3q3", title: "Sum of Subarray Minimums (LC 907) ⭐⭐⭐",       link: "https://leetcode.com/problems/sum-of-subarray-minimums/",       important: true,  diff: "M", pattern: "Monotonic stack + contribution" },
      { id: "sq3q4", title: "Sum of Subarray Ranges (LC 2104) ⭐⭐",          link: "https://leetcode.com/problems/sum-of-subarray-ranges/",         important: true,  diff: "M", pattern: "Max contrib - min contrib" },
      { id: "sq3q5", title: "Maximum Width Ramp (LC 962)",                    link: "https://leetcode.com/problems/maximum-width-ramp/",             important: false, diff: "M", pattern: "Decreasing stack + reverse scan" },
    ]
  },
  {
    id: "sq4", topic: "sq", title: "Stack & Queue — Phase 4: Parentheses Problems", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "sq4q1", title: "Generate Parentheses (LC 22)",                    link: "https://leetcode.com/problems/generate-parentheses/",                   important: false, diff: "M", pattern: "Backtracking" },
      { id: "sq4q2", title: "Longest Valid Parentheses (LC 32) ⭐⭐",           link: "https://leetcode.com/problems/longest-valid-parentheses/",               important: true,  diff: "H", pattern: "Stack indices" },
      { id: "sq4q3", title: "Minimum Remove to Make Valid Parentheses (LC 1249)",link: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",important: true,  diff: "M", pattern: "Stack + mark indices" },
      { id: "sq4q4", title: "Remove Invalid Parentheses (LC 301) ⭐⭐⭐",       link: "https://leetcode.com/problems/remove-invalid-parentheses/",               important: true,  diff: "H", pattern: "BFS level-by-level" },
      { id: "sq4q5", title: "Score of Parentheses (LC 856)",                   link: "https://leetcode.com/problems/score-of-parentheses/",                   important: false, diff: "M", pattern: "Stack accumulate score" },
      { id: "sq4q6", title: "Minimum Add to Make Parentheses Valid (LC 921)",  link: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",  important: false, diff: "M", pattern: "Count open/close imbalance" },
      { id: "sq4q7", title: "Maximum Nesting Depth (LC 1614)",                 link: "https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/",important: false, diff: "E", pattern: "Depth counter" },
    ]
  },
  {
    id: "sq5", topic: "sq", title: "Stack & Queue — Phase 5: Expression Evaluation", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "sq5q1", title: "Evaluate Reverse Polish Notation (LC 150) ⭐", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", important: true,  diff: "M", pattern: "Stack operand evaluation" },
      { id: "sq5q2", title: "Basic Calculator (LC 224) ⭐⭐",                link: "https://leetcode.com/problems/basic-calculator/",                 important: true,  diff: "H", pattern: "Stack + sign tracking" },
      { id: "sq5q3", title: "Basic Calculator II (LC 227) ⭐⭐",              link: "https://leetcode.com/problems/basic-calculator-ii/",               important: true,  diff: "M", pattern: "Stack + precedence" },
      { id: "sq5q4", title: "Basic Calculator III (Premium)",               link: "https://leetcode.com/problems/basic-calculator-iii/",              important: false, diff: "H", pattern: "Recursive stack evaluation" },
    ]
  },
  {
    id: "sq6", topic: "sq", title: "Stack & Queue — Phase 6: Monotonic Queue / Deque", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "sq6q1", title: "Sliding Window Maximum (LC 239) ⭐⭐⭐",             link: "https://leetcode.com/problems/sliding-window-maximum/",                   important: true,  diff: "H", pattern: "Monotonic deque" },
      { id: "sq6q2", title: "Shortest Subarray with Sum at Least K (LC 862) ⭐⭐⭐",link: "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",  important: true,  diff: "H", pattern: "Prefix sum + deque" },
      { id: "sq6q3", title: "Constrained Subsequence Sum (LC 1425)",            link: "https://leetcode.com/problems/constrained-subsequence-sum/",              important: false, diff: "H", pattern: "DP + monotonic deque" },
      { id: "sq6q4", title: "Jump Game VI (LC 1696)",                           link: "https://leetcode.com/problems/jump-game-vi/",                            important: false, diff: "M", pattern: "DP + deque max window" },
    ]
  },
  {
    id: "sq7", topic: "sq", title: "Stack & Queue — Phase 7: BFS Queue Pattern", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "sq7q1", title: "Rotting Oranges (LC 994)",    link: "https://leetcode.com/problems/rotting-oranges/",    important: false, diff: "M", pattern: "Multi-source BFS" },
      { id: "sq7q2", title: "01 Matrix (LC 542)",           link: "https://leetcode.com/problems/01-matrix/",          important: false, diff: "M", pattern: "Multi-source BFS" },
      { id: "sq7q3", title: "Open the Lock (LC 752) ⭐",   link: "https://leetcode.com/problems/open-the-lock/",      important: true,  diff: "M", pattern: "BFS state space" },
      { id: "sq7q4", title: "Perfect Squares (LC 279)",    link: "https://leetcode.com/problems/perfect-squares/",    important: false, diff: "M", pattern: "BFS / DP" },
      { id: "sq7q5", title: "Walls and Gates (Premium)",   link: "https://leetcode.com/problems/walls-and-gates/",    important: false, diff: "M", pattern: "Multi-source BFS" },
    ]
  },
  {
    id: "sq8", topic: "sq", title: "Stack & Queue — Phase 8: Design Problems", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "sq8q1", title: "Design Circular Queue (LC 622)",          link: "https://leetcode.com/problems/design-circular-queue/",           important: false, diff: "M", pattern: "Array + head/tail pointers" },
      { id: "sq8q2", title: "Design Circular Deque (LC 641)",          link: "https://leetcode.com/problems/design-circular-deque/",           important: false, diff: "M", pattern: "Doubly-ended circular buffer" },
      { id: "sq8q3", title: "Design Front Middle Back Queue (LC 1670)",link: "https://leetcode.com/problems/design-front-middle-back-queue/",  important: false, diff: "M", pattern: "Two deques balanced" },
      { id: "sq8q4", title: "Design Browser History (LC 1472) ⭐",      link: "https://leetcode.com/problems/design-browser-history/",          important: true,  diff: "M", pattern: "Two stacks / array pointer" },
      { id: "sq8q5", title: "Dinner Plate Stacks (LC 1172)",           link: "https://leetcode.com/problems/dinner-plate-stacks/",             important: false, diff: "H", pattern: "List of stacks + heap" },
      { id: "sq8q6", title: "Design Hit Counter (Premium)",            link: "https://leetcode.com/problems/design-hit-counter/",              important: false, diff: "M", pattern: "Queue / circular buffer" },
    ]
  },
  {
    id: "sq9", topic: "sq", title: "Stack & Queue — Phase 9: Hard Stack Problems", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "sq9q1", title: "Trapping Rain Water (LC 42) ⭐⭐⭐",     link: "https://leetcode.com/problems/trapping-rain-water/",   important: true,  diff: "H", pattern: "Stack or two-pointer" },
      { id: "sq9q2", title: "Car Fleet (LC 853) ⭐⭐",                link: "https://leetcode.com/problems/car-fleet/",             important: true,  diff: "M", pattern: "Sort + stack" },
      { id: "sq9q3", title: "Asteroid Collision (LC 735) ⭐⭐",       link: "https://leetcode.com/problems/asteroid-collision/",    important: true,  diff: "M", pattern: "Stack collision simulation" },
      { id: "sq9q4", title: "Remove K Digits (LC 402) ⭐⭐",          link: "https://leetcode.com/problems/remove-k-digits/",       important: true,  diff: "M", pattern: "Monotonic stack greedy" },
      { id: "sq9q5", title: "Remove Duplicate Letters (LC 316) ⭐⭐⭐",link: "https://leetcode.com/problems/remove-duplicate-letters/",important: true,  diff: "M", pattern: "Greedy monotonic stack" },
      { id: "sq9q6", title: "Create Maximum Number (LC 321)",         link: "https://leetcode.com/problems/create-maximum-number/",  important: false, diff: "H", pattern: "Merge two monotonic stacks" },
    ]
  },
  {
    id: "sq10", topic: "sq", title: "Stack & Queue — GFG Must-Do Problems", color: "#5F5E5A", bg: "#F1EFE8",
    questions: [
      { id: "sq10q1", title: "Next Larger Element (GFG)",                       link: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1",                 important: true,  diff: "E", pattern: "Monotonic stack" },
      { id: "sq10q2", title: "Get Minimum Element from Stack (GFG)",            link: "https://www.geeksforgeeks.org/problems/get-minimum-element-from-stack/1",               important: true,  diff: "E", pattern: "Auxiliary min stack" },
      { id: "sq10q3", title: "Stack using Two Queues (GFG)",                    link: "https://www.geeksforgeeks.org/problems/stack-using-two-queues/1",                       important: false, diff: "E", pattern: "Two queues" },
      { id: "sq10q4", title: "Queue using Two Stacks (GFG)",                    link: "https://www.geeksforgeeks.org/problems/queue-using-two-stacks/1",                       important: false, diff: "E", pattern: "Lazy reversal" },
      { id: "sq10q5", title: "Infix to Postfix (GFG)",                          link: "https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1",                 important: true,  diff: "M", pattern: "Stack + operator precedence" },
      { id: "sq10q6", title: "Evaluation of Postfix Expression (GFG)",          link: "https://www.geeksforgeeks.org/problems/evaluation-of-postfix-expression1735/1",        important: true,  diff: "E", pattern: "Stack operand eval" },
      { id: "sq10q7", title: "Celebrity Problem (GFG)",                         link: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1",                       important: true,  diff: "M", pattern: "Stack elimination" },
      { id: "sq10q8", title: "First Negative Integer in Every Window (GFG)",    link: "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",important: true, diff: "M", pattern: "Deque sliding window" },
      { id: "sq10q9", title: "LRU Cache (GFG)",                                 link: "https://www.geeksforgeeks.org/problems/lru-cache/1",                                   important: true,  diff: "H", pattern: "HashMap + doubly linked list" },
    ]
  },
];

const TOTAL = ALL_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

function DiffBadge({ d, isDark }) {
  const DIFF = getDIFF(isDark);
  const { label, bg, color, border } = DIFF[d];
  return (
    <span style={{
      fontSize: 10, padding: "1px 7px", borderRadius: 99, flexShrink: 0,
      background: bg, color, border: `1px solid ${border}`, fontWeight: 500,
    }}>{label}</span>
  );
}

const TOPIC_META_LIGHT = {
  arrays: { label: "Arrays & Matrix",       emoji: "🔢", accent: "#185FA5", bg: "#E6F1FB", border: "#93c5fd" },
  sw:     { label: "Sliding Window",        emoji: "🪟", accent: "#0F6E56", bg: "#E1F5EE", border: "#6ee7b7" },
  ps:     { label: "Prefix Sum",            emoji: "➕", accent: "#6D28D9", bg: "#EDE9FE", border: "#c4b5fd" },
  bs:     { label: "Binary Search",         emoji: "🔍", accent: "#B45309", bg: "#FEF3C7", border: "#fcd34d" },
  rb:     { label: "Recursion & BT",        emoji: "🔄", accent: "#9D174D", bg: "#FCE7F3", border: "#f9a8d4" },
  dp:     { label: "Dynamic Programming",   emoji: "🧠", accent: "#1B5E20", bg: "#E8F5E9", border: "#86efac" },
  graph:  { label: "Graphs",               emoji: "🕸️", accent: "#0D47A1", bg: "#E3F2FD", border: "#90caf9" },
  bit:    { label: "Bit Manipulation",      emoji: "⚡", accent: "#7C3AED", bg: "#F5F3FF", border: "#c4b5fd" },
  sq:     { label: "Stack & Queue",         emoji: "⚙️", accent: "#B45309", bg: "#FFF7ED", border: "#fed7aa" },
};

const TOPIC_META_DARK = {
  arrays: { label: "Arrays & Matrix",       emoji: "🔢", accent: "#60a5fa", bg: "#172554", border: "#1e3a5f" },
  sw:     { label: "Sliding Window",        emoji: "🪟", accent: "#34d399", bg: "#0d2e22", border: "#14533a" },
  ps:     { label: "Prefix Sum",            emoji: "➕", accent: "#a78bfa", bg: "#1e1545", border: "#4c1d95" },
  bs:     { label: "Binary Search",         emoji: "🔍", accent: "#fbbf24", bg: "#3d2f0e", border: "#78350f" },
  rb:     { label: "Recursion & BT",        emoji: "🔄", accent: "#f472b6", bg: "#3d0f2a", border: "#831843" },
  dp:     { label: "Dynamic Programming",   emoji: "🧠", accent: "#4ade80", bg: "#0f2e16", border: "#14532d" },
  graph:  { label: "Graphs",               emoji: "🕸️", accent: "#60a5fa", bg: "#0d1f3c", border: "#1e3a5f" },
  bit:    { label: "Bit Manipulation",      emoji: "⚡", accent: "#a78bfa", bg: "#1e0f3c", border: "#4c1d95" },
  sq:     { label: "Stack & Queue",         emoji: "⚙️", accent: "#fb923c", bg: "#3d1c08", border: "#7c2d12" },
};

const getTopicMeta = (isDark) => isDark ? TOPIC_META_DARK : TOPIC_META_LIGHT;

export default function DSATracker() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [checked, setChecked]       = useState({});
  const [notes, setNotes]           = useState({});
  const [openNote, setOpenNote]     = useState(null);
  const [noteText, setNoteText]     = useState("");
  const [filter, setFilter]         = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [collapsed, setCollapsed]   = useState({});
  const [loaded, setLoaded]         = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [codeModal, setCodeModal]   = useState(null); // question object | null

  // Load progress from Firestore on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getUserProgress(user.uid);
        setChecked(data.checked);
        setNotes(data.notes);
      } catch (err) {
        console.error("Firestore read failed:", err);
      }
      setLoaded(true);
    })();
  }, [user]);

  // Save progress to Firestore
  const save = async (nc, nn) => {
    if (!user) return;
    try {
      await saveUserProgress(user.uid, nc, nn);
    } catch (err) {
      console.error("Firestore write failed:", err);
    }
  };

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next); save(next, notes);
  };

  const saveNote = () => {
    const next = { ...notes, [openNote]: noteText };
    setNotes(next); save(checked, next);
    setOpenNote(null); setNoteText("");
  };

  const deleteNote = () => {
    const next = { ...notes }; delete next[openNote];
    setNotes(next); save(checked, next);
    setOpenNote(null); setNoteText("");
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL) * 100);
  const allQ = ALL_SECTIONS.flatMap(s => s.questions);

  const statFor = (d) => ({
    done:  allQ.filter(q => q.diff === d && checked[q.id]).length,
    total: allQ.filter(q => q.diff === d).length,
  });
  const easy = statFor("E"), med = statFor("M"), hard = statFor("H");

  const filteredSections = ALL_SECTIONS.map(sec => ({
    ...sec,
    questions: sec.questions.filter(q => {
      const mf = filter === "all" || (filter === "done" && checked[q.id]) || (filter === "pending" && !checked[q.id]) || (filter === "important" && q.important);
      const md = diffFilter === "all" || q.diff === diffFilter;
      const ms = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
      return mf && md && ms;
    })
  })).filter(s => s.questions.length > 0 && (topicFilter === "all" || s.topic === topicFilter));

  if (!loaded) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading...</div>;

  const DIFF = getDIFF(isDark);
  const TOPIC_META = getTopicMeta(isDark);

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1rem 0", maxWidth: 680 }}>
      <h2 className="sr-only">DSA Practice Sheet Tracker</h2>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>DSA Sheet</span>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{doneCount} / {TOTAL} solved</span>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 999, height: 7, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: isDark ? "#4ade80" : "#3B6D11", borderRadius: 999, transition: "width 0.4s" }} />
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[ ["E", easy], ["M", med], ["H", hard] ].map(([d, s]) => (
            <span key={d} style={{
              fontSize: 11, padding: "2px 10px", borderRadius: 99,
              background: DIFF[d].bg, color: DIFF[d].color,
              border: `1px solid ${DIFF[d].border}`, fontWeight: 500
            }}>
              {DIFF[d].label} {s.done}/{s.total}
            </span>
          ))}
        </div>
      </div>

      {/* Topic filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => setTopicFilter("all")}
          style={{
            fontSize: 12, padding: "5px 14px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            border: "1.5px solid",
            borderColor: topicFilter === "all" ? "var(--color-all-topics-border-active)" : "var(--color-filter-inactive-border)",
            background: topicFilter === "all" ? "var(--color-all-topics-bg-active)" : "var(--color-background-primary)",
            color: topicFilter === "all" ? "var(--color-all-topics-color-active)" : "var(--color-text-secondary)",
            fontWeight: topicFilter === "all" ? 600 : 400,
          }}
        >📚 All Topics</button>
        {Object.entries(TOPIC_META).map(([val, meta]) => (
          <button
            key={val}
            onClick={() => setTopicFilter(val)}
            style={{
              fontSize: 12, padding: "5px 14px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              border: "1.5px solid",
              borderColor: topicFilter === val ? meta.accent : "var(--color-filter-inactive-border)",
              background: topicFilter === val ? meta.bg : "var(--color-background-primary)",
              color: topicFilter === val ? meta.accent : "var(--color-text-secondary)",
              fontWeight: topicFilter === val ? 700 : 400,
              boxShadow: topicFilter === val ? `0 0 0 2px ${meta.border}` : "none",
              transition: "all 0.15s",
            }}
          >{meta.emoji} {meta.label}</button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", marginBottom: 10, fontSize: 13, height: 34, padding: "0 10px", border: "1.5px solid var(--color-search-border)", borderRadius: "var(--border-radius-md)", background: "var(--color-surface-input)", color: "var(--color-text-primary)" }}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {[ ["all","All"], ["pending","Pending"], ["done","Done"], ["important","⭐ Important"] ].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            border: "1px solid", transition: "all 0.15s",
            borderColor: filter === val ? "var(--color-border-info)" : "var(--color-filter-inactive-border)",
            background: filter === val ? "var(--color-background-info)" : "var(--color-background-primary)",
            color: filter === val ? "var(--color-text-info)" : "var(--color-text-secondary)",
            fontWeight: filter === val ? 500 : 400
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[ ["all","All Levels"], ["E","Easy"], ["M","Medium"], ["H","Hard"] ].map(([val, label]) => {
          const active = diffFilter === val;
          const d = DIFF[val];
          return (
            <button key={val} onClick={() => setDiffFilter(val)} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
              border: `1px solid ${active ? (d ? d.border : "var(--color-border-tertiary)") : "var(--color-diff-filter-inactive-border)"}`,
              background: active ? (d ? d.bg : "var(--color-background-secondary)") : "var(--color-background-primary)",
              color: active ? (d ? d.color : "var(--color-text-primary)") : "var(--color-text-secondary)",
              fontWeight: active ? 500 : 400
            }}>{label}</button>
          );
        })}
      </div>

      {(() => {
        let lastTopic = null;
        return filteredSections.map(sec => {
          const secDone = sec.questions.filter(q => checked[q.id]).length;
          const isCollapsed = collapsed[sec.id];
          const topicMeta = TOPIC_META[sec.topic];
          const showBanner = sec.topic !== lastTopic && topicMeta;
          lastTopic = sec.topic;
          const secPct = Math.round((secDone / sec.questions.length) * 100);

          return (
            <div key={sec.id}>
              {/* Topic group banner */}
              {showBanner && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  margin: "1.5rem 0 0.75rem",
                  paddingBottom: 10,
                  borderBottom: `2.5px solid ${topicMeta.border}`,
                }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 8,
                    background: topicMeta.bg,
                    border: `1.5px solid ${topicMeta.border}`,
                    fontSize: 16,
                  }}>{topicMeta.emoji}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: topicMeta.accent, letterSpacing: "-0.3px" }}>
                    {topicMeta.label}
                  </span>
                  <span style={{
                    marginLeft: "auto", fontSize: 11, fontWeight: 500,
                    color: topicMeta.accent, background: topicMeta.bg,
                    border: `1px solid ${topicMeta.border}`,
                    borderRadius: 99, padding: "2px 10px"
                  }}>
                    {filteredSections.filter(s => s.topic === sec.topic).reduce((a, s) => a + s.questions.filter(q => checked[q.id]).length, 0)}
                    /{filteredSections.filter(s => s.topic === sec.topic).reduce((a, s) => a + s.questions.length, 0)} done
                  </span>
                </div>
              )}

              {/* Section card */}
              <div style={{
                marginBottom: "0.6rem",
                border: `1px solid ${topicMeta ? topicMeta.border : "var(--color-border-tertiary)"}`,
                borderLeft: `4px solid ${topicMeta ? topicMeta.accent : sec.color}`,
                borderRadius: "var(--border-radius-lg)",
                overflow: "hidden",
                boxShadow: "0 1px 4px var(--color-shadow)",
              }}>
                {/* Section header */}
                <div
                  onClick={() => setCollapsed(c => ({ ...c, [sec.id]: !c[sec.id] }))}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px",
                    background: topicMeta ? topicMeta.bg : sec.bg,
                    cursor: "pointer", userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    {topicMeta && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
                        color: topicMeta.accent, background: topicMeta.bg,
                        border: `1px solid ${topicMeta.border}`,
                        borderRadius: 4, padding: "1px 6px", flexShrink: 0,
                      }}>{topicMeta.emoji} {topicMeta.label}</span>
                    )}
                    <span style={{ fontWeight: 600, fontSize: 13, color: sec.color, lineHeight: 1.3 }}>{sec.title}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
                    {/* Mini progress bar */}
                    <div style={{ width: 48, height: 5, borderRadius: 99, background: "var(--color-progress-track)", overflow: "hidden" }}>
                      <div style={{ width: `${secPct}%`, height: "100%", background: sec.color, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 12, color: sec.color, opacity: 0.9, fontWeight: 500, minWidth: 32, textAlign: "right" }}>{secDone}/{sec.questions.length}</span>
                    <i className={`ti ti-chevron-${isCollapsed ? "down" : "up"}`} style={{ fontSize: 14, color: sec.color }} aria-hidden="true" />
                  </div>
                </div>

                {!isCollapsed && sec.questions.map(q => (
                  <div key={q.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px",
                    borderTop: "0.5px solid var(--color-border-tertiary)",
                    background: checked[q.id] ? "var(--color-background-secondary)" : "var(--color-background-primary)",
                    transition: "background 0.2s"
                  }}>
                    <div
                      onClick={() => toggle(q.id)}
                      style={{
                        width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 2,
                        border: checked[q.id] ? `2px solid ${topicMeta ? topicMeta.accent : sec.color}` : `2px solid var(--color-checkbox-unchecked-border)`,
                        background: checked[q.id] ? (topicMeta ? topicMeta.accent : sec.color) : "var(--color-checkbox-unchecked-bg)",
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {checked[q.id] && <i className="ti ti-check" style={{ fontSize: 13, color: "#fff" }} aria-hidden="true" />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <a href={q.link} target="_blank" rel="noreferrer" style={{
                          fontSize: 13.5,
                          color: checked[q.id] ? "var(--color-text-tertiary)" : "var(--color-text-info)",
                          textDecorationLine: checked[q.id] ? "line-through" : "underline",
                          textUnderlineOffset: 2, textDecorationColor: "var(--color-border-info)",
                          fontWeight: q.important ? 500 : 400,
                        }}>
                          {q.title}
                        </a>
                        <DiffBadge d={q.diff} isDark={isDark} />
                        {q.important && (
                          <span style={{
                            fontSize: 10, padding: "1px 6px", borderRadius: 99,
                            background: "var(--color-tip-bg)", color: "var(--color-tip-color)", fontWeight: 500, flexShrink: 0,
                            border: "1px solid var(--color-tip-border)"
                          }}>⭐ IMP</span>
                        )}
                      </div>

                      {q.pattern && (
                        <div style={{ marginTop: 4 }}>
                          <span style={{ fontSize: 10.5, color: topicMeta ? topicMeta.accent : "var(--color-text-info)", background: topicMeta ? topicMeta.bg : "var(--color-background-info)", border: `1px solid ${topicMeta ? topicMeta.border : "var(--color-border-info)"}`, borderRadius: 4, padding: "1px 7px", fontWeight: 500 }}>
                            ⚙ {q.pattern}
                          </span>
                        </div>
                      )}

                      {notes[q.id] && (
                        <div style={{ marginTop: 4, fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 4, padding: "4px 8px", borderLeft: "2px solid var(--color-border-info)" }}>
                          {notes[q.id]}
                        </div>
                      )}

                      <button
                        onClick={() => { setNoteText(notes[q.id] || ""); setOpenNote(q.id); }}
                        style={{
                          marginTop: 5, display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer",
                          border: "1px solid var(--color-note-btn-border)",
                          background: notes[q.id] ? "var(--color-background-info)" : "var(--color-note-btn-bg)",
                          color: notes[q.id] ? "var(--color-text-info)" : "var(--color-note-btn-color)",
                          fontFamily: "var(--font-sans)"
                        }}
                      >
                        <i className={`ti ti-${notes[q.id] ? "pencil" : "notes"}`} style={{ fontSize: 12 }} aria-hidden="true" />
                        {notes[q.id] ? "Edit Note" : "+ Add Note"}
                      </button>

                      {user && (
                        <button
                          onClick={() => setCodeModal(q)}
                          style={{
                            marginTop: 5, marginLeft: 4, display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 11, padding: "2px 8px", borderRadius: 4, cursor: "pointer",
                            border: "1px solid var(--color-note-btn-border)",
                            background: "var(--color-note-btn-bg)",
                            color: "var(--color-note-btn-color)",
                            fontFamily: "var(--font-sans)"
                          }}
                        >
                          <span style={{ fontSize: 12 }} aria-hidden="true">💻</span>
                          Save Code
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        });
      })()}

      {filteredSections.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-tertiary)", fontSize: 14 }}>
          No questions match your filter.
        </div>
      )}

      {openNote && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "var(--color-overlay)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-secondary)", padding: "1.25rem", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>
                {notes[openNote] ? "Edit Note" : "Add Note"}
              </span>
              <button onClick={() => setOpenNote(null)} style={{ cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "transparent", border: "1px solid var(--color-border-tertiary)", color: "var(--color-text-secondary)" }}>
                <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>
            <textarea
              autoFocus value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Write your approach, complexity, key insight..."
              rows={5}
              style={{ width: "100%", resize: "vertical", fontSize: 13, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-modal-textarea-border)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
            />
            <div style={{ marginTop: 8, display: "flex", alignItems: "flex-start", gap: 6, padding: "7px 10px", borderRadius: "var(--border-radius-md)", background: "var(--color-tip-bg)", border: "1px solid var(--color-tip-border)" }}>
              <i className="ti ti-bulb" style={{ fontSize: 13, color: "var(--color-tip-color)", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
              <span style={{ fontSize: 11.5, color: "var(--color-tip-color)", lineHeight: 1.5 }}>
                Found a similar question on LeetCode, GFG, or Codeforces? Add its name or link here so you can revisit it during revision.
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
              {notes[openNote] && (
                <button onClick={deleteNote} style={{ fontSize: 12, color: "var(--color-text-danger)", cursor: "pointer", padding: "5px 12px", borderRadius: 4, border: "1px solid var(--color-border-danger)", background: "transparent" }}>
                  Delete
                </button>
              )}
              <button onClick={saveNote} style={{ fontSize: 12, fontWeight: 500, cursor: "pointer", padding: "5px 16px", borderRadius: 4, background: "var(--color-background-success)", color: "var(--color-text-success)", border: "1px solid var(--color-border-success)" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Code Modal (lazy-loaded, only mounts when a question is selected) ── */}
      {codeModal && (
        <Suspense fallback={null}>
          <CodeModal
            question={codeModal}
            onClose={() => setCodeModal(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
