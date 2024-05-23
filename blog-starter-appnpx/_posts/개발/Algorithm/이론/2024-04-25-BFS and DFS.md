---
layout: mathjax
classes: wide
title: "BFS and DFS"
subtitle: "그래프를 탐색하는 두 가지 단순한 방법"
date: 2024-04-25
categories: Algorithm
---

## BFS와 DFS는 그래프를 탐색하는 방법 중 두 가지입니다

BFS(Breadth First Search)와 DFS(Depth First Search)는 그래프를 탐색하는 방법 중 하나입니다. 여기서 그래프를 탐색한다는 것은 그래프의 정점(vertex)에 접근해서 해당 정점이 가지고 있는 정보를 이용해 자신이 원하는 연산을 수행하는 것을 의미합니다. 미로 찾기 문제를 풀 때, 미로를 그래프로 표현하고 출발점에서 도착점까지의 경로를 찾는 문제를 풀 때 각각의 정점을 방문하면서 탈출구에 도달할 때까지 탐색하는 것이 그래프 탐색의 한 예입니다.

### BFS(Breadth First Search)

BFS는 그래프를 탐색할 때 너비를 우선으로 탐색하는 방법입니다. 즉, 시작 정점에서 가까운 정점부터 탐색을 진행하며 큐(Queue)를 이용하여 구현할 수 있습니다. 이 때 최대로 진행하는 연산의 경우에는 모든 정점을, 모든 간선을 한 번씩 방문하는 것을 통해 방문하는 것이므로 시간 복잡도는 $O(V+E)$입니다. 이를 통해 풀 수 있는 문제의 예시로는 모든 정점 간의 거리가 같을 때 최단 경로를 찾는 문제가 있습니다.

#### shortest path

### DFS(Depth First Search)

DFS는 그래프를 탐색할 때 깊이를 우선으로 탐색하는 방법입니다. 시작 정점에서 깊이를 우선으로 탐색을 진행하며 스택(Stack)을 이용하여 구현할 수 있습니다. 이 때 최대로 진행하는 연산은 모든 정점을, 모든 간선을 한 번씩 방문하는 것을 통해 방문하는 것이므로 BFS와 마찬가지로 시간 복잡도는 $O(V+E)$입니다.

DFS는 각각의 간선을 다음의 네 가지로 구분하는 데 사용할 수 있습니다.

```plaintext
1. 트리 간선(tree edge): DFS 트리에서 나온 간선(edge)
2. 순방향 간선(forward edge): DFS 트리에서 나온 간선이 아니지만, 자식 노드로 가는 간선(edge)
3. 역방향 간선(back edge): DFS 트리에서 나온 간선이 아니지만, 조상 노드로 가는 간선(edge)
4. 교차 간선(cross edge): DFS 트리에서 나온 간선이 아니지만, 서로 다른 서브트리 간의 간선(edge)
```

여기서 dfs트리란 DFS를 수행하면서 만들어지는 각 정점을 방문하는 순서대로 정렬된 트리를 의미합니다. DFS 트리에서 나온 간선(edge)이라는 것은 DFS를 수행하면서 만들어지는 트리에서 나온 것을 의미하며 나머지 간선(edge)들은 DFS 트리에서 나오지 않는 것들입니다.

#### topological sort

구성 요소 간에 우선순위가 존재하는 경우 이를 정렬하는 것을 위상정렬(topological sort)이라고 합니다. 위상정렬은 DFS를 이용하여 구현할 수 있으며 다음과 같은 순서를 따릅니다.

```plaintext
1. DFS를 이용하여 그래프를 탐색한다. 탐색하는 과정에서 각각의 정점을 방문하는데 걸린 시간을 기록한다.
2. 모든 정점을 방문한 후, 각 정점을 방문한 시간을 기준으로 내림차순으로 정렬한 linked list를 반환한다.
```

```plaintext
1. DFS를 이용하여 그래프를 탐색한다.
2. 탐색하고 빠져나오는 순간에 해당 정점을 linked list의 맨 앞에 추가한다.
3. 이를 모든 정점을 방문할 때까지 반복한다.
4. linked list를 반환한다.
```

```python
def topological_sort(graph):
    visited = [False] * len(graph)
    topological_order = []
    stack = []

    for v in range(len(graph)):
        if not visited[v]:
            stack.append(v)
            while stack:
                node = stack[-1]
                if not visited[node]:
                    visited[node] = True
                    for neighbor in graph[node]:
                        if not visited[neighbor]:
                            stack.append(neighbor)
                else:
                    stack.pop()
                    topological_order.append(node)

    return topological_order[::-1]
```

#### acyclic graph

acyclic graph는 사이클이 없는 그래프를 의미합니다. 이 때 acyclic graph는 위상정렬을 통해 정렬할 수 있습니다.

#### strongly connected components

strongly connected component는 모든 구성 vertex(정점)들이 서로 도달 가능한 그래프의 부분 그래프를 의미합니다. 이를 수학적으로 표현하면 다음과 같습니다.

vertices C is strongly connected component when

$$G = (V, E)$$
$$C \subseteq V$$
$$\forall u, \forall v \in C, u \rightarrow v \text{ and } v \rightarrow u$$

이를 DFS를 이용해 구하는 방법은 다음과 같습니다.

1. 그래프 $G$에 대해 DFS를 수행해서 모든 정점에 대해 끝나는 시간을 기록한다.
2. 그래프 $G$의 간선을 뒤집어서 그래프 $G^T$를 만든다.
3. $G^T$에 대해 DFS를 수행해서 끝나는 시간이 큰 정점부터 탐색한다.
4. 탐색하는 과정에서 방문하는 정점들이 하나의 strongly connected component를 형성한다.

```python
def strongly_connected_components(graph):
    visited = [False] * len(graph)
    stack = []
    for v in range(len(graph)):
        if not visited[v]:
            dfs(graph, v, visited, stack)

    graph_reverse = [[] for _ in range(len(graph))]
    for v in range(len(graph)):
        for neighbor in graph[v]:
            graph_reverse[neighbor].append(v)

    visited = [False] * len(graph)
    components = []
    while stack:
        node = stack.pop()
        if not visited[node]:
            component = []
            dfs_reverse(graph_reverse, node, visited, component)
            components.append(component)

    return components
```

---

## 출처

- Introduction to Algorithms, 3rd Edition. Thomas H. Cormen, Charles E. pg.610 ~ 644
- [GeeksforGeeks](https://www.geeksforgeeks.org/introduction-to-directed-acyclic-graph/)
