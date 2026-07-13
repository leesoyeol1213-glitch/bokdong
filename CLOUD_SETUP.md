# ☁️ 클라우드 세이브 — Supabase 설정 (소열님 1회 작업, 약 5분)

> $0 로드맵 1단계. 클라이언트(`src/cloud.js`)는 이미 완성·검증됨. 아래 백엔드 설정만 하면 실제로 켜집니다.
> 설정 전에도 **로컬 플레이는 정상**(클라우드는 추가 레이어라 미설정 시 무동작).

## A. `saves` 테이블 만들기
Supabase 대시보드 → **SQL Editor** → New query → 아래 붙여넣고 **Run**:

```sql
create table if not exists public.saves (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;

-- 본인 행만 읽고/쓰게(RLS). auth.uid() = 로그인한 사용자.
create policy saves_select on public.saves for select to authenticated using (auth.uid() = user_id);
create policy saves_insert on public.saves for insert to authenticated with check (auth.uid() = user_id);
create policy saves_update on public.saves for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## B. 로그인 링크 주소 허용 (Authentication → URL Configuration)
- **Site URL**: `https://bokdong.vercel.app`
- **Redirect URLs** 에 추가(둘 다):
  - `https://bokdong.vercel.app/**`
  - `http://localhost:8000/**`  ← 로컬 테스트용

## C. 이메일 (기본 켜져 있음 — 확인만)
- Authentication → Providers → **Email** 이 Enabled인지 확인(기본값 On).
- ⚠️ **주의**: Supabase 기본 이메일은 **시간당 발송 수가 매우 적음**(테스트용). 베타에 친구 몇 명은 괜찮지만,
  본격 사용 시 무료 SMTP(Resend/Brevo 무료 티어)를 붙이는 게 좋음 → 이건 나중 단계.

## 설정 끝나면
게임 → **🔑 백업** 버튼 → 상단 **☁️ 클라우드 세이브**에서 이메일 입력 → 링크 클릭 → 로그인.
그 뒤부터 저장 시 클라우드 자동 백업, 다른 기기/캐시삭제 후엔 같은 이메일 로그인으로 복원됩니다.
(설정 후 함께 실제 로그인→동기화 테스트 한 번 하시죠.)
