# Railway 배포용 Dockerfile
# Node.js 18+ 기반 해외 여행 공지사항 API 서버

FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 모든 의존성 설치 (빌드용 devDependencies 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 불필요한 dev dependencies 제거 (빌드 완료 후)
RUN npm prune --production

# 포트 설정 (Railway가 동적으로 할당)
EXPOSE $PORT

# 사용자 권한 설정 (보안)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:$PORT/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 서버 시작 (Railway용 HTTP 서버)
CMD ["npm", "start"]