// node gen-table.js → table.html 생성
// 요율(calc.js RATES) 바뀌면 이 스크립트만 다시 실행하면 됨
const fs = require('fs');
const { netSalary } = require('./calc.js');

const rows = [];
for (let a = 20000000; a <= 100000000; a += 1000000) rows.push(a);
for (let a = 110000000; a <= 200000000; a += 10000000) rows.push(a);

const fmt = n => n.toLocaleString('ko-KR');
const tbody = rows.map(a => {
  const r = netSalary(a); // 1인 가구, 비과세 월 20만 기준
  const em = a % 10000000 === 0 ? ' class="em"' : '';
  return `<tr${em}><td>${fmt(a / 10000)}만</td><td>${fmt(r.monthlyNet)}원</td><td>${fmt(r.monthlyDeduction)}원</td></tr>`;
}).join('\n      ');

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>2026 연봉 실수령액 표 — 2천만~2억 한눈에 | 계산소</title>
<meta name="description" content="2026년 연봉 실수령액 표. 연봉 2,000만원부터 2억원까지 월 실수령액과 공제액을 한눈에 확인하세요. 4대보험·소득세 최신 요율 반영.">
<meta property="og:title" content="2026 연봉 실수령액 표">
<meta property="og:description" content="연봉 2천만~2억, 통장에 찍히는 월급 한눈에.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700;900&family=IBM+Plex+Sans+KR:wght@400;600&family=IBM+Plex+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='8' y='8' width='84' height='84' rx='16' fill='none' stroke='%23b3382c' stroke-width='8'/><text x='50' y='68' font-size='52' text-anchor='middle' fill='%23b3382c' font-family='serif' font-weight='900'>計</text></svg>">
<!-- AdSense: 승인 후 스크립트 삽입 (DEPLOY.md 4번) -->
<style>
  .tbl-wrap { overflow-x: auto; background: #fffdf8; border: 1.5px solid var(--ink); box-shadow: 5px 5px 0 var(--paper-deep); }
  table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-variant-numeric: tabular-nums; font-size: 14.5px; }
  thead th { font-family: var(--serif); font-size: 14px; letter-spacing: .08em; background: var(--ink); color: var(--paper); padding: 10px 14px; position: sticky; top: 0; }
  td { padding: 8px 14px; border-bottom: 1px solid var(--line); text-align: right; }
  td:first-child { text-align: left; color: var(--ink-soft); font-family: var(--sans); font-weight: 600; }
  tr.em td { background: var(--paper); border-bottom: 1.5px solid var(--ink); }
  tr.em td:nth-child(2) { color: var(--ledger); font-weight: 700; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <a class="stamp-logo" href="./">計</a>
    <a class="brand" href="./">계산소<small>GYESANSO · 生活計算</small></a>
  </header>

  <h1>2026 연봉 실수령액 표</h1>
  <p class="lead">연봉 2,000만~2억원, 통장에 찍히는 월급 한눈에. <strong>1인 가구 · 비과세 월 20만원 기준</strong>이며, 조건이 다르면 <a href="salary.html">실수령액 계산기</a>에서 직접 계산하세요.</p>

  <div class="tbl-wrap">
    <table>
      <thead><tr><th>연봉</th><th>월 실수령액</th><th>월 공제액</th></tr></thead>
      <tbody>
      ${tbody}
      </tbody>
    </table>
  </div>

  <section class="explain">
    <h2>표 읽는 법</h2>
    <ul>
      <li><strong>월 공제액</strong> = 국민연금 + 건강보험 + 장기요양 + 고용보험 + 소득세 + 지방소득세. 항목별 내역은 <a href="salary.html">계산기</a>에서 확인됩니다.</li>
      <li>부양가족이 있으면 소득세가 줄어 실수령액이 표보다 <strong>몇만원 늘어납니다</strong>.</li>
      <li>연봉이 높을수록 공제 비율도 커집니다. 소득세가 6~45% 누진 구조이기 때문입니다.</li>
    </ul>
    <h2>왜 연봉 1억이 월 833만원이 아닌가요?</h2>
    <p>1억 ÷ 12 = 약 833만원은 세전 금액입니다. 여기서 4대보험과 소득세를 떼면 실제 통장에는 650만원 안팎이 들어옵니다. 세전-세후 차이는 연봉이 높을수록 벌어집니다.</p>
  </section>

  <footer>
    2026년 요율 기준 약식 계산입니다. 실제 금액은 회사 급여 구성·연말정산에 따라 달라집니다.
    <a href="./">← 다른 계산기 보기</a>
  </footer>
</div>
</body>
</html>
`;

fs.writeFileSync('table.html', html);
console.log('table.html 생성 완료 —', rows.length, '행');
