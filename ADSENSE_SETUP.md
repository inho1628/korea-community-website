# Google AdSense 설정 가이드

## 1. AdSense 계정 생성 및 승인

1. **AdSense 계정 생성**
   - https://www.google.com/adsense 접속
   - Google 계정으로 로그인
   - 웹사이트 정보 입력 및 계정 생성

2. **사이트 승인 대기**
   - AdSense 코드를 사이트에 추가
   - Google 검토 완료까지 대기 (보통 1-2주)

## 2. Publisher ID 설정

승인 후 `index.html` 파일에서 다음을 변경하세요:

### Publisher ID 찾기
- AdSense 대시보드 → 사이트 → 광고 단위
- Publisher ID 형식: `ca-pub-1234567890123456`

### 변경할 위치

1. **Head 섹션** (line 8-11):
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-여기에_발급받은_ID"
     crossorigin="anonymous"></script>
```

2. **모든 광고 단위의 `data-ad-client` 속성**:
```html
data-ad-client="ca-pub-여기에_발급받은_ID"
```

## 3. 광고 단위 생성 및 Slot ID 설정

1. **AdSense 대시보드에서 광고 단위 생성**
   - 각 위치별로 광고 단위 생성:
     - 상단 배너 (Top Banner)
     - 인라인 광고 (In-Article)
     - 하단 배너 (Bottom Banner)

2. **Slot ID 설정**
   - 각 광고 단위의 Slot ID를 `data-ad-slot`에 입력
   - 예: `data-ad-slot="1234567890"`

## 4. 광고 위치

현재 다음 위치에 광고가 배치되어 있습니다:

1. **상단 배너** (페이지 최상단)
   - 모든 페이지에서 표시
   - Slot ID: `1234567890` (변경 필요)

2. **인라인 광고** (게시판 목록 상단)
   - Information, Hot Places, Humor Board 페이지
   - Slot ID: `1234567891` (변경 필요)

3. **하단 배너** (페이지 최하단)
   - 모든 페이지 하단
   - Slot ID: `1234567892` (변경 필요)

## 5. 광고 단위 추가 위치

필요에 따라 다음 위치에도 광고를 추가할 수 있습니다:

- 게시글 상세보기 모달 내부
- 사이드바 (레이아웃 변경 필요)
- 게시글 사이 (동적 삽입)

## 6. 주의사항

- **클릭 유도 금지**: 사용자에게 광고 클릭을 유도하면 안 됩니다
- **콘텐츠 비율**: 광고가 콘텐츠보다 많으면 안 됩니다
- **위치**: 광고가 콘텐츠를 가리지 않도록 주의
- **반응형**: 모바일에서도 적절히 표시되도록 확인

## 7. 테스트

- AdSense 승인 전에는 테스트 광고가 표시됩니다
- 승인 후 실제 광고가 표시되기 시작합니다
- 수익은 월 단위로 정산됩니다

