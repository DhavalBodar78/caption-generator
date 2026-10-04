/*
 * Template bank. Placeholders:
 *   {t} = topic as typed, {T} = short topic in CAPS (on-screen).
 * On-screen lines mark the money word(s) with *stars*.
 */
window.CG = window.CG || {};

CG.TONES = ['funny', 'savage', 'motivational', 'emotional', 'roast', 'storytelling', 'informative', 'trendy'];

CG.LANG_NAMES = {
  en: 'English',
  hi: 'Hindi',
  gu: 'Gujarati',
  hinglish: 'Hinglish',
  gujlish: 'Gujlish',
};

CG.TONE_CTA = {
  funny: 'tag', savage: 'comment', motivational: 'save', emotional: 'share',
  roast: 'tag', storytelling: 'follow', informative: 'save', trendy: 'share',
};

CG.TONE_EMOJIS = {
  funny: ['😂', '🤣', '😅', '🙈', '💀', '😜', '🤪', '😆'],
  savage: ['😤', '🔥', '💅', '😏', '🗿', '⚡', '🙄', '👑'],
  motivational: ['💪', '🔥', '🚀', '🏆', '✨', '💯', '🎯', '⚡'],
  emotional: ['🥺', '❤️', '✨', '🌙', '🤍', '😢', '🫶', '💫'],
  roast: ['💀', '😂', '🔥', '🤡', '😭', '👀', '🫠', '🙃'],
  storytelling: ['📖', '👀', '✨', '🎬', '⏳', '💭', '🔥', '😮'],
  informative: ['💡', '📌', '🧠', '✅', '📊', '👇', '🔑', '📝'],
  trendy: ['✨', '😎', '🔥', '💫', '🎶', '🕶️', '💯', '🌈'],
};

CG.TONE_TAGS = {
  funny: '#FunnyReels', savage: '#SavageMode', motivational: '#Motivation', emotional: '#FeelItAll',
  roast: '#RoastReels', storytelling: '#StoryTime', informative: '#LearnOnReels', trendy: '#TrendAlert',
};

CG.LANG_TAGS = {
  en: ['#ReelsViral', '#TrendingNow', '#ExplorePage'],
  hi: ['#HindiReels', '#ReelsIndia', '#DesiVibes'],
  gu: ['#GujaratiReels', '#GujjuVibes', '#Gujarat'],
  hinglish: ['#ReelsIndia', '#DesiReels', '#TrendingReels'],
  gujlish: ['#GujjuReels', '#GujaratiReels', '#GujjuVibes'],
};

