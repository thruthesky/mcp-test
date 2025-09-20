# Claude Desktop MCP 서버 설정 가이드

## 📋 목차
1. [Claude Desktop 설정 파일 위치](#1-claude-desktop-설정-파일-위치)
2. [MCP 서버 설정 방법](#2-mcp-서버-설정-방법)
3. [서버 실행 및 테스트](#3-서버-실행-및-테스트)
4. [사용 방법](#4-사용-방법)
5. [문제 해결](#5-문제-해결)

---

## 1. Claude Desktop 설정 파일 위치

Claude Desktop의 MCP 설정 파일은 운영체제에 따라 다른 위치에 있습니다:

### macOS (현재 시스템)
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Windows
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Linux
```
~/.config/Claude/claude_desktop_config.json
```

## 2. MCP 서버 설정 방법

### 방법 1: 직접 설정 파일 편집

1. **설정 파일 열기**
```bash
# macOS에서 설정 파일 편집
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
# 또는
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. **MCP 서버 설정 추가**

설정 파일에 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

또는 개발 모드로 실행하려면:

```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "npx",
      "args": ["tsx", "/Users/thruthesky/tmp/mcp/src/index.ts"],
      "env": {}
    }
  }
}
```

### 방법 2: 여러 MCP 서버 설정

이미 다른 MCP 서버가 설정되어 있다면:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/thruthesky/Documents"]
    },
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

## 3. 서버 실행 및 테스트

### 사전 준비

1. **프로젝트 빌드**
```bash
cd /Users/thruthesky/tmp/mcp
npm run build
```

2. **빌드 확인**
```bash
ls -la dist/index.js
# 파일이 존재하고 실행 가능한지 확인
```

### Claude Desktop 재시작

설정을 변경한 후에는 반드시 Claude Desktop을 재시작해야 합니다:

1. Claude Desktop 완전히 종료
2. Claude Desktop 다시 실행
3. 새 대화 시작

## 4. 사용 방법

### MCP 서버 연결 확인

Claude Desktop에서 새 대화를 시작한 후:

1. **서버 연결 상태 확인**
```
MCP 서버가 연결되었는지 확인해줘
```

2. **사용 가능한 도구 확인**
```
어떤 MCP 도구를 사용할 수 있는지 보여줘
```

### 도구 사용 예시

#### 1. 특정 국가 여행 경보 조회
```
일본(JP)의 여행 경보 정보를 조회해줘
```

#### 2. 전체 국가 목록 조회
```
모든 국가의 여행 경보 목록을 보여줘
```

#### 3. 비자 정보 조회
```
한국인이 미국(US)을 여행할 때 필요한 비자 정보를 알려줘
```

#### 4. 긴급 연락처 조회
```
일본(JP)의 긴급 연락처를 알려줘
```

### 실제 사용 예시

```
User: "일본 여행을 계획 중인데, 여행 경보와 비자 정보를 알려줘"

Claude: MCP 도구를 사용하여 일본 여행 정보를 조회하겠습니다.

[getAdvisory 도구 실행: countryCode="JP"]
[getVisaInfo 도구 실행: countryCode="JP", nationality="KR"]

일본 여행 정보:

📍 여행 경보: 1단계 (여행유의)
- 일반적으로 안전하나 지진 등 자연재해에 유의하세요

📝 비자 정보:
- 한국인은 무비자 입국 가능
- 관광 목적으로 90일까지 체류 가능
```

## 5. 문제 해결

### 서버가 연결되지 않을 때

1. **로그 확인**
```bash
# Claude Desktop 로그 위치 (macOS)
~/Library/Logs/Claude/
```

2. **수동으로 서버 테스트**
```bash
# 서버가 정상 실행되는지 테스트
cd /Users/thruthesky/tmp/mcp
npm run dev
```

3. **권한 문제 해결**
```bash
# 실행 권한 부여
chmod +x dist/index.js
```

### 일반적인 문제와 해결 방법

| 문제 | 원인 | 해결 방법 |
|------|------|-----------|
| "MCP 서버를 찾을 수 없음" | 설정 파일 경로 오류 | 절대 경로 사용 확인 |
| "도구 실행 실패" | 빌드되지 않은 파일 | `npm run build` 실행 |
| "한글이 깨짐" | 인코딩 문제 | UTF-8 인코딩 확인 |
| "서버 시작 실패" | Node.js 버전 | Node.js 18+ 확인 |

### 디버깅 팁

1. **개발 모드로 실행**
```json
{
  "mcpServers": {
    "travel-advisory-debug": {
      "command": "npx",
      "args": ["tsx", "/Users/thruthesky/tmp/mcp/src/index.ts"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

2. **로그 레벨 설정**
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## 📝 추가 참고사항

### package.json 스크립트
```json
{
  "scripts": {
    "build": "tsc",           // TypeScript 컴파일
    "dev": "tsx src/index.ts", // 개발 모드 실행
    "start": "node dist/index.js" // 프로덕션 실행
  }
}
```

### 프로젝트 구조
```
/Users/thruthesky/tmp/mcp/
├── src/
│   ├── index.ts          # MCP 서버 메인 파일
│   └── types/
│       └── advisory.ts    # 타입 정의
├── dist/                  # 빌드 출력 (자동 생성)
│   └── index.js          # 컴파일된 JavaScript
├── package.json
├── tsconfig.json
└── claude_desktop_config.json  # 이 파일을 복사해서 사용
```

### 환경 변수 설정 (선택사항)

실제 API를 사용할 경우:

```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {
        "WEATHER_API_KEY": "your-api-key",
        "CURRENCY_API_KEY": "your-api-key",
        "GOVERNMENT_API_KEY": "your-api-key"
      }
    }
  }
}
```

## ✅ 설정 완료 체크리스트

- [ ] 프로젝트 빌드 완료 (`npm run build`)
- [ ] Claude Desktop 설정 파일 수정
- [ ] Claude Desktop 재시작
- [ ] MCP 서버 연결 확인
- [ ] 도구 실행 테스트

---

## 문의 및 지원

- GitHub Issues: [프로젝트 저장소]
- 문서: `/Users/thruthesky/tmp/mcp/README.md`

마지막 업데이트: 2024년 1월