import type { Metadata } from "next";
import { TrackedLink } from "../components/TrackedLink";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export const metadata: Metadata = {
  title: "初次來之前",
  description:
    "第一次踏進一個陌生的空間，總有很多問號。以下是常見的問題，來之前可以先了解一下。",
  alternates: { canonical: "/before" },
  openGraph: {
    title: "初次來之前",
    description:
      "第一次踏進一個陌生的空間，總有很多問號。以下是常見的問題，來之前可以先了解一下。",
    url: "/before",
  },
};

const qa: { q: string; a: string }[] = [
  {
    q: "第一次來，會發生什麼？",
    a: `先聊聊你為什麼來
身體最近有什麼訊號
你自己觀察到了什麼。

再來我會先介紹太曦的方式與哲學
這是為了讓你接下來更能清楚發生什麼、並與自己連結。

接著我會評估你身體目前的狀態：心靈的狀態、哪裡在代償。
然後是徒手調整的時間。
調整完後會有一個簡單的總結與回家功課。

初次體驗約 2 小時，多一點時間帶你認識身體的狀況。
後續每次約 1.5 小時。`,
  },
  {
    q: "要穿什麼來？",
    a: `穿著輕鬆就好，避免牛仔褲與裙子。`,
  },
  {
    q: "一對一的身體工作，會不會很尷尬？",
    a: `這個顧慮很正常，特別是第一次。

全程你穿著寬鬆衣物，不涉及需要脫衣的部位；手法主要是引導呼吸與局部按壓。
如果希望有陪伴者在場，事前告訴我可以安排。
過程中任何不舒服，都可以隨時暫停。

太曦重視你的自在感——這件事沒有標準流程，是我們一起找到你舒服的節奏。`,
  },
  {
    q: "做完之後呢？",
    a: `身體被重新調整過，需要一點時間整合新的模式。
調整的部位可能有短暫的痠感——那是正常的過程。
多喝水，慢一點觀察自己接下來幾天身心的變化。
有任何不適，隨時來訊。`,
  },
  {
    q: "哪些人不適合？",
    a: `急重症狀態下不適合進行調整。
如果你有特殊身體狀況，預約前先告訴我，我們一起評估。`,
  },
  {
    q: "這跟整骨、推拿有什麼不同？",
    a: `其他身體工作各有專業，太曦走的路徑不太一樣。

太曦的工作核心是「喚醒」——透過徒手調整與呼吸，
從內部讓神經肌肉、內分泌循環、長年累積的代償模式重新流動，
也讓情緒與創傷有空間被看見、被釋放。

不是「修好」，是「喚醒」。`,
  },
  {
    q: "曦昀是誰？",
    a: `台大數學系畢業，赴巴黎音樂院深造，後來轉進中國醫藥大學後中醫學系，目前在臨床見實習階段。

方法上長期投入以下幾套身心整合系統：

· Be Activated
· Somatic Experiencing
· Feldenkrais
· Body-Mind Centering
· Applied Kinesiology
· Internal Family Systems

投入身心工作五年，累計超過 300 位個案、超過 1,000 次一對一工作。
從幾個月大的嬰兒、孕期媽媽，到七十歲以上的長輩；職業從上班族、老師、護理師、工程師到神職人員——不同身體、不同故事的人都走過這裡。

偶爾也有動物。

持續在做、持續在學。`,
  },
  {
    q: "在哪裡？",
    a: `台中北屯，有停車位。
確切地址於預約確認後提供。`,
  },
  {
    q: "改期、暫停、退費怎麼處理？",
    a: `改期：請於課程前 24 小時告知，可順延。
當日臨時取消或缺席視同完成該堂。

暫停：套課請在合理時間內持續使用，避免長期中斷影響身體節奏。
如遇醫療或重大事故，來訊個別討論。

退費：套課購買後不另行退費。`,
  },
];

