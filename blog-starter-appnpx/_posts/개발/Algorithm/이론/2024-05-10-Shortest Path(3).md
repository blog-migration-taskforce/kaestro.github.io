---
layout: series_mathjax
classes: wide
title: "Dijkstra algorithm"
subtitle: "single-source shortest path algorithm(3)"
date: 2024-05-07
categories: Algorithm
series: "single-source shortest path algorithm"
seriesIndex: 3
---

### 목차

- [1. Introduction](#1-introduction)
- [2. Algorithm by pseudocode](#2-algorithm-by-pseudocode)
- [Algorithm by python](#algorithm-by-python)
- [Time complexity](#time-complexity)
- [Reference](#reference)

---

## 1. Introduction

`Dijkstra algorithm`은 `단일 출발점 최단 경로 알고리즘` 중 하나로, `음수 가중치`를 가진 간선이
포함된 그래프에서는 사용할 수 없다. 대신 음수 가중치를 가진 간선이 없는 그래프에서는 `Bellman-ford algorithm`보다
더 빠르게 동작한다.

이를 위해 `Dijkstra algorithm`은 `priority queue`를 사용하여 최단 거리를 계산하며, 이미 계산이 완료된 정점
들은 다시 계산하지 않는다. 이 때문에 `Dijkstra algorithm`은 `그리디 알고리즘`으로 분류된다.

---

## 2. Algorithm by pseudocode

`Dijkstra algorithm`은 다음과 같은 방식으로 동작한다.

```plaintest
DIJKSTRA(G, w, s)
1  INITIALIZE-SINGLE-SOURCE(G, s)  // 모든 정점의 거리 값을 무한대로 초기화하고, 시작점의 거리 값을 0으로 설정합니다.
2  S = {}  // 최단 경로가 발견된 정점들의 집합 S를 초기화합니다.
3  Q = V[G]  // 모든 정점들을 포함하는 우선순위 큐 Q를 생성합니다.
4  while Q != {}  // Q가 빌 때까지 반복합니다.
5      u = EXTRACT-MIN(Q)  // Q에서 거리 값이 가장 작은 정점 u를 추출합니다.
6      S = S append {u}  // u를 S에 추가합니다.
7      for each vertex v in Adj[u]  // u의 모든 인접 정점 v에 대해
8          RELAX(u, v, w)  // u를 통해 v로 가는 경로가 더 짧은지 확인하고, 더 짧다면 v의 거리 값을 갱신합니다.
```

`DIJKSTRA(G, w, s)`: 그래프 `G`와 가중치 함수 `w`, 시작 정점 `s`를 입력으로 받아 최단 경로를 계산한다.

이 때 사용하는 자료구조는 다음과 같다.

- `S`: 이미 최단 거리를 계산한 정점의 집합
- `Q`: 아직 최단 거리를 계산하지 않은 정점의 집합
- `V[G]`: 그래프 `G`의 정점 집합
- `Adj[u]`: 정점 `u`에 인접한 정점들의 집합

---

## Algorithm by python

```python
import heapq

def dijkstra(graph, start):
    distance, predecessor = dict(), dict()
    # 각 노드의 거리와 선행 노드를 초기화합니다
    for node in graph:
        distance[node], predecessor[node] = float('inf'), None
    distance[start] = 0

    # 우선순위 큐를 초기화합니다
    queue = [(0, start)]

    while queue:
        # 우선순위 큐에서 가장 가까운 노드를 추출합니다
        current_distance, current_node = heapq.heappop(queue)
        # 이미 처리된 노드인 경우 건너뜁니다
        if current_distance > distance[current_node]:
            continue
        # 인접 노드에 대해 최단 거리를 갱신합니다
        for neighbor, weight in graph[current_node].items():
            new_distance = current_distance + weight
            if new_distance < distance[neighbor]:
                distance[neighbor] = new_distance
                predecessor[neighbor] = current_node
                heapq.heappush(queue, (new_distance, neighbor))
    return distance, predecessor
```

---

## Time complexity

`Dijkstra algorithm`의 시간 복잡도는 `O((V + E) log V)`이다. 이는 `priority queue`를 사용하여
최단 거리를 계산하기 때문에 정점을 추출하는 과정이 `O(log V)`이기 때문이다. Bellman-ford algorithm과
달리 모든 간선이 아니라 `최소 거리를 가진 정점만`을 추출하여 계산하기 때문에 더 빠르게 동작한다.

---

## Reference

- [Dijkstra algorithm - wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [Dijkstra algorithm - geeksforgeeks](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/)
- [Introduction to algorithms, 3rd edition](https://mitpress.mit.edu/books/introduction-algorithms-third-edition)
