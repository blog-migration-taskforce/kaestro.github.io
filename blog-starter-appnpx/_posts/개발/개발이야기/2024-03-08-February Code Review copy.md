---
layout: default
classes: wide
title: "2월의 코드 복기"
subtitle: "알고리즘, Go 문법"
date: 2024-03-08
categories: 개발이야기
---

## <https://github.com/kaestro/algorithms_v3/commit/886b271b3be97d6af2af270d2754ebb8127f4d88>

binary search tree가 있을 때, 이를 펴는 방법

* 순회하고, 붙이고, 올려보내라

```python
def inorder_traversal(node):
  if node is None:
    return

  inorder_traversal(node.left)
  self.current_node.right = node.val
  self.current_node = self.current_node.right
  inorder_traversal(node.right)
```

---

## <https://github.com/kaestro/algorithms_v3/commit/449fc65f0fbc29330042bb3b0153b16b0049a167>

string을 element로 갖는 array를 입력받았을 때, 모든 element에 공통으로 들어간 character의 리스트를 구하는 문제. 중복을 허용하여 동일 character가 정답에 2번 이상 등장할 수도 있다.

직접 count하는 방법, python dictionary의 & 연산자를 이용하는 방법, set을 이용해서 정의역 자체를 줄인 뒤에 갯수를 count하고 객체는 최후에 만든다.

* 연산을 하기 전에 대상을 줄인다.
* 객체를 만드는 것은 최후에, 꼭 필요한 순간에만 한다.

---

## <https://github.com/kaestro/algorithms_v3/commit/90c7db2c8ff37d1ddf24b0a187fbe85de7ddd380>

세 명의 아이에게 줄 사탕의 갯수와 한 아이에게 줄 수 있는 최대 사탕의 갯수가 주어졌을 때, 이를 나눠 줄 수 있는 경우의 수를 구하는 문제.

* 최대 값에 제한이 있는 문제를 풀 때, 이를 합을 통해서 경우의 수를 만들지 않고 뺄셈을 통한 경우의 수 생성이 유리할 수 있다.

---

## <https://github.com/kaestro/algorithms_v3/commit/77ec890aefcc049d6cc8f0d8437909e4b6bf72db>

* 값이 존재하는지 계속해서 확인할 경우, hashtable을 사용하자.
* python의 set은 hashtable로 구현되어 있다.

---

## <https://github.com/kaestro/algorithms_v3/commit/ea23a451316766fde8bfce5213a8e9e23781da50>

* sliding window

---

Awesome!

## <https://github.com/kaestro/algorithms_v3/commit/471f6fb0b0c8cba6890b13ca1fbce871dd05eada>

: list의 partial sum = 0 되는 구간을 삭제한 list를 구하는 문제.

* accumulative sum이 key이고, 해당 sum이 나온 마지막 node가 value인 hashtable을 만든다.
* 다시 accumulative sum을 순회하면서, 해당 sum이 나온 마지막 노드가 현재 노드보다 뒤에 있으면, 그 사이의 구간은 0이 된다.
* currentNode.next = savedNode.next 로 중간 삭제

---

## <https://github.com/kaestro/algorithms_v3/commit/5309222eb2af9bb8cc830a05ebe554f870f2ffb3>

* backtracking

---

## <https://github.com/kaestro/weekly-reviews/blob/main/February/Code%20-%20Week%204th.md>

* Go와 관련한 전반적인 문법사항
