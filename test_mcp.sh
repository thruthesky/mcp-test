#!/bin/bash

# MCP 서버 연결 상태 확인 스크립트
# Claude Desktop에서 MCP가 제대로 설정되었는지 확인합니다

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Claude Desktop MCP 서버 연결 상태 확인${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 점수 계산용 변수
TOTAL_SCORE=0
MAX_SCORE=5

# 1. 빌드 파일 확인
echo -e "${YELLOW}[1/5] 빌드 파일 확인${NC}"
if [ -f "/Users/thruthesky/tmp/mcp/dist/index.js" ]; then
    echo -e "  ${GREEN}✅ 빌드 파일 존재${NC}"
    echo -e "  📍 경로: /Users/thruthesky/tmp/mcp/dist/index.js"
    TOTAL_SCORE=$((TOTAL_SCORE + 1))
else
    echo -e "  ${RED}❌ 빌드 파일 없음${NC}"
    echo -e "  ${YELLOW}💡 해결방법: cd /Users/thruthesky/tmp/mcp && npm run build${NC}"
fi
echo ""

# 2. Claude 설정 파일 확인
echo -e "${YELLOW}[2/5] Claude 설정 파일 확인${NC}"
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "  ${GREEN}✅ 설정 파일 존재${NC}"
    TOTAL_SCORE=$((TOTAL_SCORE + 1))

    # travel-advisory 설정 확인
    if grep -q "travel-advisory" "$CONFIG_FILE" 2>/dev/null; then
        echo -e "  ${GREEN}✅ travel-advisory 서버 설정됨${NC}"
        TOTAL_SCORE=$((TOTAL_SCORE + 1))

        # 설정 내용 일부 표시
        echo -e "  📋 설정 내용:"
        grep -A 3 "travel-advisory" "$CONFIG_FILE" | head -5 | sed 's/^/    /'
    else
        echo -e "  ${RED}❌ travel-advisory 서버 설정 없음${NC}"
        echo -e "  ${YELLOW}💡 해결방법: ./setup.sh 실행${NC}"
    fi
else
    echo -e "  ${RED}❌ 설정 파일 없음${NC}"
    echo -e "  ${YELLOW}💡 해결방법: Claude Desktop 설치 확인 또는 ./setup.sh 실행${NC}"
fi
echo ""

# 3. Node.js 버전 확인
echo -e "${YELLOW}[3/5] Node.js 환경 확인${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')

    echo -e "  📦 Node.js 버전: ${NODE_VERSION}"

    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "  ${GREEN}✅ Node.js 18+ 설치됨${NC}"
        TOTAL_SCORE=$((TOTAL_SCORE + 1))
    else
        echo -e "  ${YELLOW}⚠️  Node.js 18+ 권장 (현재: $NODE_VERSION)${NC}"
    fi
else
    echo -e "  ${RED}❌ Node.js 설치되지 않음${NC}"
    echo -e "  ${YELLOW}💡 해결방법: Node.js 18+ 설치 필요${NC}"
fi
echo ""

# 4. MCP 서버 프로세스 확인
echo -e "${YELLOW}[4/5] MCP 서버 프로세스 확인${NC}"
if ps aux | grep -v grep | grep "node.*mcp/dist/index.js" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ MCP 서버 프로세스 실행 중${NC}"
    PROCESS_INFO=$(ps aux | grep -v grep | grep "node.*mcp/dist/index.js" | head -1)
    PID=$(echo $PROCESS_INFO | awk '{print $2}')
    echo -e "  🔧 PID: $PID"
    TOTAL_SCORE=$((TOTAL_SCORE + 1))
else
    echo -e "  ${YELLOW}⚠️  MCP 서버 프로세스 없음${NC}"
    echo -e "  ℹ️  Claude Desktop이 실행 중이면 자동으로 시작됩니다"
fi
echo ""

# 5. 수동 실행 테스트
echo -e "${YELLOW}[5/5] 서버 수동 실행 테스트${NC}"
echo -e "  테스트 명령어:"
echo -e "  ${BLUE}cd /Users/thruthesky/tmp/mcp && npm run dev${NC}"
echo -e "  ℹ️  위 명령어를 직접 실행하여 서버 동작을 확인할 수 있습니다"
echo ""

# 최종 결과
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 최종 점검 결과${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 점수에 따른 상태 표시
if [ $TOTAL_SCORE -eq $MAX_SCORE ]; then
    echo -e "${GREEN}🎉 완벽! 모든 설정이 정상입니다. ($TOTAL_SCORE/$MAX_SCORE)${NC}"
    echo ""
    echo -e "${GREEN}✅ Claude Desktop을 재시작하면 MCP 서버를 사용할 수 있습니다.${NC}"
elif [ $TOTAL_SCORE -ge 3 ]; then
    echo -e "${YELLOW}⚠️  일부 설정 확인 필요 ($TOTAL_SCORE/$MAX_SCORE)${NC}"
    echo ""
    echo -e "${YELLOW}위의 경고 사항을 확인하고 해결해주세요.${NC}"
else
    echo -e "${RED}❌ 설정 필요 ($TOTAL_SCORE/$MAX_SCORE)${NC}"
    echo ""
    echo -e "${RED}./setup.sh 스크립트를 실행하여 자동 설정을 진행하세요.${NC}"
fi

echo ""
echo -e "${BLUE}📝 다음 단계:${NC}"
echo "1. Claude Desktop 완전 종료 (Cmd+Q)"
echo "2. Claude Desktop 재실행"
echo "3. 새 대화에서 테스트: '일본의 여행 경보 정보를 알려줘'"
echo ""
echo -e "${BLUE}🔗 자세한 내용: MCP_VERIFICATION_GUIDE.md 참조${NC}"