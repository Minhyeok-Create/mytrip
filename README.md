<h1>Trip Partner - 여행 관련 플랫폼</h1>

![image](https://github.com/user-attachments/assets/a56cbb68-533c-44fd-8b98-b68db8446eb6)

- JAVA,JS, SpringBoot, HTML/CSS 기반 여행 관련 플랫폼
- 마이페이지 파트 작업
- MyBatis 기반 서버단 기능 구현
- Turn.JS 라이브러리 코드 변형하여 클라이언트 페이지 구현
- 노션을 통한 협업 스케줄 관리
  
  ![image](https://github.com/user-attachments/assets/8a89cb5d-fe8b-498a-9761-39215ec872b6)

  ### TripPartner
2024년 11월 첫 팀 프로젝트 작업물로 여행 관련 웹사이트이다.
본인은 마이페이지를 담당하였으며, 기본적인 CRUD 기능 구현과 WebSocket을 통한 실시간 채팅기능을 구현하였다.

### 기획 개요
여행의 순간을 기록하고, 비슷한 취향의 사람들과 연결되는 커뮤니티 서비스이다.

사용자는 여행 경험을 사진과 글로 남기고, 관심사에 따라 다른 여행자들과 소통하거나 새로운 여행 메이트를 찾을 수 있다.

함께 여행을 계획하고 추억을 만들어가는 플랫폼이다.

### 사용 기술
JAVA, SpringBoot, HTML, CSS, JavaScript, PostMan, Figma, Illuste, Photoship, JQuery, AJax, Mybatis, Lombok, WebSocket, Turn.js


### MyPageMain.
![](https://velog.velcdn.com/images/codegod/post/44eb5ea9-b3e7-4e6c-9bf6-47e6058150ba/image.png)
- 게시글 작성자의 개인 정보 보호를 위해 일부 이미지 블러처리한 점 양해부탁드립니다.
- 피드 게시글 중, 최근 9항목을 로드하는 메인페이지
- 개인 정보에 대한 수정이 가능하고 본인이 메인 페이지에서 선택한 가고싶은 여행지가 슬라이드 버튼을 통해 표시됨


![](https://velog.velcdn.com/images/codegod/post/efd4941f-bb51-44da-ab47-fdc7335117a8/image.gif)
- Turn.js 라이브러리 코드 변형하여 커스텀 이미지 기반으로 페이지를 오픈하는 모습

### GuestBook.
![](https://velog.velcdn.com/images/codegod/post/a0a9b397-9813-4a4a-a70e-95d42f559fbe/image.gif)
- 타인의 마이페이지에서 방명록을 작성할 수 있는 페이지로 작성한 항목이 비동기 & 동적 생성
- 방명록 텍스트 배경을 랜덤 함수를 통해 설정하여, 랜덤한 도장 이미지가 뒷 배경으로 설정됨

### Chat.
![](https://velog.velcdn.com/images/codegod/post/21d9832b-245f-4def-8ff2-670e2cd3b6cc/image.gif)
- WebSocket(Stomp)과 SockJS를 사용하여 실시간 채팅 기능 구현
- 여러 이용자가 한 채팅방에서 대화를 나눌 수 있는 구조

[소스링크](https://github.com/Minhyeok-Create/mytrip)



[기술 구현 ppt](https://docs.google.com/presentation/d/1T9mGIZKxcgeYVZtToY4tJcPR75FeQlQvZ_ntFTNClyk/edit#slide=id.g3345c3b832a_0_62)








