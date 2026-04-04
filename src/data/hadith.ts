export type Hadith = {
  id: number;
  arabic: string;
  translationEn: string;
  translationTh: string;
  narrator: string;
  source: string;
};

export const HADITH: Hadith[] = [
  {
    id: 1,
    arabic:
      "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translationEn:
      "Actions are judged by intentions, and every person will get what they intended.",
    translationTh:
      "การกระทำทั้งหลายขึ้นอยู่กับเจตนา และทุกคนจะได้รับในสิ่งที่ตนตั้งใจ",
    narrator: "Umar ibn al-Khattab (RA)",
    source: "HR. al-Bukhari No. 1, Muslim No. 1907",
  },
  {
    id: 2,
    arabic:
      "الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ، وَبَيْنَهُمَا أُمُورٌ مُشْتَبِهَاتٌ",
    translationEn:
      "The halal is clear and the haram is clear, and between them are doubtful matters.",
    translationTh:
      "สิ่งที่ฮาลาลนั้นชัดเจน และสิ่งที่ฮะรอมก็ชัดเจน และระหว่างทั้งสองมีเรื่องที่ยังคลุมเครืออยู่",
    narrator: "al-Nu'man ibn Bashir (RA)",
    source: "HR. al-Bukhari No. 52, Muslim No. 1599",
  },
  {
    id: 3,
    arabic:
      "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translationEn:
      "None of you truly believes until he loves for his brother what he loves for himself.",
    translationTh:
      "ไม่มีผู้ใดในหมู่พวกท่านศรัทธาอย่างแท้จริง จนกว่าเขาจะรักให้แก่พี่น้องของเขาในสิ่งที่เขารักให้แก่ตัวเอง",
    narrator: "Anas ibn Malik (RA)",
    source: "HR. al-Bukhari No. 13, Muslim No. 45",
  },
  {
    id: 4,
    arabic:
      "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translationEn:
      "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    translationTh:
      "ผู้ใดที่ศรัทธาต่ออัลลอฮ์และวันแห่งการฟื้นคืนชีพ ให้กล่าวในสิ่งที่ดีหรือไม่ก็นิ่งเสีย",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 6018, Muslim No. 47",
  },
  {
    id: 5,
    arabic: "الطَّهُورُ شَطْرُ الْإِيمَانِ",
    translationEn: "Cleanliness is half of faith.",
    translationTh: "ความสะอาดคือครึ่งหนึ่งของอีหม่าน",
    narrator: "Abu Malik al-Ash'ari (RA)",
    source: "HR. Muslim No. 223",
  },
  {
    id: 6,
    arabic:
      "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    translationEn:
      "The strong man is not the one who is physically powerful, but the one who controls himself when angry.",
    translationTh:
      "คนเข้มแข็งไม่ใช่คนที่มีพลังร่างกาย แต่คือคนที่ควบคุมตัวเองได้ขณะที่โกรธ",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 6114, Muslim No. 2609",
  },
  {
    id: 7,
    arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا",
    translationEn:
      "Make things easy and do not make them difficult; give glad tidings and do not drive people away.",
    translationTh:
      "จงทำให้ง่ายและอย่าทำให้ยาก จงให้ข่าวดีและอย่าทำให้หนีห่าง",
    narrator: "Anas ibn Malik (RA)",
    source: "HR. al-Bukhari No. 69, Muslim No. 1734",
  },
  {
    id: 8,
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    translationEn: "Your smile in the face of your brother is charity (sadaqa).",
    translationTh: "รอยยิ้มของท่านต่อหน้าพี่น้องของท่านคือการทำทาน",
    narrator: "Abu Dharr al-Ghifari (RA)",
    source: "HR. at-Tirmidzi No. 1956",
  },
  {
    id: 9,
    arabic:
      "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translationEn: "The best among you are those who learn the Quran and teach it.",
    translationTh: "ผู้ที่ดีที่สุดในหมู่พวกท่านคือผู้ที่เรียนอัลกุรอานและสอนอัลกุรอาน",
    narrator: "Uthman ibn Affan (RA)",
    source: "HR. al-Bukhari No. 5027",
  },
  {
    id: 10,
    arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
    translationEn: "Seeking knowledge is an obligation upon every Muslim.",
    translationTh: "การแสวงหาความรู้เป็นหน้าที่ที่วาญิบสำหรับมุสลิมทุกคน",
    narrator: "Anas ibn Malik (RA)",
    source: "HR. Ibn Majah No. 224",
  },
  {
    id: 11,
    arabic:
      "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    translationEn:
      "This world is a prison for the believer and a paradise for the disbeliever.",
    translationTh:
      "โลกดุนยาคือคุกของผู้ศรัทธาและสวรรค์ของผู้ปฏิเสธ",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. Muslim No. 2956",
  },
  {
    id: 12,
    arabic:
      "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ",
    translationEn:
      "Be in this world as though you were a stranger or a traveler (passing through).",
    translationTh:
      "จงเป็นอยู่ในโลกนี้ราวกับว่าท่านเป็นคนแปลกหน้าหรือผู้เดินทางผ่าน",
    narrator: "Ibn Umar (RA)",
    source: "HR. al-Bukhari No. 6416",
  },
  {
    id: 13,
    arabic:
      "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    translationEn:
      "The most beloved deeds to Allah are those performed consistently, even if they are few.",
    translationTh:
      "การกระทำที่อัลลอฮ์ทรงรักมากที่สุดคือสิ่งที่ทำอย่างสม่ำเสมอ แม้จะน้อยก็ตาม",
    narrator: "Aisha (RA)",
    source: "HR. al-Bukhari No. 6465, Muslim No. 783",
  },
  {
    id: 14,
    arabic:
      "لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ",
    translationEn:
      "Allah will not show mercy to one who does not show mercy to people.",
    translationTh:
      "อัลลอฮ์จะไม่ทรงเมตตาผู้ที่ไม่แสดงความเมตตาต่อผู้คน",
    narrator: "Jarir ibn Abdullah (RA)",
    source: "HR. al-Bukhari No. 7376, Muslim No. 2319",
  },
  {
    id: 15,
    arabic:
      "لَا تَغْضَبْ",
    translationEn:
      "Do not be angry. (The Prophet repeated this three times.)",
    translationTh:
      "อย่าโกรธ (ท่านนบีกล่าวซ้ำสามครั้ง)",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 6116",
  },
  {
    id: 16,
    arabic:
      "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    translationEn:
      "Allah does not look at your appearances or your wealth, but He looks at your hearts and your deeds.",
    translationTh:
      "อัลลอฮ์ไม่ทรงดูรูปร่างหน้าตาและทรัพย์สมบัติของพวกท่าน แต่ทรงดูที่หัวใจและการกระทำของพวกท่าน",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. Muslim No. 2564",
  },
  {
    id: 17,
    arabic:
      "الدَّالُّ عَلَى الْخَيْرِ كَفَاعِلِهِ",
    translationEn:
      "The one who guides another to something good has the same reward as the doer.",
    translationTh:
      "ผู้ที่ชี้นำสู่ความดีจะได้รับรางวัลเท่ากับผู้กระทำสิ่งดีนั้น",
    narrator: "Anas ibn Malik (RA)",
    source: "HR. Muslim No. 1893, at-Tirmidzi No. 2670",
  },
  {
    id: 18,
    arabic:
      "كُلُّ مَعْرُوفٍ صَدَقَةٌ",
    translationEn:
      "Every act of goodness is charity (sadaqa).",
    translationTh:
      "ทุกการกระทำความดีคือการทำทาน",
    narrator: "Jabir ibn Abdullah (RA)",
    source: "HR. al-Bukhari No. 6021, Muslim No. 1005",
  },
  {
    id: 19,
    arabic:
      "مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ",
    translationEn:
      "Whoever does not thank people does not thank Allah.",
    translationTh:
      "ผู้ที่ไม่ขอบคุณผู้คนก็ไม่ขอบคุณอัลลอฮ์",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. Abu Dawud No. 4811, at-Tirmidzi No. 1954",
  },
  {
    id: 20,
    arabic:
      "الْمُسْلِمُ أَخُو الْمُسْلِمِ لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ",
    translationEn:
      "A Muslim is a brother of another Muslim; he does not oppress him nor does he abandon him.",
    translationTh:
      "มุสลิมคือพี่น้องของมุสลิมด้วยกัน เขาไม่กดขี่เพื่อนมุสลิมและไม่ทอดทิ้งเพื่อนมุสลิม",
    narrator: "Abdullah ibn Umar (RA)",
    source: "HR. al-Bukhari No. 2442, Muslim No. 2580",
  },
  {
    id: 21,
    arabic:
      "لَيْسَ الْمُؤْمِنُ بِالطَّعَّانِ وَلَا اللَّعَّانِ وَلَا الْفَاحِشِ وَلَا الْبَذِيءِ",
    translationEn:
      "The believer is not one who taunts, curses, uses obscene language, or insults.",
    translationTh:
      "ผู้ศรัทธาไม่ใช่ผู้ที่ยั่วยุ สาปแช่ง ใช้ภาษาหยาบคาย หรือดูหมิ่นผู้อื่น",
    narrator: "Abdullah ibn Masud (RA)",
    source: "HR. at-Tirmidzi No. 1977",
  },
  {
    id: 22,
    arabic:
      "مَا أَنْزَلَ اللَّهُ مِنْ دَاءٍ إِلَّا أَنْزَلَ لَهُ شِفَاءً",
    translationEn:
      "There is no disease that Allah has created except that He also has created its treatment.",
    translationTh:
      "ไม่มีโรคใดที่อัลลอฮ์ทรงลงมา เว้นแต่พระองค์ได้ทรงลงยารักษาสำหรับมันด้วย",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 5678",
  },
  {
    id: 23,
    arabic:
      "الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ",
    translationEn: "Modesty (haya) is a branch of faith.",
    translationTh: "ความละอายชั่ว (หะยา) คือสาขาหนึ่งของอีหม่าน",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 9, Muslim No. 35",
  },
  {
    id: 24,
    arabic:
      "مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ",
    translationEn:
      "Whoever of you sees an evil, let him change it with his hand; if he cannot, then with his tongue; if he cannot, then with his heart — and that is the weakest of faith.",
    translationTh:
      "ผู้ใดในหมู่พวกท่านเห็นสิ่งมุงกัร ให้เขาเปลี่ยนแปลงมันด้วยมือของเขา ถ้าไม่สามารถก็ด้วยลิ้น ถ้าไม่สามารถก็ด้วยหัวใจ และนั่นคืออีหม่านที่อ่อนแอที่สุด",
    narrator: "Abu Sa'id al-Khudri (RA)",
    source: "HR. Muslim No. 49",
  },
  {
    id: 25,
    arabic:
      "أَعْطُوا الْأَجِيرَ أَجْرَهُ قَبْلَ أَنْ يَجِفَّ عَرَقُهُ",
    translationEn:
      "Pay the worker his wages before his sweat dries.",
    translationTh:
      "จงจ่ายค่าตอบแทนแก่ลูกจ้างก่อนที่เหงื่อของเขาจะแห้ง",
    narrator: "Abdullah ibn Umar (RA)",
    source: "HR. Ibn Majah No. 2443",
  },
  {
    id: 26,
    arabic:
      "آيَةُ الْمُنَافِقِ ثَلَاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ",
    translationEn:
      "The signs of the hypocrite are three: when he speaks he lies, when he makes a promise he breaks it, and when he is trusted he betrays.",
    translationTh:
      "สัญลักษณ์ของคนมุนาฟิกมีสาม: เมื่อพูดเขาโกหก เมื่อสัญญาเขาผิดสัญญา และเมื่อได้รับความไว้วางใจเขาทรยศ",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 33, Muslim No. 59",
  },
  {
    id: 27,
    arabic:
      "يَتْبَعُ الْمَيِّتَ ثَلَاثَةٌ، فَيَرْجِعُ اثْنَانِ وَيَبْقَى وَاحِدٌ: يَتْبَعُهُ أَهْلُهُ وَمَالُهُ وَعَمَلُهُ، فَيَرْجِعُ أَهْلُهُ وَمَالُهُ وَيَبْقَى عَمَلُهُ",
    translationEn:
      "Three things follow the deceased: his family, his wealth, and his deeds. Two return and one remains — his family and wealth return, but his deeds remain with him.",
    translationTh:
      "สามสิ่งติดตามผู้ตาย: ครอบครัว ทรัพย์สิน และการงาน สองอย่างกลับและหนึ่งอยู่ คือครอบครัวและทรัพย์สินกลับไป แต่การงานยังคงอยู่กับเขา",
    narrator: "Anas ibn Malik (RA)",
    source: "HR. al-Bukhari No. 6514, Muslim No. 1631",
  },
  {
    id: 28,
    arabic:
      "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ",
    translationEn:
      "Allah is gentle and loves gentleness in all things.",
    translationTh:
      "อัลลอฮ์ทรงอ่อนโยนและทรงรักความอ่อนโยนในทุกกิจการ",
    narrator: "Aisha (RA)",
    source: "HR. al-Bukhari No. 6927, Muslim No. 2165",
  },
  {
    id: 29,
    arabic:
      "مَنْ كَانَ لَهُ مَظْلَمَةٌ لِأَخِيهِ مِنْ عِرْضِهِ أَوْ شَيْءٍ، فَلْيَتَحَلَّلْهُ مِنْهُ الْيَوْمَ",
    translationEn:
      "Whoever has wronged his brother regarding his honor or anything else, let him seek his pardon today (before the Day of Resurrection).",
    translationTh:
      "ผู้ใดที่ได้ทำผิดต่อพี่น้องของตนในเรื่องเกียรติหรือสิ่งใดก็ตาม จงขอขมาวันนี้ ก่อนวันกิยามะห์",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 2449",
  },
  {
    id: 30,
    arabic:
      "أَفْضَلُ الصَّدَقَةِ أَنْ تَصَدَّقَ وَأَنْتَ صَحِيحٌ شَحِيحٌ، تَأْمُلُ الْغِنَى وَتَخْشَى الْفَقْرَ",
    translationEn:
      "The best charity is that given when you are healthy and miserly, hoping for wealth and fearing poverty.",
    translationTh:
      "ทานที่ดีที่สุดคือทานที่ให้ขณะที่ท่านมีสุขภาพดีและตระหนี่ หวังความมั่งคั่งและกลัวความยากจน",
    narrator: "Abu Hurayrah (RA)",
    source: "HR. al-Bukhari No. 1419, Muslim No. 1032",
  },
];

/** Get the hadith for today (rotates by day-of-month) */
export function getDailyHadith(): Hadith {
  const day = new Date().getDate(); // 1-31
  return HADITH[(day - 1) % HADITH.length]!;
}
