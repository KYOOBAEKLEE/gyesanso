// 계산소 — 핵심 계산 로직 (브라우저 + Node 테스트 공용)
// ponytail: 2026년 기준 요율 하드코딩. 매년 1월/7월 아래 상수만 갱신하면 됨 (RALPH.md 참고)
const RATES = {
  pension: 0.0475,            // 국민연금 근로자 부담률 (2026년, 연금개혁으로 매년 인상)
  pensionCapMonthly: 6370000, // 국민연금 기준소득월액 상한 (매년 7월 조정)
  health: 0.03545,            // 건강보험 근로자 부담률
  longCare: 0.1295,           // 장기요양보험 = 건강보험료 × 12.95%
  employment: 0.009,          // 고용보험 근로자 부담률
  personalDeduction: 1500000, // 인적공제 1인당 (본인 포함)
};

// 종합소득세 과세표준 구간: [상한, 세율, 누진공제]
const TAX_BRACKETS = [
  [14000000, 0.06, 0],
  [50000000, 0.15, 1260000],
  [88000000, 0.24, 5760000],
  [150000000, 0.35, 15440000],
  [300000000, 0.38, 19940000],
  [500000000, 0.40, 25940000],
  [1000000000, 0.42, 35940000],
  [Infinity, 0.45, 65940000],
];

// 근로소득공제 (총급여 기준, 한도 2,000만원)
function earnedIncomeDeduction(gross) {
  let d;
  if (gross <= 5000000) d = gross * 0.7;
  else if (gross <= 15000000) d = 3500000 + (gross - 5000000) * 0.4;
  else if (gross <= 45000000) d = 7500000 + (gross - 15000000) * 0.15;
  else if (gross <= 100000000) d = 12000000 + (gross - 45000000) * 0.05;
  else d = 14750000 + (gross - 100000000) * 0.02;
  return Math.min(d, 20000000);
}

function progressiveTax(base) {
  for (const [cap, rate, sub] of TAX_BRACKETS) {
    if (base <= cap) return Math.max(0, base * rate - sub);
  }
}

// 근로소득세액공제 한도 (총급여 기준)
function taxCreditCap(gross) {
  if (gross <= 33000000) return 740000;
  if (gross <= 70000000) return Math.max(660000, 740000 - (gross - 33000000) * 0.008);
  if (gross <= 120000000) return Math.max(500000, 660000 - (gross - 70000000) * 0.5);
  return Math.max(200000, 500000 - (gross - 120000000) * 0.5);
}

// 연봉 실수령액 (월 기준). 간이세액표 대신 연말정산 약식 — 실제와 수만원 차이 가능
function netSalary(annual, opts = {}) {
  const dependents = opts.dependents ?? 1;
  const nonTaxableMonthly = opts.nonTaxableMonthly ?? 200000; // 식대 비과세 기본값
  const gross = Math.max(0, annual - nonTaxableMonthly * 12); // 총급여(과세대상)
  const monthlyBase = gross / 12;

  const pension = Math.round(Math.min(monthlyBase, RATES.pensionCapMonthly) * RATES.pension);
  const health = Math.round(monthlyBase * RATES.health);
  const longCare = Math.round(health * RATES.longCare);
  const employment = Math.round(monthlyBase * RATES.employment);
  const annualIns = (pension + health + longCare + employment) * 12;

  const taxBase = Math.max(0, gross - earnedIncomeDeduction(gross)
    - RATES.personalDeduction * dependents - annualIns);
  const computed = progressiveTax(taxBase);
  const credit = Math.min(
    computed <= 1300000 ? computed * 0.55 : 715000 + (computed - 1300000) * 0.3,
    taxCreditCap(gross));
  const annualTax = Math.max(0, Math.round(computed - credit));

  const incomeTax = Math.round(annualTax / 12);
  const localTax = Math.round(incomeTax * 0.1);
  const monthlyDeduction = pension + health + longCare + employment + incomeTax + localTax;
  const monthlyNet = Math.round(annual / 12 - monthlyDeduction);
  return { pension, health, longCare, employment, incomeTax, localTax,
           monthlyDeduction, monthlyNet, annualNet: monthlyNet * 12 };
}

