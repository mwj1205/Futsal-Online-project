# Futsal-Online-project
Nodejs 6기 - 9조 풋살 온라인 프로젝트
피파온라인 4를 오마주한 풋살 온라인 프로젝트입니다. 사용자 인증, 선수 뽑기, 스쿼드 관리, 게임 기능을 포함하고 있으며, AWS EC2를 통해 배포되고 있습니다.

1. [프로젝트 관리](#프로젝트-관리)
2. [AWS EC2 배포](#aws-ec2-배포)
3. [인증 미들웨어 구현](#인증-미들웨어-구현)
4. [데이터베이스 모델링](#데이터베이스-모델링)
5. [필수 기능 구현](#필수-기능-구현)
   - [회원가입 및 로그인 API](#회원가입-및-로그인-api)
   - [캐시 구매 API](#캐시-구매-api)
   - [선수 뽑기 API](#선수-뽑기-api)
   - [팀 꾸리기 API](#팀-꾸리기-api)
   - [축구 게임 API](#축구-게임-api)
7. [도전 기능 구현](#도전-기능-구현)
   - [유저 랭킹 조회 API](#유저-랭킹-조회-api)
   - [매치 메이킹 API](#매치-메이킹-api)


## 프로젝트 관리
1. `.env` 파일을 이용해 민감한 정보를 관리합니다 (DB 계정 정보, API Key 등).
2. `.gitignore` 파일을 생성하여 `.env` 파일과 `node_modules` 폴더가 GitHub에 올라가지 않도록 설정합니다.
3. `.prettierrc` 파일을 생성하여 일정한 코드 포맷팅을 유지합니다.

## AWS EC2 배포
- 프로젝트를 [**AWS EC2**](https://ap-northeast-2.console.aws.amazon.com/ec2)에 배포하였습니다.
- 배포된 IP 주소: 

## 인증 미들웨어 구현
- `/middlewares/auth.middleware.js`파일에 구현했습니다.
- JWT를 사용하여 사용자를 인증하는 미들웨어를 구현했습니다.
- Authorization 헤더를 통해 JWT를 전달받으며, 인증에 실패하는 경우 알맞은 HTTP Status Code와 에러 메세지를 반환합니다.
- 인증 성공 시, 사용자 정보를 `req.user`에 담고 다음 동작을 진행합니다.

- ## 데이터베이스 모델링
### ERD 다이어그램
![Untitled](https://github.com/user-attachments/assets/3cf756a9-2ab9-41d7-8a0f-b100aaea65d2)

**유저(Users), 선수의 기본 스탯(BaseCard), 유저가 소유한 선수(UserCard), 유저의 저장고(Storage), 유저의 팀(Squad), 게임 로그(MatchLog)** 총 6개의 주요 테이블로 구성되어 있습니다.
- Users 테이블 : 유저 정보 관리
  - id: 유저의 고유 id
  - username: 유저의 고유 사용자명.
  - password: 유저의 비밀번호. 6글자 이상의 문자열로 이루어진 값. 보안을 위해 해시 처리되어 저장된다.
  - nickname: 유저의 이름.
  - cash: 유저가 소유한 캐시
  - rating: 유저의 점수

- BaseCard 테이블 : 선수의 기본 스텟 관리
  - id: 선수의 고유 ID
  - playername: 선수의 이름
  - position: 선수의 포지션
  - shoot, pass, defense: 게임 로직에 사용되는 선수의 스텟
 
- UserCard 테이블 : 유저가 소유한 선수 관리
  - id: 유저가 소유한 선수의 고유 id
  - playername: 선수의 이름
  - position: 선수의 포지션
  - userid: 선수를 소유하고있는 유저의 id
  - level: 선수의 강화 레벨. 레벨에 따라 스텟이 상승함
  - shoot, pass, defense: 선수의 현재 스텟
 
- Storage 테이블 : 유저의 창고
  - id: 창고의 고유 ID
  - userid: 창고를 소유하고있는 유저의 id
  - cardid: 창고에 포함되어있는 선수의 id
 
- Squad 테이블 : 유저가 꾸린 팀
  - id: 팀의 고유 id
  - user: 팀을 소유하고있는 유저의 id
  - player1Id, player2Id, player3Id: 팀에 소속되어있는 선수의 id. 한 팀에 3명의 선수가 소속됨
 
- MatchLog 테이블 : 게임의 로그
  - id: 로그의 고유 id
  - UserAid, userBid: 게임을 진행한 두 유저의 id
  - scoreA, scoreB: 게임에서 두 유저가 획득한 점수
  - RatingChangeA, RatingChangeB: 게임으로 인해 획득/상실한 점수
  - matchdate: 게임이 진행된 시간

## 필수 기능 구현
## 회원가입 및 로그인 API
### 1. 회원가입 API (POST /users/sign-up)
자신의 아이디와 비밀번호를 서버의 user 테이블에 등록한다.

**요청 형식:**
```json
{
	"username": "spartaman",
	"password": "asdf4321",
	"confirmPassword": "asdf4321",
	"name": "스파르타맨"
}
```
- `username`: 로그인 할 때의 아이디. 다른 유저와 중복 불가능. 알파벳 소문자와 숫자로 이루어진 문자열.
- `password`: 로그인 할 때의 비밀번호. 최소 6글자 이상의 문자열.
- `confirmPassword`: 비밀번호 확인용 필드. password와 같아야 함.
- `name`: 유저의 이름.

**응답 형식:**
```json
{
	"message": "회원가입이 완료되었습니다.",
	"username": "spartaman",
	"name": "스파르타맨"
}
```
- `message`: 회원가입 성공 메시지.
- `username`: 회원가입된 유저의 아이디.
- `name`: 회원가입된 유저의 이름.

**실패 시 응답 예시**
```json
{
	"error": "이미 존재하는 사용자명입니다."
}
```
- `409 Conflict`: 입력된 사용자명이 이미 존재할 경우 발생하는 오류


**동작 설명**
1. 클라이언트는 사용자명, 비밀번호, 비밀번호 확인, 이름 정보를 POST 요청으로 보냄
2. Joi를 이용해 데이터의 유효성 검사
3. 사용자명이 이미 존재하면 `409 Conflict` 오류 발생
4. 데이터가 유효하면, 비밀번호는 `bcrypt`로 해시 처리되어 데이터베이스에 저장
5. 저장이 완료되면 성공 메시지와 함께 `username`,`name`을 반환


### 2. 로그인 API (POST /users/login)
자신의 아이디와 비밀번호로 로그인하여 토큰을 반환받는다.

**요청 형식:**
```json
{
	"username": "spartaman",
	"password": "asdf4321",
}
```
- `username`: 로그인 할 때의 아이디.
- `password`: 로그인 할 때의 비밀번호.

**응답 형식:**
```json
{
	"message": "로그인 성공",
	"token": "JWT 토큰"
}
```
- `message`: 로그인 성공 메시지.
- `token`: 인증이 필요한 API에서 사용되는 JWT 토큰.


**실패 시 응답 예시**
```json
{
	"error": "비밀번호가 일치하지 않습니다."
}
```
- `401 Unauthorized `: 입력된 비밀번호와 데이터베이스에 저장된 비밀번호가 다를 경우 발생하는 오류


**동작 설명**
1. 클라이언트는 사용자명, 비밀번호 정보를 POST 요청으로 보냄
2. Joi를 이용해 데이터의 유효성 검사
3. 사용자명이 데이터베이스에 존재하지 않으면 `401 Unauthorized` 오류 발생
4. 비밀번호가 다르면 `401 Unauthorized` 오류 발생
5. 사용자명과 비밀번호가 일치하면 JWT 토큰을 반환
6. 클라이언트는 이후 인증이 필요한 API 요청 시, authorization 헤더에 해당 토큰을 담아서 보냄

## 캐시 구매 API
### 3. 캐시 구매 API (POST /users/??) (JWT 인증 필요)
user가 캐시를 획득하는 API

**요청 형식:**


**응답 형식:**


**동작 설명**
1. 클라이언트는 POST 요청을 보냄

## 선수 뽑기 API
### 4. 선수 뽑기 API (POST /??) (JWT 인증 필요)
랜덤한 선수를 뽑는 API. 뽑기를 시행하면 일정량의 cash가 소비됨.

**요청 형식:**


**응답 형식:**


**동작 설명**
1. 클라이언트는 POST 요청을 보냄

## 팀 꾸리기 API
### 5. 팀 꾸리기 API (POST /users/??)
user가 캐시를 획득하는 API

**요청 형식:**


**응답 형식:**


**동작 설명**
1. 클라이언트는 POST 요청을 보냄

## 축구 게임 API
### 5. 축구 게임 API (POST /play) (JWT 인증 필요)
지정한 선수와 게임을 실행하는 API

**요청 형식:**


**응답 형식:**


**동작 설명**
1. 클라이언트는 상대할 선수의 id를 POST 요청으로 보냄

## 도전 기능 구현
## 유저 랭킹 조회 API
### 1. 유저 랭킹 조회 API
user의 rating을 기준으로 랭킹을 조회하는 API

**요청 쿼리**
- `page`: 조회할 유저 랭킹의 페이지
- `limit`: 한 페이지당 출력할 유저의 수

**응답 형식:**
```json
{
  "totalUsers": 12,
  "totalPages": 2,
  "data": [
    {
      "ranking": 1,
      "name": "k",
      "rating": 1300
    },
    {
      "ranking": 2,
      "name": "i",
      "rating": 1100
    },
...(이하 생략)
```
- `totalUsers`: db에 등록된 전체 유저의 수
- `totalPages`: 랭킹 페이지의 전체 수. limit에 따라 달라짐
- `data`: 랭킹과 유저의 정보

**동작 설명**
1. 클라이언트는 page와 limit을 GET 요청으로 보냄
2. 서버는 전체 유저의 수를 조회
3. 입력된 page와 limit에 맞는 유저의 랭킹 데이터를 가져옴
4. 가져온 데이터를 가공하여 반환

## 매치 메이킹 API
### 2. 점수 기반 자동 매치 메이킹 기능 (JWT 인증 필요)
유저가 상대를 지정하는 것이 아닌 rating을 기반으로 상대를 서버가 찾아주는 API

**응답 형식**
```json
{
  "message": "경기가 끝났습니다.",
  "matchLog": {
    "id": 29,
    "userAid": 1,
    "userBid": 2,
    "scoreA": 7,
    "scoreB": 3,
    "RatingChangeA": 4,
    "RatingChangeB": -4,
    "matchdate": "2024-09-19T10:21:58.865Z"
  }
}
```

**실패 시 응답 예시**
```json
{
  "error": "상대를 찾을 수 없습니다."
}
```

**동작 설명**
1. 클라이언트는 matchmaking POST 요청을 보냄
2. 서버는 요청을 보낸 유저의 정보를 확인
3. 유저의 rating을 기준으로 +-10의 rating을 가진 유저를 탐색
4. 최대 +-100까지 점차 늘려가면서 검색
5. 찾은 범위의 유저들 중 한 명의 유저를 랜덤으로 선택
6. 게임 실행 (이후는 축구 게임 API와 같이 동작)
