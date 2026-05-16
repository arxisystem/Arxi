export type Voice = {
  id: string;
  name: string;
  age: number;
  occupation: string;
  /** 一句話引言，首頁用 */
  quote: string;
  /** 完整故事，/voices 頁用 */
  story: string;
  /** true 才會顯示在首頁 */
  featured: boolean;
};

export const voices: Voice[] = [
  {
    id: "sylvia-35",
    name: "Sylvia",
    age: 35,
    occupation: "業務",
    quote: "肩膀痛了快三年，做幾次就不痛了！",
    story:
      "做業務真的很操，每天講話、陪笑、應酬。那陣子肩頸痛到晚上睡不好，推拿、復健都試過，按完好一下，過幾天又開始痛。\n來太曦之後，曦昀沒有先去喬我痛的地方，是從呼吸跟身體結構去調。\n做幾次之後就真的不痛了，而且現在搬東西、站一整天都還好，沒以前那麼容易累。",
    featured: true,
  },
  {
    id: "yijun-42",
    name: "怡君",
    age: 42,
    occupation: "中學教師",
    quote: "現在比較安心了，不像以前整天提心吊膽。",
    story:
      "我這人就是什麼都自己扛，學生的事、家裡的事、學校的事，大家都覺得交給我就對了。\n但有一陣子我常常莫名其妙很慌，半夜醒來就睡不回去，胸口悶悶的。我先生叫我去看醫生，可是我知道那不是累。\n來太曦做了幾次，那種心裡毛毛的、好像隨時會出事的感覺就消失了。現在我比較安心，覺得踏實，不是靠別人撐著，是我自己。",
    featured: true,
  },
  {
    id: "marcus-29",
    name: "Marcus",
    age: 29,
    occupation: "軟體工程師",
    quote: "睡眠品質變好了！而且整個人比較有力氣。",
    story:
      "老實說我本來覺得身心整合很玄，會來只是因為失眠太久，看了好幾個醫生都沒用，想說死馬當活馬醫。\n第一次去就躺著，曦昀只是調我的呼吸跟身體，沒有按摩，也沒什麼奇怪的手法。\n後來睡眠真的變好，但更有感的是我整個人比較有力氣，以前下班只想躺平，現在會想出去走走。身體好像被叫醒了。",
    featured: true,
  },
];
