# 해외 여행 공지사항 MCP Server 개발 가이드라인

## Standard Workflow
**⚠️ 이 워크플로우는 반드시 따라야 합니다 (MANDATORY)**

### 1. 프로젝트 초기화
- 모든 MCP 서버는 Node.js 환경에서 **TypeScript**로 작성합니다
- `tsconfig.json` 설정을 엄격하게 구성합니다 (`strict: true`)
- ESLint와 Prettier 설정을 프로젝트 초기에 구성합니다
- 보안 취약점 검사를 위한 `npm audit` 정기 실행
- **UTF-8 인코딩 설정 필수** - 모든 소스 파일은 UTF-8로 저장하여 한글 주석이 깨지지 않도록 합니다

### 2. 개발 순서
1. **요구사항 분석** - 여행 정보 API 소스 조사 및 데이터 구조 설계
2. **TypeScript 인터페이스 정의** - 타입 안정성 확보
3. **MCP 프로토콜 구현** - JSON-RPC 통신 구조 구성
4. **외부 API 통합** - 여행 정보 제공 서비스 연동
5. **캐싱 전략 구현** - 응답 속도 최적화
6. **단위 테스트 작성** - Jest 또는 Vitest 사용
7. **통합 테스트** - 실제 API 연동 테스트
8. **문서화** - 사용자 가이드 및 API 문서 작성
9. **배포 준비** - npm 패키지 빌드 및 게시

### 3. 코드 커밋 전 체크리스트
- [ ] TypeScript 컴파일 에러 없음
- [ ] 린트 규칙 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] 타입 정의 완료
- [ ] 보안 취약점 검사 통과
- [ ] API 키 하드코딩 없음
- [ ] 모든 파일 UTF-8 인코딩 확인 (한글 주석 깨짐 방지)

## 해외 여행 공지사항 MCP Server 특화 지침

### 핵심 개발 목표
**🎯 전 세계 여행자를 위한 실시간 해외 여행 공지사항 및 안전 정보를 제공하는 MCP 서버 구축**

### 제공해야 할 핵심 정보

#### 1. 여행 경보 및 안전 정보
- **여행 경보 단계** (1단계: 여행유의 ~ 4단계: 여행금지)
- **실시간 안전 공지** (테러, 자연재해, 정치 상황 등)
- **현지 치안 정보**
- **긴급 상황 대처 방법**

#### 2. 입국/비자 정보
- **비자 요구사항** (무비자, 도착비자, 사전비자)
- **여권 유효기간 요구사항**
- **입국 심사 서류**
- **코로나19 관련 입국 제한**

#### 3. 건강 및 의료 정보
- **필수/권장 예방접종**
- **풍토병 정보**
- **의료 시설 수준**
- **여행자 보험 권장사항**

#### 4. 현지 실용 정보
- **환율 정보**
- **날씨/기후 정보**
- **시차 정보**
- **공휴일 및 영업시간**

#### 5. 긴급 연락처
- **대사관/영사관 연락처**
- **현지 응급 서비스** (경찰, 의료, 화재)
- **24시간 영사콜센터**
- **카드사 분실 신고**

## MCP Server 구현 요구사항

### 기본 인터페이스
```typescript
// 여행 공지사항 인터페이스
interface TravelAdvisory {
  countryCode: string;              // ISO 3166-1 alpha-2 코드
  countryName: string;              // 국가 이름 (한글/영문)
  alertLevel: AlertLevel;           // 경보 단계
  lastUpdated: Date;                // 최종 업데이트 일시
  summary: string;                  // 요약 정보
  details: AdvisoryDetails;         // 상세 정보
}

interface AlertLevel {
  level: 1 | 2 | 3 | 4;           // 경보 단계
  levelName: string;                // 단계 명칭
  color: string;                   // 표시 색상 (blue/yellow/orange/red)
  description: string;              // 단계 설명
}

interface AdvisoryDetails {
  safety: SafetyInfo;              // 안전 정보
  visa: VisaRequirements;          // 비자 정보
  health: HealthInfo;              // 건강 정보
  contacts: EmergencyContacts;     // 긴급 연락처
  weather: WeatherInfo;            // 날씨 정보
  currency: CurrencyInfo;          // 환율 정보
}

interface SafetyInfo {
  alerts: Alert[];                 // 최신 경보
  risks: string[];                 // 주요 위험 요소
  safetyTips: string[];            // 안전 수칙
  prohibitedItems: string[];       // 반입 금지 물품
}

interface VisaRequirements {
  visaRequired: boolean;           // 비자 필요 여부
  visaType: string;                // 비자 유형
  visaOnArrival: boolean;          // 도착 비자 가능 여부
  eVisaAvailable: boolean;         // 전자비자 가능 여부
  passportValidity: number;        // 요구 여권 유효기간 (개월)
  documents: string[];             // 필요 서류
}
```

