import React, { useState, useEffect } from "react";

const DIFF = {
  E: { label: "Easy",   bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
  M: { label: "Medium", bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27" },
  H: { label: "Hard",   bg: "#FCEBEB", color: "#A32D2D", border: "#F09595" },
};

const ALL_SECTIONS = [
  {
    id: "phase1", title: "Phase 1 — Basics", color: "#3B6D11", bg: "#EAF3DE",
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
    id: "phase2", title: "Phase 2 — Core Interview Questions", color: "#185FA5", bg: "#E6F1FB",
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
    id: "phase3", title: "Phase 3 — Matrix Problems", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "p3q1", title: "Set Matrix Zeroes",   link: "https://leetcode.com/problems/set-matrix-zeroes/", important: true,  diff: "M" },
      { id: "p3q2", title: "Rotate Image (90°)",  link: "https://leetcode.com/problems/rotate-image/",      important: true,  diff: "M" },
      { id: "p3q3", title: "Spiral Matrix",        link: "https://leetcode.com/problems/spiral-matrix/",     important: true,  diff: "M" },
      { id: "p3q4", title: "Pascal's Triangle",   link: "https://leetcode.com/problems/pascals-triangle/",  important: false, diff: "E" },
    ]
  },
  {
    id: "phase4", title: "Phase 4 — Prefix Sum + Hashing", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "p4q1", title: "Longest Subarray with Sum K (Positive)", link: "https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1", important: true, diff: "M" },
      { id: "p4q2", title: "Subarray Sum Equals K",                  link: "https://leetcode.com/problems/subarray-sum-equals-k/",                    important: true, diff: "M" },
      { id: "p4q3", title: "Count Subarrays with Given XOR",         link: "https://www.naukri.com/code360/problems/subarrays-with-xor-k_6826258",    important: true, diff: "M" },
    ]
  },
  {
    id: "phase5", title: "Phase 5 — Medium / Hard (Important)", color: "#993C1D", bg: "#FAECE7",
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
    id: "phase6", title: "Phase 6 — Sliding Window / Advanced", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "p6q1", title: "Maximum Product Subarray",  link: "https://leetcode.com/problems/maximum-product-subarray/",                 important: true,  diff: "M" },
      { id: "p6q2", title: "Sliding Window Maximum",    link: "https://leetcode.com/problems/sliding-window-maximum/",                   important: true,  diff: "H" },
      { id: "p6q3", title: "Maximum Points from Cards", link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/", important: false, diff: "M" },
    ]
  },
  {
    id: "phase7", title: "Phase 7 — Famous Hard Problems", color: "#A32D2D", bg: "#FCEBEB",
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
    id: "array_extra", title: "Arrays — Extra Must-Know", color: "#5F5E5A", bg: "#F1EFE8",
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
    id: "matrix", title: "Matrix Problems", color: "#993556", bg: "#FBEAF0",
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
    id: "sw1", title: "Sliding Window — Phase 1: Fixed Window Basics", color: "#185FA5", bg: "#E6F1FB",
    questions: [
      { id: "sw1q1", title: "Maximum Average Subarray I",                  link: "https://leetcode.com/problems/maximum-average-subarray-i/",                       important: true,  diff: "E", pattern: "Fixed window" },
      { id: "sw1q2", title: "Find K-Beauty of a Number",                   link: "https://leetcode.com/problems/find-the-k-beauty-of-a-number/",                    important: false, diff: "E", pattern: "Fixed window" },
      { id: "sw1q3", title: "Substrings of Size Three with Distinct Chars",link: "https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/",important: false, diff: "E", pattern: "Fixed window" },
      { id: "sw1q4", title: "Sliding Window Maximum",                      link: "https://leetcode.com/problems/sliding-window-maximum/",                           important: true,  diff: "H", pattern: "Monotonic deque" },
    ]
  },
  {
    id: "sw2", title: "Sliding Window — Phase 2: Variable Window Basics", color: "#0F6E56", bg: "#E1F5EE",
    questions: [
      { id: "sw2q1", title: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", important: true, diff: "M", pattern: "Variable window + hashmap" },
      { id: "sw2q2", title: "Maximum Consecutive Ones III",                   link: "https://leetcode.com/problems/max-consecutive-ones-iii/",                       important: true, diff: "M", pattern: "Variable window" },
      { id: "sw2q3", title: "Fruit Into Baskets",                             link: "https://leetcode.com/problems/fruit-into-baskets/",                             important: true, diff: "M", pattern: "At most K distinct" },
      { id: "sw2q4", title: "Longest Repeating Character Replacement",        link: "https://leetcode.com/problems/longest-repeating-character-replacement/",        important: true, diff: "M", pattern: "Variable window + frequency" },
    ]
  },
  {
    id: "sw3", title: "Sliding Window — Phase 3: At Most K Distinct Pattern", color: "#534AB7", bg: "#EEEDFE",
    questions: [
      { id: "sw3q1", title: "Longest Substring with At Most K Distinct Characters", link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/", important: true, diff: "M", pattern: "At most K distinct" },
      { id: "sw3q2", title: "Subarrays with K Different Integers",                  link: "https://leetcode.com/problems/subarrays-with-k-different-integers/",                   important: true, diff: "H", pattern: "Exact K = atMost(K) - atMost(K-1)" },
    ]
  },
  {
    id: "sw4", title: "Sliding Window — Phase 4: Minimum Window Type", color: "#993C1D", bg: "#FAECE7",
    questions: [
      { id: "sw4q1", title: "Minimum Size Subarray Sum",  link: "https://leetcode.com/problems/minimum-size-subarray-sum/",  important: true, diff: "M", pattern: "Shrinking window" },
      { id: "sw4q2", title: "Minimum Window Substring",   link: "https://leetcode.com/problems/minimum-window-substring/",   important: true, diff: "H", pattern: "Shrinking window + frequency map" },
    ]
  },
  {
    id: "sw5", title: "Sliding Window — Phase 5: Anagram Window", color: "#854F0B", bg: "#FAEEDA",
    questions: [
      { id: "sw5q1", title: "Permutation in String",       link: "https://leetcode.com/problems/permutation-in-string/",       important: true, diff: "M", pattern: "Fixed window + frequency" },
      { id: "sw5q2", title: "Find All Anagrams in a String",link: "https://leetcode.com/problems/find-all-anagrams-in-a-string/",important: true, diff: "M", pattern: "Fixed window + frequency" },
    ]
  },
  {
    id: "sw6", title: "Sliding Window — Phase 6: Prefix Sum + Window Hybrid", color: "#993556", bg: "#FBEAF0",
    questions: [
      { id: "sw6q1", title: "Binary Subarrays With Sum",       link: "https://leetcode.com/problems/binary-subarrays-with-sum/",       important: true, diff: "M", pattern: "Exact K = atMost(K) - atMost(K-1)" },
      { id: "sw6q2", title: "Count Number of Nice Subarrays",  link: "https://leetcode.com/problems/count-number-of-nice-subarrays/",  important: true, diff: "M", pattern: "Exact K pattern" },
      { id: "sw6q3", title: "Subarray Product Less Than K",    link: "https://leetcode.com/problems/subarray-product-less-than-k/",    important: true, diff: "M", pattern: "Variable window (product)" },
    ]
  },
  {
    id: "sw7", title: "Sliding Window — Phase 7: Advanced", color: "#3B6D11", bg: "#EAF3DE",
    questions: [
      { id: "sw7q1", title: "Maximum Points You Can Obtain from Cards", link: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",   important: true, diff: "M", pattern: "Reverse fixed window" },
      { id: "sw7q2", title: "Frequency of Most Frequent Element",       link: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/",    important: true, diff: "M", pattern: "Sorting + sliding window" },
      { id: "sw7q3", title: "Take K of Each Character From Left & Right",link: "https://leetcode.com/problems/take-k-of-each-character-from-left-and-right/",important: true, diff: "M", pattern: "Reverse window" },
    ]
  },
  {
    id: "sw8", title: "Sliding Window — Phase 8: Hard / Top Company", color: "#A32D2D", bg: "#FCEBEB",
    questions: [
      { id: "sw8q1", title: "Sliding Window Median",                     link: "https://leetcode.com/problems/sliding-window-median/",                    important: true, diff: "H", pattern: "Fixed window + two heaps" },
      { id: "sw8q2", title: "Minimum Operations to Reduce X to Zero",    link: "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",  important: true, diff: "M", pattern: "Complement max window" },
      { id: "sw8q3", title: "Count Vowel Substrings of a String",        link: "https://leetcode.com/problems/count-vowel-substrings-of-a-string/",       important: false, diff: "E", pattern: "Variable window + set" },
    ]
  }
];

const TOTAL = ALL_SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

function DiffBadge({ d }) {
  const { label, bg, color, border } = DIFF[d];
  return (
    <span style={{
      fontSize: 10, padding: "1px 7px", borderRadius: 99, flexShrink: 0,
      background: bg, color, border: `1px solid ${border}`, fontWeight: 500,
    }}>{label}</span>
  );
}

export default function DSATracker() {
  const [checked, setChecked]       = useState({});
  const [notes, setNotes]           = useState({});
  const [openNote, setOpenNote]     = useState(null);
  const [noteText, setNoteText]     = useState("");
  const [filter, setFilter]         = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");
  const [collapsed, setCollapsed]   = useState({});
  const [loaded, setLoaded]         = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = window.localStorage.getItem("dsa-checked");
        const n = window.localStorage.getItem("dsa-notes");
        if (c) setChecked(JSON.parse(c));
        if (n) setNotes(JSON.parse(n));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const save = async (nc, nn) => {
    try {
      window.localStorage.setItem("dsa-checked", JSON.stringify(nc));
      window.localStorage.setItem("dsa-notes",   JSON.stringify(nn));
    } catch {}
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
  })).filter(s => s.questions.length > 0);

  if (!loaded) return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1rem 0", maxWidth: 680 }}>
      <h2 className="sr-only">DSA Practice Sheet Tracker</h2>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>DSA Sheet</span>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{doneCount} / {TOTAL} solved</span>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: 999, height: 7, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#3B6D11", borderRadius: 999, transition: "width 0.4s" }} />
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

      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", marginBottom: 10, fontSize: 13, height: 34, padding: "0 10px", border: "1.5px solid #bbb", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        {[ ["all","All"], ["pending","Pending"], ["done","Done"], ["important","⭐ Important"] ].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            fontSize: 12, padding: "4px 12px", borderRadius: "var(--border-radius-md)", cursor: "pointer",
            border: "1px solid", transition: "all 0.15s",
            borderColor: filter === val ? "var(--color-border-info)" : "#ccc",
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
              border: `1px solid ${active ? (d ? d.border : "#888") : "#ccc"}`,
              background: active ? (d ? d.bg : "#eee") : "var(--color-background-primary)",
              color: active ? (d ? d.color : "#333") : "var(--color-text-secondary)",
              fontWeight: active ? 500 : 400
            }}>{label}</button>
          );
        })}
      </div>

      {filteredSections.map(sec => {
        const secDone = sec.questions.filter(q => checked[q.id]).length;
        const isCollapsed = collapsed[sec.id];
        return (
          <div key={sec.id} style={{ marginBottom: "1rem", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
            <div
              onClick={() => setCollapsed(c => ({ ...c, [sec.id]: !c[sec.id] }))}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: sec.bg, cursor: "pointer", userSelect: "none" }}
            >
              <span style={{ fontWeight: 500, fontSize: 14, color: sec.color }}>{sec.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: sec.color, opacity: 0.8 }}>{secDone}/{sec.questions.length}</span>
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
                    border: checked[q.id] ? "2px solid #3B6D11" : "2px solid #222",
                    background: checked[q.id] ? "#3B6D11" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.06)"
                  }}
                >
                  {checked[q.id] && <i className="ti ti-check" style={{ fontSize: 14, color: "#fff" }} aria-hidden="true" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <a href={q.link} target="_blank" rel="noreferrer" style={{
                      fontSize: 13.5,
                      color: checked[q.id] ? "var(--color-text-tertiary)" : "var(--color-text-info)",
                      textDecoration: checked[q.id] ? "line-through" : "underline",
                      textUnderlineOffset: 2, textDecorationColor: "var(--color-border-info)",
                      fontWeight: q.important ? 500 : 400,
                    }}>
                      {q.title}
                    </a>
                    <DiffBadge d={q.diff} />
                    {q.important && (
                      <span style={{
                        fontSize: 10, padding: "1px 6px", borderRadius: 99,
                        background: "#FAEEDA", color: "#854F0B", fontWeight: 500, flexShrink: 0,
                        border: "1px solid #EF9F27"
                      }}>⭐ IMP</span>
                    )}
                  </div>

                  {/* Pattern tag */}
                  {q.pattern && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 10.5, color: "#534AB7", background: "#EEEDFE", border: "1px solid #b5b0f5", borderRadius: 4, padding: "1px 7px", fontWeight: 500 }}>
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
                      border: "1px solid #999",
                      background: notes[q.id] ? "var(--color-background-info)" : "#f0f0f0",
                      color: notes[q.id] ? "var(--color-text-info)" : "#444",
                      fontFamily: "var(--font-sans)"
                    }}
                  >
                    <i className={`ti ti-${notes[q.id] ? "pencil" : "notes"}`} style={{ fontSize: 12 }} aria-hidden="true" />
                    {notes[q.id] ? "Edit Note" : "+ Add Note"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {filteredSections.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-tertiary)", fontSize: 14 }}>
          No questions match your filter.
        </div>
      )}

      {openNote && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-secondary)", padding: "1.25rem", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>
                {notes[openNote] ? "Edit Note" : "Add Note"}
              </span>
              <button onClick={() => setOpenNote(null)} style={{ cursor: "pointer", padding: "2px 6px", borderRadius: 4 }}>
                <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>
            <textarea
              autoFocus value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Write your approach, complexity, key insight..."
              rows={5}
              style={{ width: "100%", resize: "vertical", fontSize: 13, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: "1px solid #bbb", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", boxSizing: "border-box" }}
            />
            <div style={{ marginTop: 8, display: "flex", alignItems: "flex-start", gap: 6, padding: "7px 10px", borderRadius: "var(--border-radius-md)", background: "#FAEEDA", border: "1px solid #EF9F27" }}>
              <i className="ti ti-bulb" style={{ fontSize: 13, color: "#854F0B", flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
              <span style={{ fontSize: 11.5, color: "#854F0B", lineHeight: 1.5 }}>
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
    </div>
  );
}
