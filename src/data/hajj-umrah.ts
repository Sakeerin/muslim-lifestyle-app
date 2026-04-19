export type StepBadge = "rukn" | "wajib" | "sunnah";

export type StepAction = { th: string; en: string };

export type PilgrimageStep = {
  id: string;
  number: number;
  nameAr: string;
  nameTh: string;
  nameEn: string;
  badge: StepBadge;
  locationTh: string;
  locationEn: string;
  icon: string;
  descTh: string;
  descEn: string;
  actions: StepAction[];
  prohibitions?: StepAction[];
  noteTh?: string;
  noteEn?: string;
  duaAr?: string;
  duaTransliteration?: string;
  duaTransTh?: string;
};

export type HajjDay = {
  id: string;
  dayNumber: number;
  hijriDateTh: string;
  nameTh: string;
  nameAr: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  steps: PilgrimageStep[];
};

export type PilgrimageDua = {
  id: string;
  nameTh: string;
  nameEn: string;
  occasionTh: string;
  occasionEn: string;
  arabic: string;
  transliteration: string;
  translationTh: string;
  translationEn: string;
};

export type MadinahSite = {
  id: string;
  nameTh: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  descTh: string;
  descEn: string;
  importanceTh: string;
  importanceEn: string;
  tipTh?: string;
  tipEn?: string;
};

// ── Umrah Steps ────────────────────────────────────────────────────────────

