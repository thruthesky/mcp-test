#!/bin/bash

# 해외 여행 공지사항 MCP 서버 설정 스크립트
# 이 스크립트는 Claude Desktop에 MCP 서버를 자동으로 설정합니다

echo "🚀 해외 여행 공지사항 MCP 서버 설정 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 프로젝트 경로
PROJECT_PATH="/Users/thruthesky/tmp/mcp"
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

# 1. 프로젝트 빌드
echo ""
echo "📦 프로젝트 빌드 중..."
cd "$PROJECT_PATH"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 빌드 실패! npm install을 먼저 실행해주세요.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 빌드 완료${NC}"

# 2. Claude 설정 디렉토리 생성
echo ""
echo "📁 설정 디렉토리 확인..."
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Claude 설정 디렉토리 생성 중..."
    mkdir -p "$CONFIG_DIR"
fi

# 3. 기존 설정 파일 백업
if [ -f "$CONFIG_FILE" ]; then
    echo ""
    echo "💾 기존 설정 파일 백업..."
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d%H%M%S)"
    echo -e "${GREEN}✅ 백업 완료${NC}"
fi

# 4. 새 설정 파일 생성 또는 업데이트
echo ""
echo "⚙️  MCP 서버 설정 추가..."

# Python을 사용하여 JSON 병합 (기존 설정 보존)
python3 << EOF
import json
import os

config_file = "$CONFIG_FILE"
new_server = {
    "travel-advisory": {
        "command": "node",
        "args": ["$PROJECT_PATH/dist/index.js"],
        "env": {}
    }
}

# 기존 설정 읽기
if os.path.exists(config_file):
    with open(config_file, 'r') as f:
        config = json.load(f)
else:
    config = {}

# mcpServers가 없으면 생성
if 'mcpServers' not in config:
    config['mcpServers'] = {}

# 새 서버 추가
config['mcpServers']['travel-advisory'] = new_server['travel-advisory']

# 설정 저장
with open(config_file, 'w') as f:
    json.dump(config, f, indent=2)

print("설정 파일 업데이트 완료")
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ MCP 서버 설정 완료${NC}"
else
    echo -e "${RED}❌ 설정 파일 업데이트 실패${NC}"
    exit 1
fi

# 5. 설정 확인
echo ""
echo "📋 현재 설정 내용:"
echo "-------------------"
cat "$CONFIG_FILE"
echo "-------------------"

# 6. 완료 메시지
echo ""
echo -e "${GREEN}🎉 설정이 완료되었습니다!${NC}"
echo ""
echo "다음 단계:"
echo "1. Claude Desktop을 완전히 종료하세요"
echo "2. Claude Desktop을 다시 실행하세요"
echo "3. 새 대화에서 다음과 같이 테스트해보세요:"
echo ""
echo -e "${YELLOW}예시 명령어:${NC}"
echo "  - '일본의 여행 경보 정보를 알려줘'"
echo "  - '모든 국가의 여행 경보 목록을 보여줘'"
echo "  - '한국인이 미국 여행할 때 비자가 필요해?'"
echo "  - '일본의 긴급 연락처를 알려줘'"
echo ""
echo "문제가 발생하면 SETUP_GUIDE.md를 참조하세요."