CG.T = {
  en: {
    hooks: {
      funny: ['Me trying to figure out {t} like 😅', 'Nobody warned me {t} would be this chaotic'],
      savage: ['{t}? Most people are doing it wrong.', "Hot take: {t} isn't hard, you're just lazy."],
      motivational: ['{t} will change your life if you stop quitting.', 'One year of {t} = a completely new you.'],
      emotional: ['Nobody talks about how {t} really feels.', 'This is your sign about {t}.'],
      roast: ["POV: you said you'd start {t} \"next Monday\".", '{t} fans, we need to talk.'],
      storytelling: ["I tried {t} for 30 days. Here's what happened.", 'Let me tell you how {t} changed everything.'],
      informative: ['3 things about {t} nobody tells you.', "Here's {t} explained in 15 seconds."],
      trendy: ['{t} is the vibe this season ✨', "Everyone's talking about {t} — here's why."],
    },
    lines: {
      funny: ["Plot twist: I still have no idea what I'm doing.", "Laughing so I don't cry, honestly."],
      savage: ['Stay mad or start learning.', 'Not sorry for saying it.'],
      motivational: ['Start small. Stay consistent. Win big.', 'Your future self is watching.'],
      emotional: ['Some moments stay with you forever.', 'Hold on to the little things.'],
      roast: ["It's been 47 Mondays.", "Don't take this personally… actually, do."],
      storytelling: ['Day 1 was rough. Day 30? Unreal.', 'Wait for the ending.'],
      informative: ['Number 3 is the game-changer.', 'Save it now, thank me later.'],
      trendy: ["Don't be late to the trend.", 'Main character energy only.'],
    },
    screen: {
      funny: ['NOBODY *WARNED* ME', '{T} IS *CHAOS*', "I'M STILL *CONFUSED*", 'SEND *HELP*', '*FOLLOW* FOR MORE'],
      savage: ['HOT *TAKE*', "YOU'RE DOING IT *WRONG*", "{T} ISN'T *HARD*", 'STOP MAKING *EXCUSES*', '*COMMENT* BELOW'],
      motivational: ['START *TODAY*', '{T} CHANGES *EVERYTHING*', 'STAY *CONSISTENT*', 'NO MORE *EXCUSES*', '*SAVE* THIS'],
      emotional: ['NOBODY *TALKS* ABOUT THIS', '{T} HITS *DIFFERENT*', 'IT STAYS *FOREVER*', 'HOLD ON *TIGHT*', '*SHARE* WITH SOMEONE'],
      roast: ['WE NEED TO *TALK*', '{T} FANS BE LIKE', 'NEXT *MONDAY* AGAIN', "IT'S BEEN *47* MONDAYS", '*TAG* THAT FRIEND'],
      storytelling: ['*30 DAYS* OF {T}', 'DAY 1 WAS *ROUGH*', 'THEN THIS *HAPPENED*', 'WAIT FOR *IT*', '*FOLLOW* FOR PART 2'],
      informative: ['*3 THINGS* NOBODY SAYS', 'ABOUT {T}', 'NUMBER 3 IS *KEY*', 'SIMPLE BUT *POWERFUL*', '*SAVE* FOR LATER'],
      trendy: ['THE *VIBE* RIGHT NOW', '{T} IS *TRENDING*', "DON'T BE *LATE*", 'MAIN CHARACTER *ENERGY*', '*SHARE* THIS'],
    },
    cta: {
      tag: 'Tag a friend who needs to see this! 👇',
      save: 'Save this for later — you’ll thank me! 📌',
      comment: 'Comment your take below — agree or disagree? 💬',
      follow: 'Follow for Part 2 and more like this! 🔔',
      share: 'Share this with someone who needs it today! 📲',
    },
  },

  hinglish: {
    hooks: {
      funny: ['Main {t} samajhne ki koshish karte hue 😅', 'Kisi ne nahi bataya tha ki {t} itna chaotic hoga'],
      savage: ['{t}? 90% log galat kar rahe hain.', 'Seedhi baat: {t} mushkil nahi, tum lazy ho.'],
      motivational: ['{t} tumhari life badal dega, bas haar mat maano.', 'Ek saal {t} = ek naya tum.'],
      emotional: ['{t} ke baare mein koi baat nahi karta.', 'Ye tumhara sign hai — {t}.'],
      roast: ["POV: tumne bola tha {t} 'agle Monday' se.", '{t} wale log, humein baat karni hai.'],
      storytelling: ['Maine 30 din {t} try kiya. Dekho kya hua.', 'Batata hoon {t} ne sab kaise badal diya.'],
      informative: ['{t} ke baare mein 3 baatein jo koi nahi batata.', '{t} — 15 second mein samjho.'],
      trendy: ['{t} is season ka vibe hai ✨', 'Sab {t} ki baat kar rahe hain — kyun? Dekho.'],
    },
    lines: {
      funny: ['Plot twist: abhi bhi kuch samajh nahi aaya.', 'Hasna hi padega, aur kya karein.'],
      savage: ['Gussa karo ya seekh lo, choice tumhari.', 'Sorry nahi bolunga.'],
      motivational: ['Chhota shuru karo, roz karo, bada jeeto.', 'Tumhara future self dekh raha hai.'],
      emotional: ['Kuch pal hamesha yaad reh jaate hain.', 'Chhoti cheezon ko sambhal ke rakho.'],
      roast: ['47 Monday ho gaye bhai.', 'Dil pe mat lo… actually lo.'],
      storytelling: ['Din 1 mushkil tha. Din 30? Kamaal.', 'End tak dekhna.'],
      informative: ['Number 3 game-changer hai.', 'Save karo, baad mein thanks bolna.'],
      trendy: ['Trend miss mat karna.', 'Main character energy only.'],
    },
    screen: {
      funny: ['KISI NE NAHI *BATAYA*', '{T} MATLAB *CHAOS*', 'ABHI BHI *CONFUSED*', 'KOI *BACHAO*', '*FOLLOW* KARO'],
      savage: ['SEEDHI *BAAT*', 'TUM *GALAT* KAR RAHE', '{T} MUSHKIL *NAHI*', 'BAHANE *BAND* KARO', '*COMMENT* KARO'],
      motivational: ['AAJ SE *SHURU*', '{T} SAB *BADAL* DEGA', 'ROZ *CONSISTENT* RAHO', 'KOI *BAHANA* NAHI', '*SAVE* KARO'],
      emotional: ['KOI *BAAT* NAHI KARTA', '{T} DIL *CHHU* LETA', 'HAMESHA *YAAD* RAHEGA', '*SAMBHAL* KE RAKHO', '*SHARE* KARO'],
      roast: ['HUMEIN *BAAT* KARNI HAI', '{T} WALE LOG', 'AGLE *MONDAY* SE', '47 MONDAY *HO GAYE*', '*TAG* KARO USKO'],
      storytelling: ['*30 DIN* {T}', 'DIN 1 *MUSHKIL*', 'PHIR YE *HUA*', 'END TAK *DEKHO*', '*FOLLOW* PART 2'],
      informative: ['*3 BAATEIN* KOI NAHI BATATA', '{T} KE BAARE MEIN', 'NUMBER 3 *ZAROORI*', 'SIMPLE PAR *POWERFUL*', '*SAVE* KARO'],
      trendy: ['ABHI KA *VIBE*', '{T} *TRENDING* HAI', 'MISS MAT *KARNA*', 'MAIN CHARACTER *ENERGY*', '*SHARE* KARO'],
    },
    cta: {
      tag: 'Us dost ko tag karo jise ye dekhna chahiye! 👇',
      save: 'Save karo baad ke liye, kaam aayega! 📌',
      comment: 'Comment mein batao tumhara kya kehna hai! 💬',
      follow: 'Follow karo Part 2 aur aise content ke liye! 🔔',
      share: 'Share karo us insaan ke saath jise aaj iski zaroorat hai! 📲',
    },
  },

  gujlish: {
    hooks: {
      funny: ['Hu {t} samajhvano try karto hou 😅', 'Koi e kidhu j nahi ke {t} aatlu chaotic hase'],
      savage: ['{t}? 90% loko khotu kare che.', 'Sidhi vaat: {t} aghru nathi, tame aalsu cho.'],
      motivational: ['{t} tamari life badli dese, bas haar na mano.', 'Ek varsh {t} = ek nava tame.'],
      emotional: ['{t} vishe koi vaat nathi kartu.', 'Aa tamaro sign che — {t}.'],
      roast: ["POV: tame kidhu tu {t} 'aavta Monday' thi.", '{t} vala loko, aapde vaat karvi padse.'],
      storytelling: ['Me 30 divas {t} try karyu. Juo su thayu.', 'Kahu chu {t} e badhu kevi rite badli nakhyu.'],
      informative: ['{t} vishe 3 vaat je koi nathi kahetu.', '{t} — 15 second ma samjo.'],
      trendy: ['{t} aa season no vibe che ✨', 'Badha {t} ni vaat kare che — kem? Juo.'],
    },
    lines: {
      funny: ['Plot twist: haju pan kai samjayu nathi.', 'Hasvanu j che, biju su karie.'],
      savage: ['Gusso karo ke shikho, choice tamari.', 'Sorry nai kahu.'],
      motivational: ['Nanu sharu karo, roj karo, motu jeeto.', 'Tamaro future self joi rahyo che.'],
      emotional: ['Amuk pal hamesha yaad rahi jay che.', 'Nani nani vaato ne sachvi ne rakho.'],
      roast: ['47 Monday thai gaya bhai.', 'Dil par na lo… actually lo.'],
      storytelling: ['Divas 1 aghro hato. Divas 30? Kamaal.', 'End sudhi jojo.'],
      informative: ['Number 3 game-changer che.', 'Save karo, pachi thanks kehjo.'],
      trendy: ['Trend miss na karta.', 'Main character energy only.'],
    },
    screen: {
      funny: ['KOI E *KIDHU* J NAHI', '{T} ETLE *CHAOS*', 'HAJU PAN *CONFUSED*', 'KOI *BACHAVO*', '*FOLLOW* KARO'],
      savage: ['SIDHI *VAAT*', 'TAME *KHOTU* KARO CHO', '{T} AGHRU *NATHI*', 'BAHANA *BANDH* KARO', '*COMMENT* KARO'],
      motivational: ['AAJ THI *SHARU*', '{T} BADHU *BADLI* DESE', 'ROJ *CONSISTENT* RAHO', 'KOI *BAHANU* NAHI', '*SAVE* KARO'],
      emotional: ['KOI *VAAT* NATHI KARTU', '{T} DIL NE *SPARSHE*', 'HAMESHA *YAAD* RAHESE', '*SACHVI* NE RAKHO', '*SHARE* KARO'],
      roast: ['APDE *VAAT* KARVI PADSE', '{T} VALA LOKO', 'AAVTA *MONDAY* THI', '47 MONDAY *THAI GAYA*', '*TAG* KARO ENE'],
      storytelling: ['*30 DIVAS* {T}', 'DIVAS 1 *AGHRO*', 'PACHI AA *THAYU*', 'END SUDHI *JUO*', '*FOLLOW* PART 2'],
      informative: ['*3 VAAT* JE KOI NA KAHE', '{T} VISHE', 'NUMBER 3 *JARURI*', 'SIMPLE PAN *POWERFUL*', '*SAVE* KARO'],
      trendy: ['ATYAR NO *VIBE*', '{T} *TRENDING* CHE', 'MISS NA *KARTA*', 'MAIN CHARACTER *ENERGY*', '*SHARE* KARO'],
    },
    cta: {
      tag: 'Tag karo e dost ne jene aa jovu joie! 👇',
      save: 'Save karo pachi mate, kaam aavse! 📌',
      comment: 'Comment ma kaho tamaru su kehvu che! 💬',
      follow: 'Follow karo Part 2 ane aava content mate! 🔔',
      share: 'Share karo e vyakti sathe jene aaje aani jarur che! 📲',
    },
  },

  hi: {
    hooks: {
      funny: ['मैं {t} समझने की कोशिश करते हुए 😅', 'किसी ने नहीं बताया था कि {t} इतना उलझा होगा'],
      savage: ['{t}? 90% लोग गलत कर रहे हैं।', 'सीधी बात: {t} मुश्किल नहीं, तुम आलसी हो।'],
      motivational: ['{t} तुम्हारी ज़िंदगी बदल देगा, बस हार मत मानो।', 'एक साल {t} = एक नया तुम।'],
      emotional: ['{t} के बारे में कोई बात नहीं करता।', 'ये तुम्हारा इशारा है — {t}।'],
      roast: ["POV: तुमने कहा था {t} 'अगले सोमवार' से।", '{t} वाले लोगो, हमें बात करनी है।'],
      storytelling: ['मैंने 30 दिन {t} ट्राई किया। देखो क्या हुआ।', 'बताता हूँ {t} ने सब कैसे बदल दिया।'],
      informative: ['{t} की 3 बातें जो कोई नहीं बताता।', '{t} — 15 सेकंड में समझो।'],
      trendy: ['{t} इस सीज़न का वाइब है ✨', 'सब {t} की बात कर रहे हैं — क्यों? देखो।'],
    },
    lines: {
      funny: ['प्लॉट ट्विस्ट: अभी भी कुछ समझ नहीं आया।', 'हँसना ही पड़ेगा, और क्या करें।'],
      savage: ['गुस्सा करो या सीख लो, मर्ज़ी तुम्हारी।', 'माफ़ी नहीं माँगूँगा।'],
      motivational: ['छोटा शुरू करो, रोज़ करो, बड़ा जीतो।', 'तुम्हारा भविष्य तुम्हें देख रहा है।'],
      emotional: ['कुछ पल हमेशा याद रह जाते हैं।', 'छोटी चीज़ों को संभाल कर रखो।'],
      roast: ['47 सोमवार हो गए भाई।', 'दिल पे मत लो… असल में लो।'],
      storytelling: ['दिन 1 मुश्किल था। दिन 30? कमाल।', 'आखिर तक देखना।'],
      informative: ['नंबर 3 सबसे ज़रूरी है।', 'सेव करो, बाद में शुक्रिया कहना।'],
      trendy: ['ट्रेंड मिस मत करना।', 'मेन कैरेक्टर एनर्जी।'],
    },
    screen: {
      funny: ['किसी ने नहीं *बताया*', '{T} मतलब *अफरा-तफरी*', 'अभी भी *कन्फ्यूज़*', 'कोई *बचाओ*', '*फॉलो* करो'],
      savage: ['सीधी *बात*', 'तुम *गलत* कर रहे', '{T} मुश्किल *नहीं*', 'बहाने *बंद* करो', '*कमेंट* करो'],
      motivational: ['आज से *शुरू*', '{T} सब *बदल* देगा', 'रोज़ *लगातार* रहो', 'कोई *बहाना* नहीं', '*सेव* करो'],
      emotional: ['कोई *बात* नहीं करता', '{T} दिल *छू* लेता', 'हमेशा *याद* रहेगा', '*संभाल* कर रखो', '*शेयर* करो'],
      roast: ['हमें *बात* करनी है', '{T} वाले लोग', 'अगले *सोमवार* से', '47 सोमवार *हो गए*', '*टैग* करो उसको'],
      storytelling: ['*30 दिन* {T}', 'दिन 1 *मुश्किल*', 'फिर ये *हुआ*', 'आखिर तक *देखो*', '*फॉलो* पार्ट 2'],
      informative: ['*3 बातें* जो कोई नहीं बताता', '{T} के बारे में', 'नंबर 3 *ज़रूरी*', 'आसान पर *दमदार*', '*सेव* करो'],
      trendy: ['अभी का *वाइब*', '{T} *ट्रेंडिंग* है', 'मिस मत *करना*', 'मेन कैरेक्टर *एनर्जी*', '*शेयर* करो'],
    },
    cta: {
      tag: 'उस दोस्त को टैग करो जिसे ये देखना चाहिए! 👇',
      save: 'सेव करो, बाद में काम आएगा! 📌',
      comment: 'कमेंट में बताओ तुम्हारी क्या राय है! 💬',
      follow: 'पार्ट 2 और ऐसे कंटेंट के लिए फॉलो करो! 🔔',
      share: 'उसके साथ शेयर करो जिसे आज इसकी ज़रूरत है! 📲',
    },
  },

  gu: {
    hooks: {
      funny: ['હું {t} સમજવાનો પ્રયત્ન કરતો હોઉં 😅', 'કોઈએ કહ્યું જ નહીં કે {t} આટલું ગૂંચવાડાભર્યું હશે'],
      savage: ['{t}? 90% લોકો ખોટું કરે છે.', 'સીધી વાત: {t} અઘરું નથી, તમે આળસુ છો.'],
      motivational: ['{t} તમારી જિંદગી બદલી દેશે, બસ હાર ન માનો.', 'એક વર્ષ {t} = એક નવા તમે.'],
      emotional: ['{t} વિશે કોઈ વાત નથી કરતું.', 'આ તમારો સંકેત છે — {t}.'],
      roast: ["POV: તમે કહ્યું હતું {t} 'આવતા સોમવાર'થી.", '{t} વાળા લોકો, આપણે વાત કરવી પડશે.'],
      storytelling: ['મેં 30 દિવસ {t} ટ્રાય કર્યું. જુઓ શું થયું.', 'કહું છું {t} એ બધું કેવી રીતે બદલી નાખ્યું.'],
      informative: ['{t} વિશે 3 વાતો જે કોઈ નથી કહેતું.', '{t} — 15 સેકન્ડમાં સમજો.'],
      trendy: ['{t} આ સીઝનનો વાઇબ છે ✨', 'બધા {t} ની વાત કરે છે — કેમ? જુઓ.'],
    },
    lines: {
      funny: ['પ્લોટ ટ્વિસ્ટ: હજુ પણ કંઈ સમજાયું નથી.', 'હસવાનું જ છે, બીજું શું કરીએ.'],
      savage: ['ગુસ્સો કરો કે શીખો, પસંદગી તમારી.', 'માફી નહીં માગું.'],
      motivational: ['નાનું શરૂ કરો, રોજ કરો, મોટું જીતો.', 'તમારું ભવિષ્ય તમને જોઈ રહ્યું છે.'],
      emotional: ['અમુક પળો હંમેશા યાદ રહી જાય છે.', 'નાની નાની વાતોને સાચવીને રાખો.'],
      roast: ['47 સોમવાર થઈ ગયા ભાઈ.', 'દિલ પર ન લો… ખરેખર તો લો.'],
      storytelling: ['દિવસ 1 અઘરો હતો. દિવસ 30? કમાલ.', 'છેલ્લે સુધી જોજો.'],
      informative: ['નંબર 3 સૌથી જરૂરી છે.', 'સેવ કરો, પછી આભાર કહેજો.'],
      trendy: ['ટ્રેન્ડ મિસ ન કરતા.', 'મેઈન કેરેક્ટર એનર્જી.'],
    },
    screen: {
      funny: ['કોઈએ *કહ્યું* જ નહીં', '{T} એટલે *ગડબડ*', 'હજુ પણ *કન્ફ્યુઝ*', 'કોઈ *બચાવો*', '*ફોલો* કરો'],
      savage: ['સીધી *વાત*', 'તમે *ખોટું* કરો છો', '{T} અઘરું *નથી*', 'બહાના *બંધ* કરો', '*કમેન્ટ* કરો'],
      motivational: ['આજથી *શરૂ*', '{T} બધું *બદલી* દેશે', 'રોજ *સતત* રહો', 'કોઈ *બહાનું* નહીં', '*સેવ* કરો'],
      emotional: ['કોઈ *વાત* નથી કરતું', '{T} દિલને *સ્પર્શે*', 'હંમેશા *યાદ* રહેશે', '*સાચવીને* રાખો', '*શેર* કરો'],
      roast: ['આપણે *વાત* કરવી પડશે', '{T} વાળા લોકો', 'આવતા *સોમવારથી*', '47 સોમવાર *થઈ ગયા*', '*ટેગ* કરો એને'],
      storytelling: ['*30 દિવસ* {T}', 'દિવસ 1 *અઘરો*', 'પછી આ *થયું*', 'છેલ્લે સુધી *જુઓ*', '*ફોલો* પાર્ટ 2'],
      informative: ['*3 વાતો* જે કોઈ ન કહે', '{T} વિશે', 'નંબર 3 *જરૂરી*', 'સરળ પણ *દમદાર*', '*સેવ* કરો'],
      trendy: ['અત્યારનો *વાઇબ*', '{T} *ટ્રેન્ડિંગ* છે', 'મિસ ન *કરતા*', 'મેઈન કેરેક્ટર *એનર્જી*', '*શેર* કરો'],
    },
    cta: {
      tag: 'એ મિત્રને ટેગ કરો જેને આ જોવું જોઈએ! 👇',
      save: 'સેવ કરો, પછી કામ આવશે! 📌',
      comment: 'કમેન્ટમાં કહો તમારું શું કહેવું છે! 💬',
      follow: 'પાર્ટ 2 અને આવા કન્ટેન્ટ માટે ફોલો કરો! 🔔',
      share: 'એની સાથે શેર કરો જેને આજે આની જરૂર છે! 📲',
    },
  },
};
