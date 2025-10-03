import type { DrawingStyle } from './types';

interface StorySuggestion {
  title: string;
  characterDescription: string;
  batchPrompt: string;
}

export const storySuggestionsData: {
  [key in DrawingStyle]: {
    ar: StorySuggestion[];
    en: StorySuggestion[];
  }
} = {
  storybook: {
    ar: [
      {
        title: 'السحابة التي أرادت أن تمطر قوس قزح',
        characterDescription: 'غيمة بيضاء صغيرة ورقيقة اسمها "غيمو"، لها خدود وردية وعيون فضولية كبيرة.',
        batchPrompt: 'كان غيمو حزينًا لأنه لا يستطيع أن يمطر إلا ماءً رماديًا. رأى قوس قزح جميل وقرر أنه يريد أن يمطر ألوانًا. سافر عبر السماء، وجمع اللون الأحمر من الفراولة، والأصفر من الشمس، والأزرق من المحيط. في النهاية، أطلق مطرًا ملونًا رائعًا، جلب السعادة إلى الوادي بالأسفل.',
      },
      {
        title: 'الفأر الخباز والفطيرة المفقودة',
        characterDescription: 'فأر بني صغير اسمه "ريمي"، يرتدي قبعة طاهٍ بيضاء ومئزرًا صغيرًا ملطخًا بالدقيق.',
        batchPrompt: 'كان ريمي يشتهر بصنع أفضل فطائر الجبن في الغابة. في صباح مهرجان الغابة السنوي، اكتشف أن فطيرته الكبيرة قد اختفت. يتبع ريمي أثر فتات الجبن، مستجوبًا قطًا كسولًا وسنجابًا عصبيًا. يكتشف أن الفطيرة لم تسرق، بل أخذها مجموعة من صغار الحيوانات لمشاركتها مع الجميع في المهرجان.',
      },
    ],
    en: [
      {
        title: 'The Cloud Who Wanted to Rain a Rainbow',
        characterDescription: 'A small, fluffy white cloud named Nimbus with rosy cheeks and big, curious eyes.',
        batchPrompt: 'Nimbus was sad because he could only rain grey water. He saw a beautiful rainbow and decided he wanted to rain colors. He traveled across the sky, collecting red from strawberries, yellow from the sun, and blue from the ocean. Finally, he let out a magnificent, colorful shower, bringing happiness to the valley below.',
      },
      {
        title: 'The Mouse Baker and the Missing Pie',
        characterDescription: 'A tiny brown mouse named Remy, who wears a white chef\'s hat and a small, flour-dusted apron.',
        batchPrompt: 'Remy was famous for making the best cheese pie in the forest. On the morning of the annual Forest Festival, he discovers his grand pie has vanished. Remy follows a trail of cheese crumbs, questioning a lazy cat and a nervous squirrel. He discovers the pie wasn\'t stolen, but taken by a group of baby animals to share with everyone at the festival.',
      },
    ]
  },
  realistic: {
    ar: [
      {
        title: 'يوم في حياة حارس المنارة',
        characterDescription: 'رجل عجوز اسمه "توماس"، له لحية بيضاء كثيفة ووجه متجعد بفعل الطقس، يرتدي سترة صوفية ثقيلة.',
        batchPrompt: 'يستيقظ توماس مع أول ضوء للفجر في منارته المعزولة. يقوم بفحص المصباح الضخم، وتلميع النحاس، وتدوين ملاحظاته في سجله. تهب عاصفة مفاجئة، ويجب عليه العمل بجد للحفاظ على الضوء ساطعًا لسفينة صيد عالقة في البحر. تنتهي العاصفة، ويرى قوس قزح فوق البحر الهادئ، شاعرًا بالرضا عن عمله.',
      },
    ],
    en: [
      {
        title: 'A Day in the Life of a Lighthouse Keeper',
        characterDescription: 'An old man named Thomas, with a thick white beard and a weathered face, wearing a heavy wool sweater.',
        batchPrompt: 'Thomas wakes at first light in his isolated lighthouse. He inspects the giant lamp, polishes the brass, and makes notes in his logbook. A sudden storm rolls in, and he must work hard to keep the light shining for a fishing boat caught at sea. The storm passes, and he sees a rainbow over the calm water, feeling content with his work.',
      },
    ]
  },
  anime: {
    ar: [
      {
        title: 'مقهى بوابة الأبعاد',
        characterDescription: 'فتاة اسمها "يوكي"، لها شعر فضي قصير وعيون بلون البنفسج، ترتدي زي نادلة أنيق باللونين الأسود والأبيض.',
        batchPrompt: 'مقهى "بوابة الأبعاد" يخدم زبائن من عوالم مختلفة. في أحد الأيام، يدخل فارس من عالم خيالي يبحث عن سيفه المفقود، تليه فتاة سايبورغ من المستقبل تبحث عن شريحة ذاكرة. يساعدهم يوكي باستخدام قدرته على رؤية الخيوط المتصلة بالأشياء المفقودة. يكتشفون أن أغراضهم قد تبادلت عن طريق الخطأ عبر بوابة زمنية وعليهم العمل معًا لاستعادتها.',
      },
    ],
    en: [
      {
        title: 'The Dimensional Gate Cafe',
        characterDescription: 'A girl named Yuki, with short silver hair and violet eyes, wearing a chic black and white waitress uniform.',
        batchPrompt: 'The Dimensional Gate Cafe serves customers from different worlds. One day, a knight from a fantasy realm comes in looking for his lost sword, followed by a cyborg girl from the future looking for a memory chip. Yuki helps them using her ability to see the threads connected to lost items. They discover their items were accidentally swapped through a time portal and must work together to get them back.',
      },
    ]
  },
  cartoon: {
    ar: [
      {
        title: 'السنجاب الذي جمع الكثير من الجوز',
        characterDescription: 'سنجاب ممتلئ ومفرط النشاط اسمه "ناتي"، له أسنان أمامية كبيرة وذيل كثيف للغاية.',
        batchPrompt: 'يصاب ناتي بالهوس بجمع الجوز لفصل الشتاء، ويملأ شجرته بالكامل حتى لا يتبقى مكان للنوم. يحاول تخزين الجوز في أماكن أخرى: جحر أرنب، عش طائر، وحتى منزل دب غاضب. تحدث فوضى عارمة. في النهاية، يتعلم ناتي أن المشاركة أفضل من التخزين، ويقيم حفلة جوز كبيرة لجميع أصدقائه في الغابة.',
      },
    ],
    en: [
      {
        title: 'The Squirrel Who Collected Too Many Nuts',
        characterDescription: 'A chubby, hyperactive squirrel named Nutty, with big buck teeth and an extra-fluffy tail.',
        batchPrompt: 'Nutty becomes obsessed with collecting nuts for winter, filling his entire tree so full there\'s no room to sleep. He tries to store the nuts in other places: a rabbit\'s burrow, a bird\'s nest, and even a grumpy bear\'s house. Wacky chaos ensues. In the end, Nutty learns that sharing is better than hoarding and throws a giant nut party for all his forest friends.',
      },
    ]
  },
  fantasy: {
    ar: [
      {
        title: 'أمينة مكتبة التنانين',
        characterDescription: 'تنين برونزي قديم وحكيم اسمه "إغنيس"، يرتدي نظارات نصف قمرية ويحب رائحة الكتب القديمة.',
        batchPrompt: 'يعيش إغنيس في كهف ضخم منحوت في جبل، وهو في الواقع مكتبة تحتوي على معرفة العصور. في يوم من الأيام، يبدأ السحر في التلاشي من العالم، وتتحول صفحات الكتب إلى صفحات فارغة. يجب على إغنيس مغادرة كهفه لأول مرة منذ قرون. يسافر مع قزم شاب شجاع للعثور على "ينبوع المعرفة" المفقود وإعادة السحر إلى العالم والكلمات إلى كتبه.',
      },
    ],
    en: [
      {
        title: 'The Dragon Librarian',
        characterDescription: 'An ancient, wise bronze dragon named Ignis, who wears half-moon spectacles and loves the smell of old books.',
        batchPrompt: 'Ignis lives in a massive, mountain-carved cave that is actually a library containing the knowledge of ages. One day, the magic begins to fade from the world, and the book pages are turning blank. Ignis must leave his cave for the first time in centuries. He travels with a brave young gnome to find the lost "Well of Knowledge" and restore magic to the world and words to his books.',
      },
    ]
  },
  noir: {
    ar: [
      {
        title: 'قضية المغنية الصامتة',
        characterDescription: 'محقق خاص متعب اسمه "جاك كورماك"، يرتدي معطفًا مطريًا متجعدًا وقبعة فيدورا تخفي عينيه دائمًا.',
        batchPrompt: 'في مدينة تمطر باستمرار، يتم استئجار جاك من قبل مغنية جاز شهيرة فقدت صوتها في ظروف غامضة. يتعمق جاك في عالم نوادي الجاز المليء بالدخان والسياسيين الفاسدين. يكتشف مؤامرة ابتزاز يقودها منافس غيور استخدم ساحرة غامضة لسرقة صوت المغنية. يواجه جاك المبتز في مواجهة متوترة على سطح مبلل بالمطر.',
      },
    ],
    en: [
      {
        title: 'The Case of the Silent Songbird',
        characterDescription: 'A world-weary private eye named Jack Cormac, wearing a wrinkled trench coat and a fedora that always hides his eyes.',
        batchPrompt: 'In a city where it always rains, Jack is hired by a famous jazz singer who has mysteriously lost her voice. Jack delves into the smoky world of jazz clubs and corrupt politicians. He uncovers a blackmail plot led by a jealous rival who used a mystic to steal the singer\'s voice. Jack confronts the blackmailer in a tense showdown on a rain-slicked rooftop.',
      },
    ]
  },
  vintage: {
    ar: [
      {
        title: 'سر قطار الشرق السريع',
        characterDescription: 'سيدة ثرية وأنيقة اسمها "السيدة إيفلين"، تسافر مع قطتها السيامية المخلصة "كлео".',
        batchPrompt: 'أثناء رحلة فاخرة على متن قطار الشرق السريع، تُسرق قلادة ألماس ثمينة من السيدة إيفلين. يصبح كل راكب غريب الأطوار مشتبهًا به: أميرة روسية، عالم آثار، ساحر. بمساعدة من قائد القطار الذكي، تجمع السيدة إيفلين الأدلة. تكتشف أن قطتها، كليو، التي تحب الأشياء اللامعة، هي التي أخذت القلادة وأخفتها في سريرها.',
      },
    ],
    en: [
      {
        title: 'The Secret of the Orient Express',
        characterDescription: 'A wealthy, elegant socialite named Mrs. Evelyn, who travels with her loyal Siamese cat, Cleo.',
        batchPrompt: 'During a luxurious trip on the Orient Express, Mrs. Evelyn\'s prized diamond necklace is stolen. Every eccentric passenger becomes a suspect: a Russian princess, an archaeologist, a magician. With the help of the clever conductor, Mrs. Evelyn gathers clues. She discovers that her own cat, Cleo, who loves shiny things, took the necklace and hid it in her bed.',
      },
    ]
  },
  minimalist: {
    ar: [
      {
        title: 'النقطة والخط',
        characterDescription: 'نقطة حمراء بسيطة وفضولية.',
        batchPrompt: 'تعيش النقطة في مساحة بيضاء شاسعة. في أحد الأيام، تلتقي بخط أسود مستقيم. في البداية، لا يعرفان كيفية التفاعل. تستكشف النقطة القفز فوق الخط، والتدحرج على طوله. يتعلم الخط الانحناء وتشكيل أشكال جديدة للعب مع النقطة. معًا، يكتشفان أنهما يمكنهما إنشاء أي شيء: منزل، شجرة، شمس. يصبحان أفضل الأصدقاء.',
      },
    ],
    en: [
      {
        title: 'The Dot and the Line',
        characterDescription: 'A simple, curious red dot.',
        batchPrompt: 'The dot lives in a vast white space. One day, it meets a straight black line. At first, they don\'t know how to interact. The dot explores hopping over the line and rolling alongside it. The line learns to bend and curve, creating new shapes for the dot to play with. Together, they discover they can create anything: a house, a tree, a sun. They become the best of friends.',
      },
    ]
  },
  cinematic: {
    ar: [
      {
        title: 'الوصول',
        characterDescription: 'عالمة لغويات اسمها "الدكتورة آريانا فيدي"، ذات نظرة ثاقبة ومركزة، ترتدي ملابس عملية.',
        batchPrompt: 'تهبط مركبة فضائية غامضة وصامتة في صحراء موهافي. يتم إحضار الدكتورة فيدي لقيادة فريق في محاولة للتواصل مع الكائنات الفضائية. المهمة مرهقة وبطيئة. بدلاً من الكلمات، يتواصل الفضائيون باستخدام رموز بصرية معقدة تمثل مفاهيم غير خطية للزمن. بينما تبدأ آريانا في فهم لغتهم، تبدأ في تجربة ذكريات من مستقبلها، مما يغير فهمها للوجود نفسه.',
      },
    ],
    en: [
      {
        title: 'Arrival',
        characterDescription: 'A linguist, Dr. Aris Thorne, with an intense, focused gaze, dressed in practical field gear.',
        batchPrompt: 'A mysterious, silent alien vessel lands in the Mojave Desert. Dr. Thorne is brought in to lead a team to communicate with the extraterrestrials. The task is grueling and slow. The aliens communicate using complex visual symbols representing non-linear concepts of time. As Aris begins to understand their language, he starts experiencing memories of his own future, altering his perception of existence itself.',
      },
    ]
  },
  digitalArt: {
    ar: [
      {
        title: 'حارس الساعة الكونية',
        characterDescription: 'كيان مصنوع من سديم النجوم، يرتدي درعًا من النحاس والزجاج الملون الذي يكشف عن مجرات بداخله.',
        batchPrompt: 'في وسط الزمن، يحافظ حارس الساعة على تدفق الواقع. تظهر شقوق في زجاج ساعة رملية عملاقة، وتبدأ شظايا من الماضي والمستقبل في التسرب إلى الحاضر. يجب على الحارس أن يسافر عبر عصور متصادمة - فرسان يقاتلون روبوتات، وديناصورات تجوب مدن المستقبل - لجمع شظايا الزمن المفقودة وإصلاح الساعة الرملية قبل أن ينهار الواقع.',
      },
    ],
    en: [
      {
        title: 'The Cosmic Clockwinder',
        characterDescription: 'An entity made of star-nebula, wearing brass and stained-glass armor that reveals galaxies within.',
        batchPrompt: 'At the center of time, the Clockwinder maintains the flow of reality. Cracks appear in a giant hourglass, and fragments of the past and future begin leaking into the present. The Clockwinder must travel through colliding eras—knights fighting robots, dinosaurs roaming future cities—to collect the lost shards of time and repair the hourglass before reality collapses.',
      },
    ]
  },
};

// This is a helper for legacy components that might still expect the old format.
// New components should use storySuggestionsData and the language state.
export const storySuggestions: Record<DrawingStyle, StorySuggestion[]> = Object.entries(storySuggestionsData).reduce((acc, [key, value]) => {
    acc[key as DrawingStyle] = value.ar;
    return acc;
}, {} as Record<DrawingStyle, StorySuggestion[]>);