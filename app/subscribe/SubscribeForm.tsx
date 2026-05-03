"use client";

import { useActionState } from "react";
import { subscribeAction, type SubscribeState } from "./actions";

const initialState: SubscribeState = { status: "idle", message: "" };

export function SubscribeForm() {
  const [state, formAction, isPending] = useActionState(
    subscribeAction,
    initialState,
  );

  // 訂閱成功 → 顯示確認訊息，不再顯示 form
  if (state.status === "ok") {
    return (
      <div className="border border-rule bg-page p-10 text-center">
        <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-6">
          確認信已寄出
        </p>
        <p className="text-base leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="border border-rule bg-page p-10">
      <label
        htmlFor="email"
        className="block font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-4"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        disabled={isPending}
        className="w-full bg-transparent border-b border-rule py-3 text-base focus:outline-none focus:border-ink transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-8 w-full font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper py-4 hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "處理中⋯" : "訂閱"}
      </button>

      {state.status === "error" && (
        <p
          role="alert"
          className="mt-6 font-sans text-sm text-ink-muted text-center"
        >
          {state.message}
        </p>
      )}

      <p className="mt-6 font-sans text-xs tracking-[0.15em] text-ink-soft text-center leading-relaxed">
        免費訂閱・隨時可退訂・不轉售你的 email
      </p>
    </form>
  );
}