export const UMRAH_STEPS: PilgrimageStep[] = [
  {
    id: "umrah-ihram",
    number: 1,
    nameAr: "الإحرام",
    nameTh: "อิห์รอม",
    nameEn: "Ihram",
    badge: "rukn",
    locationTh: "มีกอต — สำหรับผู้มาจากเอเชียตะวันออกเฉียงใต้ ใช้มีกอต ยะลัมลัม",
    locationEn: "Miqat — for Southeast Asian pilgrims, Yalamlam is the designated Miqat",
    icon: "🕋",
    descTh: "เข้าสู่สภาวะศักดิ์สิทธิ์แห่งการเป็นผู้แสวงบุญ เป็นจุดเริ่มต้นของอุมเราะห์",
    descEn: "Enter the sacred state of pilgrimage. This is the first pillar of Umrah.",
    actions: [
      {
        th: "อาบน้ำ (ฆุสล์) หรืออย่างน้อยวุฎูอ์",
        en: "Perform Ghusl (full bath) or at minimum Wudu",
      },
      {
        th: "ผู้ชาย: สวมอิซาร์ (ผ้าโสร่ง) และริดา (ผ้าคลุมไหล่) สีขาว ไม่เย็บ",
        en: "Men: Wear white unstitched Izar (lower wrap) and Rida (upper wrap)",
      },
      {
        th: "ผู้หญิง: สวมชุดที่ปิดเอาเราะห์ทั้งหมด เปิดเฉพาะใบหน้าและมือ",
        en: "Women: Wear clothes covering the entire body except face and hands",
      },
      {
        th: "ละหมาดซุนนะห์ 2 ร็อกอะห์ (ซุนนะห์อิห์รอม)",
        en: "Perform 2 rak'ah Sunnah prayer (Salat al-Ihram)",
      },
      {
        th: "ตั้งเนียตอุมเราะห์ในใจแล้วกล่าวตัลบิยะห์",
        en: "Make intention for Umrah in the heart, then recite the Talbiyah",
      },
      {
        th: "กล่าวตัลบิยะห์อย่างต่อเนื่องตลอดทาง",
        en: "Continuously recite the Talbiyah throughout the journey",
      },
    ],
    prohibitions: [
      { th: "ตัดหรือถอนผมและเล็บ", en: "Cutting or pulling hair and nails" },
      { th: "ใช้น้ำหอมหรือสิ่งที่มีกลิ่นหอม", en: "Using perfume or scented products" },
      {
        th: "ผู้ชาย: สวมชุดเย็บติดกัน หมวก ถุงเท้า",
        en: "Men: Wearing stitched clothes, hats, or socks",
      },
      { th: "ล่าสัตว์บก", en: "Hunting land animals" },
      { th: "มีเพศสัมพันธ์และกิจกรรมทางเพศ", en: "Sexual intercourse and related acts" },
      { th: "ทะเลาะวิวาท พูดหยาบคาย", en: "Quarreling or using foul language" },
    ],
    noteTh: "มีกอตหลักสำหรับคนไทย คือ ยะลัมลัม อยู่ห่างจากมักกะห์ประมาณ 94 กม. ทางทิศใต้",
    noteEn: "For Thai pilgrims, Yalamlam is the Miqat, located ~94 km south of Makkah",
    duaAr:
      "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    duaTransliteration:
      "Labbayk Allāhumma labbayk, labbayk lā sharīka laka labbayk, innal ḥamda wan-ni'mata laka wal-mulk, lā sharīka lak",
    duaTransTh:
      "ฉันตอบรับ โอ้อัลลอฮ์ ฉันตอบรับ ฉันตอบรับ ไม่มีภาคีสำหรับพระองค์ ฉันตอบรับ แท้จริงการสรรเสริญ ความโปรดปราน และอาณาจักรเป็นของพระองค์ ไม่มีภาคีสำหรับพระองค์",
  },
  {
    id: "umrah-tawaf",
    number: 2,
    nameAr: "الطواف",
    nameTh: "เฏาวาฟ",
    nameEn: "Tawaf",
    badge: "rukn",
    locationTh: "มัสยิดฮะรอม — รอบกะอ์บะห์",
    locationEn: "Masjid al-Haram — around the Ka'bah",
    icon: "🕌",
    descTh: "เวียนรอบกะอ์บะห์ 7 รอบ เริ่มที่หินดำ (ฮะญัรอัสวัด) เดินทวนเข็มนาฬิกา",
    descEn:
      "Circumambulate the Ka'bah 7 times, starting from the Black Stone (Hajar al-Aswad), counterclockwise",
    actions: [
      {
        th: "ต้องอยู่ในสภาวะมีวุฎูอ์ตลอดการเฏาวาฟ",
        en: "Must be in a state of Wudu throughout the Tawaf",
      },
      {
        th: "ผู้ชาย: อิฎ็ฏิบาอ์ — วางผ้าริดาไว้ใต้รักแร้ขวา เปิดไหล่ขวาตลอดการเฏาวาฟ",
        en: "Men: Idtiba — drape the Rida under the right armpit, exposing the right shoulder",
      },
      {
        th: "เริ่มต้นที่ฮะญัรอัสวัด (หินดำ) ชี้มือขวาหรือจูบถ้าสะดวก",
        en: "Start at Hajar al-Aswad, point right hand toward it or kiss it if possible",
      },
      {
        th: "ผู้ชาย: รัมัล — เดินเร็วก้าวสั้น ไหล่ตั้ง ใน 3 รอบแรก",
        en: "Men: Ramal — walk briskly with short steps and raised shoulders in the first 3 rounds",
      },
      { th: "รอบที่ 4-7: เดินปกติ สำหรับทุกคน", en: "Rounds 4–7: Walk normally for everyone" },
      {
        th: "ที่มุมยะมานี (มุมที่ 3) แตะด้วยมือขวาถ้าทำได้",
        en: "At the Yemeni Corner (3rd corner), touch it with the right hand if possible",
      },
      {
        th: "ระหว่างมุมยะมานีถึงฮะญัรอัสวัด กล่าวดุอาอ์: رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...",
        en: "Between Yemeni Corner and Hajar al-Aswad, recite: Rabbana atina fid-dunya hasanah...",
      },
      {
        th: "หลังครบ 7 รอบ ละหมาด 2 ร็อกอะห์ หลังมะกอมอิบรอฮีม",
        en: "After completing 7 rounds, pray 2 rak'ah behind Maqam Ibrahim",
      },
      {
        th: "ละหมาด 2 ร็อกอะห์ หลังมะกอมอิบรอฮีม พร้อมดุอาอ์: رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ",
        en: "Pray 2 rak'ah behind Maqam Ibrahim, reciting: Rabbi aj'alni muqimas-salah",
      },
      { th: "ดื่มน้ำซัมซัมพร้อมดุอาอ์", en: "Drink Zamzam water with a du'a" },
    ],
    duaAr:
      "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ",
    duaTransliteration:
      "Bismillāhi wallāhu akbar, Allāhumma īmānan bika wa taṣdīqan bikitābika wa wafā'an bi'ahdika wattibā'an lisunnati nabiyyika Muḥammadin ﷺ",
    duaTransTh:
      "ด้วยพระนามของอัลลอฮ์ และอัลลอฮ์ทรงยิ่งใหญ่ โอ้อัลลอฮ์ ด้วยศรัทธาต่อพระองค์ ยืนยันคัมภีร์ของพระองค์ ปฏิบัติตามพันธสัญญาของพระองค์ และปฏิบัติตามซุนนะห์ของนบีมุฮัมมัด ﷺ",
  },
  {
    id: "umrah-sai",
    number: 3,
    nameAr: "السعي",
    nameTh: "สะอฺยี",
    nameEn: "Sa'i",
    badge: "rukn",
    locationTh: "มัสยิดฮะรอม — ทางเดินมัสอา ระหว่างศอฟาและมัรวะห์",
    locationEn: "Masjid al-Haram — Mas'a walkway between Safa and Marwah",
    icon: "🏃",
    descTh: "เดิน 7 รอบระหว่างเนินศอฟาและมัรวะห์ รำลึกถึงนางฮาญัรที่วิ่งหาน้ำให้บุตร",
    descEn:
      "Walk 7 times between the hills of Safa and Marwah, commemorating Hajar's search for water",
    actions: [
      {
        th: "ขึ้นเนินศอฟา หันหน้าไปทางกะอ์บะห์ กล่าว: إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
        en: "Ascend Safa, face the Ka'bah, and recite: Innas-safa wal-marwata min sha'a'irillah",
      },
      { th: "ดุอาอ์ที่ศอฟา 3 ครั้ง", en: "Make du'a at Safa, repeating 3 times" },
      {
        th: "เดินจากศอฟาไปมัรวะห์ = 1 รอบ, มัรวะห์กลับศอฟา = 2 รอบ (นับ 7 รอบ จบที่มัรวะห์)",
        en: "Safa to Marwah = 1 round; count to 7, ending at Marwah",
      },
      {
        th: "ผู้ชาย: วิ่งเร็วระหว่างเสาสีเขียว 2 ต้น (ฮัรวะละห์)",
        en: "Men: Run briskly between the two green pillars (Harwalah)",
      },
      {
        th: "ดุอาอ์ที่มัรวะห์ — เหมือนกับดุอาอ์ที่ศอฟา: กล่าว ลาอิลาฮะ อิลลัลลอฮ์... ซ้ำ 3 ครั้ง",
        en: "Du'a at Marwah — same as Safa: recite La ilaha illallahu wahdahu... 3 times",
      },
    ],
    noteTh: "สะอฺยีไม่ต้องอยู่ในสภาวะวุฎูอ์ แต่ควรอยู่ในสภาวะสะอาด และสามารถนั่งพักได้ระหว่างทาง",
    noteEn:
      "Wudu is not required for Sa'i, but it is recommended to be in a state of cleanliness. Rest is allowed.",
  },
  {
    id: "umrah-taqsir",
    number: 4,
    nameAr: "التقصير أو الحلق",
    nameTh: "ตัดหรือโกนผม",
    nameEn: "Taqsir or Halq",
    badge: "rukn",
    locationTh: "บริเวณมัสยิดฮะรอม หรือที่พัก",
    locationEn: "Near Masjid al-Haram or accommodation",
    icon: "✂️",
    descTh: "ออกจากสภาวะอิห์รอม โดยการโกนหรือตัดผม ถือเป็นขั้นตอนสุดท้ายของอุมเราะห์",
    descEn: "Exit the state of Ihram by shaving or cutting hair. This is the final step of Umrah.",
    actions: [
      {
        th: "ผู้ชาย: โกนศีรษะทั้งหมด (อัฟฎ็อล/ดีกว่า) หรือตัดผมให้สั้นลงทั่วศีรษะ",
        en: "Men: Shave the entire head (Afda/better) or shorten hair evenly all over the head",
      },
      {
        th: "ผู้หญิง: ตัดปลายผมประมาณ 1 นิ้ว (ประมาณ 2.5 ซม.) เท่านั้น ห้ามโกน",
        en: "Women: Cut approximately 1 inch (~2.5 cm) from the ends of the hair only; shaving is prohibited",
      },
    ],
    noteTh: "หลังตัดผม อุมเราะห์สมบูรณ์แล้ว ข้อห้ามอิห์รอมทุกข้อถูกยกขึ้นหมด",
    noteEn: "After cutting/shaving hair, Umrah is complete and all Ihram prohibitions are lifted.",
  },
];

// ── Hajj Days (Tamattu') ──────────────────────────────────────────────────

