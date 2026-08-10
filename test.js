// node test.js — 계산 로직 자가 검증
const assert = require('assert');
const { netSalary, severance, earnedIncomeDeduction } = require('./calc.js');

// 연봉 5,000만 / 1인 / 비과세 월 20만 → 시중 계산기 기준 월 실수령 약 350~360만
const r = netSalary(50000000);
assert.ok(r.monthlyNet > 3400000 && r.monthlyNet < 3700000, `5천만 실수령 이상: ${r.monthlyNet}`);
assert.strictEqual(r.monthlyDeduction + r.monthlyNet, Math.round(50000000 / 12), '공제+실수령=월급');

// 단조성: 연봉이 오르면 실수령도 오른다
assert.ok(netSalary(60000000).monthlyNet > r.monthlyNet, '단조성 위반');

// 부양가족 많으면 세금 줄어 실수령 증가
assert.ok(netSalary(50000000, { dependents: 4 }).monthlyNet >= r.monthlyNet, '부양가족 공제 미반영');

// 국민연금 상한: 고연봉이면 연금액이 상한에 고정
const high = netSalary(200000000);
assert.strictEqual(high.pension, Math.round(6370000 * 0.0475), '연금 상한 미적용');

// 근로소득공제 한도 2,000만
assert.strictEqual(earnedIncomeDeduction(500000000), 20000000, '근로소득공제 한도');

// 연봉 0원 → 실수령 0, 음수 없음
const zero = netSalary(0);
assert.strictEqual(zero.monthlyNet, 0);
assert.ok(Object.values(zero).every(v => v >= 0), '음수 공제 발생');

// 퇴직금: 1년 미만은 미지급
assert.strictEqual(severance({ monthlySalary: 3000000, startDate: '2026-01-01', endDate: '2026-06-30' }).eligible, false);

// 딱 1년, 월 300만 → 약 1개월치 (평균임금 기준이라 월급보다 약간 다름)
const s = severance({ monthlySalary: 3000000, startDate: '2025-01-01', endDate: '2026-01-01' });
assert.ok(s.eligible && s.pay > 2800000 && s.pay < 3100000, `1년 퇴직금 이상: ${s.pay}`);

// 상여 있으면 퇴직금 증가
const sb = severance({ monthlySalary: 3000000, startDate: '2025-01-01', endDate: '2026-01-01', annualBonus: 6000000 });
assert.ok(sb.pay > s.pay, '상여 미반영');

console.log('OK — 전체 테스트 통과');
