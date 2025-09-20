/**
 * 해외 여행 공지사항 MCP 서버 타입 정의
 *
 * 이 파일은 여행 경보, 비자 정보, 건강 정보 등
 * 해외 여행 관련 데이터의 타입을 정의합니다.
 */

/**
 * 여행 경보 단계 (1-4단계)
 * 1단계: 여행유의 (파란색)
 * 2단계: 여행자제 (노란색)
 * 3단계: 출국권고 (주황색)
 * 4단계: 여행금지 (빨간색)
 */
export type AlertLevelNumber = 1 | 2 | 3 | 4;

/**
 * 경보 단계 정보
 */
export interface AlertLevel {
  level: AlertLevelNumber;              // 경보 단계 번호
  levelName: string;                     // 단계 명칭 (예: "여행유의")
  color: 'blue' | 'yellow' | 'orange' | 'red'; // 표시 색상
  description: string;                   // 단계 상세 설명
}

/**
 * 안전 관련 경보 정보
 */
export interface Alert {
  id: string;                           // 경보 ID
  title: string;                        // 경보 제목
  type: 'TERROR' | 'DISASTER' | 'DISEASE' | 'CRIME' | 'POLITICAL' | 'OTHER'; // 경보 유형
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // 심각도
  description: string;                  // 상세 설명
  issuedDate: Date;                    // 발령 일시
  expiryDate?: Date;                   // 만료 일시 (선택사항)
}

/**
 * 안전 정보
 */
export interface SafetyInfo {
  alerts: Alert[];                     // 최신 경보 목록
  risks: string[];                     // 주요 위험 요소
  safetyTips: string[];               // 안전 수칙
  prohibitedItems: string[];          // 반입 금지 물품
  emergencyProcedures: string[];      // 긴급 상황 대처 요령
}

/**
 * 비자 요구사항
 */
export interface VisaRequirements {
  visaRequired: boolean;               // 비자 필요 여부
  visaType: string;                   // 비자 유형 (관광, 비즈니스 등)
  visaOnArrival: boolean;             // 도착 비자 가능 여부
  eVisaAvailable: boolean;            // 전자비자 가능 여부
  passportValidity: number;           // 요구 여권 유효기간 (개월)
  documents: string[];                // 필요 서류 목록
  processingTime: string;             // 처리 기간
  fee: {                              // 비자 수수료
    amount: number;
    currency: string;
  };
}

/**
 * 건강 정보
 */
export interface HealthInfo {
  requiredVaccinations: Vaccination[];  // 필수 예방접종
  recommendedVaccinations: Vaccination[]; // 권장 예방접종
  healthRisks: string[];                // 건강 위험 요소
  medicalFacilities: MedicalFacility[]; // 의료 시설 정보
  insuranceRecommendation: string;      // 여행자 보험 권장사항
  covidRequirements?: {                 // 코로나19 관련 요구사항
    pcrTest: boolean;
    vaccination: boolean;
    quarantine: number;                 // 격리 일수
  };
}

/**
 * 예방접종 정보
 */
export interface Vaccination {
  name: string;                         // 백신 이름
  disease: string;                     // 대상 질병
  required: boolean;                   // 필수 여부
  validityPeriod?: string;             // 유효 기간
  notes?: string;                      // 추가 설명
}

/**
 * 의료 시설 정보
 */
export interface MedicalFacility {
  name: string;                        // 시설명
  type: 'HOSPITAL' | 'CLINIC' | 'PHARMACY'; // 시설 유형
  address: string;                     // 주소
  phone: string;                       // 연락처
  hasEmergencyRoom: boolean;           // 응급실 보유 여부
  englishService: boolean;             // 영어 서비스 가능 여부
}

/**
 * 긴급 연락처
 */
export interface EmergencyContacts {
  embassy: {                           // 대사관/영사관
    name: string;
    address: string;
    phone: string;
    emergencyPhone: string;             // 24시간 긴급 전화
    email: string;
    website?: string;
  };
  localEmergency: {                    // 현지 긴급 서비스
    police: string;
    fire: string;
    medical: string;
    touristPolice?: string;             // 관광경찰 (있는 경우)
  };
  helplines: {                         // 도움 전화
    consularCallCenter?: string;       // 영사콜센터
    creditCardLoss?: string;           // 카드 분실
    travelInsurance?: string;          // 여행 보험
  };
}

/**
 * 날씨 정보
 */
export interface WeatherInfo {
  current: {                           // 현재 날씨
    temperature: number;                // 온도 (섭씨)
    humidity: number;                   // 습도 (%)
    condition: string;                  // 날씨 상태
    windSpeed: number;                  // 풍속 (km/h)
  };
  forecast: WeatherForecast[];         // 일기 예보
  bestTimeToVisit: string;             // 방문 최적 시기
  seasonalNotes: string;               // 계절별 주의사항
}

/**
 * 일기 예보
 */
export interface WeatherForecast {
  date: Date;                          // 날짜
  tempMin: number;                     // 최저 기온
  tempMax: number;                     // 최고 기온
  condition: string;                   // 날씨 상태
  precipitationChance: number;         // 강수 확률 (%)
}

/**
 * 환율 정보
 */
export interface CurrencyInfo {
  code: string;                        // 통화 코드 (예: USD, EUR)
  name: string;                        // 통화 이름
  symbol: string;                      // 통화 기호
  exchangeRate: {                      // 환율
    rate: number;                      // 환율값
    base: string;                      // 기준 통화
    lastUpdated: Date;                 // 최종 업데이트
  };
  acceptedCards: string[];             // 사용 가능 카드
  cashRecommendation: string;          // 현금 사용 권장사항
}

/**
 * 여행 경보 상세 정보
 */
export interface AdvisoryDetails {
  safety: SafetyInfo;                  // 안전 정보
  visa: VisaRequirements;              // 비자 정보
  health: HealthInfo;                  // 건강 정보
  contacts: EmergencyContacts;         // 긴급 연락처
  weather: WeatherInfo;                // 날씨 정보
  currency: CurrencyInfo;              // 환율 정보
}

/**
 * 메인 여행 공지사항 인터페이스
 */
export interface TravelAdvisory {
  countryCode: string;                 // ISO 3166-1 alpha-2 국가 코드
  countryName: string;                 // 국가명 (한글)
  countryNameEn: string;               // 국가명 (영문)
  alertLevel: AlertLevel;              // 경보 단계
  lastUpdated: Date;                   // 최종 업데이트 일시
  summary: string;                     // 요약 정보
  details: AdvisoryDetails;            // 상세 정보
  regions?: RegionalAdvisory[];        // 지역별 경보 (선택사항)
}

/**
 * 지역별 여행 경보
 */
export interface RegionalAdvisory {
  regionName: string;                  // 지역명
  regionNameEn: string;                // 지역명 (영문)
  alertLevel: AlertLevel;              // 해당 지역 경보 단계
  description: string;                 // 지역별 특별 주의사항
}

/**
 * API 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;                    // 성공 여부
  data?: T;                           // 응답 데이터
  error?: {                           // 에러 정보
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {                        // 메타데이터
    timestamp: Date;
    version: string;
    source: string;
  };
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  page: number;                       // 현재 페이지
  limit: number;                      // 페이지당 항목 수
  total: number;                      // 전체 항목 수
  totalPages: number;                 // 전체 페이지 수
}

/**
 * 목록 응답
 */
export interface ListResponse<T> {
  items: T[];                         // 항목 목록
  pagination: PaginationInfo;         // 페이지네이션 정보
}