export const HAJJ_DAYS: HajjDay[] = [
  {
    id: "day8",
    dayNumber: 8,
    hijriDateTh: "8 ซุลฮิจญะห์",
    nameTh: "วันตัรวิยะห์",
    nameAr: "يوم التروية",
    nameEn: "Day of Tarwiyah",
    descTh: "เริ่มต้นสภาวะอิห์รอมสำหรับฮัจญ์และเดินทางไปมินา",
    descEn: "Enter Ihram for Hajj and travel to Mina",
    steps: [
      {
        id: "day8-ihram",
        number: 1,
        nameAr: "الإحرام للحج",
        nameTh: "อิห์รอมสำหรับฮัจญ์",
        nameEn: "Ihram for Hajj",
        badge: "rukn",
        locationTh: "ที่พักในมักกะห์ (สำหรับฮัจญ์ตะมัตตุอ์)",
        locationEn: "Accommodation in Makkah (for Hajj Tamattu)",
        icon: "🕋",
        descTh: "สวมอิห์รอมและตั้งเนียตสำหรับฮัจญ์",
        descEn: "Wear Ihram and make intention for Hajj",
        actions: [
          {
            th: "อาบน้ำ สวมชุดอิห์รอม นิยัตฮัจญ์ กล่าวตัลบิยะห์",
            en: "Bathe, wear Ihram garments, make Hajj intention, recite Talbiyah",
          },
        ],
      },
      {
        id: "day8-mina",
        number: 2,
        nameAr: "التوجه إلى منى",
        nameTh: "เดินทางสู่มินา",
        nameEn: "Travel to Mina",
        badge: "sunnah",
        locationTh: "มินา — ห่างจากมัสยิดฮะรอม ประมาณ 8 กม.",
        locationEn: "Mina — approximately 8 km from Masjid al-Haram",
        icon: "⛺",
        descTh: "ค้างคืนที่มินา ละหมาดย่อ (ก็อศรุ) ไม่รวม (ไม่ญัมอ์)",
        descEn: "Spend the night at Mina, shorten prayers (Qasr) without combining (no Jam')",
        actions: [
          {
            th: "ละหมาดซุฮูร อัศรุ มัฆริบ อิชาอ์ และฟัจร์ ย่อที่มินา",
            en: "Pray Dhuhr, Asr, Maghrib, Isha, and Fajr (shortened) at Mina",
          },
        ],
        noteTh: "การค้างคืนที่มินาวันนี้เป็นซุนนะห์ ไม่ใช่วาญิบ",
        noteEn: "Staying overnight at Mina on this day is Sunnah, not Wajib",
      },
    ],
  },
  {
    id: "day9",
    dayNumber: 9,
    hijriDateTh: "9 ซุลฮิจญะห์",
    nameTh: "วันอะรอฟะห์",
    nameAr: "يوم عرفة",
    nameEn: "Day of Arafah",
    descTh: "เส้นทาง: มินา → อะรอฟะห์ (หลังดวงอาทิตย์ขึ้น) → มุซดะลิฟะห์ (หลังดวงอาทิตย์ตก) — วุกูฟที่อะรอฟะห์เป็นเสาหลักของฮัจญ์ ผู้ใดพลาดฮัจญ์เป็นโมฆะ",
    descEn: "Route: Mina → Arafah (after sunrise) → Muzdalifah (after sunset) — Standing at Arafah is the main pillar of Hajj. Missing it renders Hajj invalid.",
    steps: [
      {
        id: "day9-arafah",
        number: 1,
        nameAr: "الوقوف بعرفة",
        nameTh: "วุกูฟที่อะรอฟะห์",
        nameEn: "Standing at Arafah",
        badge: "rukn",
        locationTh: "ทุ่งอะรอฟะห์ — ห่างจากมักกะห์ประมาณ 20 กม.",
        locationEn: "Plain of Arafah — approximately 20 km from Makkah",
        icon: "🌄",
        descTh: "วุกูฟตั้งแต่ดวงอาทิตย์คล้อยจนถึงดวงอาทิตย์ตก ดุอาอ์อย่างเร่าร้อน",
        descEn: "Stand from after Dhuhr until sunset, making earnest supplications",
        actions: [
          { th: "เดินทางไปอะรอฟะห์หลังดวงอาทิตย์ขึ้น", en: "Travel to Arafah after sunrise" },
          {
            th: "ละหมาดซุฮูร+อัศรุ ญัมอ์ตักดีม+ก็อศรุ (รวมกัน ย่อ)",
            en: "Pray Dhuhr and Asr combined early (Jam' Taqdim + Qasr)",
          },
          {
            th: "ขอดุอาอ์อย่างต่อเนื่องและเร่าร้อนตลอดช่วงบ่าย",
            en: "Make earnest and continuous du'a throughout the afternoon",
          },
          {
            th: "ห้ามออกจากอะรอฟะห์ก่อนดวงอาทิตย์ตก",
            en: "Do not leave Arafah before sunset",
          },
        ],
        duaAr:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        duaTransliteration:
          "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul mulku wa lahul ḥamd, wa huwa 'alā kulli shay'in qadīr",
        duaTransTh:
          "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคีสำหรับพระองค์ อาณาจักรและการสรรเสริญเป็นของพระองค์ พระองค์ทรงอานุภาพเหนือทุกสิ่ง",
      },
      {
        id: "day9-muzdalifah",
        number: 2,
        nameAr: "المبيت بمزدلفة",
        nameTh: "ค้างคืนที่มุซดะลิฟะห์",
        nameEn: "Overnight at Muzdalifah",
        badge: "wajib",
        locationTh: "มุซดะลิฟะห์ — ระหว่างอะรอฟะห์และมินา",
        locationEn: "Muzdalifah — between Arafah and Mina",
        icon: "🌙",
        descTh: "ค้างคืนที่มุซดะลิฟะห์ ละหมาดมัฆริบ+อิชาอ์ รวมและย่อ เก็บก้อนหิน",
        descEn: "Spend the night at Muzdalifah, pray Maghrib and Isha combined, collect pebbles",
        actions: [
          {
            th: "หลังดวงอาทิตย์ตก เดินทางจากอะรอฟะห์ไปมุซดะลิฟะห์อย่างสงบ",
            en: "After sunset, travel calmly from Arafah to Muzdalifah",
          },
          {
            th: "ละหมาดมัฆริบ (3 ร็อกอะห์ ปกติ) + อิชาอ์ (2 ร็อกอะห์ ย่อ) ญัมอ์ตะอ์ฆีร",
            en: "Pray Maghrib (3 rak'ah) + Isha (2 rak'ah, Qasr) combined late (Jam' Ta'khir)",
          },
          {
            th: "ค้างคืน (วาญิบ) — อย่างน้อยจนถึงครึ่งคืน หรือจนถึงฟัจร์ (ดีกว่า)",
            en: "Spend the night (Wajib) — at minimum until midnight, or until Fajr (better)",
          },
          {
            th: "เก็บก้อนหินกรวด 49 หรือ 70 ก้อน ขนาดเท่าเมล็ดถั่วชิกพี",
            en: "Collect 49 or 70 small pebbles, the size of a chickpea",
          },
        ],
        noteTh: "ผู้อ่อนแอ ผู้สูงอายุ และผู้หญิง สามารถออกจากมุซดะลิฟะห์หลังครึ่งคืนได้ เก็บหินได้ที่มุซดะลิฟะห์หรือมินา",
        noteEn: "The weak, elderly, and women may leave Muzdalifah after midnight. Pebbles may be collected at Muzdalifah or Mina.",
      },
    ],
  },
  {
    id: "day10",
    dayNumber: 10,
    hijriDateTh: "10 ซุลฮิจญะห์",
    nameTh: "วันอีดุลอัฎฮา (วันนะห์ร)",
    nameAr: "يوم النحر",
    nameEn: "Day of Eid al-Adha (Yawm al-Nahr)",
    descTh: "วันที่สำคัญที่สุดของฮัจญ์ มีกิจกรรมหลัก 4 อย่างที่ควรทำตามลำดับ",
    descEn: "The most important day of Hajj with 4 main activities performed in order",
    steps: [
      {
        id: "day10-rami",
        number: 1,
        nameAr: "رمي جمرة العقبة",
        nameTh: "ขว้างหินที่ญัมเราะตุลอะกอบะห์",
        nameEn: "Stone Jamarat al-Aqabah",
        badge: "wajib",
        locationTh: "มินา — ญัมเราะตุลอะกอบะห์ (เสาหินใหญ่)",
        locationEn: "Mina — Jamarat al-Aqabah (large pillar)",
        icon: "🪨",
        descTh:
          "ขว้างหิน 7 ก้อนที่เสาหินใหญ่ (ญัมเราะตุลอะกอบะห์) หลังละหมาดฟัจร์ (ผ่อนปรน: หลังครึ่งคืนสำหรับผู้อ่อนแอและผู้หญิง)",
        descEn:
          "Throw 7 pebbles at the large pillar (Jamarat al-Aqabah) after Fajr prayer (dispensation: after midnight for the weak and women)",
        actions: [
          {
            th: "ขว้างหิน 7 ก้อน ทีละก้อน กล่าว 'บิสมิลลาห์ วัลลอฮุ อักบัร' ทุกครั้ง",
            en: "Throw 7 pebbles one by one, saying 'Bismillah wallahu akbar' with each throw",
          },
        ],
        duaAr: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
        duaTransliteration: "Bismillāhi wallāhu akbar",
        duaTransTh: "ด้วยพระนามของอัลลอฮ์ และอัลลอฮ์ทรงยิ่งใหญ่",
      },
      {
        id: "day10-hadyi",
        number: 2,
        nameAr: "الهدي",
        nameTh: "เชือดสัตว์กุรบาน (หะดย์)",
        nameEn: "Sacrifice (Hadyi)",
        badge: "wajib",
        locationTh: "มินา หรือภายในเขตฮะรัม",
        locationEn: "Mina or within the Haram boundary",
        icon: "🐑",
        descTh: "วาญิบสำหรับฮัจญ์ตะมัตตุอ์ — เชือดแพะ แกะ วัว หรืออูฐ",
        descEn: "Obligatory for Hajj Tamattu — slaughter a goat, sheep, cow, or camel",
        actions: [
          {
            th: "สามารถมอบหมายให้ตัวแทนเชือดแทนได้ผ่านบริการที่ได้รับอนุญาต",
            en: "May authorize an authorized agent to slaughter on your behalf through licensed services",
          },
        ],
      },
      {
        id: "day10-halq",
        number: 3,
        nameAr: "الحلق أو التقصير",
        nameTh: "โกนหรือตัดผม",
        nameEn: "Halq or Taqsir",
        badge: "wajib",
        locationTh: "มินา หรือมักกะห์",
        locationEn: "Mina or Makkah",
        icon: "✂️",
        descTh: "โกนหรือตัดผม → พ้นสภาวะตะฮัลลุลอัสฆัร (อิห์รอมบางส่วน)",
        descEn: "Shave or cut hair → enter Tahallul al-Asghar (partial release from Ihram)",
        actions: [
          {
            th: "ผู้ชาย: โกนศีรษะทั้งหมด (ดีกว่า) หรือตัดผมให้สั้นลงทั่วศีรษะ",
            en: "Men: Shave entire head (better) or shorten hair all over the head",
          },
          {
            th: "ผู้หญิง: ตัดปลายผมประมาณ 1 นิ้ว",
            en: "Women: Cut approximately 1 inch from the ends of hair",
          },
        ],
        noteTh: "หลังโกน/ตัดผม เข้าสู่ตะฮัลลุลอัสฆัร (อิห์รอมบางส่วน) — ข้อห้ามทุกอย่างยกเว้นความสัมพันธ์ทางเพศถูกยกขึ้น หลังเฏาวาฟอิฟาเฎาะห์จึงจะเข้าสู่ตะฮัลลุลอักบัร (พ้นอิห์รอมสมบูรณ์)",
        noteEn: "After halq/taqsir: Tahallul al-Asghar (partial release) — all prohibitions except intercourse are lifted. Full release (Tahallul al-Akbar) occurs only after completing Tawaf al-Ifadah.",
      },
      {
        id: "day10-tawaf",
        number: 4,
        nameAr: "طواف الإفاضة والسعي",
        nameTh: "เฏาวาฟอิฟาเฎาะห์ + สะอฺยี",
        nameEn: "Tawaf al-Ifadah + Sa'i",
        badge: "rukn",
        locationTh: "มัสยิดฮะรอม มักกะห์",
        locationEn: "Masjid al-Haram, Makkah",
        icon: "🕌",
        descTh:
          "เฏาวาฟรอบกะอ์บะห์ 7 รอบ + สะอฺยีอีก 7 รอบ (สำหรับตะมัตตุอ์) → พ้นสภาวะอิห์รอมทั้งหมด",
        descEn:
          "Tawaf around Ka'bah 7 rounds + Sa'i 7 rounds (for Tamattu) → Full release from Ihram",
        actions: [
          {
            th: "เฏาวาฟอิฟาเฎาะห์ 7 รอบเหมือนเฏาวาฟอุมเราะห์ แต่ไม่มีรัมัลและอิฎ็ฏิบาอ์",
            en: "Perform Tawaf al-Ifadah 7 rounds like Umrah Tawaf, but without Ramal and Idtiba",
          },
          {
            th: "สะอฺยีฮัจญ์ 7 รอบระหว่างศอฟาและมัรวะห์",
            en: "Perform Sa'i of Hajj, 7 rounds between Safa and Marwah",
          },
        ],
        noteTh: "สามารถเลื่อนเฏาวาฟอิฟาเฎาะห์ไปทำในวันตัชรีกได้",
        noteEn: "Tawaf al-Ifadah may be postponed to the Tashreeq days",
      },
    ],
  },
  {
    id: "day11-12",
    dayNumber: 11,
    hijriDateTh: "11–12 ซุลฮิจญะห์",
    nameTh: "วันตัชรีก",
    nameAr: "أيام التشريق",
    nameEn: "Days of Tashreeq",
    descTh: "ค้างคืนที่มินาและขว้างหินทั้ง 3 ต้นทุกวัน หลังดวงอาทิตย์คล้อย",
    descEn: "Stay overnight in Mina and stone all 3 pillars each day after Dhuhr",
    steps: [
      {
        id: "tashreeq-mabeet",
        number: 1,
        nameAr: "المبيت بمنى",
        nameTh: "ค้างคืนที่มินา",
        nameEn: "Overnight at Mina",
        badge: "wajib",
        locationTh: "มินา",
        locationEn: "Mina",
        icon: "⛺",
        descTh: "วาญิบต้องค้างคืนที่มินาทั้งคืนวันที่ 11 และ 12 มีสองทางเลือกในการออกจากมินา",
        descEn: "Obligatory to spend the nights of 11th and 12th at Mina. Two valid departure options exist.",
        actions: [
          {
            th: "ค้างคืนวันที่ 11 และ 12 ที่มินา (วาญิบ)",
            en: "Stay overnight on the 11th and 12th at Mina (Wajib)",
          },
          {
            th: "นาฟัรอัวล์ (ออกเร็ว): หากออกวันที่ 12 ต้องออกก่อนดวงอาทิตย์ตก — ฮัจญ์สมบูรณ์",
            en: "Nafar Awwal (early departure): If leaving on Day 12, must depart before sunset — Hajj is valid",
          },
          {
            th: "นาฟัรษานี (ออกช้า): ค้างคืนวันที่ 13 ขว้างหินอีกครั้ง แล้วออก — อัฟฎ็อล (ดีกว่า)",
            en: "Nafar Thani (later departure): Stay night of Day 13, stone again, then leave — Afda (more virtuous)",
          },
        ],
        noteTh: "ถ้าดวงอาทิตย์ตกในวันที่ 12 ขณะยังอยู่ในมินา ต้องค้างคืนวันที่ 13 และขว้างหินก่อนออก",
        noteEn: "If the sun sets on Day 12 while still at Mina, one must spend the night of Day 13 and stone before departing.",
      },
      {
        id: "tashreeq-rami",
        number: 2,
        nameAr: "رمي الجمرات الثلاث",
        nameTh: "ขว้างหิน 3 ต้น",
        nameEn: "Stone all 3 Pillars",
        badge: "wajib",
        locationTh: "มินา — ญัมเราะต์ทั้ง 3",
        locationEn: "Mina — all 3 Jamarat pillars",
        icon: "🪨",
        descTh: "ขว้างหิน 3 ต้น หลังดวงอาทิตย์คล้อย วันละ 21 ก้อน",
        descEn: "Stone 3 pillars after Dhuhr, 21 pebbles per day",
        actions: [
          {
            th: "ญัมเราะตุลอูลา (เล็ก): ขว้าง 7 ก้อน + ดุอาอ์หลัง",
            en: "Jamarat al-Ula (small): Throw 7 pebbles + du'a after",
          },
          {
            th: "ญัมเราะตุลวุสฏอ (กลาง): ขว้าง 7 ก้อน + ดุอาอ์หลัง",
            en: "Jamarat al-Wusta (middle): Throw 7 pebbles + du'a after",
          },
          {
            th: "ญัมเราะตุลอะกอบะห์ (ใหญ่): ขว้าง 7 ก้อน ไม่ต้องดุอาอ์หลัง",
            en: "Jamarat al-Aqabah (large): Throw 7 pebbles, no du'a after",
          },
        ],
        noteTh: "ขว้างหินได้ตั้งแต่หลังดวงอาทิตย์คล้อยจนถึงก่อนฟัจร์วันถัดไป",
        noteEn: "Stoning may be done from after Dhuhr until before Fajr of the next day",
      },
    ],
  },
  {
    id: "wada",
    dayNumber: 13,
    hijriDateTh: "ก่อนออกจากมักกะห์",
    nameTh: "เฏาวาฟอำลา",
    nameAr: "طواف الوداع",
    nameEn: "Farewell Tawaf",
    descTh: "เฏาวาฟสุดท้ายก่อนออกจากมักกะห์ วาญิบสำหรับผู้มาจากต่างถิ่น",
    descEn: "Final Tawaf before leaving Makkah. Obligatory for those coming from outside Makkah.",
    steps: [
      {
        id: "wada-tawaf",
        number: 1,
        nameAr: "طواف الوداع",
        nameTh: "เฏาวาฟวะดาอ์",
        nameEn: "Farewell Tawaf",
        badge: "wajib",
        locationTh: "มัสยิดฮะรอม มักกะห์",
        locationEn: "Masjid al-Haram, Makkah",
        icon: "🕌",
        descTh: "เฏาวาฟ 7 รอบเพื่ออำลากะอ์บะห์ กระทำก่อนออกจากมักกะห์ทันที",
        descEn:
          "Perform 7 rounds of Tawaf to bid farewell to the Ka'bah, done immediately before departing Makkah",
        actions: [
          {
            th: "เฏาวาฟ 7 รอบปกติ ไม่มีรัมัลและอิฎ็ฏิบาอ์",
            en: "Perform 7 normal rounds without Ramal and Idtiba",
          },
          {
            th: "ละหมาด 2 ร็อกอะห์ หลังมะกอมอิบรอฮีม",
            en: "Pray 2 rak'ah behind Maqam Ibrahim",
          },
          {
            th: "ดื่มน้ำซัมซัมและดุอาอ์สุดท้าย",
            en: "Drink Zamzam water and make final du'as",
          },
        ],
        noteTh: "ผู้หญิงที่มีประจำเดือนหรือหลังคลอดได้รับยกเว้น ไม่ต้องทำเฏาวาฟอำลา",
        noteEn: "Women in menses or post-partum bleeding are exempt from the Farewell Tawaf",
      },
    ],
  },
];

