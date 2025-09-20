/**
 * Railway 배포용 HTTP 서버
 *
 * MCP 서버의 기능을 HTTP API로 제공하는 웹 서버입니다.
 * Railway에서 실행되며, REST API 형태로 여행 정보를 제공합니다.
 */

import express from 'express';
import cors from 'cors';
import { TravelAdvisoryMCPServer } from './index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MCP 서버 인스턴스 생성 (HTTP 모드용)
class HTTPTravelAdvisoryServer {
  private mcpServer: TravelAdvisoryMCPServer;

  constructor() {
    this.mcpServer = new TravelAdvisoryMCPServer();
  }

  /**
   * HTTP API용 여행 경보 조회
   */
  async getAdvisory(countryCode: string) {
    try {
      const result = await this.mcpServer['handleGetAdvisory']({ countryCode });
      if (!result.content?.[0]?.text) {
        throw new Error('응답 데이터가 없습니다');
      }
      return JSON.parse(result.content[0].text);
    } catch (error) {
      throw new Error(`여행 경보 조회 실패: ${error}`);
    }
  }

  /**
   * HTTP API용 전체 경보 목록 조회
   */
  async listAdvisories(level?: number) {
    try {
      const result = await this.mcpServer['handleListAdvisories']({ level });
      if (!result.content?.[0]?.text) {
        throw new Error('응답 데이터가 없습니다');
      }
      return JSON.parse(result.content[0].text);
    } catch (error) {
      throw new Error(`경보 목록 조회 실패: ${error}`);
    }
  }

  /**
   * HTTP API용 비자 정보 조회
   */
  async getVisaInfo(countryCode: string, nationality?: string) {
    try {
      const result = await this.mcpServer['handleGetVisaInfo']({ countryCode, nationality });
      if (!result.content?.[0]?.text) {
        throw new Error('응답 데이터가 없습니다');
      }
      return JSON.parse(result.content[0].text);
    } catch (error) {
      throw new Error(`비자 정보 조회 실패: ${error}`);
    }
  }

  /**
   * HTTP API용 긴급 연락처 조회
   */
  async getEmergencyContacts(countryCode: string) {
    try {
      const result = await this.mcpServer['handleGetEmergencyContacts']({ countryCode });
      if (!result.content?.[0]?.text) {
        throw new Error('응답 데이터가 없습니다');
      }
      return JSON.parse(result.content[0].text);
    } catch (error) {
      throw new Error(`긴급 연락처 조회 실패: ${error}`);
    }
  }
}

// 서버 인스턴스 생성
const travelServer = new HTTPTravelAdvisoryServer();

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.static('public')); // 정적 파일 서빙

// 기본 정보 엔드포인트
app.get('/', (_req, res) => {
  res.json({
    name: '해외 여행 공지사항 API',
    version: '1.0.0',
    description: '해외 여행 경보, 비자 정보, 긴급 연락처를 제공하는 REST API',
    endpoints: {
      'GET /': '서버 정보',
      'GET /health': '서버 상태 확인',
      'GET /api/advisory/:countryCode': '특정 국가 여행 경보 조회',
      'GET /api/advisories': '전체 여행 경보 목록 (level 쿼리로 필터링 가능)',
      'GET /api/visa/:countryCode': '비자 정보 조회 (nationality 쿼리로 국적 지정)',
      'GET /api/emergency/:countryCode': '긴급 연락처 조회'
    },
    examples: {
      '일본 여행 경보': '/api/advisory/JP',
      '2단계 이상 경보': '/api/advisories?level=2',
      '한국인 미국 비자': '/api/visa/US?nationality=KR',
      '일본 긴급연락처': '/api/emergency/JP'
    },
    warnings: {
      japan: '🚨 일본은 현재 코로나25로 인해 4단계 여행금지 상태입니다!'
    }
  });
});

// 헬스 체크 엔드포인트
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API 라우트들

/**
 * 특정 국가 여행 경보 조회
 * GET /api/advisory/:countryCode
 */
app.get('/api/advisory/:countryCode', async (req, res) => {
  try {
    const { countryCode } = req.params;

    // 국가 코드 검증
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return res.status(400).json({
        error: '잘못된 국가 코드입니다. 2자리 대문자를 사용하세요 (예: KR, JP, US)'
      });
    }

    const advisory = await travelServer.getAdvisory(countryCode);

    return res.json({
      success: true,
      data: advisory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(404).json({
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 전체 여행 경보 목록 조회
 * GET /api/advisories?level=1
 */
app.get('/api/advisories', async (req, res) => {
  try {
    const level = req.query.level ? parseInt(req.query.level as string) : undefined;

    // 레벨 검증
    if (level !== undefined && (level < 1 || level > 4)) {
      return res.status(400).json({
        error: '경보 단계는 1-4 사이의 숫자여야 합니다'
      });
    }

    const advisories = await travelServer.listAdvisories(level);

    return res.json({
      success: true,
      data: advisories,
      filter: level ? { level } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 비자 정보 조회
 * GET /api/visa/:countryCode?nationality=KR
 */
app.get('/api/visa/:countryCode', async (req, res) => {
  try {
    const { countryCode } = req.params;
    const nationality = req.query.nationality as string;

    // 국가 코드 검증
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return res.status(400).json({
        error: '잘못된 국가 코드입니다. 2자리 대문자를 사용하세요 (예: KR, JP, US)'
      });
    }

    // 국적 검증 (선택사항)
    if (nationality && !/^[A-Z]{2}$/.test(nationality)) {
      return res.status(400).json({
        error: '잘못된 국적 코드입니다. 2자리 대문자를 사용하세요 (예: KR)'
      });
    }

    const visaInfo = await travelServer.getVisaInfo(countryCode, nationality);

    return res.json({
      success: true,
      data: visaInfo,
      params: { countryCode, nationality },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(404).json({
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 긴급 연락처 조회
 * GET /api/emergency/:countryCode
 */
app.get('/api/emergency/:countryCode', async (req, res) => {
  try {
    const { countryCode } = req.params;

    // 국가 코드 검증
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return res.status(400).json({
        error: '잘못된 국가 코드입니다. 2자리 대문자를 사용하세요 (예: KR, JP, US)'
      });
    }

    const contacts = await travelServer.getEmergencyContacts(countryCode);

    return res.json({
      success: true,
      data: contacts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(404).json({
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 에러 핸들러
app.use((_req, res) => {
  res.status(404).json({
    error: '요청한 엔드포인트를 찾을 수 없습니다',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/advisory/:countryCode',
      'GET /api/advisories',
      'GET /api/visa/:countryCode',
      'GET /api/emergency/:countryCode'
    ],
    timestamp: new Date().toISOString()
  });
});

// 전역 에러 핸들러
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('서버 에러:', error);
  res.status(500).json({
    error: '내부 서버 오류가 발생했습니다',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 해외 여행 공지사항 HTTP API 서버가 포트 ${PORT}에서 시작되었습니다`);
  console.log(`📍 서버 URL: http://localhost:${PORT}`);
  console.log(`🌐 Railway URL: https://your-app.railway.app`);
  console.log(`📚 API 문서: http://localhost:${PORT}/`);
  console.log(`🩺 헬스 체크: http://localhost:${PORT}/health`);
  console.log(`🚨 일본 여행 경보: http://localhost:${PORT}/api/advisory/JP`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('서버 종료 신호를 받았습니다. 정상적으로 종료합니다...');
  process.exit(0);
});

export default app;