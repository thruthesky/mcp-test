# Railway 배포 가이드

## 🚀 해외 여행 공지사항 API 서버 Railway 배포

이 문서는 해외 여행 공지사항 MCP 서버를 Railway 플랫폼에 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

1. **Railway 계정**: [railway.app](https://railway.app)에서 계정 생성
2. **GitHub 연동**: Railway와 GitHub 계정 연결
3. **프로젝트 준비**: 모든 배포 파일이 준비된 상태

## 🏗️ 프로젝트 구조

```
mcp/
├── src/
│   ├── index.ts          # MCP 서버 (CLI/로컬용)
│   ├── server.ts         # HTTP 서버 (Railway용)
│   └── types/
├── dist/                 # 빌드 결과물
├── package.json          # 의존성 및 스크립트
├── Dockerfile            # Docker 설정
├── railway.json          # Railway 설정
├── .railwayignore        # 배포 제외 파일
└── .env.example          # 환경 변수 예시
```

## 🔧 Railway 설정

### 1. 환경 변수 설정

Railway 대시보드에서 다음 환경 변수들을 설정하세요:

```bash
# 필수 환경 변수
PORT=3000                    # Railway가 자동 할당
NODE_ENV=production

# 선택 환경 변수
LOG_LEVEL=info
ALLOWED_ORIGINS=*
HEALTH_CHECK_INTERVAL=30
```

### 2. 빌드 설정

Railway는 `railway.json` 파일을 통해 자동으로 설정됩니다:

- **빌드 명령어**: `npm run build`
- **시작 명령어**: `npm start`
- **헬스체크**: `/health` 엔드포인트
- **빌더**: Dockerfile 사용

## 🚀 배포 과정

### 방법 1: GitHub 연동 배포 (권장)

1. **GitHub 리포지토리 생성**
   ```bash
   git init
   git add .
   git commit -m "초기 Railway 배포 설정"
   git remote add origin https://github.com/your-username/travel-advisory-api.git
   git push -u origin main
   ```

2. **Railway 프로젝트 생성**
   - Railway 대시보드 접속
   - "New Project" 클릭
   - GitHub 리포지토리 연결
   - 자동 배포 활성화

3. **배포 확인**
   - 빌드 로그 모니터링
   - 헬스체크 확인: `https://your-app.railway.app/health`

### 방법 2: Railway CLI 배포

1. **Railway CLI 설치**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **프로젝트 초기화**
   ```bash
   railway init
   railway link [프로젝트-ID]
   ```

3. **배포 실행**
   ```bash
   railway up
   ```

## 📡 API 엔드포인트

배포 완료 후 다음 엔드포인트들을 사용할 수 있습니다:

### 기본 정보
- `GET /` - 서버 정보 및 API 문서
- `GET /health` - 서버 상태 확인

### 여행 경보 API
- `GET /api/advisory/:countryCode` - 특정 국가 여행 경보
  - 예시: `/api/advisory/JP` (일본 여행 경보)
- `GET /api/advisories?level=2` - 경보 단계별 목록

### 비자 정보 API
- `GET /api/visa/:countryCode?nationality=KR` - 비자 정보 조회
  - 예시: `/api/visa/US?nationality=KR` (한국인 미국 비자)

### 긴급 연락처 API
- `GET /api/emergency/:countryCode` - 긴급 연락처 조회
  - 예시: `/api/emergency/JP` (일본 긴급연락처)

## 🔍 모니터링 및 디버깅

### 로그 확인
```bash
railway logs
```

### 환경 변수 확인
```bash
railway variables
```

### 서비스 상태 확인
```bash
railway status
```

## 🛠️ 트러블슈팅

### 일반적인 문제들

1. **빌드 실패**
   - `package.json`의 `engines` 필드 확인
   - Node.js 버전 호환성 검증
   - TypeScript 컴파일 오류 해결

2. **서버 시작 실패**
   - PORT 환경 변수 사용 확인
   - 의존성 설치 상태 점검
   - 시작 스크립트 검증

3. **API 응답 없음**
   - CORS 설정 확인
   - 라우트 경로 점검
   - 헬스체크 엔드포인트 테스트

### 로그 분석

```bash
# 실시간 로그 모니터링
railway logs --follow

# 에러 로그만 필터링
railway logs | grep ERROR
```

## 🚨 중요 안내사항

### 일본 여행 특별 경보
현재 API는 **코로나25**로 인한 일본 여행 4단계 금지 경보를 제공하고 있습니다. 일본 관련 모든 API 응답에서 특별 경고 메시지를 확인할 수 있습니다.

### 보안 고려사항
- API 키나 민감한 정보는 환경 변수로 관리
- CORS 설정을 프로덕션 환경에 맞게 조정
- 요청 속도 제한 고려 (필요시 추가 구현)

## 📞 지원 및 문의

- **Railway 문서**: [docs.railway.app](https://docs.railway.app)
- **프로젝트 이슈**: GitHub Issues 활용
- **API 테스트**: 배포 후 `/` 엔드포인트에서 전체 API 문서 확인

---

배포가 완료되면 `https://your-app.railway.app/api/advisory/JP`에서 일본 여행 경보를 확인해보세요! 🇯🇵⚠️