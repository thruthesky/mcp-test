# 해외 여행 공지사항 API 사용 가이드

## 🌟 개요

해외 여행 공지사항 API는 전 세계 여행자들에게 실시간 여행 경보, 비자 정보, 긴급 연락처 등 필수 여행 정보를 제공합니다.

**🚀 Live API URL**: `https://mcp-test-production-5d0b.up.railway.app`

**⚠️ 중요**: 현재 일본은 코로나25로 인해 **4단계 여행금지** 상태입니다!

---

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [Claude Desktop 연동](#claude-desktop-연동)
3. [웹 브라우저에서 사용](#웹-브라우저에서-사용)
4. [프로그래밍 언어별 사용법](#프로그래밍-언어별-사용법)
5. [다른 AI 챗봇과 연동](#다른-ai-챗봇과-연동)
6. [GitHub Copilot 활용](#github-copilot-활용)
7. [실제 활용 사례](#실제-활용-사례)
8. [API 레퍼런스](#api-레퍼런스)

---

## 🚀 빠른 시작

### 1분 만에 테스트하기

```bash
# 서버 상태 확인
curl https://mcp-test-production-5d0b.up.railway.app/health

# 일본 여행 경보 조회 (코로나25 4단계!)
curl https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

# 전체 여행 경보 목록
curl https://mcp-test-production-5d0b.up.railway.app/api/advisories
```

### 웹 브라우저로 바로 확인
다음 링크를 클릭하여 바로 확인하세요:
- [🏠 API 기본 정보](https://mcp-test-production-5d0b.up.railway.app/)
- [💚 서버 상태](https://mcp-test-production-5d0b.up.railway.app/health)
- [🇯🇵 일본 여행 경보](https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP)

---

## 🎯 Claude Desktop 연동

### MCP 서버로 연동하기 (로컬 실행)

#### 1. 사전 준비사항 체크리스트
- [ ] Node.js 18+ 설치 확인: `node --version`
- [ ] 프로젝트 클론: `git clone https://github.com/thruthesky/mcp-test`
- [ ] 의존성 설치: `cd mcp-test && npm install`
- [ ] TypeScript 빌드: `npm run build`

#### 2. Claude Desktop 설정 파일 찾기

##### macOS에서 설정 파일 생성/수정
```bash
# 설정 디렉토리 생성 (처음 설치 시)
mkdir -p ~/Library/Application\ Support/Claude

# 설정 파일 편집
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

##### Windows에서 설정 파일 생성/수정
```powershell
# PowerShell에서 실행
# 설정 디렉토리 생성
New-Item -ItemType Directory -Force -Path "$env:APPDATA\Claude"

# 설정 파일 편집
notepad "$env:APPDATA\Claude\claude_desktop_config.json"
```

##### Linux에서 설정 파일 생성/수정
```bash
# 설정 디렉토리 생성
mkdir -p ~/.config/Claude

# 설정 파일 편집
nano ~/.config/Claude/claude_desktop_config.json
```

#### 3. MCP 서버 설정 상세 구성

##### 기본 설정 (최소 구성)
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"]
    }
  }
}
```

##### 고급 설정 (전체 옵션)
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "/usr/local/bin/node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "info",
        "CACHE_TTL": "3600"
      },
      "cwd": "/Users/thruthesky/tmp/mcp",
      "timeout": 30000
    },
    "travel-advisory-remote": {
      "description": "원격 API 서버 직접 호출용",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-proxy",
              "https://mcp-test-production-5d0b.up.railway.app"]
    }
  },
  "debugMode": true,
  "autoReload": true
}
```

#### 4. Node.js 경로 확인 및 설정

```bash
# Node.js 설치 위치 확인
which node
# 출력 예: /usr/local/bin/node

# npm 전역 모듈 위치 확인
npm root -g
# 출력 예: /usr/local/lib/node_modules

# 프로젝트 빌드 파일 위치 확인
ls -la /Users/thruthesky/tmp/mcp/dist/index.js
```

#### 5. Claude Desktop 재시작 및 확인

##### macOS
```bash
# Claude Desktop 완전 종료
pkill -f Claude

# 다시 시작
open -a Claude
```

##### Windows
```powershell
# Claude Desktop 종료
Stop-Process -Name "Claude" -Force

# 다시 시작
Start-Process "Claude"
```

#### 6. MCP 서버 연결 상태 확인

Claude Desktop을 시작한 후, 다음을 확인:

1. **설정 아이콘** → **Developer** → **MCP Servers** 확인
2. "travel-advisory" 서버가 "Connected" 상태인지 확인
3. 연결 실패 시 로그 확인:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%LOCALAPPDATA%\Claude\logs\`

#### 7. MCP 명령어 사용법

##### 기본 명령어
```
@travel-advisory get_advisory JP
→ 일본 여행 경보를 MCP 프로토콜로 직접 조회

@travel-advisory list_advisories
→ 전체 국가 경보 목록 조회

@travel-advisory get_visa_info US KR
→ 한국인의 미국 비자 정보 조회
```

##### 자연어 질문
```
일본 여행 경보 상황을 @travel-advisory 서버에서 확인해주세요

@travel-advisory를 사용해서 현재 4단계 경보 국가들을 알려주세요

@travel-advisory로 한국인이 미국 갈 때 필요한 비자 정보를 조회해주세요
```

### HTTP API 직접 호출 방식

#### 1. 간단한 프롬프트 예시

```
다음 API를 호출해서 정보를 가져와주세요:

1. 일본 여행 경보:
   GET https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

2. 전체 경보 목록:
   GET https://mcp-test-production-5d0b.up.railway.app/api/advisories

3. 4단계 경보 국가들:
   GET https://mcp-test-production-5d0b.up.railway.app/api/advisories?level=4

응답을 분석해서 안전한 여행지와 위험한 여행지를 구분해주세요.
```

#### 2. 복잡한 분석 요청

```
다음 작업을 수행해주세요:

1. API 호출:
   - https://mcp-test-production-5d0b.up.railway.app/api/advisories

2. 데이터 분석:
   - 경보 단계별 국가 수 집계
   - 가장 위험한 국가 TOP 5
   - 가장 안전한 국가 TOP 5

3. 여행 추천:
   - 현재 시점 추천 여행지
   - 피해야 할 여행지
   - 주의가 필요한 여행지

4. 시각화:
   - 경보 단계별 파이 차트 생성 (텍스트로)
   - 국가별 위험도 매트릭스 작성
```

#### 3. 실시간 모니터링 프롬프트

```
10초 간격으로 다음 API를 3번 호출해서 서버 상태를 모니터링해주세요:
https://mcp-test-production-5d0b.up.railway.app/health

각 응답의 uptime 값을 비교해서 서버가 안정적으로 동작하는지 확인해주세요.
```

### 트러블슈팅 가이드

#### 일반적인 오류와 해결법

##### 1. "Could not attach to MCP server" 오류
```json
// 해결법: 절대 경로 사용
{
  "mcpServers": {
    "travel-advisory": {
      "command": "/usr/local/bin/node",  // 절대 경로
      "args": ["/절대/경로/mcp/dist/index.js"]  // 절대 경로
    }
  }
}
```

##### 2. "ENOENT: no such file or directory" 오류
```bash
# 파일 존재 확인
ls -la /Users/thruthesky/tmp/mcp/dist/index.js

# 빌드 다시 실행
cd /Users/thruthesky/tmp/mcp
npm run build
```

##### 3. "Permission denied" 오류
```bash
# 실행 권한 부여
chmod +x /Users/thruthesky/tmp/mcp/dist/index.js
```

##### 4. 연결은 되지만 명령어가 작동하지 않을 때
```bash
# MCP 서버 직접 테스트
node /Users/thruthesky/tmp/mcp/dist/index.js

# 로그 확인
tail -f ~/Library/Logs/Claude/*.log
```

---

## 🌐 웹 브라우저에서 사용

### 즉시 테스트 가능한 링크들

#### 📌 북마크 추가 권장 링크
| 기능 | URL | 설명 |
|------|-----|------|
| 🏠 **API 홈** | [https://mcp-test-production-5d0b.up.railway.app/](https://mcp-test-production-5d0b.up.railway.app/) | API 전체 정보 및 엔드포인트 목록 |
| 💚 **서버 상태** | [https://mcp-test-production-5d0b.up.railway.app/health](https://mcp-test-production-5d0b.up.railway.app/health) | 실시간 서버 상태 확인 |
| 🌏 **전체 경보** | [https://mcp-test-production-5d0b.up.railway.app/api/advisories](https://mcp-test-production-5d0b.up.railway.app/api/advisories) | 모든 국가 여행 경보 현황 |
| ⚠️ **위험 국가** | [https://mcp-test-production-5d0b.up.railway.app/api/advisories?level=4](https://mcp-test-production-5d0b.up.railway.app/api/advisories?level=4) | 4단계 여행금지 국가들 |

#### 국가별 직접 링크
```
🇯🇵 일본: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
🇺🇸 미국: https://mcp-test-production-5d0b.up.railway.app/api/advisory/US
🇨🇳 중국: https://mcp-test-production-5d0b.up.railway.app/api/advisory/CN
🇬🇧 영국: https://mcp-test-production-5d0b.up.railway.app/api/advisory/GB
🇫🇷 프랑스: https://mcp-test-production-5d0b.up.railway.app/api/advisory/FR
🇩🇪 독일: https://mcp-test-production-5d0b.up.railway.app/api/advisory/DE
🇹🇭 태국: https://mcp-test-production-5d0b.up.railway.app/api/advisory/TH
🇻🇳 베트남: https://mcp-test-production-5d0b.up.railway.app/api/advisory/VN
```

### JSON 뷰어 확장 프로그램 설치 가이드

#### Chrome/Edge 확장 프로그램
1. **JSON Formatter** (추천 ⭐⭐⭐⭐⭐)
   - [Chrome 웹스토어 설치](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa)
   - 특징: 트리뷰, 원시 데이터 토글, 다크모드 지원

2. **JSON Viewer Pro**
   - 특징: 검색 기능, CSV/Excel 내보내기 지원

3. **JSONVue**
   - 특징: Vue.js 스타일 인터페이스, 실시간 편집

#### Firefox 확장 프로그램
1. **JSONView**
   - [Firefox 애드온 설치](https://addons.mozilla.org/en-US/firefox/addon/jsonview/)
   - 특징: 내장형 뷰어, 테마 지원

#### Safari 확장 프로그램
1. **JSON Peep for Safari**
   - App Store에서 설치
   - 특징: 네이티브 macOS 디자인

### 브라우저 개발자 도구 활용법

#### 1. Chrome DevTools Console에서 API 테스트

##### 기본 API 호출
```javascript
// 일본 여행 경보 조회
const response = await fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP');
const data = await response.json();
console.table(data.data);
```

##### 여러 국가 동시 조회
```javascript
// 여러 국가 동시 조회
const countries = ['JP', 'US', 'CN', 'TH', 'VN'];
const results = await Promise.all(
  countries.map(async (code) => {
    const res = await fetch(`https://mcp-test-production-5d0b.up.railway.app/api/advisory/${code}`);
    const data = await res.json();
    return {
      country: data.data.countryName,
      level: data.data.alertLevel.level,
      levelName: data.data.alertLevel.levelName,
      summary: data.data.summary
    };
  })
);
console.table(results);
```

##### 실시간 모니터링 스크립트
```javascript
// 5초마다 서버 상태 체크
setInterval(async () => {
  const response = await fetch('https://mcp-test-production-5d0b.up.railway.app/health');
  const health = await response.json();
  console.log(`[${new Date().toLocaleTimeString()}] Server Status:`, health.status, `Uptime: ${Math.floor(health.uptime)}s`);
}, 5000);
```

#### 2. Network 탭에서 API 분석

1. **DevTools 열기**: F12 또는 Cmd+Option+I (Mac)
2. **Network 탭** 선택
3. API URL 방문
4. 요청 클릭하여 상세 정보 확인:
   - **Headers**: 요청/응답 헤더
   - **Preview**: JSON 트리뷰
   - **Response**: 원시 응답
   - **Timing**: 응답 시간 분석

#### 3. Postman 대체 - 브라우저에서 바로 테스트

##### Fetch API Snippet Generator
```javascript
// 브라우저 콘솔에 붙여넣고 실행
function generateFetchCode(country) {
  const code = `
fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisory/${country}')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
`;
  console.log(code);
  return code;
}

// 사용법
generateFetchCode('JP');  // 일본 조회 코드 생성
```

### HTML 대시보드 만들기

#### 실시간 여행 경보 대시보드
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>실시간 여행 경보 대시보드</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 0.5rem; }
        .countries { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .country-card { background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .country-card:hover { transform: translateY(-5px); }
        .level-1 { border-left: 5px solid #28a745; }
        .level-2 { border-left: 5px solid #ffc107; }
        .level-3 { border-left: 5px solid #fd7e14; }
        .level-4 { border-left: 5px solid #dc3545; }
        .country-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .country-name { font-size: 1.25rem; font-weight: bold; }
        .level-badge { padding: 0.25rem 0.75rem; border-radius: 20px; color: white; font-size: 0.875rem; }
        .level-1 .level-badge { background: #28a745; }
        .level-2 .level-badge { background: #ffc107; }
        .level-3 .level-badge { background: #fd7e14; }
        .level-4 .level-badge { background: #dc3545; }
        .loading { text-align: center; padding: 2rem; }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .filter-buttons { margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.5rem 1.5rem; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 25px; cursor: pointer; transition: all 0.3s; }
        .filter-btn:hover, .filter-btn.active { background: #667eea; color: white; }
        .search-box { margin-bottom: 2rem; }
        .search-input { width: 100%; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem; }
        .last-update { text-align: center; color: #666; margin-top: 2rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 실시간 여행 경보 대시보드</h1>
        <p>전 세계 여행 안전 정보를 한눈에</p>
    </div>

    <div class="container">
        <div class="stats" id="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-countries">-</div>
                <div class="stat-label">전체 국가</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="level-1-count">-</div>
                <div class="stat-label">1단계 (여행유의)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="level-2-count">-</div>
                <div class="stat-label">2단계 (여행자제)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="level-3-count">-</div>
                <div class="stat-label">3단계 (출국권고)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="level-4-count">-</div>
                <div class="stat-label">4단계 (여행금지)</div>
            </div>
        </div>

        <div class="search-box">
            <input type="text" class="search-input" id="search" placeholder="국가명으로 검색... (예: 일본, Japan, JP)">
        </div>

        <div class="filter-buttons">
            <button class="filter-btn active" data-level="all">전체 보기</button>
            <button class="filter-btn" data-level="1">1단계</button>
            <button class="filter-btn" data-level="2">2단계</button>
            <button class="filter-btn" data-level="3">3단계</button>
            <button class="filter-btn" data-level="4">4단계 ⚠️</button>
        </div>

        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>데이터 로딩 중...</p>
        </div>

        <div class="countries" id="countries"></div>

        <div class="last-update" id="last-update"></div>
    </div>

    <script>
        const API_BASE = 'https://mcp-test-production-5d0b.up.railway.app';
        let allCountries = [];
        let filteredCountries = [];

        async function loadData() {
            try {
                const response = await fetch(`${API_BASE}/api/advisories`);
                const data = await response.json();
                allCountries = data.data || [];
                filteredCountries = allCountries;

                updateStats();
                displayCountries();
                setupFilters();
                setupSearch();

                document.getElementById('loading').style.display = 'none';
                document.getElementById('last-update').textContent =
                    `마지막 업데이트: ${new Date().toLocaleString('ko-KR')}`;
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                document.getElementById('loading').innerHTML =
                    '<p style="color: red;">데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>';
            }
        }

        function updateStats() {
            const stats = {
                total: allCountries.length,
                level1: allCountries.filter(c => c.alertLevel.level === 1).length,
                level2: allCountries.filter(c => c.alertLevel.level === 2).length,
                level3: allCountries.filter(c => c.alertLevel.level === 3).length,
                level4: allCountries.filter(c => c.alertLevel.level === 4).length
            };

            document.getElementById('total-countries').textContent = stats.total;
            document.getElementById('level-1-count').textContent = stats.level1;
            document.getElementById('level-2-count').textContent = stats.level2;
            document.getElementById('level-3-count').textContent = stats.level3;
            document.getElementById('level-4-count').textContent = stats.level4;
        }

        function displayCountries() {
            const container = document.getElementById('countries');
            container.innerHTML = '';

            filteredCountries.forEach(country => {
                const card = document.createElement('div');
                card.className = `country-card level-${country.alertLevel.level}`;
                card.innerHTML = `
                    <div class="country-header">
                        <div class="country-name">${country.countryName}</div>
                        <div class="level-badge">${country.alertLevel.levelName}</div>
                    </div>
                    <p>${country.summary}</p>
                    <div style="margin-top: 1rem; color: #666; font-size: 0.875rem;">
                        국가 코드: ${country.countryCode}
                    </div>
                `;
                card.addEventListener('click', () => {
                    window.open(`${API_BASE}/api/advisory/${country.countryCode}`, '_blank');
                });
                container.appendChild(card);
            });
        }

        function setupFilters() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');

                    const level = e.target.dataset.level;
                    if (level === 'all') {
                        filteredCountries = allCountries;
                    } else {
                        filteredCountries = allCountries.filter(c => c.alertLevel.level === parseInt(level));
                    }
                    displayCountries();
                });
            });
        }

        function setupSearch() {
            document.getElementById('search').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                filteredCountries = allCountries.filter(c =>
                    c.countryName.toLowerCase().includes(query) ||
                    c.countryNameEn.toLowerCase().includes(query) ||
                    c.countryCode.toLowerCase().includes(query)
                );
                displayCountries();
            });
        }

        // 30초마다 자동 새로고침
        setInterval(loadData, 30000);

        // 초기 로드
        loadData();
    </script>
</body>
</html>
```

### 브라우저 북마클릿 활용

#### 즉시 실행 가능한 북마클릿
```javascript
// 북마크바에 드래그하여 추가
javascript:(function(){fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP').then(r=>r.json()).then(d=>alert(`일본 여행 경보: ${d.data.alertLevel.level}단계 - ${d.data.summary}`))})();
```

#### 여행 경보 빠른 확인 북마클릿
```javascript
javascript:(function(){
    const country = prompt('국가 코드 입력 (예: JP, US, CN):', 'JP');
    if(country) {
        fetch(`https://mcp-test-production-5d0b.up.railway.app/api/advisory/${country.toUpperCase()}`)
        .then(r => r.json())
        .then(d => {
            if(d.success) {
                alert(`${d.data.countryName} (${d.data.countryCode})\n` +
                      `경보 단계: ${d.data.alertLevel.level} - ${d.data.alertLevel.levelName}\n` +
                      `요약: ${d.data.summary}`);
            } else {
                alert('국가 정보를 찾을 수 없습니다.');
            }
        })
        .catch(e => alert('오류 발생: ' + e.message));
    }
})();

---

## 💻 프로그래밍 언어별 사용법

### JavaScript/Node.js

#### fetch API 사용
```javascript
async function getTravelAdvisory(countryCode) {
  try {
    const response = await fetch(
      `https://mcp-test-production-5d0b.up.railway.app/api/advisory/${countryCode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('여행 경보 조회 실패:', error);
    return null;
  }
}

// 사용 예시
getTravelAdvisory('JP').then(advisory => {
  if (advisory) {
    console.log(`${advisory.countryName}: ${advisory.summary}`);
    console.log(`경보 단계: ${advisory.alertLevel.level} (${advisory.alertLevel.levelName})`);
  }
});
```

#### axios 사용
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://mcp-test-production-5d0b.up.railway.app',
  timeout: 10000,
});

// 여행 경보 조회
async function getAdvisory(countryCode) {
  const response = await api.get(`/api/advisory/${countryCode}`);
  return response.data.data;
}

// 전체 경보 목록
async function getAllAdvisories() {
  const response = await api.get('/api/advisories');
  return response.data.data;
}

// 특정 단계 경보만 조회
async function getAdvisoriesByLevel(level) {
  const response = await api.get(`/api/advisories?level=${level}`);
  return response.data.data;
}
```

### Python

#### requests 라이브러리 사용
```python
import requests
import json

class TravelAdvisoryAPI:
    def __init__(self):
        self.base_url = "https://mcp-test-production-5d0b.up.railway.app"
        self.session = requests.Session()
        self.session.timeout = 10

    def get_advisory(self, country_code):
        """특정 국가 여행 경보 조회"""
        try:
            response = self.session.get(f"{self.base_url}/api/advisory/{country_code}")
            response.raise_for_status()
            return response.json()['data']
        except requests.RequestException as e:
            print(f"API 호출 실패: {e}")
            return None

    def get_all_advisories(self, level=None):
        """전체 여행 경보 목록 조회"""
        url = f"{self.base_url}/api/advisories"
        if level:
            url += f"?level={level}"

        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()['data']
        except requests.RequestException as e:
            print(f"API 호출 실패: {e}")
            return None

    def get_visa_info(self, country_code, nationality='KR'):
        """비자 정보 조회"""
        try:
            response = self.session.get(
                f"{self.base_url}/api/visa/{country_code}?nationality={nationality}"
            )
            response.raise_for_status()
            return response.json()['data']
        except requests.RequestException as e:
            print(f"API 호출 실패: {e}")
            return None

# 사용 예시
api = TravelAdvisoryAPI()

# 일본 여행 경보 조회
jp_advisory = api.get_advisory('JP')
if jp_advisory:
    print(f"국가: {jp_advisory['countryName']}")
    print(f"경보 단계: {jp_advisory['alertLevel']['level']}단계")
    print(f"요약: {jp_advisory['summary']}")

# 4단계 경보 국가들 조회
level_4_countries = api.get_all_advisories(level=4)
if level_4_countries:
    print("\\n4단계 여행금지 국가들:")
    for country in level_4_countries:
        print(f"- {country['countryName']} ({country['countryCode']})")
```

### PHP

```php
<?php
class TravelAdvisoryAPI {
    private $baseUrl;
    private $timeout;

    public function __construct() {
        $this->baseUrl = 'https://mcp-test-production-5d0b.up.railway.app';
        $this->timeout = 10;
    }

    public function getAdvisory($countryCode) {
        $url = $this->baseUrl . "/api/advisory/" . $countryCode;
        $response = $this->makeRequest($url);

        return $response ? $response['data'] : null;
    }

    public function getAllAdvisories($level = null) {
        $url = $this->baseUrl . "/api/advisories";
        if ($level) {
            $url .= "?level=" . $level;
        }

        $response = $this->makeRequest($url);
        return $response ? $response['data'] : null;
    }

    private function makeRequest($url) {
        $context = stream_context_create([
            'http' => [
                'timeout' => $this->timeout,
                'method' => 'GET',
                'header' => 'Content-Type: application/json\\r\\n'
            ]
        ]);

        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            return null;
        }

        return json_decode($response, true);
    }
}

// 사용 예시
$api = new TravelAdvisoryAPI();

// 일본 여행 경보 조회
$jpAdvisory = $api->getAdvisory('JP');
if ($jpAdvisory) {
    echo "국가: " . $jpAdvisory['countryName'] . "\\n";
    echo "경보 단계: " . $jpAdvisory['alertLevel']['level'] . "단계\\n";
    echo "요약: " . $jpAdvisory['summary'] . "\\n";
}
?>
```

### cURL 명령어

```bash
#!/bin/bash

# 환경 변수 설정
API_BASE="https://mcp-test-production-5d0b.up.railway.app"

# 함수 정의
get_advisory() {
    local country_code=$1
    curl -s "$API_BASE/api/advisory/$country_code" | jq '.'
}

get_all_advisories() {
    local level=$1
    if [ -n "$level" ]; then
        curl -s "$API_BASE/api/advisories?level=$level" | jq '.'
    else
        curl -s "$API_BASE/api/advisories" | jq '.'
    fi
}

get_visa_info() {
    local country_code=$1
    local nationality=${2:-"KR"}
    curl -s "$API_BASE/api/visa/$country_code?nationality=$nationality" | jq '.'
}

# 사용 예시
echo "=== 일본 여행 경보 ==="
get_advisory "JP"

echo -e "\\n=== 4단계 경보 국가들 ==="
get_all_advisories "4"

echo -e "\\n=== 한국인 미국 비자 정보 ==="
get_visa_info "US" "KR"
```

---

## 🤖 다른 AI 챗봇과 연동

### ChatGPT에서 활용하기

#### 1. Custom GPT 생성 (GPT-4 Plus 필요)

##### Step 1: GPT 빌더 접속
1. [ChatGPT](https://chat.openai.com) 로그인
2. 왼쪽 사이드바 → **Explore** → **Create a GPT**
3. **Configure** 탭 선택

##### Step 2: 기본 설정
```yaml
Name: Travel Advisory Assistant
Description: 실시간 해외 여행 경보 및 안전 정보 제공
Instructions: |
  You are a travel safety assistant that provides real-time travel advisories.
  Use the Travel Advisory API to get current information about countries.
  Always check for COVID-25 alerts, especially for Japan (currently Level 4).
  Provide information in Korean when requested.
```

##### Step 3: Actions 설정
```yaml
openapi: 3.0.0
info:
  title: Travel Advisory API
  description: Real-time travel advisory information
  version: 1.0.0
servers:
  - url: https://mcp-test-production-5d0b.up.railway.app
paths:
  /health:
    get:
      operationId: checkHealth
      summary: Check API health status
      responses:
        '200':
          description: Server health status
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  uptime:
                    type: number
  /api/advisory/{countryCode}:
    get:
      operationId: getAdvisory
      summary: Get travel advisory for a specific country
      parameters:
        - name: countryCode
          in: path
          required: true
          description: ISO 3166-1 alpha-2 country code
          schema:
            type: string
            pattern: '^[A-Z]{2}$'
            example: "JP"
      responses:
        '200':
          description: Travel advisory details
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
        '404':
          description: Country not found
  /api/advisories:
    get:
      operationId: listAdvisories
      summary: Get all travel advisories
      parameters:
        - name: level
          in: query
          required: false
          description: Filter by alert level (1-4)
          schema:
            type: integer
            minimum: 1
            maximum: 4
      responses:
        '200':
          description: List of all advisories
  /api/visa/{countryCode}:
    get:
      operationId: getVisaInfo
      summary: Get visa requirements
      parameters:
        - name: countryCode
          in: path
          required: true
          schema:
            type: string
        - name: nationality
          in: query
          schema:
            type: string
            default: "KR"
      responses:
        '200':
          description: Visa information
  /api/emergency/{countryCode}:
    get:
      operationId: getEmergencyContacts
      summary: Get emergency contacts
      parameters:
        - name: countryCode
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Emergency contact information
```

##### Step 4: 테스트 프롬프트
```
1. "일본 여행 경보 상황을 확인해주세요"
2. "현재 4단계 경보 국가들을 알려주세요"
3. "한국인이 미국 여행 시 필요한 비자 정보"
4. "태국 긴급 연락처 정보"
```

#### 2. 일반 ChatGPT에서 직접 사용

##### 간단한 조회
```
다음 API를 호출해서 정보를 가져와주세요:

일본 여행 경보:
curl https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

응답을 분석해서 다음을 알려주세요:
1. 현재 경보 단계
2. 주요 위험 요소
3. 여행 가능 여부
```

##### 복잡한 분석 요청
```
여행 계획 도우미로서 다음 작업을 수행해주세요:

1. API 호출:
   - 전체 경보: https://mcp-test-production-5d0b.up.railway.app/api/advisories
   - 일본 상세: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
   - 미국 비자: https://mcp-test-production-5d0b.up.railway.app/api/visa/US?nationality=KR

2. 분석 및 추천:
   - 현재 가장 안전한 여행지 TOP 3
   - 절대 피해야 할 국가들
   - 비자 없이 갈 수 있는 안전한 국가

3. 여행 일정 제안:
   - 2주 동남아 여행 루트
   - 예상 비용 및 준비사항
```

### Microsoft Copilot에서 활용하기

#### 1. Edge 브라우저 Copilot

##### 웹페이지 분석 모드
```
이 페이지를 분석해주세요:
https://mcp-test-production-5d0b.up.railway.app/api/advisories

분석 결과를 바탕으로:
1. 경보 단계별 통계 작성
2. 가장 위험한 지역 식별
3. 안전한 여행 추천지 5곳
```

##### 비교 분석
```
다음 두 API의 데이터를 비교 분석해주세요:

A. 일본: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
B. 태국: https://mcp-test-production-5d0b.up.railway.app/api/advisory/TH

어느 나라가 더 안전한지, 그 이유는 무엇인지 설명해주세요.
```

#### 2. Windows Copilot

```powershell
# PowerShell 스크립트 생성 요청
"여행 경보 API를 활용한 PowerShell 스크립트를 작성해주세요:
1. https://mcp-test-production-5d0b.up.railway.app/api/advisories 호출
2. 4단계 경보 국가만 필터링
3. 결과를 CSV 파일로 저장
4. 데스크톱 알림 표시"
```

### Google Bard (Gemini)에서 활용하기

#### 1. 데이터 시각화 요청

```
다음 API에서 데이터를 가져와서 시각화해주세요:
https://mcp-test-production-5d0b.up.railway.app/api/advisories

요청사항:
1. 경보 단계별 파이 차트
2. 국가별 위험도 히트맵
3. 시간대별 업데이트 현황 (lastUpdated 필드 활용)

Python 코드와 함께 결과를 보여주세요.
```

#### 2. Google Sheets 연동 스크립트

```
Google Apps Script를 작성해서 여행 경보 API 데이터를
Google Sheets에 자동으로 업데이트하는 방법을 알려주세요:

API: https://mcp-test-production-5d0b.up.railway.app/api/advisories

요구사항:
- 매일 오전 9시 자동 업데이트
- 경보 단계별 색상 코딩
- 변경사항 이메일 알림
```

### Perplexity AI에서 활용하기

```
다음 여행 경보 API를 참조하여 답변해주세요:
https://mcp-test-production-5d0b.up.railway.app/api/advisories

질문:
1. 현재 아시아 지역에서 가장 안전한 여행지는?
2. 코로나25가 영향을 미치는 국가들은?
3. 한국인이 무비자로 갈 수 있는 안전한 국가 목록

각 답변에 API 데이터를 인용해주세요.
```

### Claude (Web)에서 활용하기

#### 1. API 분석 및 코드 생성

```
다음 API를 분석하고 React 컴포넌트를 만들어주세요:
https://mcp-test-production-5d0b.up.railway.app/api/advisories

요구사항:
1. TypeScript 사용
2. 실시간 업데이트 (30초 간격)
3. 필터링 및 검색 기능
4. 반응형 디자인
5. 다크모드 지원

전체 코드와 사용 예시를 포함해주세요.
```

#### 2. API 문서 생성

```
다음 API 엔드포인트들을 테스트하고
완전한 API 문서를 작성해주세요:

Base URL: https://mcp-test-production-5d0b.up.railway.app

엔드포인트:
- GET /health
- GET /api/advisory/{countryCode}
- GET /api/advisories
- GET /api/visa/{countryCode}
- GET /api/emergency/{countryCode}

각 엔드포인트에 대해:
1. 요청/응답 예시
2. 파라미터 설명
3. 에러 케이스
4. 사용 예시 코드 (curl, Python, JavaScript)
```

### Anthropic Claude API 활용

```python
import anthropic
import requests
import json

client = anthropic.Anthropic(api_key="your-api-key")

# API에서 데이터 가져오기
response = requests.get("https://mcp-test-production-5d0b.up.railway.app/api/advisories")
advisories = response.json()

# Claude에게 분석 요청
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1000,
    temperature=0,
    messages=[{
        "role": "user",
        "content": f"""
        다음 여행 경보 데이터를 분석해주세요:
        {json.dumps(advisories, ensure_ascii=False, indent=2)}

        분석 항목:
        1. 가장 위험한 국가 TOP 5
        2. 가장 안전한 국가 TOP 5
        3. 지역별 위험도 분석
        4. 여행 추천 및 주의사항
        """
    }]
)

print(message.content)
```

### OpenAI API 활용

```javascript
// Node.js에서 OpenAI API와 여행 경보 API 연동
const OpenAI = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeTravel(countryCode) {
  // 여행 경보 데이터 가져오기
  const response = await axios.get(
    `https://mcp-test-production-5d0b.up.railway.app/api/advisory/${countryCode}`
  );

  const advisory = response.data.data;

  // GPT-4에게 분석 요청
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: "You are a travel safety expert."
    }, {
      role: "user",
      content: `
        Analyze this travel advisory data and provide recommendations:
        ${JSON.stringify(advisory, null, 2)}

        Please provide:
        1. Safety assessment
        2. Key risks to be aware of
        3. Essential preparations
        4. Alternative destinations if too dangerous
      `
    }],
    model: "gpt-4",
  });

  return completion.choices[0].message.content;
}

// 사용 예시
analyzeTravel('JP').then(console.log);
```

### Slack Bot 연동

```python
# Slack Bot with Travel Advisory API
from slack_bolt import App
import requests

app = App(token=os.environ["SLACK_BOT_TOKEN"])

@app.message("여행경보")
def handle_travel_advisory(message, say):
    """슬랙에서 '여행경보 JP' 형식으로 메시지 전송"""
    text = message['text']
    parts = text.split()

    if len(parts) < 2:
        say("사용법: 여행경보 [국가코드] (예: 여행경보 JP)")
        return

    country_code = parts[1].upper()

    try:
        response = requests.get(
            f"https://mcp-test-production-5d0b.up.railway.app/api/advisory/{country_code}"
        )
        data = response.json()

        if data['success']:
            advisory = data['data']
            blocks = [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": f"{advisory['countryName']} 여행 경보"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*경보 단계:* {advisory['alertLevel']['level']}단계"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*단계명:* {advisory['alertLevel']['levelName']}"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*요약:*\n{advisory['summary']}"
                    }
                }
            ]

            # 4단계 경보인 경우 경고 추가
            if advisory['alertLevel']['level'] == 4:
                blocks.append({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "⚠️ *경고: 현재 여행금지 상태입니다!*"
                    }
                })

            say(blocks=blocks)
        else:
            say(f"국가 코드 {country_code}를 찾을 수 없습니다.")

    except Exception as e:
        say(f"오류 발생: {str(e)}")

if __name__ == "__main__":
    app.start(port=3000)
```

### Discord Bot 연동

```javascript
// Discord.js v14 Travel Advisory Bot
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const API_BASE = 'https://mcp-test-production-5d0b.up.railway.app';

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!travel')) {
        const args = message.content.split(' ');

        if (args.length < 2) {
            message.reply('사용법: !travel [국가코드] (예: !travel JP)');
            return;
        }

        const countryCode = args[1].toUpperCase();

        try {
            const response = await axios.get(`${API_BASE}/api/advisory/${countryCode}`);
            const advisory = response.data.data;

            // 경보 단계별 색상
            const colors = {
                1: 0x28a745,  // 녹색
                2: 0xffc107,  // 노란색
                3: 0xfd7e14,  // 주황색
                4: 0xdc3545   // 빨간색
            };

            const embed = new EmbedBuilder()
                .setColor(colors[advisory.alertLevel.level])
                .setTitle(`${advisory.countryName} 여행 경보`)
                .addFields(
                    { name: '경보 단계', value: `${advisory.alertLevel.level}단계 - ${advisory.alertLevel.levelName}`, inline: true },
                    { name: '국가 코드', value: advisory.countryCode, inline: true },
                    { name: '요약', value: advisory.summary }
                )
                .setFooter({ text: '데이터 출처: Travel Advisory API' })
                .setTimestamp();

            // 4단계인 경우 추가 경고
            if (advisory.alertLevel.level === 4) {
                embed.setDescription('⚠️ **경고: 현재 여행금지 상태입니다!**');
            }

            message.reply({ embeds: [embed] });

        } catch (error) {
            message.reply(`❌ 오류: ${countryCode} 정보를 찾을 수 없습니다.`);
        }
    }
});

client.login('YOUR_BOT_TOKEN');

---

## 🛠️ GitHub Copilot 활용

### VS Code에서 Copilot 설정 및 활용

#### 1. Copilot 초기 설정

##### .copilot-instructions 파일 생성
```markdown
# Travel Advisory API Instructions

## API Base URL
https://mcp-test-production-5d0b.up.railway.app

## Available Endpoints
- GET /health - Server health check
- GET /api/advisory/{countryCode} - Get specific country advisory
- GET /api/advisories?level={1-4} - Get all advisories (optional level filter)
- GET /api/visa/{countryCode}?nationality={code} - Get visa info
- GET /api/emergency/{countryCode} - Get emergency contacts

## Important Notes
- Japan (JP) is currently at Level 4 (Travel Ban) due to COVID-25
- Country codes are ISO 3166-1 alpha-2 format (2 uppercase letters)
- All responses are in JSON format with { success: boolean, data: object }

## Code Generation Preferences
- Use TypeScript for type safety
- Include proper error handling
- Add loading states for async operations
- Use Korean comments for documentation
```

#### 2. 자동 코드 생성 예시

##### 기본 API 클라이언트
```javascript
// Travel Advisory API 클라이언트를 TypeScript로 만들어줘
// Base URL: https://mcp-test-production-5d0b.up.railway.app

// Copilot이 생성하는 코드:
interface TravelAdvisory {
  countryCode: string;
  countryName: string;
  alertLevel: {
    level: 1 | 2 | 3 | 4;
    levelName: string;
    color: string;
    description: string;
  };
  summary: string;
  lastUpdated: string;
  details: any;
}

class TravelAdvisoryClient {
  private baseURL = 'https://mcp-test-production-5d0b.up.railway.app';

  async getAdvisory(countryCode: string): Promise<TravelAdvisory> {
    const response = await fetch(`${this.baseURL}/api/advisory/${countryCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch advisory for ${countryCode}`);
    }
    const data = await response.json();
    return data.data;
  }

  async getAllAdvisories(level?: number): Promise<TravelAdvisory[]> {
    const url = level
      ? `${this.baseURL}/api/advisories?level=${level}`
      : `${this.baseURL}/api/advisories`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch advisories');
    }
    const data = await response.json();
    return data.data;
  }

  async getVisaInfo(countryCode: string, nationality = 'KR'): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/api/visa/${countryCode}?nationality=${nationality}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch visa info for ${countryCode}`);
    }
    const data = await response.json();
    return data.data;
  }
}
```

##### React Hook 생성
```typescript
// useTravelAdvisory hook을 만들어줘
// API: https://mcp-test-production-5d0b.up.railway.app/api/advisory/{countryCode}

// Copilot이 생성하는 코드:
import { useState, useEffect } from 'react';

interface UseTravelAdvisoryReturn {
  data: TravelAdvisory | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTravelAdvisory = (countryCode: string): UseTravelAdvisoryReturn => {
  const [data, setData] = useState<TravelAdvisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAdvisory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://mcp-test-production-5d0b.up.railway.app/api/advisory/${countryCode}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchAdvisory();
    }
  }, [countryCode]);

  return { data, loading, error, refetch: fetchAdvisory };
};
```

#### 3. Copilot Chat 고급 활용

##### 복잡한 컴포넌트 생성
```
@workspace Travel Advisory API를 사용한 대시보드 컴포넌트를 만들어줘

요구사항:
1. API: https://mcp-test-production-5d0b.up.railway.app
2. 실시간 경보 현황 표시
3. 국가 검색 기능
4. 경보 단계별 필터링
5. 지도 시각화 (optional)
6. TypeScript + Next.js 13 App Router 사용
7. Tailwind CSS 스타일링
8. 다크모드 지원
```

Copilot이 생성하는 코드:
```typescript
// app/components/TravelAdvisoryDashboard.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, AlertTriangle, Globe, RefreshCw } from 'lucide-react';

interface TravelAdvisory {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  alertLevel: {
    level: 1 | 2 | 3 | 4;
    levelName: string;
    color: string;
    description: string;
  };
  summary: string;
  lastUpdated: string;
}

const API_BASE = 'https://mcp-test-production-5d0b.up.railway.app';

export default function TravelAdvisoryDashboard() {
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 경보 단계별 스타일
  const levelStyles = {
    1: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    2: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    3: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    4: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  };

  const levelColors = {
    1: 'text-green-700 dark:text-green-300',
    2: 'text-yellow-700 dark:text-yellow-300',
    3: 'text-orange-700 dark:text-orange-300',
    4: 'text-red-700 dark:text-red-300',
  };

  // 데이터 로드
  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const url = selectedLevel
        ? `${API_BASE}/api/advisories?level=${selectedLevel}`
        : `${API_BASE}/api/advisories`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setAdvisories(data.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch advisories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();

    // 30초마다 자동 새로고침
    const interval = setInterval(fetchAdvisories, 30000);
    return () => clearInterval(interval);
  }, [selectedLevel]);

  // 검색 필터링
  const filteredAdvisories = useMemo(() => {
    return advisories.filter(advisory =>
      advisory.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.countryNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advisory.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [advisories, searchTerm]);

  // 통계 계산
  const stats = useMemo(() => {
    return {
      total: advisories.length,
      level1: advisories.filter(a => a.alertLevel.level === 1).length,
      level2: advisories.filter(a => a.alertLevel.level === 2).length,
      level3: advisories.filter(a => a.alertLevel.level === 3).length,
      level4: advisories.filter(a => a.alertLevel.level === 4).length,
    };
  }, [advisories]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                실시간 여행 경보 대시보드
              </h1>
            </div>
            <button
              onClick={fetchAdvisories}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            마지막 업데이트: {lastUpdate.toLocaleString('ko-KR')}
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">전체 국가</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.level1}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">1단계 (여행유의)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.level2}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">2단계 (여행자제)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">{stats.level3}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">3단계 (출국권고)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">{stats.level4}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">4단계 (여행금지)</div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="국가명 또는 코드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLevel(null)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedLevel === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                전체
              </button>
              {[1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level}단계
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 국가 목록 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdvisories.map((advisory) => (
              <div
                key={advisory.countryCode}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 ${
                  levelStyles[advisory.alertLevel.level]
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {advisory.countryName}
                  </h3>
                  <span className={`text-sm font-medium ${levelColors[advisory.alertLevel.level]}`}>
                    {advisory.alertLevel.levelName}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {advisory.summary}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {advisory.countryCode}
                  </span>
                  {advisory.alertLevel.level === 4 && (
                    <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. Copilot CLI 활용

##### 터미널에서 직접 사용
```bash
# GitHub Copilot CLI 설치
npm install -g @githubnext/github-copilot-cli

# 별칭 설정
alias ghcp='github-copilot-cli'

# API 호출 스크립트 생성
ghcp suggest "curl 명령으로 일본 여행 경보 조회하기 https://mcp-test-production-5d0b.up.railway.app"

# 결과:
curl -X GET "https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP" \
  -H "Accept: application/json" | jq '.'
```

#### 5. JetBrains IDEs (IntelliJ, WebStorm)

##### .copilot 파일 설정
```yaml
# .copilot/config.yml
version: 1
context:
  - travel-advisory-api:
      base_url: "https://mcp-test-production-5d0b.up.railway.app"
      endpoints:
        - "/api/advisory/{countryCode}"
        - "/api/advisories"
        - "/api/visa/{countryCode}"
        - "/api/emergency/{countryCode}"
      notes:
        - "Japan is Level 4 due to COVID-25"
        - "Use ISO 3166-1 alpha-2 country codes"

templates:
  - name: "API Client"
    description: "Generate API client for travel advisories"
    pattern: "// @copilot-template:api-client"

  - name: "React Component"
    description: "Generate React component with API integration"
    pattern: "// @copilot-template:react-component"
```

#### 6. Copilot Workspace 활용

##### 프로젝트 전체 리팩토링
```
@workspace 현재 프로젝트에 Travel Advisory API를 통합해줘

작업 목록:
1. API 클라이언트 라이브러리 생성 (src/lib/travel-api.ts)
2. 타입 정의 파일 생성 (src/types/travel.d.ts)
3. React 컨텍스트 생성 (src/contexts/TravelContext.tsx)
4. 커스텀 훅 생성 (src/hooks/useTravel.ts)
5. 테스트 파일 생성 (src/__tests__/travel-api.test.ts)

API Base: https://mcp-test-production-5d0b.up.railway.app
```

---

## 🎯 실제 활용 사례

### 1. 여행 계획 웹사이트

```html
<!DOCTYPE html>
<html>
<head>
    <title>안전한 여행 계획</title>
    <style>
        .alert-level-1 { background-color: #d4edda; }
        .alert-level-2 { background-color: #fff3cd; }
        .alert-level-3 { background-color: #f8d7da; }
        .alert-level-4 { background-color: #721c24; color: white; }
    </style>
</head>
<body>
    <h1>여행 안전 정보</h1>
    <div id="travel-info"></div>

    <script>
        async function loadTravelInfo() {
            try {
                const response = await fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisories');
                const data = await response.json();

                const container = document.getElementById('travel-info');
                data.data.forEach(country => {
                    const div = document.createElement('div');
                    div.className = `alert-level-${country.alertLevel.level}`;
                    div.innerHTML = `
                        <h3>${country.countryName}</h3>
                        <p>경보 단계: ${country.alertLevel.level} (${country.alertLevel.levelName})</p>
                        <p>${country.summary}</p>
                    `;
                    container.appendChild(div);
                });
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        }

        loadTravelInfo();
    </script>
</body>
</html>
```

### 2. 여행 계획 봇 (Discord/Slack)

```python
import discord
import requests

class TravelBot(discord.Client):
    def __init__(self):
        super().__init__()
        self.api_base = "https://mcp-test-production-5d0b.up.railway.app"

    async def on_message(self, message):
        if message.author == self.user:
            return

        if message.content.startswith('!여행경보'):
            # !여행경보 JP
            country_code = message.content.split()[1].upper()
            advisory = self.get_advisory(country_code)

            if advisory:
                embed = discord.Embed(
                    title=f"{advisory['countryName']} 여행 경보",
                    description=advisory['summary'],
                    color=self.get_color_by_level(advisory['alertLevel']['level'])
                )
                embed.add_field(
                    name="경보 단계",
                    value=f"{advisory['alertLevel']['level']}단계 ({advisory['alertLevel']['levelName']})",
                    inline=True
                )
                await message.channel.send(embed=embed)

    def get_advisory(self, country_code):
        try:
            response = requests.get(f"{self.api_base}/api/advisory/{country_code}")
            return response.json()['data']
        except:
            return None

    def get_color_by_level(self, level):
        colors = {1: 0x28a745, 2: 0xffc107, 3: 0xfd7e14, 4: 0xdc3545}
        return colors.get(level, 0x6c757d)

# 봇 실행
bot = TravelBot()
bot.run('YOUR_BOT_TOKEN')
```

### 3. 여행 안전 알림 앱 (Flutter)

```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class TravelAdvisoryApp extends StatefulWidget {
  @override
  _TravelAdvisoryAppState createState() => _TravelAdvisoryAppState();
}

class _TravelAdvisoryAppState extends State<TravelAdvisoryApp> {
  final String apiBase = 'https://mcp-test-production-5d0b.up.railway.app';
  List<dynamic> advisories = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadAdvisories();
  }

  Future<void> loadAdvisories() async {
    try {
      final response = await http.get(Uri.parse('$apiBase/api/advisories'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          advisories = data['data'];
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  Color getColorByLevel(int level) {
    switch (level) {
      case 1: return Colors.green;
      case 2: return Colors.yellow;
      case 3: return Colors.orange;
      case 4: return Colors.red;
      default: return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('여행 안전 정보')),
      body: isLoading
        ? Center(child: CircularProgressIndicator())
        : ListView.builder(
            itemCount: advisories.length,
            itemBuilder: (context, index) {
              final advisory = advisories[index];
              return Card(
                color: getColorByLevel(advisory['alertLevel']['level']),
                child: ListTile(
                  title: Text(advisory['countryName']),
                  subtitle: Text(advisory['summary']),
                  trailing: Text('${advisory['alertLevel']['level']}단계'),
                ),
              );
            },
          ),
    );
  }
}
```

### 4. Excel/Google Sheets 매크로

```vba
' Excel VBA 매크로
Sub GetTravelAdvisories()
    Dim http As Object
    Dim url As String
    Dim response As String
    Dim json As Object

    Set http = CreateObject("MSXML2.XMLHTTP")
    url = "https://mcp-test-production-5d0b.up.railway.app/api/advisories"

    http.Open "GET", url, False
    http.send

    If http.Status = 200 Then
        response = http.responseText
        ' JSON 파싱 및 셀에 데이터 입력
        ' ... JSON 처리 로직 ...
    End If
End Sub
```

---

## 📚 API 레퍼런스

### 기본 정보

| 항목 | 값 |
|------|-----|
| **Base URL** | `https://mcp-test-production-5d0b.up.railway.app` |
| **Content-Type** | `application/json` |
| **Rate Limit** | 1000 requests/minute |
| **Timeout** | 30 seconds |

### 엔드포인트 목록

#### 1. 서버 상태 확인
```
GET /health
```
**응답 예시:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-20T07:58:38.895Z",
  "uptime": 184.966117804,
  "version": "1.0.0"
}
```

#### 2. API 정보 조회
```
GET /
```
**응답 예시:**
```json
{
  "name": "해외 여행 공지사항 API",
  "version": "1.0.0",
  "description": "해외 여행 경보, 비자 정보, 긴급 연락처를 제공하는 REST API",
  "endpoints": { ... },
  "examples": { ... }
}
```

#### 3. 특정 국가 여행 경보 조회
```
GET /api/advisory/{countryCode}
```
**파라미터:**
- `countryCode` (path): ISO 3166-1 alpha-2 국가 코드 (예: JP, US, KR)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "countryCode": "JP",
    "countryName": "일본",
    "alertLevel": {
      "level": 4,
      "levelName": "여행금지",
      "color": "red",
      "description": "긴급 상황 - 즉시 대피 권고"
    },
    "summary": "🚨 코로나25 대유행으로 일본 전 지역 여행금지!",
    "details": { ... }
  }
}
```

#### 4. 전체 여행 경보 목록
```
GET /api/advisories[?level=N]
```
**쿼리 파라미터:**
- `level` (optional): 경보 단계 필터 (1-4)

#### 5. 비자 정보 조회
```
GET /api/visa/{countryCode}[?nationality=XX]
```
**파라미터:**
- `countryCode` (path): 목적지 국가 코드
- `nationality` (query, optional): 국적 코드 (기본값: KR)

#### 6. 긴급 연락처 조회
```
GET /api/emergency/{countryCode}
```

### 에러 응답 형식

```json
{
  "error": "잘못된 국가 코드입니다. 2자리 대문자를 사용하세요 (예: KR, JP, US)",
  "timestamp": "2025-09-20T07:58:38.895Z"
}
```

### HTTP 상태 코드

| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 요청 성공 |
| 400 | Bad Request | 잘못된 요청 파라미터 |
| 404 | Not Found | 국가 정보를 찾을 수 없음 |
| 500 | Internal Server Error | 서버 내부 오류 |

---

## 🔧 고급 활용 팁

### 1. 캐싱 전략
API 응답을 로컬에 캐싱하여 성능을 향상시키세요:

```javascript
class TravelAdvisoryCache {
    constructor(ttl = 3600000) { // 1시간 TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    async get(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.ttl) {
            return item.data;
        }
        return null;
    }

    set(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
}
```

### 2. 에러 처리 및 재시도
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}
```

### 3. 배치 요청 처리
```javascript
async function getMultipleAdvisories(countryCodes) {
    const promises = countryCodes.map(code =>
        fetch(`https://mcp-test-production-5d0b.up.railway.app/api/advisory/${code}`)
            .then(res => res.json())
            .catch(err => ({ error: err.message, countryCode: code }))
    );

    return await Promise.all(promises);
}
```

---

## 🛡️ 보안 고려사항

### API 키 관리
현재 API는 인증이 필요하지 않지만, 프로덕션 환경에서는 다음을 고려하세요:

```javascript
// 환경 변수로 API 키 관리
const API_KEY = process.env.TRAVEL_API_KEY;

const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
};
```

### Rate Limiting 준수
```javascript
class RateLimiter {
    constructor(maxRequests = 100, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return true;
        }
        return false;
    }
}
```

---

## 📞 지원 및 문의

### GitHub 리포지토리
- **Source Code**: https://github.com/thruthesky/mcp-test
- **Issues**: GitHub Issues에서 버그 리포트 및 기능 요청
- **Discussions**: 일반적인 질문 및 토론

### API 상태 모니터링
- **실시간 상태**: https://mcp-test-production-5d0b.up.railway.app/health
- **서비스 업타임**: Railway 대시보드에서 확인

### 커뮤니티
- 사용 중 문제가 발생하면 GitHub Issues에 등록해주세요
- 새로운 기능 아이디어가 있으면 Discussion에서 공유해주세요

---

**⚠️ 중요 공지**: 현재 일본은 코로나25로 인해 **4단계 여행금지** 상태입니다. 여행 계획 시 반드시 최신 경보 정보를 확인하세요!

---

*이 문서는 해외 여행 공지사항 API의 모든 사용법을 다룹니다. 추가 질문이나 개선 사항이 있으면 언제든지 GitHub Issues에 등록해주세요.*