### MCP 프로토콜 메소드
```typescript
// MCP 서버가 제공해야 할 메소드
interface TravelAdvisoryMethods {
  // 국가별 여행 경보 조회
  'travel/advisory': (params: { country: string }) => TravelAdvisory;

  // 전체 국가 경보 현황
  'travel/advisories/list': () => TravelAdvisory[];

  // 특정 경보 단계 국가 목록
  'travel/advisories/by-level': (params: { level: number }) => TravelAdvisory[];

  // 비자 정보 조회
  'travel/visa': (params: { country: string, nationality: string }) => VisaRequirements;

  // 건강/예방접종 정보
  'travel/health': (params: { country: string }) => HealthInfo;

  // 긴급 연락처 조회
  'travel/emergency': (params: { country: string }) => EmergencyContacts;

  // 실시간 환율 조회
  'travel/currency': (params: { from: string, to: string }) => CurrencyInfo;

  // 날씨 정보 조회
  'travel/weather': (params: { city: string }) => WeatherInfo;

  // 여행 정보 구독 (실시간 업데이트)
  'travel/subscribe': (params: { countries: string[] }) => Subscription;
}
```

## TypeScript 코딩 표준

### 필수 규칙
1. **엄격한 타입 체크** - `any` 타입 사용 금지
2. **명시적 반환 타입** - 모든 함수에 반환 타입 명시
3. **인터페이스 우선** - type alias보다 interface 선호
4. **불변성** - `const`와 `readonly` 적극 활용
5. **null 안정성** - Optional chaining(`?.`)과 Nullish coalescing(`??`) 사용
6. **에러 타입 정의** - 커스텀 에러 클래스 활용
7. **UTF-8 인코딩** - 모든 소스 파일은 반드시 UTF-8로 저장하여 한글 주석이 깨지지 않도록 함

### UTF-8 인코딩 설정 가이드
```typescript
// ✅ 올바른 예시 - UTF-8로 저장된 파일
/**
 * 여행 경보 정보를 가져옵니다
 * @param countryCode - 국가 코드
 * @returns 여행 경보 상세 정보
 */

// ❌ 잘못된 예시 - 인코딩 문제로 한글이 깨진 경우
/**
 * ¿©Çà °æº¸ Á¤º¸¸¦ °¡Á®¿É´Ï´Ù  // 이렇게 보이면 인코딩 문제!
 */
```

#### IDE별 UTF-8 설정 방법
- **VS Code**: Settings → Files: Encoding → UTF-8
- **WebStorm/IntelliJ**: Settings → Editor → File Encodings → UTF-8
- **파일 저장 시**: 항상 "UTF-8" 또는 "UTF-8 without BOM" 선택

### 코드 구조 예시
```typescript
// 좋은 예시 - 명확한 타입과 에러 처리
export async function getTravelAdvisory(
  countryCode: string
): Promise<TravelAdvisory> {
  // 입력 검증
  if (!isValidCountryCode(countryCode)) {
    throw new InvalidCountryCodeError(countryCode);
  }

  try {
    // 캐시 확인
    const cached = await cache.get<TravelAdvisory>(`advisory:${countryCode}`);
    if (cached && !isExpired(cached)) {
      return cached;
    }

    // 외부 API 호출
    const advisory = await fetchAdvisoryFromAPI(countryCode);

    // 데이터 검증 및 변환
    const validated = validateAdvisorySchema(advisory);

    // 캐시 저장 (1시간 TTL)
    await cache.set(`advisory:${countryCode}`, validated, 3600);

    return validated;
  } catch (error) {
    logger.error(`여행 경보 조회 실패: ${countryCode}`, error);
    throw new AdvisoryFetchError(countryCode, error);
  }
}
```

