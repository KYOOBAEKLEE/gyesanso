# 배포 & 수익화 체크리스트 (사장님 할 일)

## 진행 상황 (2026-08-12 기준)
- [x] 1. GitHub Pages 배포 → https://kyoobaeklee.github.io/gyesanso/
- [x] 3-구글. 서치콘솔 등록 + 소유 확인(HTML 파일) + sitemap.xml 제출 완료
- [ ] 3-네이버. 서치어드바이저 등록 — 아래 "네이버 등록 방법" 참고
- [ ] 4. 애드센스 신청

## 네이버 등록 방법 (10분)
1. searchadvisor.naver.com 접속 → 네이버 로그인 → "웹마스터 도구"
2. 사이트 등록: `https://kyoobaeklee.github.io/gyesanso` 입력
3. 소유 확인에서 "HTML 파일 업로드" 선택 → 파일명과 내용이 나오면 **그대로 복사해서 Claude에게 전달**
   (Claude가 파일을 만들어 배포하고, 그 후 "소유확인" 버튼만 누르면 됨)
4. 확인 완료 후: 요청 → 사이트맵 제출 → `https://kyoobaeklee.github.io/gyesanso/sitemap.xml`

코드는 완성돼 있습니다. 아래는 **계정이 필요해서 제가 대신 못 하는 것**들입니다.
위에서부터 순서대로 하면 됩니다. 총 소요: 첫날 1~2시간, 이후 방치.

## 1. GitHub Pages 무료 배포 (10분)
1. github.com 가입 → 새 저장소 만들기 (이름 예: `gyesanso`, Public)
2. 터미널에서:
   ```bash
   cd ~/Product/외주/project
   git remote add origin https://github.com/<아이디>/gyesanso.git
   git push -u origin main
   ```
3. 저장소 → Settings → Pages → Branch: `main` 선택 → Save
4. 5분 뒤 `https://<아이디>.github.io/gyesanso/` 접속 확인

## 2. 도메인 연결 (선택, 연 2만원 안팎)
- 애드센스 승인이 잘 되려면 자체 도메인이 유리합니다 (예: gyesanso.kr)
- 가비아/후이즈에서 구입 → GitHub Pages 설정에서 Custom domain 입력
- 도메인 확정되면 저에게 알려주세요 → sitemap.xml 주소를 교체해 드립니다

## 2.5. 주소 확정되면 알려주기
- 배포 주소(예: `mano.github.io/gyesanso` 또는 자체 도메인)를 저에게 알려주세요
- `sitemap.xml`과 `robots.txt`의 `REPLACE-DOMAIN`을 실제 주소로 교체해 드립니다 (검색 등록 전에 필요)

## 3. 검색 등록 (20분) — 트래픽의 핵심
한국 트래픽은 네이버가 절반 이상입니다. 둘 다 등록하세요.
- **네이버 서치어드바이저** (searchadvisor.naver.com): 사이트 등록 → 소유 확인(HTML 태그 방식 — 태그 값 알려주시면 제가 넣어드립니다) → sitemap.xml 제출
- **구글 서치콘솔** (search.google.com/search-console): 동일하게 등록 + sitemap 제출

## 4. 구글 애드센스 신청 (승인까지 2주~1개월)
1. adsense.google.com 가입 → 사이트 추가
2. 발급받은 스크립트 태그를 알려주시면 각 페이지 `<!-- AdSense -->` 자리에 넣어드립니다
3. 승인 조건: 자체 콘텐츠(각 페이지에 설명 글 이미 있음), 방문자 소량이라도 필요
4. 승인 후 "자동 광고" 켜면 끝

## 5. 현실적인 기대치 (중요)
- 애드센스 수익은 대략 **1,000 페이지뷰당 1,000~3,000원** (한국 단가 기준)
- 월 10만원 = **월 3~5만 페이지뷰** 필요
- 검색 유입이 붙는 데 보통 **2~6개월** 걸립니다. 첫 달 수익 0원은 정상입니다
- 빠르게 당기는 법: 연봉 시즌(1~3월)에 커뮤니티(블라인드, 더쿠 등) 공유, 네이버 블로그에 "연봉 5000 실수령액" 같은 글 쓰고 계산기 링크

## 매년 유지보수 (제가 함)
- 1월: 4대보험 요율, 세법 개정 반영 (`calc.js`의 RATES만 수정)
- 7월: 국민연금 기준소득월액 상한 조정
