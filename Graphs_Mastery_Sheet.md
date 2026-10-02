# Graphs — Complete Pattern-wise Prep Sheet

Organized basic → advanced. Question count per pattern is weighted by real interview/CP frequency — Dijkstra, Topological Sort, and DSU dominate actual interviews; things like network flow and Eulerian paths are rare but worth knowing exist.

---

## 1. Graph Representation & BFS/DFS Basics
**Importance: Very High (everything below builds on this)** — 8 questions

1. BFS of Graph — GFG — https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1
2. DFS of Graph — GFG — https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1
3. Number of Islands — LeetCode 200 — https://leetcode.com/problems/number-of-islands/
4. Clone Graph — LeetCode 133 — https://leetcode.com/problems/clone-graph/
5. Flood Fill — LeetCode 733 — https://leetcode.com/problems/flood-fill/
6. Rotting Oranges (multi-source BFS) — LeetCode 994 — https://leetcode.com/problems/rotting-oranges/
7. 01 Matrix (multi-source BFS) — LeetCode 542 — https://leetcode.com/problems/01-matrix/
8. Max Area of Island — LeetCode 695 — https://leetcode.com/problems/max-area-of-island/

---

## 2. Connected Components / Grid-based Graphs
**Importance: High** — 7 questions

1. Number of Provinces — LeetCode 547 — https://leetcode.com/problems/number-of-provinces/
2. Number of Connected Components in an Undirected Graph — LeetCode 323 — https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
3. Find the Number of Islands — GFG — https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1
4. Surrounded Regions — LeetCode 130 — https://leetcode.com/problems/surrounded-regions/
5. Shortest Path in Binary Matrix — LeetCode 1091 — https://leetcode.com/problems/shortest-path-in-binary-matrix/
6. Flood Fill Algorithm — GFG — https://www.geeksforgeeks.org/problems/flood-fill-algorithm1817/1
7. Making A Large Island — LeetCode 827 — https://leetcode.com/problems/making-a-large-island/

---

