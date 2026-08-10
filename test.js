// node test.js — 계산 로직 자가 검증
const assert = require('assert');
const { netSalary, severance, earnedIncomeDeduction, depositInterest, savingsInterest, jeonseToMonthly, loanPayment, hourlyToMonthly, MIN_WAGE } = require('./calc.js');

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

// 예금: 1000만, 연 3%, 12개월 단리 → 이자 30만, 세후 253,800
const d = depositInterest({ principal: 10000000, annualRate: 0.03, months: 12 });
assert.strictEqual(d.interest, 300000);
assert.strictEqual(d.net, 253800);

// 월복리 > 단리
assert.ok(depositInterest({ principal: 10000000, annualRate: 0.03, months: 12, compound: true }).interest > 300000);

// 비과세면 세금 0
assert.strictEqual(depositInterest({ principal: 10000000, annualRate: 0.03, months: 12, taxFree: true }).tax, 0);

// 적금: 월 100만, 연 3%, 12개월 단리 → 이자 195,000, 세후 164,970
const sv = savingsInterest({ monthly: 1000000, annualRate: 0.03, months: 12 });
assert.strictEqual(sv.interest, 195000);
assert.strictEqual(sv.net, 164970);
assert.strictEqual(sv.principal, 12000000);

// 전월세: 전세 3억 → 보증금 1억, 전환율 5% → 월세 833,333
const j = jeonseToMonthly({ jeonse: 300000000, deposit: 100000000, ratePct: 5 });
assert.strictEqual(j.monthly, 833333);

// 보증금이 전세금보다 크면 월세 0 (음수 방지)
assert.strictEqual(jeonseToMonthly({ jeonse: 100000000, deposit: 200000000, ratePct: 5 }).monthly, 0);

// 대출: 1억, 연 4%, 30년 원리금균등 → 월 약 477,415원 (시중 계산기 대조값)
const lp = loanPayment({ principal: 100000000, annualRate: 0.04, months: 360 });
assert.ok(lp.firstMonthly > 470000 && lp.firstMonthly < 485000, `원리금균등 월납 이상: ${lp.firstMonthly}`);

// 원금균등: 첫 달 최대, 마지막 달 최소, 총이자 = P·r·(n+1)/2
const lpr = loanPayment({ principal: 100000000, annualRate: 0.04, months: 360, type: 'equal-principal' });
assert.ok(lpr.firstMonthly > lpr.lastMonthly, '원금균등 첫달>마지막달 위반');
assert.strictEqual(lpr.totalInterest, Math.round(100000000 * 0.04 / 12 * 361 / 2));

// 총이자 순서: 만기일시 > 원리금균등 > 원금균등
const lb = loanPayment({ principal: 100000000, annualRate: 0.04, months: 360, type: 'bullet' });
assert.ok(lb.totalInterest > lp.totalInterest && lp.totalInterest > lpr.totalInterest, '총이자 순서 위반');

// 금리 0% 나눗셈 가드
assert.strictEqual(loanPayment({ principal: 12000000, annualRate: 0, months: 12 }).firstMonthly, 1000000);

// 시급: 최저시급 주40시간 → 월 209시간 = 2,156,880원 (고용노동부 공식 환산과 일치)
const h = hourlyToMonthly({ hourly: MIN_WAGE, weeklyHours: 40 });
assert.strictEqual(h.monthlyHours, 209);
assert.strictEqual(h.monthly, MIN_WAGE * 209);
assert.strictEqual(h.juhyuHours, 8);

// 주 15시간 미만은 주휴수당 없음
assert.strictEqual(hourlyToMonthly({ hourly: MIN_WAGE, weeklyHours: 14 }).juhyuHours, 0);

// 주 20시간 → 주휴 4시간 (비례)
assert.strictEqual(hourlyToMonthly({ hourly: MIN_WAGE, weeklyHours: 20 }).juhyuHours, 4);

// 주휴 제외 옵션이 포함보다 적다
assert.ok(hourlyToMonthly({ hourly: MIN_WAGE, weeklyHours: 40, withJuhyu: false }).monthly < h.monthly);

console.log('OK — 전체 테스트 통과');
