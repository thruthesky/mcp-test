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

### MCP 서버로 연동하기

#### 1. Claude Desktop 설정 파일 위치
```bash
# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Windows
%APPDATA%/Claude/claude_desktop_config.json
```

#### 2. 로컬 MCP 서버 설정
```json
{
  "mcpServers": {
    "travel-advisory": {
      "command": "/usr/local/bin/node",
      "args": ["/Users/thruthesky/tmp/mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### 3. Claude Desktop에서 사용하기
Claude Desktop을 재시작한 후 다음과 같이 질문하세요:

```
일본 여행 경보 상황을 알려주세요
```

```
한국인이 미국 여행할 때 필요한 비자 정보를 알려주세요
```

```
현재 4단계 여행금지 국가들을 알려주세요
```

### HTTP API 방식으로 연동하기

Claude Desktop에서 HTTP API를 호출하도록 프롬프트를 작성할 수 있습니다:

```
다음 API에서 일본 여행 경보 정보를 가져와주세요:
https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

그리고 응답 내용을 한국어로 요약해주세요.
```

---

## 🌐 웹 브라우저에서 사용

### JSON 응답 확인하기

#### 브라우저에서 직접 접속
```
https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP
```

#### JSON 포맷터 확장 프로그램 설치 (권장)
- **Chrome**: JSON Formatter
- **Firefox**: JSONView
- **Safari**: JSON Peep

### 개발자 도구 활용

```javascript
// 브라우저 콘솔에서 실행
fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP')
  .then(response => response.json())
  .then(data => {
    console.log('일본 여행 경보:', data);
    console.log('경보 단계:', data.data.alertLevel.level);
    console.log('요약:', data.data.summary);
  });
```

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

#### Custom GPT 만들기
1. ChatGPT Plus 계정으로 로그인
2. "Explore" → "Create a GPT" 선택
3. Actions에 다음 OpenAPI 스키마 추가:

```yaml
openapi: 3.0.0
info:
  title: Travel Advisory API
  version: 1.0.0
servers:
  - url: https://mcp-test-production-5d0b.up.railway.app
paths:
  /api/advisory/{countryCode}:
    get:
      summary: Get travel advisory for a country
      parameters:
        - name: countryCode
          in: path
          required: true
          schema:
            type: string
            example: "JP"
      responses:
        '200':
          description: Travel advisory information
  /api/advisories:
    get:
      summary: Get all travel advisories
      parameters:
        - name: level
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 4
      responses:
        '200':
          description: List of travel advisories
```

#### 일반 ChatGPT에서 사용
```
다음 API를 호출해서 일본의 여행 경보 정보를 알려주세요:

GET https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

응답 내용을 한국어로 요약해주세요.
```

### Microsoft Copilot에서 활용하기

```
여행 계획을 세우고 있는데, 다음 API에서 최신 여행 경보 정보를 확인해주세요:

https://mcp-test-production-5d0b.up.railway.app/api/advisories

특히 4단계 경보 국가들이 있는지 확인하고, 안전한 여행지를 추천해주세요.
```

### Google Bard에서 활용하기

```
해외 여행을 계획 중입니다. 다음 API 엔드포인트에서 여행 경보 정보를 가져와서 분석해주세요:

- 전체 경보 현황: https://mcp-test-production-5d0b.up.railway.app/api/advisories
- 일본 상세 정보: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

현재 여행하기 안전한 국가와 위험한 국가를 구분해서 알려주세요.
```

---

## 🛠️ GitHub Copilot 활용

### VS Code에서 Copilot과 함께 사용

#### 1. API 클라이언트 코드 자동 생성
```javascript
// 주석으로 요구사항 작성하면 Copilot이 코드 생성
// Create a function to get travel advisory for Japan using the API
// API URL: https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP

// Copilot이 자동으로 생성하는 코드:
async function getJapanTravelAdvisory() {
    const response = await fetch('https://mcp-test-production-5d0b.up.railway.app/api/advisory/JP');
    const data = await response.json();
    return data;
}
```

#### 2. 여행 앱 개발 시 활용
```javascript
// Create a React component that displays travel advisories
// Use the travel advisory API: https://mcp-test-production-5d0b.up.railway.app

// Copilot이 React 컴포넌트 자동 생성:
import React, { useState, useEffect } from 'react';

const TravelAdvisoryComponent = ({ countryCode }) => {
    const [advisory, setAdvisory] = useState(null);

    useEffect(() => {
        fetch(`https://mcp-test-production-5d0b.up.railway.app/api/advisory/${countryCode}`)
            .then(response => response.json())
            .then(data => setAdvisory(data.data));
    }, [countryCode]);

    // 컴포넌트 렌더링 로직...
};
```

### Copilot Chat 활용

VS Code에서 Copilot Chat을 열고 다음과 같이 질문:

```
@workspace 여행 경보 API (https://mcp-test-production-5d0b.up.railway.app)를 사용해서 다음 기능을 구현해줘:

1. 국가 코드를 입력받아서 여행 경보를 조회하는 함수
2. 경보 단계에 따라 색상을 다르게 표시하는 UI 컴포넌트
3. 4단계 경보 국가들을 자동으로 필터링하는 기능

TypeScript와 React를 사용해줘.
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