// 費用——單獨拉出來、用結構化排版（參考 vault PDF「太曦-陪伴方式」）
const pricing: {
  numeral: string;
  title: string;
  unit: string;
  price: string;
  desc: string;
  fitFor?: string;
  validity?: string;
  recommend?: boolean;
}[] = [
  {
    numeral: "I",
    title: "初次體驗",
    unit: "120 分鐘",
    price: "NT$ 3,500",
    desc: "看見身體目前的狀態，體驗另一種可能。",
  },
  {
    numeral: "II",
    title: "呼吸課程",
    unit: "3 堂",
    price: "NT$ 10,000",
    desc: "開始學習看見自己的身體，建立日常呼吸與觀察習慣。",
    fitFor: "開始想認識自己的人 · 建立呼吸與身體覺察的人",
    recommend: true,
  },
  {
    numeral: "III",
    title: "身體重組",
    unit: "6 堂",
    price: "NT$ 18,000",
    desc: "給身體一段時間，慢慢建立新的反應方式。",
    fitFor: "想深入整理長期狀態的人 · 想慢慢重新認識身體如何運作的人",
    recommend: true,
  },
  {
    numeral: "IV",
    title: "深度單次",
    unit: "90 分鐘",
    price: "NT$ 8,000",
    desc: "適合有明確議題想深入探索的人。",
  },
];

export default function BeforePage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-16">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          初次來之前
        </p>
        <h1 className="mt-6 font-sans font-light text-4xl tracking-[0.05em] leading-snug">
          初次來之前
        </h1>
        <p className="mt-8 text-base leading-loose text-ink-muted whitespace-pre-line">
          {`第一次踏進一個陌生的空間，總有很多問號。
以下是常見的問題，來之前可以先了解一下。`}
        </p>
      </header>

      {/* 工作室主視覺——header 之後、Q&A 之前 */}
      <div
        role="img"
        aria-label="太曦工作室"
        className="aspect-[3/2] mb-20 bg-rule"
        style={{
          backgroundImage: "url('/images/studio-main.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="space-y-20">
        {qa.map((item) => (
          <section key={item.q}>
            <h2 className="font-sans font-medium text-xl tracking-[0.05em] leading-relaxed mb-5">
              {item.q}
            </h2>
            <p className="text-lg leading-loose whitespace-pre-line">
              {item.a}
            </p>
          </section>
        ))}

        {/* 陪伴方式——結構化排版；價格已隱藏、透過 LINE 詢問 */}
        <section>
          <h2 className="font-sans font-medium text-xl tracking-[0.05em] leading-relaxed mb-8">
            合作方式
          </h2>
          <div className="space-y-10">
            {pricing.map((p) => (
              <div
                key={p.numeral}
                className="grid grid-cols-[1.5em_1fr_auto] gap-x-4 gap-y-1 items-baseline"
              >
                {/* 羅馬數字 */}
                <span className="font-sans text-xs tracking-[0.2em] text-ink-soft">
                  {p.numeral}
                </span>
                {/* 標題（推薦的加 ✦） */}
                <h3 className="font-sans font-medium text-lg">
                  {p.recommend && (
                    <span className="text-ink-soft mr-1.5" aria-label="推薦">
                      ✦
                    </span>
                  )}
                  {p.title}
                </h3>
                {/* 單位（右側，價格已隱藏、透過 LINE 詢問） */}
                <span className="font-sans text-xs tracking-[0.15em] text-ink-muted text-right">
                  {p.unit}
                </span>
                {/* 描述（橫跨後兩欄） */}
                <span />
                <p className="col-span-2 text-base leading-loose text-ink-muted mt-2">
                  {p.desc}
                </p>
                {/* 適合 */}
                {p.fitFor && (
                  <>
                    <span />
                    <p className="col-span-2 font-sans text-xs tracking-[0.15em] text-ink-soft mt-1">
                      <span className="mr-2">適合</span>
                      {p.fitFor}
                    </p>
                  </>
                )}
                {/* 效期 */}
                {p.validity && (
                  <>
                    <span />
                    <p className="col-span-2 font-sans text-xs tracking-[0.15em] text-ink-soft">
                      <span className="mr-2">效期</span>
                      {p.validity}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="mt-10 text-base leading-loose text-ink-muted">
            費用歡迎透過 LINE 詢問。
            <br />
            初次體驗後，我們再一起討論適合你的方向。
          </p>
        </section>
      </div>

      <div className="mt-32 text-center">
        <TrackedLink
          href={LINE_BOOK_URL}
          event="before_book_click"
          className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
        >
          預約初次體驗
        </TrackedLink>
      </div>
    </article>
  );
}