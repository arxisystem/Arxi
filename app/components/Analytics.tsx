import Script from "next/script";

/**
 * 第三方追蹤工具嵌入：Google Analytics 4 + Microsoft Clarity。
 *
 * 各自由環境變數啟用：
 *   - NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX     → 啟用 GA4
 *   - NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx  → 啟用 Clarity
 *
 * 任一個沒設就跳過該段（不會壞）。
 *
 * 使用 next/script 的 afterInteractive 策略——頁面互動就緒後立即載入，
 * 不阻塞首次內容繪製，但快到能抓住所有 page view / session。
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);}
              window.gtag('js', new Date());
              window.gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