## 3. Topological Sort + DAG DP
**Importance: Very High (Kahn's algo, DFS-based sort, longest path in DAG are all classic ask)** — 8 questions

1. Topological Sort — GFG — https://www.geeksforgeeks.org/problems/topological-sort/1
2. Course Schedule — LeetCode 207 — https://leetcode.com/problems/course-schedule/
3. Course Schedule II — LeetCode 210 — https://leetcode.com/problems/course-schedule-ii/
4. Find Eventual Safe States — LeetCode 802 — https://leetcode.com/problems/find-eventual-safe-states/
5. Alien Dictionary — GFG — https://www.geeksforgeeks.org/problems/alien-dictionary/1
6. Parallel Courses III — LeetCode 2050 — https://leetcode.com/problems/parallel-courses-iii/
7. Longest Path in a Directed Acyclic Graph — GFG — https://www.geeksforgeeks.org/problems/longest-path-between-any-pair-of-vertices3235/1
8. Codeforces 510C — Fox And Names (topo sort on ordering constraints) — https://codeforces.com/problemset/problem/510/C

---

## 4. Cycle Detection (Directed & Undirected)
**Importance: Medium (often merged into topo-sort/DSU questions rather than asked standalone)** — 4 questions

1. Detect Cycle in an Undirected Graph — GFG — https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1
2. Detect Cycle in a Directed Graph — GFG — https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1
3. Codeforces 510B — Fox And Two Dots (cycle detection in grid) — https://codeforces.com/problemset/problem/510/B
4. Course Schedule — LeetCode 207 (directed-cycle detection in disguise — see Section 3) — https://leetcode.com/problems/course-schedule/

---

## 5. Dijkstra's Algorithm (Single-Source Shortest Path, Non-negative Weights)
**Importance: Very High (the single most-asked graph algorithm in interviews)** — 15 questions

1. Implementing Dijkstra Algorithm — GFG — https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1
2. Network Delay Time — LeetCode 743 — https://leetcode.com/problems/network-delay-time/
3. Path With Minimum Effort — LeetCode 1631 — https://leetcode.com/problems/path-with-minimum-effort/
4. Path with Maximum Probability — LeetCode 1514 — https://leetcode.com/problems/path-with-maximum-probability/
5. Number of Ways to Arrive at Destination — LeetCode 1976 — https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/
6. Second Minimum Time to Reach Destination — LeetCode 2045 — https://leetcode.com/problems/second-minimum-time-to-reach-destination/
7. Number of Restricted Paths From First to Last Node — LeetCode 1786 — https://leetcode.com/problems/number-of-restricted-paths-from-first-to-last-node/
8. Minimum Cost to Make at Least One Valid Path in a Grid (0-1 BFS / Dijkstra variant) — LeetCode 1368 — https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/
9. Codeforces 20C — Dijkstra? — https://codeforces.com/problemset/problem/20/C
10. Codeforces 449B — Jzzhu and Cities — https://codeforces.com/problemset/problem/449/B
11. Reachable Nodes In Subdivided Graph — LeetCode 882 — https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/
12. Minimum Weighted Subgraph With the Required Paths (multi-source Dijkstra) — LeetCode 2203 — https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/
13. Shortest Path From 1 to N (0-1 BFS style) — GFG — https://www.geeksforgeeks.org/problems/shortest-path-from-1-to-n5847/1
14. Codeforces 1076D — Edge Deletion — https://codeforces.com/problemset/problem/1076/D
15. Codeforces 936B — Sleepy Game — https://codeforces.com/problemset/problem/936/B

---

## 6. Bellman-Ford (Negative Weights / Negative Cycle Detection)
**Importance: Medium-Low (rarely primary focus, but a common follow-up: "what if weights are negative?")** — 4 questions

1. Distance from the Source (Bellman-Ford Algorithm) — GFG — https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1
2. Negative Weight Cycle — GFG — https://www.geeksforgeeks.org/problems/negative-weight-cycle3707/1
3. Cheapest Flights Within K Stops — LeetCode 787 — https://leetcode.com/problems/cheapest-flights-within-k-stops/
4. Minimum Cost to Reach Destination in Time — LeetCode 1928 — https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/

*(For more, filter Codeforces by the "shortest-paths" tag: https://codeforces.com/problemset?tags=shortest-paths)*

---

## 7. Floyd-Warshall (All-Pairs Shortest Path)
**Importance: Medium** — 5 questions

1. Implementing Floyd Warshall — GFG — https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1
2. Find the City With the Smallest Number of Neighbors at a Threshold Distance — LeetCode 1334 — https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/
3. Evaluate Division — LeetCode 399 — https://leetcode.com/problems/evaluate-division/
4. Course Schedule IV — LeetCode 1462 — https://leetcode.com/problems/course-schedule-iv/
5. Codeforces 25C — Roads in Berland — https://codeforces.com/problemset/problem/25/C

---

## 8. Minimum Spanning Tree (Prim's & Kruskal's)
**Importance: High** — 7 questions

1. Minimum Spanning Tree — GFG — https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1
2. Kruskal's Algorithm — GFG — https://www.geeksforgeeks.org/problems/kruskals-minimum-spanning-tree/1
3. Prim's MST for Adjacency List Representation — GFG — https://www.geeksforgeeks.org/problems/prims-mst-for-adjacency-list-representation1702/1
4. Min Cost to Connect All Points — LeetCode 1584 — https://leetcode.com/problems/min-cost-to-connect-all-points/
5. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree — LeetCode 1489 — https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/
6. Codeforces 1245D — Shichikuji and Lasers — https://codeforces.com/problemset/problem/1245/D
7. Codeforces 609E — Minimum Spanning Tree for Each Edge — https://codeforces.com/problemset/problem/609/E

---

## 9. Union-Find / Disjoint Set Union (DSU)
**Importance: Very High (foundational for MST, dynamic connectivity, and a huge chunk of "hidden graph" problems)** — 14 questions

1. Union-Find — GFG — https://www.geeksforgeeks.org/problems/union-find/1
2. Number of Provinces — LeetCode 547 — https://leetcode.com/problems/number-of-provinces/
3. Redundant Connection — LeetCode 684 — https://leetcode.com/problems/redundant-connection/
4. Redundant Connection II (directed) — LeetCode 685 — https://leetcode.com/problems/redundant-connection-ii/
5. Number of Operations to Make Network Connected — LeetCode 1319 — https://leetcode.com/problems/number-of-operations-to-make-network-connected/
6. Smallest String With Swaps — LeetCode 1202 — https://leetcode.com/problems/smallest-string-with-swaps/
7. Satisfiability of Equality Equations — LeetCode 990 — https://leetcode.com/problems/satisfiability-of-equality-equations/
8. Codeforces 25D — Roads not only in Berland — https://codeforces.com/problemset/problem/25/D
9. Accounts Merge — LeetCode 721 — https://leetcode.com/problems/accounts-merge/
10. Most Stones Removed with Same Row or Column — LeetCode 947 — https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/
11. Lexicographically Smallest Equivalent String — LeetCode 1061 — https://leetcode.com/problems/lexicographically-smallest-equivalent-string/
12. Similar String Groups — LeetCode 839 — https://leetcode.com/problems/similar-string-groups/
13. Codeforces 566D — Restructuring Company — https://codeforces.com/problemset/problem/566/D
14. Codeforces 371D — Vessels — https://codeforces.com/problemset/problem/371/D

---

## 10. Bipartite Graph Check
**Importance: Medium-Low** — 4 questions

1. Is Graph Bipartite? — LeetCode 785 — https://leetcode.com/problems/is-graph-bipartite/
2. Possible Bipartition — LeetCode 886 — https://leetcode.com/problems/possible-bipartition/
3. Bipartite Graph — GFG — https://www.geeksforgeeks.org/problems/bipartite-graph/1
4. Codeforces 862B — Mahmoud and Ehab and the bipartiteness — https://codeforces.com/problemset/problem/862/B

---

## 11. Strongly Connected Components (Kosaraju's / Tarjan's)
**Importance: Medium-Low (asked at product companies with strong CS-fundamentals rounds, rare elsewhere)** — 4 questions

1. Strongly Connected Components (Kosaraju's Algo) — GFG — https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1
2. Strongly Connected Component (Tarjan's Algo) — GFG — https://www.geeksforgeeks.org/problems/strongly-connected-component-tarjanas-algo-1587115621/1
3. Minimum Number of Vertices to Reach All Nodes — LeetCode 1557 — https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/
4. Codeforces 427C — Checkposts — https://codeforces.com/problemset/problem/427/C

---

## 12. Bridges & Articulation Points
**Importance: Medium-Low (common in CP, occasional in senior SDE interviews)** — 5 questions

1. Bridge Edge in Graph — GFG — https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1
2. Articulation Point - I — GFG — https://www.geeksforgeeks.org/problems/articulation-point-1/1
3. Critical Connections in a Network — LeetCode 1192 — https://leetcode.com/problems/critical-connections-in-a-network/
4. Codeforces 1000E — We Need More Bosses — https://codeforces.com/problemset/problem/1000/E
5. Codeforces 118E — Bertown Roads — https://codeforces.com/problemset/problem/118/E

---

## 13. Eulerian Path / Circuit
**Importance: Low (niche, but occasionally shows up as a "find a route through all edges" style problem)** — 4 questions

1. Reconstruct Itinerary — LeetCode 332 — https://leetcode.com/problems/reconstruct-itinerary/
2. Euler Circuit and Path — GFG — https://www.geeksforgeeks.org/problems/euler-circuit-and-path/1
3. Cracking the Safe (Eulerian circuit / De Bruijn sequence) — LeetCode 753 — https://leetcode.com/problems/cracking-the-safe/
4. Codeforces 209C — Trails and Glades — https://codeforces.com/problemset/problem/209/C

---

## 14. Max Flow / Min Cut / Bipartite Matching
**Importance: Low for standard interviews, occasionally shows up at top-tier companies and in CP** — 3 questions

1. Maximum Bipartite Matching — GFG — https://www.geeksforgeeks.org/problems/maximum-bipartite-matching/1
2. Find Whether Path Exist — GFG (basic flow-adjacent reachability, good warm-up) — https://www.geeksforgeeks.org/problems/find-whether-path-exist2448/1
3. Codeforces problemset filtered by "flows" tag for further practice — https://codeforces.com/problemset?tags=flows

*(I kept this section deliberately small and honest rather than listing flow problems I wasn't fully confident about — max flow is genuinely rare outside CP and specialized interviews, so it's low-ROI to over-invest here.)*

---

## Suggested Order of Attack
1. BFS/DFS basics → Connected components/grid problems (get comfortable with traversal first)
2. Topological Sort → Cycle Detection (these pair naturally — Kahn's algorithm *is* cycle detection)
3. Dijkstra's (spend the most time here — it's the highest-yield algorithm in this entire list)
4. Union-Find (learn this early — it quietly powers MST, connectivity, and a lot of "disguised graph" problems)
5. Minimum Spanning Tree (Prim's/Kruskal's — Kruskal's needs DSU, so do this right after #4)
6. Bellman-Ford → Floyd-Warshall (quick add-ons once Dijkstra is solid)
7. Bipartite Check (fast, low-effort pattern to lock in)
8. SCC → Bridges/Articulation Points (only if targeting CP or strong-fundamentals interviews)
9. Eulerian Path, Max Flow (optional depth — do these last, only after everything above is solid)

## Notes
- GFG links point to their Practice portal — slugs occasionally get renamed; if one 404s, search the exact title on geeksforgeeks.org/problems.
- Given your current level (LeetCode mediums, competitive programming background), I'd start at **Section 3 (Topological Sort)** — basic BFS/DFS traversal you've very likely already internalized.
- Codeforces problems are rated higher on average than the equivalent LeetCode difficulty for the same pattern — if a CF problem above feels like a big jump, solve 2-3 more LeetCode problems in that section first, then come back.
