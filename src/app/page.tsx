import Link from "next/link";

import AuthControls from "@/components/auth/AuthControls";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let userEmail: string | null = null;

  if (hasSupabaseEnv) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <div className="min-h-screen bg-[#0F1923] px-6 py-10 text-white md:py-16">
      <main className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4 border-b border-white/10 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#FF4655]">
            TriviaMastery
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
            Game Quiz Hub Prototype
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
            Phase 1（Auth 導入）として、Supabase ログイン状態を確認できるホームです。
            現在は Valorant クイズのプロトタイプが利用できます。
          </p>
        </header>

        <section className="grid gap-6 rounded-lg border border-white/10 bg-[#1F2326] p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">ログイン状態</h2>
            <p className="text-sm text-gray-300">
              {!hasSupabaseEnv
                ? ".env の Supabase 設定が未入力です。README の .env.example を参照してください。"
                : userEmail
                  ? `ログイン中: ${userEmail}`
                  : "未ログインです。メールリンクでサインインしてください。"}
            </p>
          </div>
          {hasSupabaseEnv ? (
            <AuthControls currentEmail={userEmail} />
          ) : (
            <p className="text-sm text-gray-300">Auth UI は設定後に利用できます。</p>
          )}
        </section>

        <section className="space-y-4 rounded-lg border border-white/10 bg-[#1F2326] p-6">
          <h2 className="text-xl font-bold">利用可能なクイズ</h2>
          <Link
            href="/valorant"
            className="inline-flex items-center rounded bg-[#FF4655] px-5 py-3 font-bold transition-colors hover:bg-[#ff5f6c]"
          >
            Valorant クイズを開く
          </Link>
        </section>
      </main>
    </div>
  );
}