// 퇴직금 (1년 미만 근속은 지급 대상 아님)
// ponytail: 최근 3개월 일수를 91.25일로 고정한 약식. 정밀 계산은 실제 달력 일수 필요
function severance(opts) {
  const { monthlySalary, startDate, endDate, annualBonus = 0, annualLeavePay = 0 } = opts;
  const days = Math.floor((new Date(endDate) - new Date(startDate)) / 86400000);
  if (days < 365) return { eligible: false, days };
  const avgDaily = (monthlySalary * 3 + annualBonus * 0.25 + annualLeavePay * 0.25) / 91.25;
  const pay = Math.round(avgDaily * 30 * (days / 365));
  return { eligible: true, days, avgDaily: Math.round(avgDaily), pay };
}

// 이자소득세 15.4% (소득세 14% + 지방소득세 1.4%)
const TAX_INTEREST = 0.154;

// 예금(목돈 예치) 이자. compound=true면 월복리
function depositInterest({ principal, annualRate, months, compound = false, taxFree = false }) {
  const interest = Math.round(compound
    ? principal * (Math.pow(1 + annualRate / 12, months) - 1)
    : principal * annualRate * months / 12);
  const tax = taxFree ? 0 : Math.round(interest * TAX_INTEREST);
  return { interest, tax, net: interest - tax, total: principal + interest - tax };
}

// 적금(매월 납입) 이자 — 국내 은행 관행대로 단리
function savingsInterest({ monthly, annualRate, months, taxFree = false }) {
  const interest = Math.round(monthly * annualRate / 12 * months * (months + 1) / 2);
  const tax = taxFree ? 0 : Math.round(interest * TAX_INTEREST);
  const principal = monthly * months;
  return { principal, interest, tax, net: interest - tax, total: principal + interest - tax };
}

// 전월세 전환: 낮추는 보증금 차액 × 전환율 ÷ 12 = 월세
function jeonseToMonthly({ jeonse, deposit, ratePct }) {
  const diff = jeonse - deposit;
  if (diff <= 0) return { diff, monthly: 0, yearly: 0 };
  const monthly = Math.round(diff * (ratePct / 100) / 12);
  return { diff, monthly, yearly: monthly * 12 };
}

// 대출 상환: type = 'equal-payment'(원리금균등) | 'equal-principal'(원금균등) | 'bullet'(만기일시)
function loanPayment({ principal, annualRate, months, type = 'equal-payment' }) {
  const r = annualRate / 12;
  if (type === 'bullet') {
    const monthly = Math.round(principal * r);
    return { firstMonthly: monthly, lastMonthly: monthly + principal,
             totalInterest: monthly * months, totalPaid: principal + monthly * months };
  }
  if (type === 'equal-principal') {
    const base = principal / months;
    const first = Math.round(base + principal * r);
    const last = Math.round(base + base * r);
    const totalInterest = Math.round(principal * r * (months + 1) / 2);
    return { firstMonthly: first, lastMonthly: last, totalInterest, totalPaid: principal + totalInterest };
  }
  // 원리금균등: 금리 0%면 원금/개월수
  const monthly = r === 0 ? Math.round(principal / months)
    : Math.round(principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
  return { firstMonthly: monthly, lastMonthly: monthly,
           totalInterest: monthly * months - principal, totalPaid: monthly * months };
}

const MIN_WAGE = 10320; // 2026년 최저시급

// 시급 → 월급. 주휴수당: 주 15시간 이상 개근 시 (주근로/40, 최대 1)×8시간 유급
// 월 환산: 주수 4.345(=365/7/12), 주40h+주휴8h → 209시간 (고용부 기준과 일치)
function hourlyToMonthly({ hourly, weeklyHours, withJuhyu = true }) {
  const juhyuHours = withJuhyu && weeklyHours >= 15 ? Math.min(weeklyHours / 40, 1) * 8 : 0;
  const monthlyHours = Math.round((weeklyHours + juhyuHours) * 4.345);
  const monthly = hourly * monthlyHours;
  return { juhyuHours, juhyuWeekly: Math.round(hourly * juhyuHours),
           weekly: Math.round(hourly * (weeklyHours + juhyuHours)),
           monthlyHours, monthly, yearly: monthly * 12 };
}

function won(n) { return n.toLocaleString('ko-KR') + '원'; }

if (typeof module !== 'undefined') {
  module.exports = { RATES, netSalary, severance, earnedIncomeDeduction, progressiveTax, taxCreditCap,
                     depositInterest, savingsInterest, jeonseToMonthly, loanPayment,
                     hourlyToMonthly, MIN_WAGE };
}