## 데이터 소스 및 외부 API

### 주요 데이터 제공처
1. **외교부 해외안전여행**
   - 여행경보 정보
   - 안전 공지사항
   - 영사 서비스

2. **질병관리청**
   - 해외 감염병 정보
   - 예방접종 정보
   - 검역 정보

3. **국제 데이터 소스**
   - WHO (세계보건기구)
   - US State Department Travel Advisories
   - UK Foreign Travel Advice
   - IATA (항공 정보)

4. **실시간 정보 API**
   - OpenWeatherMap (날씨)
   - ExchangeRate-API (환율)
   - RestCountries (국가 정보)

### API 통합 전략
```typescript
// API 클라이언트 추상화
interface DataProvider {
  name: string;
  priority: number;  // 우선순위 (낮을수록 높음)
  fetchAdvisory(country: string): Promise<RawAdvisory>;
  isAvailable(): Promise<boolean>;
}

// 폴백 메커니즘 구현
class AdvisoryAggregator {
  private providers: DataProvider[];

  async getAdvisory(country: string): Promise<TravelAdvisory> {
    for (const provider of this.providers) {
      try {
        if (await provider.isAvailable()) {
          const data = await provider.fetchAdvisory(country);
          return this.normalizeData(data, provider.name);
        }
      } catch (error) {
        logger.warn(`Provider ${provider.name} failed`, error);
        continue; // 다음 프로바이더 시도
      }
    }
    throw new NoDataAvailableError(country);
  }
}
```

## 캐싱 및 성능 최적화

### 캐싱 전략
1. **메모리 캐시** - 자주 조회되는 국가 정보
2. **Redis 캐시** - 공유 캐시 (다중 인스턴스 환경)
3. **CDN 캐싱** - 정적 데이터 (국가 코드, 통화 정보)

### 캐시 TTL 가이드라인
```typescript
const CACHE_TTL = {
  ADVISORY: 60 * 60,        // 1시간 - 여행 경보
  WEATHER: 30 * 60,         // 30분 - 날씨 정보
  CURRENCY: 10 * 60,        // 10분 - 환율 정보
  VISA: 24 * 60 * 60,       // 24시간 - 비자 정보
  HEALTH: 7 * 24 * 60 * 60, // 7일 - 건강 정보
} as const;
```

## 보안 고려사항

### API 키 관리
```typescript
// 환경 변수를 통한 API 키 관리
interface APIConfig {
  WEATHER_API_KEY: string;
  CURRENCY_API_KEY: string;
  GOVERNMENT_API_KEY: string;
}

// 키 로테이션 지원
class APIKeyManager {
  private keys: Map<string, string[]>;

  getKey(service: string): string {
    const serviceKeys = this.keys.get(service);
    if (!serviceKeys?.length) {
      throw new MissingAPIKeyError(service);
    }
    // 라운드 로빈 방식으로 키 순환
    return this.rotateKey(serviceKeys);
  }
}
```

### 사용량 제한
```typescript
// Rate limiting 구현
interface RateLimitConfig {
  maxRequests: number;      // 최대 요청 수
  windowMs: number;         // 시간 창 (밀리초)
  keyGenerator: (ctx: Context) => string;
}

const rateLimits = {
  global: { maxRequests: 1000, windowMs: 60000 },      // 분당 1000회
  perUser: { maxRequests: 100, windowMs: 60000 },      // 사용자당 분당 100회
  perCountry: { maxRequests: 50, windowMs: 60000 },    // 국가당 분당 50회
};
```

## 배포 전략

### NPM 패키지 배포

#### 1. 패키지 구성
```json
{
  "name": "@your-org/travel-advisory-mcp",
  "version": "1.0.0",
  "description": "해외 여행 공지사항 MCP 서버",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "mcp",
    "travel",
    "advisory",
    "safety"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

#### 2. 빌드 및 배포 스크립트
```json
{
  "scripts": {
    "build": "tsc --build",
    "prepare": "npm run build",
    "prepublishOnly": "npm run test && npm run lint",
    "version": "npm run format && git add -A src",
    "postversion": "git push && git push --tags",
    "release": "npm version patch && npm publish"
  }
}
```

#### 3. GitHub Actions CI/CD
```yaml
name: Deploy to NPM
on:
  release:
    types: [created]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

