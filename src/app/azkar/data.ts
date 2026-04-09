export type AzkarItem = {
  id: string;
  session: "morning" | "evening";
  arabic: string;
  transliterationEn: string;
  translationEn: string;
  translationTh: string;
  count: number;
  source: string;
  notesEn: string | null;
  notesTh: string | null;
  benefitsEn: string;
  benefitsTh: string;
};

export const AZKAR: AzkarItem[] = [
  // =================== MORNING ===================
  {
    id: "m-ayat-kursi",
    session: "morning",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliterationEn:
      "Allahu la ilaha illa huwl-hayyul-qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translationEn:
      "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
    translationTh:
      "อัลลอฮ์ ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ ผู้ทรงมีชีวิตนิรันดร์ ทรงดำรงอยู่ด้วยพระองค์เอง ความง่วงนอนและการหลับใหลไม่อาจครอบงำพระองค์...",
    count: 1,
    source: "QS. Al-Baqarah: 255",
    notesEn: "Recite once after Fajr prayer.",
    notesTh: "อ่าน 1 ครั้งหลังละหมาดฟัจร์",
    benefitsEn:
      "Whoever recites Ayat al-Kursi in the morning will be under Allah's protection until evening. It is the greatest verse in the Quran, affirming Allah's absolute sovereignty.",
    benefitsTh:
      "ผู้ใดอ่านอายะตุลกุรสีในยามเช้าจะอยู่ภายใต้การคุ้มครองของอัลลอฮ์จนถึงยามเย็น เป็นอายะห์ที่ยิ่งใหญ่ที่สุดในอัลกุรอาน ยืนยันอำนาจอธิปไตยของอัลลอฮ์อย่างสมบูรณ์",
  },
  {
    id: "m-ikhlas",
    session: "morning",
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    transliterationEn:
      "Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translationEn:
      "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    translationTh:
      "จงกล่าวว่า พระองค์คืออัลลอฮ์ผู้ทรงเป็นหนึ่งเดียว อัลลอฮ์ผู้ทรงเป็นที่พึ่งพา พระองค์ไม่ทรงให้กำเนิดและไม่ถูกให้กำเนิด และไม่มีผู้ใดเสมอเหมือนพระองค์",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite 3x in the morning and 3x in the evening.",
    notesTh: "อ่าน 3 ครั้งในยามเช้าและ 3 ครั้งในยามเย็น",
    benefitsEn:
      "Reciting Al-Ikhlas 3x is equivalent in reward to reciting the entire Quran once. It contains the pure monotheism (Tawhid) of Allah in its most concise form.",
    benefitsTh:
      "การอ่านอัล-อิคลาศ 3 ครั้งมีผลบุญเทียบเท่าการอ่านอัลกุรอานทั้งเล่ม 1 จบ เป็นสูเราะห์ที่กล่าวถึงเตาฮีดของอัลลอฮ์อย่างสมบูรณ์และกระชับที่สุด",
  },
  {
    id: "m-falaq",
    session: "morning",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliterationEn:
      "Qul a'udhu bi rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translationEn:
      "Say: I seek refuge in the Lord of daybreak from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    translationTh:
      "จงกล่าวว่า ฉันขอความคุ้มครองจากพระเจ้าแห่งรุ่งอรุณ จากความชั่วร้ายของสิ่งที่พระองค์ทรงสร้าง และจากความชั่วร้ายของความมืดมิดเมื่อมันปกคลุม",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite together with Al-Ikhlas and An-Nas, 3x each.",
    notesTh: "อ่านพร้อมกับอัล-อิคลาศและอัน-นาส ครั้งละ 3 ครั้ง",
    benefitsEn:
      "Al-Falaq seeks Allah's protection from all external harms — creatures, darkness, black magic, and envy. The Prophet ﷺ said these three surahs are sufficient for every matter.",
    benefitsTh:
      "อัล-ฟะลัก ขอความคุ้มครองจากอัลลอฮ์จากอันตรายภายนอกทั้งหมด ไม่ว่าจะเป็นสิ่งมีชีวิต ความมืด ไสยศาสตร์ และความอิจฉา ท่านนบี ﷺ กล่าวว่าสามสูเราะห์นี้เพียงพอสำหรับทุกเรื่อง",
  },
  {
    id: "m-nas",
    session: "morning",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
    transliterationEn:
      "Qul a'udhu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translationEn:
      "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind — from among the jinn and mankind.",
    translationTh:
      "จงกล่าวว่า ฉันขอความคุ้มครองจากพระเจ้าแห่งมนุษย์ ราชาแห่งมนุษย์ พระเจ้าแห่งมนุษย์ จากความชั่วร้ายของผู้กระซิบกระซาบที่ซ่อนตัว ผู้กระซิบในจิตใจของมนุษย์ จากญิ้นและมนุษย์",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite together with Al-Ikhlas and Al-Falaq, 3x each.",
    notesTh: "อ่านพร้อมกับอัล-อิคลาศและอัล-ฟะลัก ครั้งละ 3 ครั้ง",
    benefitsEn:
      "An-Nas protects from internal spiritual harms — the whisperings of Shaytan that enter the heart. Together with Al-Falaq, they guard against both external and internal evil.",
    benefitsTh:
      "อัน-นาส คุ้มครองจากอันตรายทางจิตวิญญาณภายใน ได้แก่ การกระซิบของชัยฏอนที่เข้าสู่ใจ เมื่อร่วมกับอัล-ฟะลัก จะป้องกันทั้งความชั่วภายนอกและภายใน",
  },
  {
    id: "m-asbahnaa",
    session: "morning",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliterationEn:
      "Asbahnaa wa asbahal-mulku lillah, walhamdu lillah, wa la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
    translationEn:
      "We have entered the morning and the entire kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things omnipotent. My Lord, I ask You for the good of this day and the good of what follows it...",
    translationTh:
      "เราได้เข้าสู่ยามเช้าและอาณาจักรทั้งหมดเป็นของอัลลอฮ์ การสรรเสริญทั้งหมดเป็นของอัลลอฮ์ ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์เพียงองค์เดียว...",
    count: 1,
    source: "HR. Muslim No. 2723",
    notesEn: "Recite once in the morning. The evening version replaces 'morning' with 'evening'.",
    notesTh: "อ่าน 1 ครั้งในยามเช้า โดยในเวอร์ชันเย็นจะเปลี่ยนคำว่า 'เช้า' เป็น 'เย็น'",
    benefitsEn:
      "A comprehensive morning supplication that declares Allah's sovereignty, asks for all good of the day, and seeks protection from laziness, bad old age, hellfire, and the torment of the grave.",
    benefitsTh:
      "ดุอาเช้าที่ครอบคลุม ประกาศอำนาจอธิปไตยของอัลลอฮ์ ขอสิ่งดีทั้งหมดของวัน และขอความคุ้มครองจากความเกียจคร้าน ความชราที่ไม่ดี ไฟนรก และการลงโทษในหลุมฝังศพ",
  },
  {
    id: "m-bika-asbahnaa",
    session: "morning",
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliterationEn:
      "Allahumma bika asbahnaa, wa bika amsaynaa, wa bika nahya, wa bika namutu wa ilaikan-nushur.",
    translationEn:
      "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    translationTh:
      "โอ้อัลลอฮ์ ด้วยพระองค์เราได้เข้าสู่ยามเช้า และด้วยพระองค์เราได้เข้าสู่ยามเย็น ด้วยพระองค์เราดำรงชีวิต และด้วยพระองค์เราสิ้นชีวิต และการฟื้นคืนชีพสู่พระองค์",
    count: 1,
    source: "HR. Abu Dawud No. 5068, at-Tirmidzi No. 3391",
    notesEn:
      "The evening version ends with 'wa ilaykal-masir' (to You is the final return) instead of 'an-nushur' (the resurrection).",
    notesTh: "เวอร์ชันเย็นจบด้วย 'วะอิลัยกัลมะศีร์' (สู่พระองค์คือจุดหมาย) แทน 'อัน-นุชูร'",
    benefitsEn:
      "A declaration of complete dependence on Allah in all states — morning, evening, life, and death. It strengthens the believer's awareness that every moment is under Allah's will.",
    benefitsTh:
      "การประกาศการพึ่งพาอัลลอฮ์โดยสมบูรณ์ในทุกสภาวะ ไม่ว่าจะเป็นยามเช้า ยามเย็น ชีวิต และความตาย เสริมสร้างความตระหนักรู้ว่าทุกขณะอยู่ภายใต้พระประสงค์ของอัลลอฮ์",
  },
  {
    id: "m-lailaha",
    session: "morning",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliterationEn:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
    translationEn:
      "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things omnipotent.",
    translationTh:
      "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคีแก่พระองค์ พระองค์ทรงมีอำนาจอธิปไตย การสรรเสริญเป็นของพระองค์ และพระองค์ทรงอำนาจเหนือทุกสิ่ง",
    count: 10,
    source: "HR. Muslim No. 2693",
    notesEn:
      "Recite 10x in the morning. This dhikr earns 10 good deeds and erases 10 sins with each recitation.",
    notesTh: "อ่าน 10 ครั้งในยามเช้า การอ่านซิกรฺนี้ได้รับ 10 ความดีและลบ 10 ความผิดในแต่ละครั้ง",
    benefitsEn:
      "Whoever says this 10x in the morning: Allah records 100 good deeds, erases 100 sins, earns the reward of freeing 10 slaves, and is protected from Shaytan until evening. (HR. Muslim No. 2693)",
    benefitsTh:
      "ผู้ใดกล่าวสิ่งนี้ 10 ครั้งในยามเช้า อัลลอฮ์จะบันทึกความดี 100 ประการ ลบความผิด 100 ประการ ได้รับผลบุญเทียบเท่าการปลดปล่อยทาส 10 คน และได้รับการคุ้มครองจากชัยฏอนจนถึงยามเย็น (HR. Muslim No. 2693)",
  },
  {
    id: "m-sayyid",
    session: "morning",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliterationEn:
      "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya wa abu'u bidhanbi, faghfir li fa'innahu la yaghfirudh-dhunuba illa ant.",
    translationEn:
      "O Allah, You are my Lord. There is no god except You. You created me and I am Your servant. I am committed to Your covenant and promise as best I can. I seek Your protection from the evil of what I have done. I acknowledge Your blessing upon me and I acknowledge my sin. So forgive me, for none forgives sins except You.",
    translationTh:
      "โอ้อัลลอฮ์ พระองค์คือพระเจ้าของฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ พระองค์ทรงสร้างฉันและฉันคือบ่าวของพระองค์ ฉันยึดมั่นในพันธสัญญาและคำมั่นของพระองค์เท่าที่ฉันสามารถ ฉันขอความคุ้มครองจากความชั่วที่ฉันได้กระทำ ฉันยอมรับความโปรดปรานของพระองค์ต่อตัวฉัน และยอมรับในบาปของฉัน จึงขอให้ทรงอภัยแก่ฉัน เพราะไม่มีผู้ใดอภัยบาปได้นอกจากพระองค์",
    count: 1,
    source: "HR. al-Bukhari No. 6306",
    notesEn:
      "Called 'Sayyid al-Istighfar' — the master supplication for forgiveness. Recite once sincerely in the morning.",
    notesTh:
      "เรียกว่า 'ซัยยิดุลอิสติฆฟาร' คือดุอาขอมัฆฟิเราะห์ที่ยิ่งใหญ่ที่สุด อ่านด้วยความบริสุทธิ์ใจ 1 ครั้งในยามเช้า",
    benefitsEn:
      "Whoever recites this with certainty (yaqin) in the morning and dies that day before evening will enter Paradise. The Prophet ﷺ called it the master of all supplications for forgiveness. (HR. al-Bukhari No. 6306)",
    benefitsTh:
      "ผู้ใดอ่านสิ่งนี้ด้วยความมั่นใจในยามเช้าและเสียชีวิตก่อนยามเย็นจะเข้าสวรรค์ ท่านนบี ﷺ เรียกมันว่าซัยยิดุลอิสติฆฟาร ดุอาที่ยิ่งใหญ่ที่สุดสำหรับการขอการอภัย (HR. al-Bukhari No. 6306)",
  },
  {
    id: "m-bismillah",
    session: "morning",
    arabic:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliterationEn:
      "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim.",
    translationEn:
      "In the name of Allah, with Whose name nothing can cause harm on earth or in the heavens, and He is the All-Hearing, the All-Knowing.",
    translationTh:
      "ด้วยพระนามของอัลลอฮ์ ซึ่งไม่มีสิ่งใดสามารถทำอันตรายได้เมื่อออกพระนามของพระองค์ทั้งในแผ่นดินและฟ้า และพระองค์ทรงได้ยินทรงรอบรู้",
    count: 3,
    source: "HR. Abu Dawud No. 5088, at-Tirmidzi No. 3388",
    notesEn: "Recite 3x in the morning and 3x in the evening.",
    notesTh: "อ่าน 3 ครั้งในยามเช้าและ 3 ครั้งในยามเย็น",
    benefitsEn:
      "Whoever recites this 3x in the morning will not be harmed by anything until evening. Whoever recites it 3x in the evening will not be harmed by anything until morning. (HR. Abu Dawud No. 5088)",
    benefitsTh:
      "ผู้ใดอ่านสิ่งนี้ 3 ครั้งในยามเช้าจะไม่ได้รับอันตรายจากสิ่งใดจนถึงยามเย็น และผู้ใดอ่าน 3 ครั้งในยามเย็นจะไม่ได้รับอันตรายจากสิ่งใดจนถึงยามเช้า (HR. Abu Dawud No. 5088)",
  },
  {
    id: "m-raditu",
    session: "morning",
    arabic:
      "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    transliterationEn:
      "Raditu billahi rabban, wa bil-islami dinan, wa bi-muhammadin sallallahu 'alayhi wa sallama nabiyyan.",
    translationEn:
      "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.",
    translationTh:
      "ฉันพอใจที่มีอัลลอฮ์เป็นพระเจ้า อิสลามเป็นศาสนา และมุฮัมมัด ศ็อลลัลลอฮุอะลัยฮิวะซัลลัม เป็นนบี",
    count: 3,
    source: "HR. Abu Dawud No. 5072, at-Tirmidzi No. 3389",
    notesEn: "Recite 3x in the morning and 3x in the evening.",
    notesTh: "อ่าน 3 ครั้งในยามเช้าและ 3 ครั้งในยามเย็น",
    benefitsEn:
      "Whoever recites this 3x, Allah has the right to please him on the Day of Resurrection. (HR. Abu Dawud No. 5072). This dhikr renews your pledge of contentment with Allah's decree every morning.",
    benefitsTh:
      "ผู้ใดกล่าวสิ่งนี้ 3 ครั้ง อัลลอฮ์มีสิทธิ์ที่จะทำให้เขาพอใจในวันกิยามะห์ (HR. Abu Dawud No. 5072) การซิกรฺนี้เป็นการต่ออายุคำมั่นของความพอใจในพระประสงค์ของอัลลอฮ์ทุกเช้า",
  },
  {
    id: "m-afiyah",
    session: "morning",
    arabic:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
    transliterationEn:
      "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyata fi dini wa dunyaya wa ahli wa mali. Allahummas-tur 'awrati wa amin raw'ati. Allahumma ihfazni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi'azamatika an ughtala min tahti.",
    translationEn:
      "O Allah, I ask You for pardon and well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion and worldly life, my family and wealth. O Allah, conceal my faults and calm my fears. O Allah, guard me from in front and behind, from my right and left, and from above. And I seek protection in Your greatness from being unexpectedly harmed from below.",
    translationTh:
      "โอ้อัลลอฮ์ ฉันขอให้พระองค์ทรงอภัยและให้อาฟิยะห์ในโลกนี้และโลกหน้า โอ้อัลลอฮ์ ฉันขอให้พระองค์ทรงอภัยและให้อาฟิยะห์ในศาสนาของฉัน ชีวิตดุนยา ครอบครัว และทรัพย์สินของฉัน โอ้อัลลอฮ์ โปรดทรงปกปิดข้อบกพร่องของฉันและทำให้ความกลัวของฉันสงบลง โอ้อัลลอฮ์ โปรดทรงคุ้มครองฉันทั้งข้างหน้า ข้างหลัง ทางขวา ทางซ้าย และจากข้างบน และฉันขอความคุ้มครองด้วยความยิ่งใหญ่ของพระองค์จากอันตรายที่มาจากข้างล่าง",
    count: 1,
    source: "HR. Abu Dawud No. 5074, Ibn Majah No. 3871",
    notesEn:
      "One of the most comprehensive supplications in the morning adhkar — covers protection from all six directions.",
    notesTh: "หนึ่งในดุอาที่ครอบคลุมที่สุดในอัซการเช้า ครอบคลุมการขอความคุ้มครองจากทั้ง 6 ทิศทาง",
    benefitsEn:
      "Ibn 'Umar رضي الله عنه reported that the Prophet ﷺ never abandoned these words morning or evening. They seek Allah's pardon and safety (al-'afiyah) — which scholars consider the most comprehensive blessing — for one's religion, worldly life, family, and wealth, along with protection from harm in all directions.",
    benefitsTh:
      "อิบนุ อุมัร รฏิยัลลอฮุอันฮุ รายงานว่าท่านนบี ﷺ ไม่เคยละทิ้งคำเหล่านี้ในยามเช้าหรือยามเย็น คำเหล่านี้ขอการอภัยและอาฟิยะห์ (ความปลอดภัยและสุขภาพ) ซึ่งนักวิชาการถือว่าเป็นนิอ์มะห์ที่ครอบคลุมที่สุด สำหรับศาสนา ชีวิตดุนยา ครอบครัว และทรัพย์สิน พร้อมทั้งการคุ้มครองจากอันตรายทุกทิศทาง",
  },
  {
    id: "m-afini-badani",
    session: "morning",
    arabic:
      "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    transliterationEn:
      "Allahumma 'afini fi badani. Allahumma 'afini fi sam'i. Allahumma 'afini fi basari. La ilaha illa ant.",
    translationEn:
      "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is none worthy of worship except You.",
    translationTh:
      "โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีแก่ร่างกายของฉัน โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีในการได้ยินของฉัน โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีในการมองเห็นของฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์",
    count: 3,
    source: "HR. Abu Dawud No. 5090",
    notesEn:
      "Recite 3x in both morning and evening. Covers three vital faculties: body, hearing, and sight.",
    notesTh:
      "อ่าน 3 ครั้งทั้งยามเช้าและยามเย็น ครอบคลุมสามสิ่งสำคัญ: ร่างกาย การได้ยิน และการมองเห็น",
    benefitsEn:
      "Abu Bakrah رضي الله عنه used to recite this 3x every morning and evening, having heard it from the Prophet ﷺ. Asking for 'afiyah (well-being) in the body, hearing, and sight is a recognition that these are gifts that can be taken away — and a daily acknowledgment of dependence on Allah for their preservation.",
    benefitsTh:
      "อบู บักเราะห์ รฏิยัลลอฮุอันฮุ อ่านสิ่งนี้ 3 ครั้งทุกเช้าและเย็น หลังจากได้ยินจากท่านนบี ﷺ การขออาฟิยะห์สำหรับร่างกาย การได้ยิน และการมองเห็น เป็นการยอมรับว่าสิ่งเหล่านี้คือของขวัญที่อาจถูกนำไปได้ และเป็นการแสดงความพึ่งพาต่ออัลลอฮ์ในการปกป้องรักษาสิ่งเหล่านี้ทุกวัน",
  },
  {
    id: "m-hasbiyallah",
    session: "morning",
    arabic:
      "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliterationEn:
      "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'azim.",
    translationEn:
      "Allah is sufficient for me. There is none worthy of worship but Him. In Him I place my trust, and He is the Lord of the Majestic Throne.",
    translationTh:
      "อัลลอฮ์เพียงพอสำหรับฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ ฉันวางใจในพระองค์ และพระองค์คือพระเจ้าแห่งบัลลังก์อันยิ่งใหญ่",
    count: 7,
    source: "HR. Abu Dawud No. 5081, as-Silsilah as-Sahihah No. 2753",
    notesEn: "Recite 7x in the morning and 7x in the evening.",
    notesTh: "อ่าน 7 ครั้งในยามเช้าและ 7 ครั้งในยามเย็น",
    benefitsEn:
      "Whoever recites this 7x in the morning and evening, Allah will suffice him in whatever concerns him in this world and the next. (HR. Abu Dawud No. 5081). The phrase 'Hasbiyallah' (Allah is sufficient) is a declaration of complete tawakkul — trusting Allah to handle all of one's affairs.",
    benefitsTh:
      "ผู้ใดกล่าวสิ่งนี้ 7 ครั้งในยามเช้าและยามเย็น อัลลอฮ์จะทรงเพียงพอสำหรับเขาในทุกสิ่งที่เขาเป็นห่วงทั้งในโลกนี้และโลกหน้า (HR. Abu Dawud No. 5081) คำว่า 'ฮัสบิยัลลอฮ์' เป็นการประกาศตะวักกุลอย่างสมบูรณ์ ฝากเรื่องทุกอย่างแก่อัลลอฮ์",
  },

  // =================== EVENING ===================
  {
    id: "e-ayat-kursi",
    session: "evening",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliterationEn:
      "Allahu la ilaha illa huwl-hayyul-qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translationEn:
      "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...",
    translationTh:
      "อัลลอฮ์ ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ ผู้ทรงมีชีวิตนิรันดร์ ทรงดำรงอยู่ด้วยพระองค์เอง ความง่วงนอนและการหลับใหลไม่อาจครอบงำพระองค์...",
    count: 1,
    source: "QS. Al-Baqarah: 255",
    notesEn: "Recite once after Maghrib prayer.",
    notesTh: "อ่าน 1 ครั้งหลังละหมาดมัฆริบ",
    benefitsEn:
      "Whoever recites Ayat al-Kursi in the evening will be under Allah's protection until morning. A guardian angel is appointed to protect him and Shaytan cannot approach him.",
    benefitsTh:
      "ผู้ใดอ่านอายะตุลกุรสีในยามเย็นจะอยู่ภายใต้การคุ้มครองของอัลลอฮ์จนถึงยามเช้า มีมะลาอิกะห์คอยปกป้องเขาและชัยฏอนไม่อาจเข้าใกล้ได้",
  },
  {
    id: "e-ikhlas",
    session: "evening",
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    transliterationEn:
      "Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    translationEn:
      "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.",
    translationTh:
      "จงกล่าวว่า พระองค์คืออัลลอฮ์ผู้ทรงเป็นหนึ่งเดียว อัลลอฮ์ผู้ทรงเป็นที่พึ่งพา พระองค์ไม่ทรงให้กำเนิดและไม่ถูกให้กำเนิด และไม่มีผู้ใดเสมอเหมือนพระองค์",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite 3x in the evening. Equal in reward to reciting the entire Quran.",
    notesTh: "อ่าน 3 ครั้งในยามเย็น มีผลบุญเทียบเท่าการอ่านอัลกุรอานทั้งเล่ม",
    benefitsEn:
      "Reciting Al-Ikhlas 3x is equivalent in reward to reciting the entire Quran once. It affirms the pure oneness of Allah and is a fortress of Tawhid against shirk.",
    benefitsTh:
      "การอ่านอัล-อิคลาศ 3 ครั้งมีผลบุญเทียบเท่าการอ่านอัลกุรอานทั้งเล่ม 1 จบ ยืนยันเอกภาพของอัลลอฮ์และเป็นป้อมปราการของเตาฮีดต่อต้านการตั้งภาคี",
  },
  {
    id: "e-falaq",
    session: "evening",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliterationEn:
      "Qul a'udhu bi rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",
    translationEn:
      "Say: I seek refuge in the Lord of daybreak from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.",
    translationTh:
      "จงกล่าวว่า ฉันขอความคุ้มครองจากพระเจ้าแห่งรุ่งอรุณ จากความชั่วร้ายของสิ่งที่พระองค์ทรงสร้าง และจากความชั่วร้ายของความมืดมิดเมื่อมันปกคลุม",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite 3x in the evening together with Al-Ikhlas and An-Nas.",
    notesTh: "อ่าน 3 ครั้งในยามเย็นพร้อมกับอัล-อิคลาศและอัน-นาส",
    benefitsEn:
      "Especially powerful in the evening as darkness (ghasiq) is specifically mentioned in the surah. Provides protection from the increased evil that comes with nightfall and during sleep.",
    benefitsTh:
      "มีพลังเป็นพิเศษในยามเย็น เนื่องจากความมืดมิด (ฆอสิก) ถูกกล่าวถึงโดยเฉพาะในสูเราะห์ ให้ความคุ้มครองจากความชั่วร้ายที่เพิ่มขึ้นเมื่อกลางคืนมาถึงและขณะนอนหลับ",
  },
  {
    id: "e-nas",
    session: "evening",
    arabic:
      "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَٰهِ النَّاسِ ۞ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",
    transliterationEn:
      "Qul a'udhu bi rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
    translationEn:
      "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer who whispers in the breasts of mankind — from among the jinn and mankind.",
    translationTh:
      "จงกล่าวว่า ฉันขอความคุ้มครองจากพระเจ้าแห่งมนุษย์ ราชาแห่งมนุษย์ พระเจ้าแห่งมนุษย์ จากความชั่วร้ายของผู้กระซิบกระซาบที่ซ่อนตัว ผู้กระซิบในจิตใจของมนุษย์ จากญิ้นและมนุษย์",
    count: 3,
    source: "HR. Abu Dawud No. 5082, at-Tirmidzi No. 3575",
    notesEn: "Recite 3x in the evening together with Al-Ikhlas and Al-Falaq.",
    notesTh: "อ่าน 3 ครั้งในยามเย็นพร้อมกับอัล-อิคลาศและอัล-ฟะลัก",
    benefitsEn:
      "An-Nas protects from Shaytan's whispering that intensifies at night. Together with Al-Falaq, they are a complete shield — one for external evil, one for internal evil.",
    benefitsTh:
      "อัน-นาส คุ้มครองจากการกระซิบของชัยฏอนที่เข้มข้นขึ้นในตอนกลางคืน เมื่อร่วมกับอัล-ฟะลัก จะเป็นโล่ป้องกันที่สมบูรณ์ — สูเราะห์หนึ่งสำหรับความชั่วภายนอก อีกสูเราะห์หนึ่งสำหรับความชั่วภายใน",
  },
  {
    id: "e-amsaynaa",
    session: "evening",
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    transliterationEn:
      "Amsaynaa wa amsal-mulku lillah, walhamdu lillah, wa la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir...",
    translationEn:
      "We have entered the evening and the entire kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things omnipotent. My Lord, I ask You for the good of this night and the good of what follows it...",
    translationTh:
      "เราได้เข้าสู่ยามเย็นและอาณาจักรทั้งหมดเป็นของอัลลอฮ์ การสรรเสริญทั้งหมดเป็นของอัลลอฮ์ ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์เพียงองค์เดียว...",
    count: 1,
    source: "HR. Muslim No. 2723",
    notesEn:
      "The evening counterpart of the morning dhikr 'Asbahnaa'. Changes 'morning/day' to 'evening/night'.",
    notesTh:
      "ซิกรฺยามเย็นที่คู่กันกับซิกรฺยามเช้า 'อัศบะห์นา' โดยเปลี่ยน 'เช้า/วัน' เป็น 'เย็น/คืน'",
    benefitsEn:
      "A comprehensive evening supplication seeking all the good of the night and seeking protection from laziness, evil old age, hellfire, and the torment of the grave. It mirrors the morning supplication, completing the circle of daily dhikr.",
    benefitsTh:
      "ดุอาเย็นที่ครอบคลุม ขอสิ่งดีทั้งหมดของคืน และขอความคุ้มครองจากความเกียจคร้าน ความชราที่ไม่ดี ไฟนรก และการลงโทษในหลุมฝังศพ เป็นคู่ของดุอาเช้าที่ทำให้วงกลมของการซิกรฺประจำวันสมบูรณ์",
  },
  {
    id: "e-bika-amsaynaa",
    session: "evening",
    arabic:
      "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliterationEn:
      "Allahumma bika amsaynaa, wa bika asbahnaa, wa bika nahya, wa bika namutu wa ilaykal-masir.",
    translationEn:
      "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.",
    translationTh:
      "โอ้อัลลอฮ์ ด้วยพระองค์เราได้เข้าสู่ยามเย็น และด้วยพระองค์เราได้เข้าสู่ยามเช้า ด้วยพระองค์เราดำรงชีวิต และด้วยพระองค์เราสิ้นชีวิต และการกลับสู่พระองค์",
    count: 1,
    source: "HR. Abu Dawud No. 5068, at-Tirmidzi No. 3391",
    notesEn:
      "Note the ending: 'al-masir' (final destination/return) in the evening version, vs. 'an-nushur' (resurrection) in the morning version.",
    notesTh:
      "สังเกตตอนท้าย: 'อัลมะศีร์' (จุดหมายปลายทาง) ในเวอร์ชันเย็น เทียบกับ 'อัน-นุชูร' (การฟื้นคืนชีพ) ในเวอร์ชันเช้า",
    benefitsEn:
      "Ends the day with a reminder that our ultimate destination is Allah. The word 'al-masir' (final return) is particularly fitting at night — a small death — reinforcing that all returns to Him.",
    benefitsTh:
      "ปิดวันด้วยการเตือนใจว่าจุดหมายสูงสุดของเราคืออัลลอฮ์ คำว่า 'อัลมะศีร์' (การกลับสู่พระองค์) เหมาะสมเป็นพิเศษในยามค่ำคืน ซึ่งเปรียบเสมือนการตายชั่วคราว เสริมย้ำว่าทุกสิ่งกลับสู่พระองค์",
  },
  {
    id: "e-lailaha",
    session: "evening",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliterationEn:
      "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir.",
    translationEn:
      "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things omnipotent.",
    translationTh:
      "ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์ผู้เดียว ไม่มีภาคีแก่พระองค์ พระองค์ทรงมีอำนาจอธิปไตย การสรรเสริญเป็นของพระองค์ และพระองค์ทรงอำนาจเหนือทุกสิ่ง",
    count: 10,
    source: "HR. Muslim No. 2693",
    notesEn: "Recite 10x in the evening. The same reward applies as for the morning recitation.",
    notesTh: "อ่าน 10 ครั้งในยามเย็น ผลบุญเหมือนกับการอ่านในยามเช้า",
    benefitsEn:
      "Whoever says this 10x in the evening: 100 good deeds recorded, 100 sins erased, reward of freeing 10 slaves, and protection from Shaytan until morning. (HR. Muslim No. 2693)",
    benefitsTh:
      "ผู้ใดกล่าวสิ่งนี้ 10 ครั้งในยามเย็น: บันทึกความดี 100 ประการ ลบความผิด 100 ประการ ผลบุญเทียบเท่าการปลดปล่อยทาส 10 คน และได้รับการคุ้มครองจากชัยฏอนจนถึงยามเช้า (HR. Muslim No. 2693)",
  },
  {
    id: "e-audhu",
    session: "evening",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliterationEn: "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
    translationEn:
      "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    translationTh:
      "ฉันขอความคุ้มครองด้วยพระวจนะอันสมบูรณ์ของอัลลอฮ์จากความชั่วร้ายของสิ่งที่พระองค์ทรงสร้าง",
    count: 3,
    source: "HR. Muslim No. 2709",
    notesEn: "Recite 3x in the evening. Specific to the evening adhkar.",
    notesTh: "อ่าน 3 ครั้งในยามเย็น เป็นอัซการเฉพาะยามเย็น",
    benefitsEn:
      "Whoever recites this in the evening will not be harmed by any creature, snake or scorpion, that night. (HR. Muslim No. 2709). The 'perfect words of Allah' refers to the Quran and all of His divine speech.",
    benefitsTh:
      "ผู้ใดอ่านสิ่งนี้ในยามเย็นจะไม่ได้รับอันตรายจากสัตว์ งู หรือแมงป่องใดๆ ในคืนนั้น (HR. Muslim No. 2709) 'พระวจนะอันสมบูรณ์ของอัลลอฮ์' หมายถึงอัลกุรอานและคำพูดศักดิ์สิทธิ์ทั้งหมดของพระองค์",
  },
  {
    id: "e-afuwwun",
    session: "evening",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliterationEn: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
    translationEn: "O Allah, indeed You are Pardoning and You love pardon, so pardon me.",
    translationTh: "โอ้อัลลอฮ์ แท้จริงพระองค์ทรงอภัยให้และทรงรักการอภัย โปรดทรงอภัยให้แก่ฉันด้วย",
    count: 3,
    source: "HR. Ibn Majah No. 3814, at-Tirmidzi No. 3513",
    notesEn:
      "This supplication was specifically taught by the Prophet ﷺ to Aisha رضي الله عنها to recite on Laylat al-Qadr, and it is also a general evening dhikr.",
    notesTh:
      "ดุอานี้ถูกสอนโดยท่านนบี ﷺ แก่ท่านหญิงอาอิชะห์ รฏิยัลลอฮุอันฮา สำหรับอ่านในคืนลัยละตุลก็อดร์ และยังเป็นอัซการเย็นทั่วไปด้วย",
    benefitsEn:
      "Al-'Afuww (the Pardoner) is one of Allah's most beloved names. Supplicating with this dhikr invokes Allah's quality of pardoning and His love for granting pardon — making it among the most hopeful of all supplications.",
    benefitsTh:
      "อัล-อะฟุวว์ (ผู้ทรงอภัย) เป็นหนึ่งในพระนามที่เป็นที่รักยิ่งของอัลลอฮ์ การวิงวอนด้วยซิกรฺนี้เรียกคุณลักษณะการอภัยของอัลลอฮ์และความรักของพระองค์ในการให้อภัย ทำให้เป็นหนึ่งในดุอาที่เต็มด้วยความหวังมากที่สุด",
  },
  {
    id: "e-sayyid",
    session: "evening",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliterationEn:
      "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya wa abu'u bidhanbi, faghfir li fa'innahu la yaghfirudh-dhunuba illa ant.",
    translationEn:
      "O Allah, You are my Lord. There is no god except You. You created me and I am Your servant. I am committed to Your covenant and promise as best I can. I seek Your protection from the evil of what I have done. I acknowledge Your blessing upon me and I acknowledge my sin. So forgive me, for none forgives sins except You.",
    translationTh:
      "โอ้อัลลอฮ์ พระองค์คือพระเจ้าของฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ พระองค์ทรงสร้างฉันและฉันคือบ่าวของพระองค์ ฉันยึดมั่นในพันธสัญญาและคำมั่นของพระองค์เท่าที่ฉันสามารถ ฉันขอความคุ้มครองจากความชั่วที่ฉันได้กระทำ ฉันยอมรับความโปรดปรานของพระองค์ต่อตัวฉัน และยอมรับในบาปของฉัน จึงขอให้ทรงอภัยแก่ฉัน เพราะไม่มีผู้ใดอภัยบาปได้นอกจากพระองค์",
    count: 1,
    source: "HR. al-Bukhari No. 6306, 6307",
    notesEn:
      "Evening version of Sayyid al-Istighfar. Whoever recites it with certainty (yaqin) in the evening and dies that night before morning will enter Paradise.",
    notesTh:
      "ซัยยิดุลอิสติฆฟาร์ เวอร์ชันยามเย็น ผู้ใดอ่านด้วยความมั่นใจในยามเย็นและเสียชีวิตก่อนรุ่งอรุณจะเข้าสวรรค์",
    benefitsEn:
      "Whoever recites this with certainty (yaqin) in the evening and dies before morning will enter Paradise. (HR. al-Bukhari No. 6307). This supplication is a complete spiritual act — acknowledging lordship, servitude, covenant, sin, blessing, and seeking forgiveness all in one breath. Scholars call it the 'master of supplications for forgiveness'.",
    benefitsTh:
      "ผู้ใดอ่านสิ่งนี้ด้วยความมั่นใจในยามเย็นและเสียชีวิตก่อนรุ่งอรุณจะเข้าสวรรค์ (HR. al-Bukhari No. 6307) ดุอานี้เป็นการกระทำทางจิตวิญญาณที่ครบถ้วน ประกอบด้วยการยอมรับความเป็นเจ้า การเป็นบ่าว พันธสัญญา บาป ความโปรดปราน และการขอการอภัย ทั้งหมดในครั้งเดียว นักวิชาการเรียกว่า 'ซัยยิดุลอิสติฆฟาร์'",
  },
  {
    id: "e-afini-badani",
    session: "evening",
    arabic:
      "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    transliterationEn:
      "Allahumma 'afini fi badani. Allahumma 'afini fi sam'i. Allahumma 'afini fi basari. La ilaha illa ant.",
    translationEn:
      "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is none worthy of worship except You.",
    translationTh:
      "โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีแก่ร่างกายของฉัน โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีในการได้ยินของฉัน โอ้อัลลอฮ์ โปรดทรงประทานสุขภาพที่ดีในการมองเห็นของฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์",
    count: 3,
    source: "HR. Abu Dawud No. 5090",
    notesEn: "Same supplication as the morning. Recite 3x in the evening.",
    notesTh: "ดุอาเดียวกันกับยามเช้า อ่าน 3 ครั้งในยามเย็น",
    benefitsEn:
      "Closing the day with a request for well-being in body, hearing, and sight — the three faculties most used throughout the day. A daily reminder that these blessings are from Allah and a supplication for their preservation through the night.",
    benefitsTh:
      "ปิดวันด้วยการขอสุขภาพที่ดีในร่างกาย การได้ยิน และการมองเห็น ซึ่งเป็นสามสิ่งที่ใช้งานมากที่สุดตลอดวัน เป็นการเตือนใจทุกวันว่าความโปรดปรานเหล่านี้มาจากอัลลอฮ์ และเป็นดุอาขอการปกป้องรักษาตลอดคืน",
  },
  {
    id: "e-hasbiyallah",
    session: "evening",
    arabic:
      "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliterationEn:
      "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul-'arshil-'azim.",
    translationEn:
      "Allah is sufficient for me. There is none worthy of worship but Him. In Him I place my trust, and He is the Lord of the Majestic Throne.",
    translationTh:
      "อัลลอฮ์เพียงพอสำหรับฉัน ไม่มีพระเจ้าอื่นใดนอกจากพระองค์ ฉันวางใจในพระองค์ และพระองค์คือพระเจ้าแห่งบัลลังก์อันยิ่งใหญ่",
    count: 7,
    source: "HR. Abu Dawud No. 5081, as-Silsilah as-Sahihah No. 2753",
    notesEn: "Recite 7x in the evening. Ending the day with tawakkul upon Allah.",
    notesTh: "อ่าน 7 ครั้งในยามเย็น ปิดวันด้วยตะวักกุลต่ออัลลอฮ์",
    benefitsEn:
      "Whoever recites this 7x in the evening, Allah will suffice him in whatever concerns him in this world and the next. (HR. Abu Dawud No. 5081). Saying this at the end of the day surrenders all remaining worries of the day to Allah — affirming that He alone is enough.",
    benefitsTh:
      "ผู้ใดกล่าวสิ่งนี้ 7 ครั้งในยามเย็น อัลลอฮ์จะทรงเพียงพอสำหรับเขาในทุกสิ่งที่เขาเป็นห่วงทั้งในโลกนี้และโลกหน้า (HR. Abu Dawud No. 5081) การกล่าวสิ่งนี้ตอนท้ายวันคือการมอบความกังวลทั้งหมดที่เหลืออยู่แก่อัลลอฮ์ ยืนยันว่าพระองค์เพียงพอ",
  },
  {
    id: "e-niamah",
    session: "evening",
    arabic:
      "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
    transliterationEn:
      "Allahumma ma amsa bi min ni'matin aw bi'ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",
    translationEn:
      "O Allah, whatever blessing I or any of Your creation have entered upon this evening, it is from You alone, without partner. All praise and thanks belong to You.",
    translationTh:
      "โอ้อัลลอฮ์ ความโปรดปรานใดก็ตามที่ฉันหรือสิ่งที่พระองค์ทรงสร้างได้รับในยามเย็นนี้ ล้วนมาจากพระองค์ผู้เดียว ไม่มีภาคีแก่พระองค์ การสรรเสริญและการขอบคุณทั้งหมดเป็นของพระองค์",
    count: 1,
    source: "HR. Abu Dawud No. 5073",
    notesEn:
      "The morning version replaces 'amsa' (evening) with 'asbaha' (morning). Whoever recites either version has fulfilled the gratitude of that part of the day.",
    notesTh:
      "เวอร์ชันเช้าเปลี่ยน 'อัมสา' (เย็น) เป็น 'อัศบะหะ' (เช้า) ผู้ใดอ่านเวอร์ชันใดก็ตามจะถือว่าได้แสดงความขอบคุณในช่วงเวลานั้นของวันครบถ้วน",
    benefitsEn:
      "Whoever recites this in the evening has fulfilled the gratitude for all blessings of that evening. The Prophet ﷺ said: whoever says this has given thanks for that day. It is a comprehensive acknowledgment that every blessing, big or small, comes solely from Allah.",
    benefitsTh:
      "ผู้ใดอ่านสิ่งนี้ในยามเย็นถือว่าได้แสดงความขอบคุณสำหรับความโปรดปรานทั้งหมดของยามเย็นนั้น ท่านนบี ﷺ กล่าวว่า ผู้ใดกล่าวสิ่งนี้ถือว่าได้ขอบคุณในวันนั้นแล้ว เป็นการยอมรับอย่างครอบคลุมว่าความโปรดปราน ไม่ว่าจะมากหรือน้อย ล้วนมาจากอัลลอฮ์เพียงผู้เดียว",
  },
];
