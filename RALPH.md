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
- [x] 반복 9: 중개수수료 계산기(fee.html, 2021.10 상한요율표, 월세 ×100/×70 환산, 한도액 처리, 부가세 안내), index/sitemap 반영
- [x] 반복 10: 실업급여 계산기(unemployment.html, 평균임금 60% + 상하한 클램프, 소정급여일수표, 수급조건/소멸시효 설명), index/sitemap 반영

## 현재 상태: 유지보수 모드 (반복 14부터)
개발 완료 — 계산기 10종 + 실수령액 표, 콘텐츠 보강 4개 페이지(salary/severance/interest/loan) 전부 완료.
루프가 다시 돌면: **코드 변경 없이** node test.js + JSON-LD 검증만 실행하고, 통과하면 "변경 없음, 사용자 액션 대기 중"으로 보고할 것.
새 기능 임의 추가 금지 — 지금 병목은 코드가 아니라 배포(사용자 액션)다.

사용자 입력이 오면 재개:
- 배포 주소 → sitemap/robots의 REPLACE-DOMAIN 치환 + 각 페이지 canonical 추가
- 네이버 소유확인 태그 → 전 페이지 head에 삽입
- 애드센스 스크립트 → 전 페이지 <!-- AdSense --> 자리에 삽입
- 매년 1월/7월 → calc.js 상수 갱신 (RATES, MIN_WAGE, UNEMP_DAILY_CAP) + node gen-table.js 재실행

## 주의 (다음 반복의 나에게)
- 실업급여 상한(66,000원/일)·최저시급·4대보험 요율은 매년 고시 변동 — calc.js 상수 주석 참고
- 콘텐츠 보강 시 과장 금지("무조건 받을 수 있다" 류), 법적 단정 대신 "원칙/예외" 구조 유지

## 규칙 (다음 반복의 나에게)
- 반복당 백로그 1~2개만. 완료하면 이 파일 갱신 + git commit
- 새 계산기 추가 시: calc.js에 순수 함수 + test.js에 케이스 추가 + node test.js 통과 확인
- 요율/세법 상수는 전부 calc.js RATES/TAX_BRACKETS에만 둔다
- 사용자 액션 대기 항목(도메인, 애드센스 코드)은 내가 해결할 수 없음 — 건드리지 말 것
- 백로그가 다 떨어지면: 콘텐츠 보강(각 페이지 FAQ 추가), 그 다음은 새 계산기 아이디어를 검색량 기준으로 추가
