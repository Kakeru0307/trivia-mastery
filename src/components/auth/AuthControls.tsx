"use client";

import { FormEvent, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthControlsProps = {
  currentEmail: string | null;
};

export default function AuthControls({ currentEmail }: AuthControlsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState(currentEmail ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn = Boolean(currentEmail);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setMessage("メールアドレスを入力してください。");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(`サインイン失敗: ${error.message}`);
      return;
    }

    setMessage("メールにログインリンクを送信しました。受信トレイを確認してください。");
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.signOut();
    setIsSubmitting(false);

    if (error) {
      setMessage(`サインアウト失敗: ${error.message}`);
      return;
    }

    setMessage("サインアウトしました。ページを再読み込みして状態を確認できます。");
  };

  return (
    <div className="w-full max-w-md space-y-3">
      {!isLoggedIn ? (
        <form className="space-y-3" onSubmit={handleSignIn}>
          <label className="block text-sm font-medium text-gray-200" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded border border-white/20 bg-black/30 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-[#FF4655] px-4 py-2 text-sm font-bold transition hover:bg-[#ff5f6c] disabled:opacity-60"
          >
            {isSubmitting ? "送信中..." : "メールリンクでサインイン"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="w-full rounded border border-white/20 px-4 py-2 text-sm font-bold transition hover:bg-white/10 disabled:opacity-60"
        >
          {isSubmitting ? "処理中..." : "サインアウト"}
        </button>
      )}

      {message && <p className="text-xs text-gray-300">{message}</p>}
    </div>
  );
}