// ── Important Du'as ────────────────────────────────────────────────────────

export const IMPORTANT_DUAS: PilgrimageDua[] = [
  {
    id: "talbiyah",
    nameTh: "ตัลบิยะห์",
    nameEn: "Talbiyah",
    occasionTh: "ฮัจญ์: กล่าวตั้งแต่อิห์รอมจนถึงก่อนขว้างหินแรก · อุมเราะห์: กล่าวจนถึงเริ่มเฏาวาฟ",
    occasionEn:
      "Hajj: From Ihram until before the first stoning · Umrah: From Ihram until the start of Tawaf",
    arabic:
      "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    transliteration:
      "Labbayk Allāhumma labbayk, labbayk lā sharīka laka labbayk, innal ḥamda wan-ni'mata laka wal-mulk, lā sharīka lak",
    translationTh:
      "ฉันตอบรับ โอ้อัลลอฮ์ ฉันตอบรับ ฉันตอบรับ ไม่มีภาคีสำหรับพระองค์ ฉันตอบรับ แท้จริงการสรรเสริญ ความโปรดปราน และอาณาจักรเป็นของพระองค์ ไม่มีภาคีสำหรับพระองค์",
    translationEn:
      "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Indeed all praise, grace, and sovereignty belong to You. You have no partner.",
  },
  {
    id: "tawaf-start",
    nameTh: "ดุอาอ์เริ่มเฏาวาฟ (ที่ฮะญัรอัสวัด)",
    nameEn: "Du'a at Start of Tawaf (Hajar al-Aswad)",
    occasionTh: "กล่าวทุกครั้งที่ผ่านหรือชี้ไปยังฮะญัรอัสวัด",
    occasionEn: "Recited each time passing or pointing toward Hajar al-Aswad",
    arabic:
      "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ ﷺ",
    transliteration:
      "Bismillāhi wallāhu akbar, Allāhumma īmānan bika wa taṣdīqan bikitābika wa wafā'an bi'ahdika wattibā'an lisunnati nabiyyika Muḥammadin ﷺ",
    translationTh:
      "ด้วยพระนามของอัลลอฮ์ และอัลลอฮ์ทรงยิ่งใหญ่ โอ้อัลลอฮ์ ด้วยศรัทธาต่อพระองค์ ยืนยันคัมภีร์ของพระองค์ ปฏิบัติตามพันธสัญญา และปฏิบัติตามซุนนะห์ของนบีมุฮัมมัด ﷺ",
    translationEn:
      "In the name of Allah and Allah is the Greatest. O Allah, with faith in You, believing in Your Book, fulfilling Your covenant, and following the Sunnah of Your Prophet Muhammad ﷺ",
  },
  {
    id: "between-corners",
    nameTh: "ดุอาอ์ระหว่างมุมยะมานีและฮะญัรอัสวัด",
    nameEn: "Du'a Between Yemeni Corner and Hajar al-Aswad",
    occasionTh: "กล่าวในช่วงสุดท้ายของแต่ละรอบเฏาวาฟ",
    occasionEn: "Recited in the last portion of each Tawaf round",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār",
    translationTh:
      "โอ้พระเจ้าของเรา โปรดประทานสิ่งดีในโลกดุนยา และสิ่งดีในโลกอาคิเราะห์ และปกป้องเราจากการลงโทษของไฟนรก",
    translationEn:
      "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
  },
  {
    id: "safa-dua",
    nameTh: "ดุอาอ์ที่เนินศอฟา",
    nameEn: "Du'a at Safa Hill",
    occasionTh: "กล่าวเมื่อขึ้นเนินศอฟา ซ้ำ 3 ครั้ง",
    occasionEn: "Recited upon ascending Safa, repeated 3 times",
    arabic:
      "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Innas-ṣafā wal-marwata min sha'ā'irillāh, abd'u bimā bada'allāhu bih, lā ilāha illallāhu waḥdahu lā sharīka lah, lahul mulku wa lahul ḥamdu wa huwa 'alā kulli shay'in qadīr",
    translationTh:
      "แท้จริง อัศ-ศอฟาและอัล-มัรวะห์เป็นส่วนหนึ่งจากเครื่องหมายของอัลลอฮ์ ฉันเริ่มด้วยสิ่งที่อัลลอฮ์เริ่มด้วย ไม่มีพระเจ้าอื่นนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคี อาณาจักรและการสรรเสริญเป็นของพระองค์ พระองค์ทรงอานุภาพเหนือทุกสิ่ง",
    translationEn:
      "Indeed Safa and Marwah are among the signs of Allah. I begin with what Allah has begun. There is no god but Allah alone, with no partner. His is the sovereignty and His is the praise, and He is over all things Powerful.",
  },
  {
    id: "arafah-dua",
    nameTh: "ดุอาอ์วุกูฟที่อะรอฟะห์",
    nameEn: "Du'a at Arafah",
    occasionTh: "ดุอาอ์ที่ดีที่สุดคือวันอะรอฟะห์",
    occasionEn: "The best du'a is the du'a on the Day of Arafah",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul mulku wa lahul ḥamd, wa huwa 'alā kulli shay'in qadīr",
    translationTh:
      "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคีสำหรับพระองค์ อาณาจักรและการสรรเสริญเป็นของพระองค์ และพระองค์ทรงอานุภาพเหนือทุกสิ่ง",
    translationEn:
      "There is no god but Allah alone, with no partner. His is the sovereignty and His is the praise, and He is over all things Powerful.",
  },
  {
    id: "stoning-dua",
    nameTh: "ดุอาอ์ขว้างหิน",
    nameEn: "Du'a When Throwing Pebbles",
    occasionTh: "กล่าวทุกครั้งที่ขว้างหิน",
    occasionEn: "Recited with each pebble thrown",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
    transliteration: "Bismillāhi wallāhu akbar",
    translationTh: "ด้วยพระนามของอัลลอฮ์ และอัลลอฮ์ทรงยิ่งใหญ่",
    translationEn: "In the name of Allah, and Allah is the Greatest.",
  },
  {
    id: "zamzam-dua",
    nameTh: "ดุอาอ์ดื่มน้ำซัมซัม",
    nameEn: "Du'a When Drinking Zamzam",
    occasionTh: "กล่าวก่อนดื่มน้ำซัมซัม",
    occasionEn: "Recited before drinking Zamzam water",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    transliteration:
      "Allāhumma innī as'aluka 'ilman nāfi'an wa rizqan wāsi'an wa shifā'an min kulli dā'",
    translationTh:
      "โอ้อัลลอฮ์ แท้จริงฉันขอจากพระองค์ซึ่งความรู้ที่เป็นประโยชน์ ปัจจัยยังชีพที่กว้างขวาง และการรักษาจากทุกโรคภัย",
    translationEn:
      "O Allah, I ask You for beneficial knowledge, abundant provision, and cure from every illness.",
  },
  {
    id: "enter-makkah",
    nameTh: "ดุอาอ์เข้าเมืองมักกะห์",
    nameEn: "Du'a Entering Makkah City",
    occasionTh: "กล่าวเมื่อแรกเห็นเมืองมักกะห์ ก่อนเข้าเขตฮะรัม",
    occasionEn: "Recited upon first seeing Makkah, before entering the Haram boundary",
    arabic:
      "اللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ، فَحَرِّمْنِي عَلَى النَّارِ، وَأَمِّنِّي مِنْ عَذَابِكَ يَوْمَ تَبْعَثُ عِبَادَكَ، وَاجْعَلْنِي مِنْ أَوْلِيَائِكَ وَأَهْلِ طَاعَتِكَ",
    transliteration:
      "Allāhumma hādhā ḥaramuka wa amnuka, fa-ḥarrimnī 'alan-nār, wa aminnī min 'adhābika yawma tab'athu 'ibādaka, waj'alnī min awliyā'ika wa ahli ṭā'atik",
    translationTh:
      "โอ้อัลลอฮ์ นี่คือเขตศักดิ์สิทธิ์ของพระองค์และความปลอดภัยของพระองค์ ขอให้ฉันเป็นที่ต้องห้ามสำหรับไฟนรก ปกป้องฉันจากการลงโทษของพระองค์ในวันที่พระองค์จะทรงฟื้นคืนบ่าวทั้งหลาย และขอให้ฉันเป็นหนึ่งในวะลีของพระองค์และผู้เชื่อฟังพระองค์",
    translationEn:
      "O Allah, this is Your sanctuary and Your place of security. Forbid me from the Fire, protect me from Your punishment on the Day You resurrect Your servants, and make me among Your close friends and those obedient to You.",
  },
  {
    id: "enter-haram",
    nameTh: "ดุอาอ์เข้ามัสยิดฮะรอม",
    nameEn: "Du'a Entering Masjid al-Haram",
    occasionTh: "กล่าวเมื่อก้าวเข้าสู่มัสยิดฮะรอม (ใช้กับการเข้ามัสยิดทุกแห่ง)",
    occasionEn: "Recited when entering Masjid al-Haram (applies to entering any mosque)",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَامِ",
    transliteration: "Allāhumma antas-salāmu wa minkas-salāmu, faḥayyinā rabbanā bis-salām",
    translationTh:
      "โอ้อัลลอฮ์ พระองค์คือสันติสุข และจากพระองค์มาซึ่งสันติสุข โอ้พระเจ้าของเรา โปรดทรงให้เราดำรงชีวิตด้วยสันติสุข",
    translationEn:
      "O Allah, You are Peace and from You comes peace. O our Lord, greet us with peace.",
  },
  {
    id: "maqam-ibrahim",
    nameTh: "ดุอาอ์ละหมาดหลังมะกอมอิบรอฮีม",
    nameEn: "Du'a at Maqam Ibrahim (after Tawaf prayer)",
    occasionTh: "กล่าวในละหมาด 2 ร็อกอะห์ หลังเฏาวาฟ ณ มะกอมอิบรอฮีม",
    occasionEn: "Recited in the 2 rak'ah prayer after Tawaf behind Maqam Ibrahim",
    arabic:
      "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ. رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    transliteration:
      "Rabbi aj'alnī muqīmas-ṣalāti wa min dhurriyyatī, Rabbanā wa taqabbal du'ā'. Rabbanāghfir lī wa liwālidayya wa lil-mu'minīna yawma yaqūmul-ḥisāb",
    translationTh:
      "โอ้พระเจ้าของฉัน โปรดให้ฉันและลูกหลานของฉันดำรงการละหมาด โอ้พระเจ้าของเรา โปรดรับดุอาอ์ของฉัน โอ้พระเจ้าของเรา โปรดอภัยให้แก่ฉัน พ่อแม่ของฉัน และบรรดาผู้ศรัทธา ในวันที่การตัดสินถูกสถาปนา (QS. Ibrahim: 40–41)",
    translationEn:
      "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication. Our Lord, forgive me and my parents and the believers the Day the account is established. (QS. Ibrahim: 40–41)",
  },
  {
    id: "dua-marwah",
    nameTh: "ดุอาอ์ที่เนินมัรวะห์",
    nameEn: "Du'a at Marwah Hill",
    occasionTh: "กล่าวเมื่อขึ้นเนินมัรวะห์ในแต่ละรอบคู่ (รอบ 2, 4, 6)",
    occasionEn: "Recited upon ascending Marwah in even-numbered rounds (2nd, 4th, 6th)",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ",
    transliteration:
      "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul mulku wa lahul ḥamdu wa huwa 'alā kulli shay'in qadīr. Lā ilāha illallāhu waḥdah, anjaza wa'dah, wa naṣara 'abdah, wa hazamal aḥzāba waḥdah",
    translationTh:
      "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคี อาณาจักรและการสรรเสริญเป็นของพระองค์ พระองค์ทรงอานุภาพเหนือทุกสิ่ง ไม่มีพระเจ้าอื่นนอกจากอัลลอฮ์ผู้เดียว พระองค์ทรงทำตามสัญญา ช่วยเหลือบ่าวของพระองค์ และทรงเอาชนะพันธมิตรศัตรูด้วยพระองค์เอง",
    translationEn:
      "There is no god but Allah alone with no partner. His is the sovereignty and His is the praise, and He is over all things Powerful. There is no god but Allah alone — He fulfilled His promise, supported His servant, and defeated the allied forces alone.",
  },
];

