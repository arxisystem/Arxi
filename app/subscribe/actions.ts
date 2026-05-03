"use server";

const GHOST_URL = process.env.GHOST_URL;

if (!GHOST_URL) {
  throw new Error("Missing GHOST_URL in env");
}

export type SubscribeState = {
  status: "idle" | "ok" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return { status: "error", message: "請輸入有效的 email 地址。" };
  }

  try {
    const res = await fetch(`${GHOST_URL}/members/api/send-magic-link/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        emailType: "signup",
      }),
      cache: "no-store",
    });

    if (res.ok) {
      return {
        status: "ok",
        message: "已寄出確認信。請到信箱點開連結完成訂閱。",
      };
    }

    // Ghost 通常會回 JSON 錯誤訊息
    const data = (await res.json().catch(() => null)) as
      | { errors?: Array<{ message?: string }> }
      | null;
    const apiMessage = data?.errors?.[0]?.message;

    return {
      status: "error",
      message:
        apiMessage || `訂閱失敗（${res.status}）。請稍後再試或直接私訊聯繫。`,
    };
  } catch {
    return {
      status: "error",
      message: "網路錯誤，請稍後再試。",
    };
  }
}
