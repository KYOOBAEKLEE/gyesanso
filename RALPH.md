# RALPH 루프 상태 — 월 10만원 수익형 서비스

**서비스**: 계산소(計算所) — 한국 생활금융 계산기 모음. 정적 사이트(서버비 0원) + 애드센스.
**전략**: 검색량 많은 계산기 키워드(연봉 실수령액 등)로 SEO 유입 → 광고 수익. 월 10만원 = 월 3~5만 PV.

## 완료
- [x] 반복 1: calc.js(실수령액/퇴직금, 2026 요율) + test.js, index/salary/severance 페이지, DEPLOY.md, git 초기화
- [x] 반복 2: 예·적금 이자 계산기(interest.html, 단리/월복리/비과세), 전월세 전환 계산기(jeonse.html), index 카드 4개로, 테스트 추가 통과
- [x] 반복 3: 2026 연봉 실수령액 표(table.html, gen-table.js로 생성 — 요율 변경 시 재실행), sitemap.xml/robots.txt(REPLACE-DOMAIN placeholder), salary↔table 내부링크
- [x] 반복 4: 대출 상환 계산기(loan.html, 원리금균등/원금균등/만기일시 + 방식별 총이자 비교), sitemap 반영, 테스트 통과

## 백로그 (다음 반복에서 위에서부터 하나씩)
1. 시급→월급 계산기 (hourly.html) — 최저시급 키워드, 검색량 큼. 주휴수당 포함/제외
2. 4대보험 계산기 단독 페이지 (insurance.html) — "4대보험 계산기" 키워드
3. 각 페이지 상호 내부링크 강화(관련 계산기 푸터 링크), 접근성 점검 (label/aria)
4. 사용자가 도메인/애드센스 코드 주면: canonical, 애드센스 태그, sitemap/robots 실주소 반영 (REPLACE-DOMAIN 치환)
5. 백로그 소진 시: 각 페이지 FAQ 확장, 새 계산기 아이디어(중개수수료, 양도세, 증여세, 연차수당 등) 검색량 순 추가

## 규칙 (다음 반복의 나에게)
- 반복당 백로그 1~2개만. 완료하면 이 파일 갱신 + git commit
- 새 계산기 추가 시: calc.js에 순수 함수 + test.js에 케이스 추가 + node test.js 통과 확인
- 요율/세법 상수는 전부 calc.js RATES/TAX_BRACKETS에만 둔다
- 사용자 액션 대기 항목(도메인, 애드센스 코드)은 내가 해결할 수 없음 — 건드리지 말 것
- 백로그가 다 떨어지면: 콘텐츠 보강(각 페이지 FAQ 추가), 그 다음은 새 계산기 아이디어를 검색량 기준으로 추가
