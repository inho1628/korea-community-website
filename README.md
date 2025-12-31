# REPPIN' KR

외국인들이 한국에서 소통할 수 있는 커뮤니티 사이트입니다.

## 주요 기능

### 1. 정보 공유
- 한국 생활에 필요한 정보를 공유할 수 있는 게시판
- 글과 사진 업로드 가능
- 동영상은 링크로만 공유 가능
- 익명 작성 가능 (닉네임 선택 가능)
- IP 주소 앞 6자리 표시

### 2. 핫 플레이스
- 한국의 인기 장소를 추천하고 공유하는 게시판
- 사진과 함께 장소 정보 공유

### 3. 나라별 커뮤니티
- 각 나라별로 갤러리를 생성하여 운영
- 30개 국가 갤러리 미리 생성 (가입 인구 많은 순서)
- 갤러리 신청 후 운영자 승인 필요
- 각 갤러리는 운영자가 지정한 2명의 관리자가 관리
- 모든 사용자가 갤러리에 게시글 작성 가능
- 별도 페이지로 접근 (메뉴처럼 사용)

### 4. 유머 게시판
- 재미있는 콘텐츠를 공유하는 게시판
- 실시간으로 인기글이 상단에 고정됨
- 인기 점수는 조회수, 좋아요, 댓글 수를 기반으로 계산

### 5. 홈페이지
- 가장 핫한 게시물 상위 10개 표시
- 인기 점수 기반 정렬

## 사용 방법

### 기본 사용자

1. **게시글 작성**
   - 로그인 없이도 작성 가능
   - 각 카테고리에서 "Write Post" 버튼 클릭
   - 닉네임 입력 (선택사항, 비우면 익명)
   - 제목, 내용, 사진(여러 개 가능), 동영상 링크 입력
   - 작성 완료

2. **로그인 (선택사항)**
   - 이름, 이메일, 국가를 입력하여 로그인
   - 기존 이메일이면 자동으로 로그인
   - 로그인 시 사용자 이름 표시

3. **갤러리 신청**
   - "Country Communities" 페이지에서 "Apply for Gallery" 버튼 클릭
   - 나라 이름과 설명 입력
   - 운영자 승인 대기

### 운영자 (관리자)

**기본 운영자 계정:**
- 이메일: `admin@admin.com`
- 이름: `Admin`
- 국가: `Korea`

**운영자 기능:**

1. **갤러리 신청 관리**
   - 갤러리 신청을 승인하거나 거부
   - 승인 시 갤러리가 생성됨

2. **갤러리 관리자 지정**
   - 각 갤러리에 최대 2명의 관리자 지정
   - 지정된 관리자는 해당 갤러리에 게시글 작성 가능

3. **게시글 관리**
   - 모든 게시글 조회 및 삭제 가능

4. **사용자 관리**
   - 전체 사용자 목록 조회
   - 사용자별 통계 확인

## 기술 스택

- HTML5
- CSS3 (반응형 디자인, 노란색/주황색 톤)
- JavaScript (Vanilla JS)
- LocalStorage (현재 데이터 저장)
- API 레이어 준비 완료 (서버 연동 대기)

## 파일 구조

```
korea-community-website/
├── index.html          # 메인 페이지
├── admin.html          # 관리자 페이지
├── styles.css          # 스타일시트
├── script.js           # 메인 JavaScript
├── admin.js            # 관리자 페이지 JavaScript
├── config.js           # API 설정 파일
├── api.js              # API 서비스 레이어
└── README.md           # 이 파일
```

## 서버 연동 방법

### 1. API 설정

`config.js` 파일을 열어서 서버 설정을 변경하세요:

```javascript
const API_CONFIG = {
    baseURL: 'https://yourdomain.com', // 실제 도메인으로 변경
    apiPath: '/api',
    useServer: true  // 서버 사용 시 true로 변경
};
```

### 2. API 엔드포인트

서버는 다음 엔드포인트를 구현해야 합니다:

#### 사용자
- `POST /api/auth/login` - 로그인
- `GET /api/users/me` - 현재 사용자 정보
- `GET /api/users` - 전체 사용자 목록

#### 게시글
- `GET /api/posts?category=info&galleryId=xxx` - 게시글 목록
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/posts` - 게시글 작성
- `POST /api/posts/:id/like` - 좋아요
- `DELETE /api/posts/:id` - 게시글 삭제 (관리자)

#### 갤러리
- `GET /api/galleries` - 갤러리 목록
- `GET /api/galleries/:id` - 갤러리 상세
- `GET /api/galleries/:id/posts` - 갤러리 게시글
- `POST /api/gallery-applications` - 갤러리 신청

#### 관리자
- `GET /api/admin/applications` - 신청 목록
- `POST /api/admin/applications/:id/approve` - 신청 승인
- `POST /api/admin/applications/:id/reject` - 신청 거부
- `PUT /api/admin/galleries/:id/admins` - 관리자 지정
- `DELETE /api/admin/posts/:id` - 게시글 삭제

### 3. 데이터 형식

#### 게시글 (Post)
```json
{
  "id": "string",
  "userId": "string | null",
  "category": "info | hotplace | humor | gallery",
  "galleryId": "string | null",
  "title": "string",
  "content": "string",
  "images": ["string"],
  "videoUrl": "string | null",
  "nickname": "string | null",
  "ipPrefix": "string",
  "views": 0,
  "likes": 0,
  "comments": 0,
  "createdAt": "ISO date string",
  "deleted": false
}
```

#### 갤러리 (Gallery)
```json
{
  "id": "string",
  "country": "string",
  "countryCode": "string",
  "flag": "string",
  "description": "string",
  "status": "approved | pending | rejected",
  "admins": ["string"],
  "createdAt": "ISO date string"
}
```

## 데이터 저장

### 현재 (LocalStorage)
모든 데이터는 브라우저의 LocalStorage에 저장됩니다:
- `users`: 사용자 정보
- `posts`: 게시글 정보
- `galleries`: 갤러리 정보
- `galleryApplications`: 갤러리 신청 정보
- `currentUser`: 현재 로그인한 사용자
- `userIPs`: 사용자별 IP 주소

### 서버 연동 시
`config.js`에서 `useServer: true`로 설정하면 자동으로 서버 API를 사용합니다.

## 배포

1. 서버 API 구현
2. `config.js`에서 `baseURL`과 `useServer` 설정
3. 정적 파일을 웹 서버에 배포
4. CORS 설정 확인

## 향후 개선 사항

- 댓글 기능 추가
- 실시간 알림 기능
- 이미지 서버 업로드
- 다국어 지원
- 검색 기능
- 사용자 프로필 페이지
- 소셜 로그인

