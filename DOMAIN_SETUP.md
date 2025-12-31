# 도메인 연결 가이드 - www.reppinkr.com

## 1. 웹 호스팅 서버 준비

### 추천 호스팅 서비스:
- **Vercel** (무료, 간단): https://vercel.com
- **Netlify** (무료, 간단): https://netlify.com
- **GitHub Pages** (무료): https://pages.github.com
- **AWS S3 + CloudFront** (유료, 확장성 좋음)
- **한국 호스팅**: 카페24, Gabia 등

## 2. 파일 업로드 방법

### 방법 A: Vercel 사용 (가장 간단)

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 업로드**
   ```bash
   # Vercel CLI 설치
   npm i -g vercel
   
   # 프로젝트 폴더에서 실행
   cd /Users/jeong-inho/korea-community-website
   vercel
   ```

3. **도메인 연결**
   - Vercel 대시보드 → 프로젝트 → Settings → Domains
   - `www.reppinkr.com` 추가
   - DNS 설정 안내에 따라 도메인 등록 업체에서 설정

### 방법 B: Netlify 사용

1. **Netlify 계정 생성**
   - https://netlify.com 접속
   - GitHub 계정으로 로그인

2. **파일 드래그 앤 드롭**
   - Netlify 대시보드 → Sites → Add new site
   - 프로젝트 폴더를 드래그 앤 드롭

3. **도메인 연결**
   - Site settings → Domain management
   - `www.reppinkr.com` 추가
   - DNS 설정 안내에 따라 설정

### 방법 C: 일반 호스팅 (FTP)

1. **FTP 클라이언트 사용** (FileZilla 등)
2. **모든 파일 업로드**:
   - index.html
   - script.js
   - styles.css
   - config.js
   - api.js
   - admin.html
   - admin.js
   - 기타 모든 파일

## 3. DNS 설정

도메인 등록 업체(예: 가비아, 후이즈, GoDaddy 등)에서 다음 DNS 레코드 추가:

### A 레코드 (또는 CNAME)
```
Type: CNAME
Name: www
Value: [호스팅 업체에서 제공하는 주소]
TTL: 3600
```

### 또는 A 레코드
```
Type: A
Name: www
Value: [호스팅 업체의 IP 주소]
TTL: 3600
```

**Vercel의 경우:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Netlify의 경우:**
```
Type: CNAME
Name: www
Value: [your-site].netlify.app
```

## 4. SSL 인증서 설정

대부분의 호스팅 서비스(Vercel, Netlify 등)는 자동으로 SSL 인증서를 제공합니다.

## 5. 코드 설정 업데이트

도메인 연결 후 `config.js` 파일을 업데이트하세요:

```javascript
const API_CONFIG = {
    baseURL: 'https://www.reppinkr.com',
    // ... 나머지 설정
};
```

## 6. 확인 사항

도메인 연결 후 확인:
- [ ] https://www.reppinkr.com 접속 가능
- [ ] SSL 인증서 정상 작동 (https)
- [ ] 모든 페이지 정상 로드
- [ ] LocalStorage 데이터 확인 (서버 연동 전까지)

## 7. 서버 연동 준비

현재는 LocalStorage를 사용하고 있지만, 나중에 서버를 연동하려면:

1. **백엔드 서버 구축** (Node.js, Python 등)
2. **데이터베이스 설정** (MySQL, PostgreSQL, MongoDB 등)
3. **API 엔드포인트 구현**
4. **config.js에서 `useServer: true`로 변경**

## 8. 문제 해결

### 도메인이 연결되지 않을 때:
- DNS 전파 시간 대기 (최대 48시간, 보통 몇 시간)
- DNS 설정이 올바른지 확인
- 호스팅 업체의 도메인 설정 확인

### SSL 인증서 오류:
- 호스팅 업체에서 자동 SSL 활성화 확인
- Let's Encrypt 사용 (무료)

## 참고 링크

- Vercel 도메인 설정: https://vercel.com/docs/concepts/projects/domains
- Netlify 도메인 설정: https://docs.netlify.com/domains-https/custom-domains/
- DNS 설정 가이드: https://www.cloudflare.com/learning/dns/
