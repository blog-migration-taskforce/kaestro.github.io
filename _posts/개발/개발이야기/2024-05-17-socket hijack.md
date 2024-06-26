---
layout: 산문
classes: wide
title: "hijack - 웹소켓 도둑놈, 아니 도둑님 잡아라"
subtitle: "웹 소켓을 위한 통신 프로토콜"
date: 2024-05-17
categories: 개발이야기
---

## 개요 - hijack을 맞이하다

나름대로 테스트코드도 다 돌려 본 채팅이 동작하는 것을 확인한 서버 프로그램을 가지고 있으니 클라이언트에서 부하
테스트를 작성하는 것은 그렇게 어렵지 않을 것이라 생각했었습니다. 그리고 착각은 무엇인가 할 때마다 산산히 부서져
나가고 있는 것을 체감하는 요즘입니다. 이번에 맞이한 녀석은 바로 `hijack`입니다.

k6를 잘 모르는 상태에서 소켓 연결을 위해 메시지를 보내고, get request도 보내고 하다가 마침내는 ws의 connect를
이용해서 요청을 보내는 데 성공했는데 이게 웬걸, 서버사이드에서 황당한 에러 메시지가 나왔습니다.

![hijack log](/images/hijack/error%20-%20hijack.png)

?? http response code는 200인데 error는 발생했고, 내 연결은 hijack(탈취)되었다고? 보자마자 제 머리 속에서
떠오른 이미지는 이것이었습니다.

![이게 무슨 소리요 의사양반](https://i.namu.wiki/i/uf88vRFdi3xVPlSMkSblePa7NN6QL1pmvUzCWe5rqlxLXvMtjHxqXTTapVkKUh4gSAvYdrI2DkfpWkFo8vpX_A.mp4)

이게 대체 무슨 소리요 의사양반, 제가 여태까지 짜 둔 로직은 탈 생각은 하지도 않고 왜 클라이언트가 내 소켓을
훔쳐가는 것이오. 이 도동놈을 내 대체 어찌해야 한다는 말이오. 우리 솔로몬급 판결사 copilot님께서는 이 도둑은
의적으로 필수불가결하니 보내줘야하고, 오히려 제 서버가 이에 맞춰줘야 한다는 의견을 제시하였고 저는 이에 저항할
도리 없이 일단 이 도둑에 맞춰 서버를 수정해야 하는 상황에 놓였습니다.

그런데 누군지도 모르는 녀석에게 내 소켓을 탈취당한 것도 모자라 훔쳐가기 편하라고 집을 뜯어고치는 것은 너무
억울해 이번에 한번 조사를 해보기로 했습니다.

---

## 웹소켓이 연결되는 과정

하이잭에 대해 알기 위해서는 제가 대충 알고 있었던 웹소켓의 연결 과정부터 다시 짚어볼 필요가 있다 생각했습니다.
웹소켓의 연결 과정은 소위 말하는 handshake를 통해 이루어집니다. 이 과정은 다음과 같습니다.

1. 클라이언트가 서버에게 웹소켓 연결을 요청합니다.
2. 서버는 클라이언트에게 응답을 보냅니다.
3. 클라이언트는 서버에게 응답을 보냅니다.
4. 연결이 성공하면 서버와 클라이언트는 데이터를 주고받을 수 있습니다.

이런 교양 넘치는 사람들 간의 합의를 통해 연결이 이루어지는 것이 일반적인 연결 과정입니다. 여기까지가 제가 알고
있는 내용이고, 서버사이드에서 유닛테스트 및 통합테스트를 통해 이 과정을 정상적으로 마칠 경우에 메시지 역시
정상적으로 주고받을 수 있었습니다.

---

## 도동놈, 아니 도둑님 잡아라

그런데 이번에는 클라이언트가 서버에게 연결을 요청하고, 서버가 응답을 보내고, 클라이언트가 응답을 보내는
과정은 제가 서버 내에서 임의의 클라이언트를 상정하던 것과는 달랐습니다. 아무래도 그것은 제가 사용하는 k6의
ws.connect가 연결을 요청하는 과정에서 hijack이라는 go의 websocket 패키지의 메서드와 다른 방식으로 연결을
하는 것일 가능성이 높아보였습니다.

![나는 능이버섯이다](/images/hijack/능이버섯.png)

뭐 여기까지 왔는데 어쩌겠습니까. 제 반려 프로그램을 포기할 수는 없으니 이 도둑님께 굴복하는 수밖에요. 조금 더
찾아보니 websocket hijack 관련해서는 보안 관련 이슈들이 주를 이루고 있었으나, 다른 것은 go의 http 패지키의
hijack interface였습니다. 즉 제가 쓰는 k6도 go를 기반으로 만들어졌고, 제 서버 역시도 go로 만들어졌기 때문에
단순히 웹소켓 연결을 요청하는 것이 아니라 hijack을 통해 연결을 요청하는 것이었습니다.

---

## 내가 해야하는 조치

현재 제 서버는 연결을 할 때 연결이 hijack에 의해서가 아니라 기존의 gin Context의 connection을 이용한 것입니다.
이 때문에 hijack을 통해 연결을 요청하는 경우에는 연결이 되지 않는 문제가 발생하게 되었습니다. 이 문제를 해결하기 위해서
제가 해야할 조치는 기존에 작성한 채팅쪽 서비스 코드와 소켓 연결 모듈을 새로운 인터페이스에 맞게 수정하는 것이네요.
별 것 아니네요!

는 그럴리가 없으니, 이슈를 새로 따서 현재 작성된 hijack이 이루어지지 않을 때의 연결을 위한 코드에서 최소한의
수정을 통해 더 높은 단의 추상 interface를 제공하고 이를 통해 양쪽의 연결을 이루어지게끔 수정하는 것이 가능한
지에 대한 검토 및 재설계의 과정을 거쳐야 할 것 같습니다. 개발은 너무 재밌어요.(농담 아님)