// ── Madinah Ziyarah (สถานที่สำคัญในมะดีนะห์) ──────────────────────────────
// คนไทยส่วนใหญ่จะต่อมะดีนะห์หลังฮัจญ์หรืออุมเราะห์

export const MADINAH_SITES: MadinahSite[] = [
  {
    id: "masjid-nabawi",
    nameTh: "มัสยิดนะบะวี",
    nameEn: "Masjid al-Nabawi",
    nameAr: "المسجد النبوي",
    icon: "🕌",
    descTh: "มัสยิดของท่านนบี ﷺ — มัสยิดศักดิ์สิทธิ์อันดับ 2 ในโลกอิสลาม ละหมาด 1 ร็อกอะห์ที่นี่มีผลบุญเท่ากับ 1,000 ร็อกอะห์ที่มัสยิดอื่น (ยกเว้นมัสยิดฮะรอม)",
    descEn: "The Prophet's ﷺ Mosque — the 2nd holiest mosque in Islam. One prayer here equals 1,000 prayers elsewhere (except Masjid al-Haram).",
    importanceTh: "ละหมาดในมัสยิดนะบะวีมีผลบุญมหาศาล เป็นจุดหมายหลักของผู้มาเยือนมะดีนะห์",
    importanceEn: "Praying here carries immense reward and is the primary destination for Madinah visitors.",
    tipTh: "แนะนำให้ละหมาดฟัจร์ที่มัสยิดนะบะวีอย่างน้อย 1 ครั้ง",
    tipEn: "It is highly recommended to pray Fajr at Masjid al-Nabawi at least once.",
  },
  {
    id: "rawdah",
    nameTh: "เราเฎาะห์ (สวนสวรรค์)",
    nameEn: "Al-Rawdah al-Sharifah",
    nameAr: "الروضة الشريفة",
    icon: "🌿",
    descTh: "พื้นที่ระหว่างมิมบัรและห้องของท่านนบี ﷺ — ท่านนบีกล่าวว่า 'ระหว่างบ้านของฉันและมิมบัรของฉันคือสวนหนึ่งจากสวนสวรรค์' (HR. Bukhari 1196)",
    descEn: "The area between the Prophet's ﷺ pulpit and his chamber — The Prophet said: 'Between my house and my pulpit is a garden from the gardens of Paradise.' (HR. Bukhari 1196)",
    importanceTh: "ละหมาดและดุอาอ์ในเราเฎาะห์มีความประเสริฐสูงมาก",
    importanceEn: "Prayer and supplication within al-Rawdah carries immense virtue.",
    tipTh: "พื้นที่นี้มีผู้คนมากในช่วงฮัจญ์ ควรไปในเวลาที่ไม่พลุกพล่าน เช่น หลังละหมาดตะฮัจญุด",
    tipEn: "This area is very crowded during Hajj season. Consider visiting after Tahajjud prayer.",
  },
  {
    id: "qabr-nabawi",
    nameTh: "สุสานนะบะวี (เยี่ยมท่านนบี ﷺ)",
    nameEn: "Visiting the Prophet's ﷺ Grave",
    nameAr: "زيارة قبر النبي ﷺ",
    icon: "🤲",
    descTh: "เยี่ยมสุสานท่านนบี ﷺ อบูบักร และอุมัร กล่าวสลาม: اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    descEn: "Visit the graves of the Prophet ﷺ, Abu Bakr, and Umar. Say salutation: Allahumma salli ala Muhammad wa ala ali Muhammad.",
    importanceTh: "ท่านนบีกล่าว: 'ผู้ใดเยี่ยมฉันหลังจากฉันเสียชีวิต เปรียบเสมือนได้เยี่ยมฉันในขณะที่ฉันยังมีชีวิตอยู่'",
    importanceEn: "The Prophet ﷺ said: 'Whoever visits me after my death is like one who visited me during my lifetime.'",
    tipTh: "ห้ามทำเฏาวาฟรอบสุสาน และห้ามขอดุอาอ์ต่อท่านนบีโดยตรง — ควรขอต่ออัลลอฮ์เท่านั้น",
    tipEn: "Do NOT circumambulate the grave. Do NOT make du'a directly to the Prophet — supplicate to Allah alone.",
  },
  {
    id: "masjid-quba",
    nameTh: "มัสยิดกุบาอ์",
    nameEn: "Masjid Quba",
    nameAr: "مسجد قباء",
    icon: "🕌",
    descTh: "มัสยิดแห่งแรกที่ถูกสร้างในอิสลาม ท่านนบี ﷺ กล่าว: 'ผู้ใดทำวุฎูอ์ที่บ้าน แล้วมาละหมาดที่มัสยิดกุบาอ์ จะได้รับผลบุญเหมือนอุมเราะห์หนึ่งครั้ง' (HR. Ibn Majah 1412)",
    descEn: "The first mosque built in Islam. The Prophet ﷺ said: 'Whoever makes ablution at home and prays at Masjid Quba will have a reward like Umrah.' (HR. Ibn Majah 1412)",
    importanceTh: "ละหมาด 2 ร็อกอะห์ที่มัสยิดกุบาอ์มีผลบุญเทียบเท่าอุมเราะห์หนึ่งครั้ง",
    importanceEn: "Praying 2 rak'ah here equals the reward of one Umrah.",
    tipTh: "ห่างจากมัสยิดนะบะวีประมาณ 5 กม. มีรถบัสรับส่งจากบริเวณมัสยิดนะบะวี",
    tipEn: "Located ~5 km from Masjid al-Nabawi. Buses available from the Nabawi area.",
  },
  {
    id: "baqi",
    nameTh: "สุสานบะกีอ์",
    nameEn: "Al-Baqi' Cemetery",
    nameAr: "البقيع",
    icon: "🪦",
    descTh: "สุสานแห่งมะดีนะห์ที่ฝังศพซอฮาบะห์และบุคคลสำคัญ รวมถึงลูกๆ และภรรยาของท่านนบี ﷺ",
    descEn: "Madinah's main cemetery where many Companions and family members of the Prophet ﷺ are buried.",
    importanceTh: "ท่านนบีเยี่ยมบะกีอ์บ่อยครั้งและสอนดุอาอ์เยี่ยมสุสาน",
    importanceEn: "The Prophet ﷺ frequently visited al-Baqi' and taught the du'a for visiting graves.",
    tipTh: "กล่าวสลาม: السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ",
    tipEn: "Greet with: As-salamu alaykum ahl al-diyar minal mu'minina wal-muslimin",
  },
  {
    id: "jabal-uhud",
    nameTh: "ภูเขาอุฮุด",
    nameEn: "Mount Uhud",
    nameAr: "جبل أحد",
    icon: "⛰️",
    descTh: "สถานที่แห่งสงครามอุฮุดที่ท่านนบีและซอฮาบะห์ต่อสู้ ที่นี่ฝังศพท่านฮัมซะห์ (ลุงของท่านนบี) และซอฮาบะห์ผู้พลีชีพ 70 ท่าน",
    descEn: "Site of the Battle of Uhud. Hamzah (the Prophet's uncle) and 70 martyred Companions are buried here.",
    importanceTh: "ท่านนบีกล่าวว่าอุฮุดรักเรา และเรารักมัน — เป็นสุนนะห์ที่ดีในการเยี่ยม",
    importanceEn: "The Prophet ﷺ said 'Uhud loves us and we love it.' — It is a praiseworthy Sunnah to visit.",
    tipTh: "ห่างจากมัสยิดนะบะวีประมาณ 5 กม. ควรเยี่ยมในตอนเช้า",
    tipEn: "Located ~5 km from Masjid al-Nabawi. Best visited in the morning.",
  },
];
