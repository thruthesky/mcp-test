# Claude Desktop MCP 연결 확인 가이드

## 🔍 MCP 서버 연결 상태 확인 방법

### 1. Claude Desktop UI에서 확인

#### 방법 1: 대화창 하단 확인
Claude Desktop의 대화창 하단을 확인하면 연결된 MCP 서버가 표시됩니다.

- **연결됨**: 🟢 녹색 점 또는 "Connected to MCP servers" 표시
- **연결 안됨**: 🔴 빨간 점 또는 표시 없음

#### 방법 2: 도구 아이콘 확인
- 대화 입력창 근처에 도구(Tools) 아이콘이 표시됩니다
- MCP가 연결되면 추가 도구들이 목록에 나타납니다

### 2. 직접 테스트로 확인

Claude Desktop에서 새 대화를 시작한 후 다음 명령어를 입력해보세요:

#### 테스트 1: MCP 도구 목록 확인
```
사용 가능한 MCP 도구들을 나열해줘
```

**✅ 성공적인 응답 예시:**
```
사용 가능한 MCP 도구:
- getAdvisory: 특정 국가의 여행 경보 조회
- listAdvisories: 모든 국가 목록
- getVisaInfo: 비자 정보 조회
- getEmergencyContacts: 긴급 연락처
```

**❌ 실패 응답 예시:**
```
MCP 도구에 접근할 수 없습니다.
또는
일반적인 대화 응답만 제공
```

#### 테스트 2: 실제 도구 실행
```
일본(JP)의 여행 경보 정보를 조회해줘
```

**✅ MCP 연결 성공 시:**
- Claude가 `getAdvisory` 도구를 사용한다고 명시
- 실제 데이터가 JSON 형식으로 반환됨

**❌ MCP 연결 실패 시:**
- 일반적인 지식 기반 응답만 제공
- "도구를 사용할 수 없다"는 메시지

### 3. 시스템 레벨에서 확인

#### 프로세스 확인 (터미널)
```bash
# MCP 서버 프로세스가 실행 중인지 확인
ps aux | grep "node.*mcp/dist/index.js"
```

#### Activity Monitor 확인 (macOS)
1. Activity Monitor 실행
2. "node" 프로세스 검색
3. `/Users/thruthesky/tmp/mcp/dist/index.js` 프로세스 확인

### 4. 로그 파일 확인

#### Claude Desktop 로그 위치
```bash
# macOS
~/Library/Logs/Claude/

# 로그 파일 실시간 모니터링
tail -f ~/Library/Logs/Claude/*.log
```

#### 로그에서 확인할 내용
```
✅ 성공 로그 예시:
[INFO] MCP server started: travel-advisory
[INFO] Connected to MCP server at /Users/thruthesky/tmp/mcp/dist/index.js
[INFO] Available tools: getAdvisory, listAdvisories, getVisaInfo, getEmergencyContacts

❌ 실패 로그 예시:
[ERROR] Failed to start MCP server: travel-advisory
[ERROR] Cannot find module '/Users/thruthesky/tmp/mcp/dist/index.js'
[ERROR] MCP server connection timeout
```

### 5. 설정 파일 검증

#### 현재 설정 확인
```bash
# 설정 파일 내용 확인
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | python -m json.tool
```

#### 설정 검증 체크리스트
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",  // ✅ 실행 명령
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],  // ✅ 절대 경로
      "env": {}  // ✅ 환경 변수
    }
  }
}
```

### 6. 디버그 모드로 확인

#### 디버그 모드 설정
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {
        "DEBUG": "true",
        "LOG_LEVEL": "debug"
      }
    }
  },
  "debug": true  // Claude Desktop 디버그 모드
}
```

### 7. 테스트 스크립트

다음 테스트 스크립트를 만들어 실행해보세요:

```bash
#!/bin/bash
# test_mcp.sh

echo "🔍 MCP 서버 연결 테스트 시작..."

# 1. 빌드 파일 확인
echo "1. 빌드 파일 확인:"
if [ -f "/Users/thruthesky/tmp/mcp/dist/index.js" ]; then
    echo "✅ 빌드 파일 존재"
else
    echo "❌ 빌드 파일 없음 - npm run build 실행 필요"
fi

# 2. 설정 파일 확인
echo -e "\n2. Claude 설정 파일 확인:"
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ 설정 파일 존재"
    if grep -q "travel-advisory" "$CONFIG_FILE"; then
        echo "✅ travel-advisory 서버 설정됨"
    else
        echo "❌ travel-advisory 서버 설정 없음"
    fi
else
    echo "❌ 설정 파일 없음"
fi

# 3. Node.js 버전 확인
echo -e "\n3. Node.js 버전 확인:"
node_version=$(node -v)
echo "현재 버전: $node_version"
if [[ "$node_version" > "v18" ]]; then
    echo "✅ Node.js 18+ 설치됨"
else
    echo "⚠️ Node.js 18+ 권장"
fi

# 4. 수동 서버 테스트
echo -e "\n4. 서버 수동 실행 테스트:"
echo "다음 명령어를 실행해보세요:"
echo "cd /Users/thruthesky/tmp/mcp && npm run dev"
```

## 🎯 빠른 확인 체크리스트

| 확인 항목 | 방법 | 성공 표시 |
|-----------|------|----------|
| UI 표시 | Claude Desktop 하단 | 🟢 Connected |
| 도구 목록 | "MCP 도구 나열해줘" | 도구 목록 표시 |
| 실제 실행 | "일본 여행 경보 조회해줘" | JSON 데이터 반환 |
| 프로세스 | `ps aux \| grep node` | node 프로세스 존재 |
| 로그 | `~/Library/Logs/Claude/` | 연결 성공 메시지 |

## 🚨 문제 발생 시

### 1. Claude Desktop 재시작
```bash
# 완전 종료 후 재시작
killall Claude
open -a Claude
```

### 2. 설정 재적용
```bash
cd /Users/thruthesky/tmp/mcp
./setup.sh
```

### 3. 수동 테스트
```bash
# 서버 직접 실행으로 문제 확인
cd /Users/thruthesky/tmp/mcp
npm run dev
```

## 💡 Pro Tips

1. **새 대화 시작**: MCP 변경사항은 새 대화에서만 적용됩니다
2. **캐시 문제**: 가끔 캐시 때문에 연결이 안 될 수 있으니 앱 데이터 초기화
3. **권한 문제**: macOS 보안 설정에서 Claude가 파일 접근 권한이 있는지 확인

---

마지막 업데이트: 2024년 1월