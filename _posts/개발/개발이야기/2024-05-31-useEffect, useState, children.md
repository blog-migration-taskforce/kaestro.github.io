---
layout: 산문
classes: wide
title: "children, hook, useEffect, useState in React"
subtitle: "react에서 데이터를 다루는 방법"
date: 2024-05-31
categories: 개발이야기
---

### 목차

- [children](#children)
- [hook - useState](#hook---usestate)
- [hook - useEffect](#hook---useeffect)
- [other famous hooks](#other-famous-hooks)
- [마무리](#마무리)

---

## children

React에서 컴포넌트를 사용할 때, 컴포넌트 태그 사이에 있는 내용을 사용하고 싶을 때가 있습니다. 이 때 사용하는
것이 `children`입니다. children을 사용하면 하위 컴포넌트는 상위 컴포넌트로부터 props로 전달 받은
값을 사용할 수 있습니다. 그러나 props는 읽기 전용이기 때문에 하위 컴포넌트에서 props를 변경할 수 없습니다.

```jsx
function Wrapper({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

function App() {
  return (
    <Wrapper>
      <h1>Hello, World!</h1>
    </Wrapper>
  );
}
```

`Wrapper` 컴포넌트는 `children`을 받아서 렌더링합니다. `App` 컴포넌트에서 `Wrapper` 컴포넌트를 사용할 때,
`Wrapper` 컴포넌트 태그 사이에 있는 내용이 `children`이 됩니다. 위의 예시를 기준으로 설명하자면, `Wrapper`
컴포넌트는 `h1` 태그를 렌더링합니다.

children은 이처럼 페이지를 단순히 렌더링하는 용도로 사용할 수도 있지만, 컴포넌트의 기능을 확장하는 용도로도
사용할 수 있습니다. 예를 들어, `Wrapper` 컴포넌트가 `children`을 받아서 `children`을 감싸는 기능을 추가한다면,
`Wrapper` 컴포넌트를 사용하는 모든 곳에서 `children`을 감싸는 기능을 사용할 수 있습니다.

```jsx
function Wrapper({ children, newName }) {
    return (
        <div>
            <div>
                {React.cloneElement(children, { name: newName })}
            </div>
        </div>
    );
}

function ChildComponent({ name }) {
    return <div>Hello, {name}!</div>;
}

// Wrapper 컴포넌트를 사용하는 예시입니다.
// Wrapper 컴포넌트는 ChildComponent에게 newName prop을 전달합니다.
<Wrapper newName="Jane Doe">
    <ChildComponent />
</Wrapper>
```

`Wrapper` 컴포넌트는 `children`인 `ChildComponent`에게 `name` prop을 전달합니다. `ChildComponent`는 `name`
prop을 받아서 사용합니다. 이처럼 `children`을 사용하면 컴포넌트의 기능을 확장하는 용도로 사용할 수 있습니다.

단순히 반환 값을 받아서 파라미터로 사용하는 것이 아니라 얼핏 복잡해보이는 방식으로 데이터를 주고 받는 이유는
react의 특성 때문입니다. react는 데이터의 흐름을 단방향으로 유지하는 것을 권장합니다. 만약 `children`을 사용하지
않고 `Wrapper` 컴포넌트에서 `name`을 선언하고 `ChildComponent`에게 전달한다면, `ChildComponent`는 `Wrapper`
컴포넌트의 상태를 직접적으로 변경할 수 있습니다. 이는 react의 데이터 흐름을 깨뜨리는 것이기 때문에 권장되지 않습니다.

```jsx
let name = "John Doe";

function Wrapper() {
    return (
        <div>
            <ChildComponent />
        </div>
    );
}

function ChildComponent() {
    const changeName = () => {
        name = "Jane Doe";
    };

    return (
        <div>
            <div>Hello, {name}!</div>
            <button onClick={changeName}>Change Name</button>
        </div>
    );
}
```

이처럼 하위 컴포넌트가 상위 컴포넌트의 상태를 직접적으로 변경할 수 있으면, 상위 컴포넌트의
상태를 추적하기 어려워집니다. 이는 react의 데이터 흐름을 깨뜨리는 것이기 때문에 권장되지 않으며 이런 상황을
단방향 데이터 흐름이 깨졌다고 합니다.

---

## hook - useState

React에서 컴포넌트의 상태를 관리하기 위해 사용하는 방법 중 하나가 hook입니다. hook은 함수 컴포넌트에서
상태를 관리할 수 있도록 도와줍니다. hook은 함수 컴포넌트에서만 사용할 수 있으며, 클래스 컴포넌트에서는
사용할 수 없습니다.

```jsx
import React, { useState } from 'react';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}
```

`useState`는 hook 중 하나로, 함수 컴포넌트에서 상태를 관리할 수 있도록 도와줍니다. `useState`는 배열을 반환하며,
배열의 첫 번째 요소는 상태 값이고, 두 번째 요소는 상태 값을 변경하는 함수입니다. `useState`의 인자로 초기값을
전달할 수 있습니다.

`App` 컴포넌트에서 `useState`를 사용하여 `count` 상태를 관리하고 있습니다. `count` 상태는 0으로 초기화되며,
`setCount` 함수를 사용하여 `count` 상태를 변경할 수 있습니다. `setCount` 함수는 `count` 상태를 변경할 때마다
컴포넌트를 리렌더링합니다.

---

## hook - useEffect

hook은 함수 컴포넌트에서 상태를 관리할 수 있도록 도와주는 것뿐만 아니라, 다른 hook을 사용하여 다양한 기능을
추가할 수 있습니다. 예를 들어, `useEffect` hook을 사용하여 컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수
있습니다.

```jsx
import React, { useState, useEffect } from 'react';

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('Component is rendered');
    });

    return (
        <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}
```

`useEffect`는 hook 중 하나로, 함수 컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있도록 도와줍니다.
`useEffect`는 함수와 배열을 인자로 받습니다. 함수는 컴포넌트가 렌더링될 때마다 수행할 작업을 정의하며,
배열은 의존성 배열로, 배열에 있는 값이 변경될 때마다 함수를 실행합니다.

`App` 컴포넌트에서 `useEffect`를 사용하여 컴포넌트가 렌더링될 때마다 'Component is rendered'를 출력합니다.
`useEffect`는 두 번째 인자로 빈 배열을 전달하였기 때문에, 컴포넌트가 렌더링될 때마다 'Component is rendered'를
출력합니다.

만약 `useEffect`의 두 번째 인자로 의존성 배열을 전달하면, 배열에 있는 값이 변경될 때마다 함수를 실행합니다. 이를
통해 특정 상태가 변경될 때만 함수를 실행할 수 있습니다.

```jsx
import React, { useState, useEffect } from 'react';

function App() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log('Component is rendered');
    }, [count]);

    return (
        <div>
            <div>{count}</div>
            <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
    );
}
```

`App` 컴포넌트에서 `useEffect`의 두 번째 인자로 `count`를 전달하였기 때문에, `count` 상태가 변경될 때마다
'Component is rendered'를 출력합니다.

---

## other famous hooks

- `useContext`: 컴포넌트 트리 전체에서 전역적으로 사용할 수 있는 값을 관리할 수 있습니다.
- `useReducer`: 복잡한 상태 로직을 컴포넌트 밖으로 빼내어 관리할 수 있습니다.
- `useCallback`: 특정 함수를 새로 만들지 않고 재사용할 수 있습니다.
- `useMemo`: 특정 값이 변경될 때만 연산을 실행할 수 있습니다.
- `useRef`: 함수 컴포넌트에서 ref를 사용할 수 있습니다.

---

## 마무리

React에서 데이터를 다루는 방법에 대해 알아보았습니다. `children`을 사용하면 컴포넌트 태그 사이에 있는 내용을
사용할 수 있습니다. `useState`를 사용하면 함수 컴포넌트에서 상태를 관리할 수 있습니다. `useEffect`를 사용하면
컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있습니다.

React에서 데이터를 다루는 방법은 다양하며, 이를 통해 컴포넌트의 기능을 확장하거나 상태를 관리할 수 있습니다.
React를 사용하여 프로젝트를 개발할 때, 데이터를 다루는 방법에 대해 고민해보고 적절한 방법을 선택하여 사용하면
좋을 것입니다.
