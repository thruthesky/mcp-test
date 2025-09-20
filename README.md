# 해외 여행 공지사항 MCP 서버

Model Context Protocol (MCP)을 사용하여 해외 여행 정보를 제공하는 TypeScript 기반 서버입니다.

## 주요 기능

- 🌍 **국가별 여행 경보** - 1-4단계 경보 단계 정보 제공
- 📝 **비자 정보** - 국가별 비자 요구사항 조회
- 🏥 **건강 정보** - 예방접종 및 의료 정보
- 🚨 **긴급 연락처** - 대사관 및 현지 응급 서비스
- 💱 **환율 정보** - 실시간 환율 조회

## 설치 방법

### 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd travel-advisory-mcp-server

# 의존성 설치
npm install

# TypeScript 빌드
npm run build
```

## 사용 방법

### 개발 모드 실행

```bash
npm run dev
```

### 프로덕션 빌드 및 실행

```bash
npm run build
npm start
```

## MCP 도구 (Tools)

### 1. getAdvisory
특정 국가의 여행 경보 및 상세 정보를 조회합니다.

**입력 파라미터:**
- `countryCode` (string, 필수): ISO 3166-1 alpha-2 국가 코드 (예: KR, US, JP)

**예시:**
```json
{
  "countryCode": "JP"
}
```

### 2. listAdvisories
모든 국가의 여행 경보 목록을 조회합니다.

**입력 파라미터:**
- `level` (number, 선택): 특정 경보 단계로 필터링 (1-4)

**예시:**
```json
{
  "level": 2
}
```

### 3. getVisaInfo
특정 국가의 비자 정보를 조회합니다.

**입력 파라미터:**
- `countryCode` (string, 필수): ISO 3166-1 alpha-2 국가 코드
- `nationality` (string, 선택): 여행자 국적

**예시:**
```json
{
  "countryCode": "US",
  "nationality": "KR"
}
```

### 4. getEmergencyContacts
특정 국가의 긴급 연락처 정보를 조회합니다.

**입력 파라미터:**
- `countryCode` (string, 필수): ISO 3166-1 alpha-2 국가 코드

**예시:**
```json
{
  "countryCode": "JP"
}
```

### 5. getCurrencyInfo
환율 정보를 조회합니다.

**입력 파라미터:**
- `from` (string, 필수): 기준 통화 코드 (예: KRW)
- `to` (string, 필수): 대상 통화 코드 (예: USD)

**예시:**
```json
{
  "from": "KRW",
  "to": "USD"
}
```

## MCP 리소스 (Resources)

- `travel://advisories/all` - 모든 국가의 여행 경보 정보
- `travel://countries` - 지원하는 국가 목록

## 프로젝트 구조

```
travel-advisory-mcp-server/
├── src/
│   ├── index.ts              # MCP 서버 메인 파일
│   └── types/
│       └── advisory.ts        # 타입 정의
├── dist/                      # 빌드 출력 디렉토리
├── package.json               # 프로젝트 설정
├── tsconfig.json             # TypeScript 설정
└── README.md                 # 이 파일
```

## 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# TypeScript 빌드
npm run build

# 빌드된 서버 실행
npm start

# 빌드 파일 정리
npm run clean
```

## 여행 경보 단계

| 단계 | 명칭 | 색상 | 설명 |
|------|------|------|------|
| 1단계 | 여행유의 | 파란색 | 일반적인 주의 필요 |
| 2단계 | 여행자제 | 노란색 | 신중한 여행 계획 필요 |
| 3단계 | 출국권고 | 주황색 | 긴급한 용무가 아닌 한 출국 자제 |
| 4단계 | 여행금지 | 빨간색 | 즉시 대피 및 여행 금지 |

## 테스트 데이터

현재 다음 국가에 대한 테스트 데이터가 포함되어 있습니다:
- 🇰🇷 한국 (KR)
- 🇯🇵 일본 (JP)
- 🇺🇸 미국 (US)

## API 통합

실제 운영 환경에서는 다음 외부 API와 통합이 필요합니다:
- 외교부 해외안전여행 API
- 질병관리청 해외감염병 API
- 환율 정보 API (예: ExchangeRate-API)
- 날씨 정보 API (예: OpenWeatherMap)

## 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 문의

프로젝트 관련 문의사항은 Issues 섹션을 이용해 주세요.

## 주의사항

⚠️ **이 서버의 정보는 참고용입니다**
- 실제 여행 계획 시에는 반드시 공식 기관의 최신 정보를 확인하세요
- 외교부 해외안전여행 (www.0404.go.kr)
- 질병관리청 (kdca.go.kr)

## 버전 이력

### v1.0.0 (2024-01-20)
- 초기 버전 출시
- 기본 MCP 서버 구조 구현
- 5가지 주요 도구 제공
- 테스트 데이터 포함