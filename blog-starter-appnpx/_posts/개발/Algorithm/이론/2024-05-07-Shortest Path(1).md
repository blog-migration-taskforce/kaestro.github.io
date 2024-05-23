---
layout: series_mathjax
classes: wide
title: "Introduction to Shortest Path algorithm"
subtitle: "single-source shortest path algorithm(1)"
date: 2024-05-07
categories: Algorithm
series: "single-source shortest path algorithm"
seriesIndex: 1
---

### 목차

- [Introduction](#introduction)
- [Optimal substructure](#optimal-substructure)
- [negative-weight edges](#negative-weight-edges)
- [Cycles](#cycles)
- [relaxation](#relaxation)
- [References](#references)

---

## Introduction

Shortest path problem은 그래프에서 두 정점 사이의 최단 경로를 찾는 문제이다. 이 문제는 다양한 분야에서 응용되며, 다양한 알고리즘이
 제안되어 있다. Shortest path problem은 다음과 같은 세 가지 유형으로 나뉜다.

1. Single-source shortest path problem
    - 주어진 그래프에서 특정 정점에서 다른 모든 정점까지의 최단 경로를 찾는 문제이다.
2. Single-destination shortest path problem
    - 주어진 그래프에서 모든 정점에서 특정 정점까지의 최단 경로를 찾는 문제이다.
3. All-pairs shortest path problem
    - 주어진 그래프에서 모든 정점 사이의 최단 경로를 찾는 문제이다.

이 글에서는 single-source shortest path problem에 대해 다룬다. single-source shortest path problem은 다음과 같은 두 가지 유형으로 나뉜다.

1. Unweighted graph: 그래프의 간선에 가중치가 없는 경우
2. Weighted graph: 그래프의 간선에 가중치가 있는 경우

이 글에서는 weighted graph에 대해 다룬다. weighted graph에서 single-source shortest path problem을 해결하는 대표적인 알고리즘은
 다음과 같다.

1. Dijkstra's algorithm
2. Bellman-Ford algorithm

---

## Optimal substructure

Shortest path problem은 optimal substructure를 가진다. Optimal substructure란 문제의 최적해가 부분 문제의 최적해로부터 구해질 수
 있는 성질을 말한다.
 Shortest path problem에서 optimal substructure는 다음과 같이 정의된다.

> Let $G = (V, E)$ be a directed graph with a weight function $w: E \rightarrow \mathbb{R}$, and let $s$ be a source vertex in $V$. For any vertex $v \in V$, let $p$ be a shortest path from $s$ to $v$. If $p$ contains an intermediate vertex $x$, then $p$ can be divided into two subpaths $s \rightarrow x$ and $x \rightarrow v$. The subpath $s \rightarrow x$ is a shortest path from $s$ to $x$, and the subpath $x \rightarrow v$ is a shortest path from $x$ to $v$.

즉, 최단 경로 $p$가 중간 정점 $x$를 포함하고 있다면, $p$는 두 개의 부분 경로 $s \rightarrow x$와 $x \rightarrow v$로 나눌 수 있다.
 부분 경로 $s \rightarrow x$는 $s$에서 $x$로 가는 최단 경로이며, 부분 경로 $x \rightarrow v$는 $x$에서 $v$로 가는 최단 경로이다.

---

## negative-weight edges

그래프의 간선이 음수 가중치를 가지는 경우, cycle이 존재할 수 있다. 이 경우, shortest path problem을 해결하는 알고리즘은 cycle을
 탐지하여 음의 무한대로 수렴할 수 있다.

Dijkstra's algorithm의 경우 모든 간선의 가중치가 양수인 경우에만 사용할 수 있다. Bellman-Ford algorithm은 음수 가중치를 가지는
 간선이 존재하고 cycle이 없는 경우에 사용할 수 있다.

---

## Cycles

Shortest path problem에서 cycle이 존재하는 경우, 해당 cycle이 음수 가중치를 가지는 경우와 양수 가중치를 가지는 경우로 나뉜다.
 음수 가중치를 가지는 cycle이 존재하는 경우, shortest path problem을 해결하는 알고리즘은 cycle을 탐지하여 음의 무한대로 수렴할 수
 있어 해를 구할 수 없다. 반면 양수 가중치를 가지는 cycle이 존재하는 경우, 해당 cycle을 포함하는 경로는 무한히 큰 가중치를 가지므로
 최단 경로가 될 수 없다. 즉 우리는 shortest path problem에서 cycle을 포함하는 경로를 고려하지 않는다.

---

## relaxation

Shortest path problem을 해결하는 알고리즘은 relaxation이라는 연산을 사용한다. relaxation은 다음과 같이 정의된다.

> Let $G = (V, E)$ be a directed graph with a weight function $w: E \rightarrow \mathbb{R}$, and let $s$ be a source vertex in $V$. For any vertex $v \in V$, let $p$ be a shortest path from $s$ to $v$. The relaxation operation updates the shortest path estimate $v.d$ and the predecessor $v.\pi$ of vertex $v$ if a shorter path from $s$ to $v$ is found.

즉, 매 정점 $v$에 대해 $s$에서 $v$로 가는 최단 경로 $v.d$와 이전 정점 $v.\pi$를 업데이트하는 연산이다.

---

## References

- [Introduction to Algorithms, 3rd Edition](https://mitpress.mit.edu/books/introduction-algorithms-third-edition)
  by Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, p.643 ~ p.650