### 사용자 가이드

#### 설치 방법
```bash
# NPM을 통한 설치
npm install @your-org/travel-advisory-mcp

# 환경 변수 설정
export WEATHER_API_KEY="your-key"
export CURRENCY_API_KEY="your-key"
```

#### 기본 사용법
```typescript
import { TravelAdvisoryServer } from '@your-org/travel-advisory-mcp';

// 서버 초기화
const server = new TravelAdvisoryServer({
  port: 3000,
  cache: {
    type: 'memory',
    maxSize: 100
  },
  rateLimits: {
    enabled: true,
    maxRequests: 100
  }
});

// 서버 시작
await server.start();
```

## 모니터링 및 로깅

### 로깅 전략
```typescript
// 구조화된 로깅
interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  method: string;
  duration: number;
  country?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

// 로깅 레벨별 처리
const logger = {
  debug: (msg: string, meta?: any) => console.debug(formatLog('debug', msg, meta)),
  info: (msg: string, meta?: any) => console.info(formatLog('info', msg, meta)),
  warn: (msg: string, meta?: any) => console.warn(formatLog('warn', msg, meta)),
  error: (msg: string, error?: Error) => console.error(formatLog('error', msg, error)),
};
```

### 메트릭 수집
```typescript
// 주요 메트릭
interface Metrics {
  requestCount: number;           // 총 요청 수
  successRate: number;            // 성공률
  averageLatency: number;         // 평균 응답 시간
  cacheHitRate: number;          // 캐시 적중률
  errorRate: number;              // 에러율
  topCountries: string[];         // 자주 조회되는 국가
}
```

## 테스트 전략

### 단위 테스트
```typescript
// Jest를 사용한 테스트 예시
describe('TravelAdvisoryService', () => {
  it('should return valid advisory for known country', async () => {
    const advisory = await service.getAdvisory('KR');
    expect(advisory).toMatchObject({
      countryCode: 'KR',
      countryName: expect.any(String),
      alertLevel: expect.objectContaining({
        level: expect.any(Number)
      })
    });
  });

  it('should throw error for invalid country code', async () => {
    await expect(service.getAdvisory('INVALID')).rejects.toThrow(
      InvalidCountryCodeError
    );
  });
});
```

### 통합 테스트
```typescript
// API 통합 테스트
describe('External API Integration', () => {
  it('should handle API failure gracefully', async () => {
    // 모든 외부 API 실패 시뮬레이션
    mockAllAPIFailures();

    const advisory = await service.getAdvisory('US');

    // 캐시된 데이터 또는 기본값 반환 확인
    expect(advisory).toBeDefined();
    expect(advisory.lastUpdated).toBeLessThan(new Date());
  });
});
```

## 프로젝트 구조
```
travel-advisory-mcp/
├── src/
│   ├── index.ts              # MCP 서버 진입점
│   ├── server.ts             # 서버 설정 및 초기화
│   ├── handlers/             # MCP 메소드 핸들러
│   │   ├── advisory.ts       # 여행 경보 핸들러
│   │   ├── visa.ts          # 비자 정보 핸들러
│   │   ├── health.ts        # 건강 정보 핸들러
│   │   └── emergency.ts     # 긴급 연락처 핸들러
│   ├── services/            # 비즈니스 로직
│   │   ├── advisory.ts      # 경보 서비스
│   │   ├── cache.ts         # 캐싱 서비스
│   │   └── aggregator.ts    # 데이터 통합 서비스
│   ├── providers/           # 외부 API 프로바이더
│   │   ├── government.ts    # 정부 API
│   │   ├── weather.ts       # 날씨 API
│   │   └── currency.ts      # 환율 API
│   ├── types/               # TypeScript 타입 정의
│   │   ├── advisory.ts      # 경보 타입
│   │   ├── mcp.ts          # MCP 프로토콜 타입
│   │   └── index.ts        # 타입 export
│   ├── utils/              # 유틸리티 함수
│   │   ├── validator.ts    # 데이터 검증
│   │   ├── logger.ts       # 로깅 유틸
│   │   └── errors.ts       # 커스텀 에러
│   └── config/             # 설정 파일
│       ├── countries.ts    # 국가 코드 매핑
│       └── defaults.ts     # 기본 설정값
├── tests/                  # 테스트 파일
├── docs/                   # 문서
│   ├── API.md             # API 문서
│   ├── SETUP.md           # 설치 가이드
│   └── EXAMPLES.md        # 사용 예시
├── examples/              # 예제 코드
├── .env.example           # 환경 변수 예시
├── tsconfig.json         # TypeScript 설정
├── package.json
├── LICENSE
└── README.md
```

