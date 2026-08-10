# RALPH 루프 상태 — 월 10만원 수익형 서비스

**서비스**: 계산소(計算所) — 한국 생활금융 계산기 모음. 정적 사이트(서버비 0원) + 애드센스.
**전략**: 검색량 많은 계산기 키워드(연봉 실수령액 등)로 SEO 유입 → 광고 수익. 월 10만원 = 월 3~5만 PV.

## 완료
- [x] 반복 1: calc.js(실수령액/퇴직금, 2026 요율) + test.js, index/salary/severance 페이지, DEPLOY.md, git 초기화
- [x] 반복 2: 예·적금 이자 계산기(interest.html, 단리/월복리/비과세), 전월세 전환 계산기(jeonse.html), index 카드 4개로, 테스트 추가 통과
- [x] 반복 3: 2026 연봉 실수령액 표(table.html, gen-table.js로 생성 — 요율 변경 시 재실행), sitemap.xml/robots.txt(REPLACE-DOMAIN placeholder), salary↔table 내부링크
- [x] 반복 4: 대출 상환 계산기(loan.html, 원리금균등/원금균등/만기일시 + 방식별 총이자 비교), sitemap 반영, 테스트 통과
- [x] 반복 5: 시급 계산기(hourly.html, 주휴수당 비례 계산, 2026 최저시급 10,320원, 고용부 209시간 기준 일치 검증), index/sitemap 반영
- [x] 반복 6: 4대보험 계산기(insurance.html, 근로자/사업주 부담 분리, 연봉 계산기와 정합성 테스트), index/sitemap 반영
- [x] 반복 7: 전 페이지 "관련 계산기" 내부링크 블록(정적 HTML — 네이버 SEO 고려), receipt에 aria-live, gen-table.js 템플릿에도 반영, 내부링크 38개 전수 검증
- [x] 반복 8: 연차 계산기(annual-leave.html, 근로기준법 60조 발생일수 + 미사용 연차수당, 연차사용촉진제도 설명), index/sitemap 반영

## 백로그 (다음 반복에서 위에서부터 하나씩)
1. 부동산 중개수수료 계산기 (fee.html) — 매매/전세/월세 상한요율표 기반
2. 사용자가 도메인/애드센스 코드 주면: canonical, 애드센스 태그, sitemap/robots 실주소 반영 (REPLACE-DOMAIN 치환)
3. 백로그 소진 시: 각 페이지 FAQ 확장, 새 계산기(실업급여, 국민연금 예상수령액 등) 검색량 순 추가

## 규칙 (다음 반복의 나에게)
- 반복당 백로그 1~2개만. 완료하면 이 파일 갱신 + git commit
- 새 계산기 추가 시: calc.js에 순수 함수 + test.js에 케이스 추가 + node test.js 통과 확인
- 요율/세법 상수는 전부 calc.js RATES/TAX_BRACKETS에만 둔다
- 사용자 액션 대기 항목(도메인, 애드센스 코드)은 내가 해결할 수 없음 — 건드리지 말 것
- 백로그가 다 떨어지면: 콘텐츠 보강(각 페이지 FAQ 추가), 그 다음은 새 계산기 아이디어를 검색량 기준으로 추가