## 버전 관리 및 변경 이력

### Semantic Versioning
- **Major (X.0.0)**: 호환되지 않는 API 변경
- **Minor (0.X.0)**: 하위 호환되는 기능 추가
- **Patch (0.0.X)**: 하위 호환되는 버그 수정

### CHANGELOG 관리
```markdown
# Changelog

## [1.2.0] - 2024-01-15
### Added
- 실시간 환율 정보 조회 기능
- 여러 국가 동시 구독 기능

### Changed
- 캐시 TTL 최적화
- API 응답 속도 30% 개선

### Fixed
- 특수 문자가 포함된 국가명 처리 버그
```

## 라이선스 및 기여 가이드라인

### 오픈소스 라이선스
- MIT License 적용
- 상업적 사용 가능
- 저작권 표시 의무

### 기여 가이드라인
1. Issue 생성 후 논의
2. Feature 브랜치에서 작업
3. 테스트 작성 필수
4. PR 템플릿 준수
5. Code Review 후 병합

## 🚀 Railway 배포 정보

### 배포된 서비스 URL
**Live API Server**: `https://mcp-test-production-5d0b.up.railway.app`

### 실시간 테스트 방법

#### 1. 헬스체크 (서버 상태 확인)
```bash
curl https://mcp-test-production-5d0b.up.railway.app/health
```

#### 2. 기본 API 정보 조회
```bash
curl https://mcp-test-production-5d0b.up.railway.app/
```

#### 3. 일본 여행 경보 조회 (코로나25 4단계 경보!)
```bash
curl https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
```

#### 4. 전체 여행 경보 목록
```bash
curl https://mcp-test-production-5d0b.up.railway.app/api/advisories
```

#### 5. 특정 경보 단계 필터링 (2단계 이상)
```bash
curl "https://mcp-test-production-5d0b.up.railway.app/api/advisories?level=2"
```

#### 6. 한국인 미국 비자 정보
```bash
curl "https://mcp-test-production-5d0b.up.railway.app/api/visa/US?nationality=KR"
```

#### 7. 일본 긴급 연락처
```bash
curl https://mcp-test-production-5d0b.up.railway.app/api/emergency/JP
```

### 웹 브라우저 테스트
다음 URL들을 브라우저에서 직접 접속하여 JSON 응답을 확인할 수 있습니다:

- **기본 정보**: https://mcp-test-production-5d0b.up.railway.app/
- **헬스체크**: https://mcp-test-production-5d0b.up.railway.app/health
- **일본 경보**: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
- **전체 경보**: https://mcp-test-production-5d0b.up.railway.app/api/advisories

### 브라우저 확장 프로그램 활용
- **JSON Formatter** 확장 프로그램 설치 시 더 읽기 쉬운 형태로 표시됩니다
- **Postman** 또는 **Insomnia** 같은 API 클라이언트 도구로 테스트 가능

### GitHub 저장소
- **Source Code**: https://github.com/thruthesky/mcp-test
- **Issues & Feedback**: GitHub Issues 페이지 활용

---
**📌 주의: 이 가이드라인은 해외 여행 공지사항 MCP 서버 개발 및 배포에 특화되어 있으며, 모든 개발 과정에서 반드시 준수해야 합니다. 사용자의 안전한 여행을 위한 정확하고 신뢰할 수 있는 정보 제공이 최우선 목표입니다.**