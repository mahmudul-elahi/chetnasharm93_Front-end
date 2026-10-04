// data/liveClasses.ts

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  gallery?: string[];
  teacher: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    experience?: string;
    students?: number;
  };
  price: number;
  discountPrice?: number;
  duration: string;
  totalClasses: number;
  schedule: {
    days: string[];
    time: string;
    startDate: string;
    endDate: string;
  };
  seats: {
    total: number;
    booked: number;
  };
  status: "upcoming" | "ongoing" | "completed";
  meetingLink?: string;
  createdAt: string;
  language: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  prerequisites?: string[];
  whatYouWillLearn: string[];
  includes: string[];
  certificate: boolean;
  recordingAvailable: boolean;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const liveClasses: LiveClass[] = [
  {
    id: "1",
    title: "English Speaking Mastery",
    description: "Master English conversation skills with native speakers. Perfect for beginners and intermediate learners who want to speak confidently in real-world situations.",
    longDescription: "This comprehensive live course is designed to help you speak English with confidence. Over 16 interactive sessions, you'll practice real-world conversations, improve your pronunciation, and overcome the fear of speaking. Our native instructor will guide you through practical scenarios like job interviews, travel conversations, and daily interactions. You'll receive personalized feedback and participate in group discussions to enhance your fluency. By the end of this course, you'll be able to express yourself naturally and understand native speakers with ease.",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Sarah is a certified ESL instructor with over 10 years of experience teaching English to students from around the world. She specializes in conversational English and pronunciation.",
      experience: "10+ years of teaching experience",
      students: 5200,
    },
    price: 89,
    discountPrice: 49,
    duration: "2 Months",
    totalClasses: 16,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "7:00 PM EST",
      startDate: "2024-04-15",
      endDate: "2024-06-10",
    },
    seats: {
      total: 50,
      booked: 28,
    },
    status: "upcoming",
    createdAt: "2024-03-01",
    language: "English",
    level: "Beginner",
    prerequisites: ["Basic understanding of English", "Willingness to practice speaking", "Stable internet connection"],
    whatYouWillLearn: [
      "Speak English confidently in everyday situations",
      "Master natural pronunciation and accent reduction",
      "Understand native speakers in conversations",
      "Participate in group discussions and debates",
      "Improve listening comprehension skills",
      "Build vocabulary for professional and social contexts",
      "Handle job interviews and business meetings",
      "Express opinions and ideas fluently"
    ],
    includes: [
      "16 live interactive sessions",
      "Class recordings for review",
      "Downloadable study materials",
      "Personalized feedback from instructor",
      "Certificate of completion",
      "Access to private community group",
      "Weekly practice assignments",
      "One-on-one speaking session"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "What level of English do I need?",
        answer: "This course is designed for beginners to intermediate learners. You should have basic understanding of English to get the most out of the classes."
      },
      {
        question: "What if I miss a class?",
        answer: "All sessions are recorded and available for replay. You can catch up anytime and ask questions in the next class."
      },
      {
        question: "Will I get a certificate?",
        answer: "Yes, upon completing the course, you'll receive a certificate of completion that you can add to your LinkedIn profile or resume."
      }
    ]
  },
  {
    id: "2",
    title: "Spanish Conversation Live",
    description: "Learn to speak Spanish naturally through interactive conversations, role-plays, and cultural insights from native instructors.",
    longDescription: "Immerse yourself in the Spanish language with this interactive live course. You'll learn practical conversation skills through real-life scenarios, cultural discussions, and engaging role-plays. Our native instructor will help you master pronunciation, common phrases, and grammar structures used in everyday Spanish. Whether you're planning to travel, work, or connect with Spanish-speaking friends, this course will give you the confidence to speak naturally.",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t2",
      name: "Carlos Mendez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Carlos is a native Spanish speaker from Mexico with 8 years of teaching experience. He specializes in conversational Spanish and Latin American culture.",
      experience: "8 years of teaching experience",
      students: 3800,
    },
    price: 79,
    discountPrice: 45,
    duration: "1.5 Months",
    totalClasses: 12,
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "6:30 PM EST",
      startDate: "2024-04-10",
      endDate: "2024-05-25",
    },
    seats: {
      total: 40,
      booked: 35,
    },
    status: "ongoing",
    meetingLink: "https://zoom.us/join/123456789",
    createdAt: "2024-03-05",
    language: "Spanish",
    level: "Beginner",
    prerequisites: ["No prior Spanish knowledge needed", "Enthusiasm to learn"],
    whatYouWillLearn: [
      "Greet people and introduce yourself in Spanish",
      "Order food and ask for directions",
      "Master essential Spanish pronunciation",
      "Understand common Spanish phrases and idioms",
      "Conjugate regular and irregular verbs",
      "Discuss daily routines and hobbies",
      "Learn about Spanish-speaking cultures",
      "Build vocabulary for travel and business"
    ],
    includes: [
      "12 live interactive sessions",
      "Class recordings available",
      "Downloadable vocabulary lists",
      "Cultural insights and tips",
      "Certificate of completion",
      "Access to conversation practice group",
      "Weekly speaking exercises"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Do I need any previous Spanish knowledge?",
        answer: "No, this course is designed for complete beginners. We'll start from the basics and build up your skills gradually."
      },
      {
        question: "What's the class size?",
        answer: "Classes are limited to 40 students to ensure personalized attention and active participation."
      }
    ]
  },
  {
    id: "3",
    title: "French for Beginners",
    description: "Start your French journey with this comprehensive live course. Learn pronunciation, basic grammar, and everyday conversations.",
    longDescription: "Bonjour! Ready to learn French? This beginner-friendly course will introduce you to the beautiful French language. You'll learn essential vocabulary, correct pronunciation, and basic grammar structures through interactive sessions. Our native French instructor will guide you through real-life conversations, cultural insights, and practical scenarios. By the end of this course, you'll be able to introduce yourself, order food, and have simple conversations in French.",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t3",
      name: "Marie Lambert",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Marie is a native French speaker from Paris with 12 years of teaching experience. She loves sharing French language and culture with her students.",
      experience: "12 years of teaching experience",
      students: 4200,
    },
    price: 69,
    discountPrice: 39,
    duration: "2 Months",
    totalClasses: 14,
    schedule: {
      days: ["Monday", "Thursday"],
      time: "8:00 AM EST",
      startDate: "2024-05-01",
      endDate: "2024-06-30",
    },
    seats: {
      total: 35,
      booked: 12,
    },
    status: "upcoming",
    createdAt: "2024-03-10",
    language: "French",
    level: "Beginner",
    prerequisites: ["No prior French knowledge required", "Love for French culture"],
    whatYouWillLearn: [
      "Master French pronunciation and accent",
      "Learn essential greetings and introductions",
      "Understand basic French grammar rules",
      "Build vocabulary for everyday situations",
      "Order food and drinks in French",
      "Ask for directions and understand responses",
      "Learn about French culture and customs",
      "Have simple conversations with native speakers"
    ],
    includes: [
      "14 live interactive sessions",
      "Class recordings for review",
      "Pronunciation guides and audio files",
      "Downloadable worksheets",
      "Certificate of completion",
      "Access to French learning community",
      "Cultural resources and tips"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Is French difficult to learn?",
        answer: "French pronunciation can be challenging at first, but with our guided sessions and practice, you'll quickly get the hang of it!"
      },
      {
        question: "Will I learn about French culture?",
        answer: "Yes! Each session includes cultural insights about French customs, traditions, and lifestyle."
      }
    ]
  },
  {
    id: "4",
    title: "German Grammar Pro",
    description: "Master German grammar structures and complex sentence formations with expert guidance. Ideal for intermediate learners.",
    longDescription: "Take your German skills to the next level with this intensive grammar course. Designed for intermediate learners, this course focuses on mastering complex grammar structures, sentence formations, and advanced vocabulary. You'll learn how to use cases (Nominative, Accusative, Dative, Genitive), modal verbs, subjunctive mood, and more. Our expert instructor will provide clear explanations and plenty of practice exercises to solidify your understanding.",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t4",
      name: "Hans Weber",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Hans is a German linguist and certified instructor with 15 years of experience teaching German to international students.",
      experience: "15 years of teaching experience",
      students: 6200,
    },
    price: 99,
    discountPrice: 59,
    duration: "2.5 Months",
    totalClasses: 20,
    schedule: {
      days: ["Tuesday", "Wednesday", "Friday"],
      time: "9:00 AM EST",
      startDate: "2024-04-05",
      endDate: "2024-06-20",
    },
    seats: {
      total: 45,
      booked: 42,
    },
    status: "ongoing",
    meetingLink: "https://meet.google.com/abc-def-ghi",
    createdAt: "2024-03-02",
    language: "German",
    level: "Intermediate",
    prerequisites: ["A2-B1 level German", "Understanding of basic German grammar", "Ability to form simple sentences"],
    whatYouWillLearn: [
      "Master German cases (Nominative, Accusative, Dative, Genitive)",
      "Use modal verbs and auxiliary verbs correctly",
      "Form complex sentences with subordinate clauses",
      "Understand and use the subjunctive mood",
      "Master adjective declension patterns",
      "Build advanced vocabulary for professional contexts",
      "Write formal and informal letters",
      "Understand German idioms and expressions"
    ],
    includes: [
      "20 live intensive sessions",
      "Detailed grammar worksheets",
      "Practice exercises with answer keys",
      "Class recordings for review",
      "Certificate of advanced German",
      "One-on-one feedback sessions",
      "Access to grammar resources library"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "What level of German do I need?",
        answer: "This course is designed for intermediate learners (A2-B1). If you're a complete beginner, we recommend taking our Beginner German course first."
      },
      {
        question: "Will I get a certificate?",
        answer: "Yes, upon successful completion of the course and passing the final assessment, you'll receive a certificate of advanced German proficiency."
      }
    ]
  },
  {
    id: "5",
    title: "Japanese Language & Culture",
    description: "Learn Japanese script (Hiragana, Katakana, Kanji) and cultural etiquette through live interactive sessions.",
    longDescription: "Discover the beauty of Japanese language and culture in this comprehensive live course. You'll learn the three writing systems (Hiragana, Katakana, and basic Kanji), essential vocabulary, and polite speech patterns. Our instructor will also introduce you to Japanese customs, etiquette, and cultural nuances. Perfect for travelers, anime fans, and anyone interested in Japanese culture.",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t5",
      name: "Yuki Tanaka",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Yuki is a native Japanese speaker from Tokyo with 7 years of teaching experience. She specializes in teaching Japanese to international students.",
      experience: "7 years of teaching experience",
      students: 3100,
    },
    price: 109,
    discountPrice: 69,
    duration: "3 Months",
    totalClasses: 24,
    schedule: {
      days: ["Monday", "Wednesday", "Saturday"],
      time: "7:30 PM EST",
      startDate: "2024-05-10",
      endDate: "2024-08-10",
    },
    seats: {
      total: 30,
      booked: 8,
    },
    status: "upcoming",
    createdAt: "2024-03-12",
    language: "Japanese",
    level: "Beginner",
    prerequisites: ["No prior Japanese knowledge needed", "Interest in Japanese culture"],
    whatYouWillLearn: [
      "Read and write Hiragana and Katakana",
      "Learn 100+ basic Kanji characters",
      "Master essential Japanese greetings",
      "Understand Japanese sentence structure",
      "Use polite and casual speech appropriately",
      "Learn about Japanese customs and etiquette",
      "Build vocabulary for travel and daily life",
      "Understand Japanese pop culture references"
    ],
    includes: [
      "24 live interactive sessions",
      "Writing practice worksheets",
      "Kanji flashcards and resources",
      "Class recordings for review",
      "Certificate of completion",
      "Access to Japanese learning community",
      "Cultural resources and videos"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Is Japanese difficult to learn?",
        answer: "Japanese has three writing systems, but with consistent practice and our structured approach, you'll find it manageable and enjoyable!"
      },
      {
        question: "Will I learn Kanji?",
        answer: "Yes, we'll introduce basic Kanji characters (100+) that are essential for everyday Japanese reading."
      }
    ]
  },
  {
    id: "6",
    title: "Italian: La Dolce Vita",
    description: "Learn Italian through music, food, and culture. Fun and engaging sessions for all levels.",
    longDescription: "Experience the sweet life with this fun and engaging Italian course! Learn Italian through music, food, cinema, and cultural traditions. Our native Italian instructor will teach you practical conversation skills while exploring Italy's rich cultural heritage. You'll learn essential phrases for travel, ordering in restaurants, and connecting with Italians. Perfect for travelers, food lovers, and anyone who wants to experience La Dolce Vita!",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t6",
      name: "Giulia Rossi",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Giulia is a native Italian speaker from Rome with 6 years of teaching experience. She loves sharing Italian culture through language, food, and music.",
      experience: "6 years of teaching experience",
      students: 2800,
    },
    price: 59,
    discountPrice: 35,
    duration: "1 Month",
    totalClasses: 8,
    schedule: {
      days: ["Wednesday", "Friday"],
      time: "10:00 AM EST",
      startDate: "2024-04-20",
      endDate: "2024-05-15",
    },
    seats: {
      total: 25,
      booked: 5,
    },
    status: "upcoming",
    createdAt: "2024-03-08",
    language: "Italian",
    level: "All Levels",
    prerequisites: ["No prior Italian knowledge needed", "Love for Italian culture"],
    whatYouWillLearn: [
      "Master Italian pronunciation and accent",
      "Order food and wine like a local",
      "Learn Italian gestures and expressions",
      "Understand Italian opera and music lyrics",
      "Discuss Italian cinema and culture",
      "Plan travel itineraries in Italy",
      "Learn about Italian regional cuisines",
      "Make Italian friends with confidence"
    ],
    includes: [
      "8 live interactive sessions",
      "Italian recipes and food guides",
      "Playlist of Italian music",
      "Class recordings for review",
      "Certificate of completion",
      "Travel tips for Italy",
      "Cultural resources and videos"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Is this course serious or just for fun?",
        answer: "Both! You'll learn practical Italian while having fun with music, food, and cultural activities."
      },
      {
        question: "Will I be able to travel to Italy after this course?",
        answer: "Absolutely! You'll learn essential phrases and cultural tips that will make your Italian travel experience much more enjoyable."
      }
    ]
  },
  {
    id: "7",
    title: "Chinese Mandarin Essentials",
    description: "Master Mandarin tones, vocabulary, and everyday conversations with live guidance from native speakers.",
    longDescription: "Learn Mandarin Chinese with our expert native instructor! This course focuses on mastering the four tones, essential vocabulary, and practical conversation skills. You'll learn pinyin (Romanized pronunciation), basic characters, and common phrases for daily situations. Our interactive sessions include pronunciation drills, dialogues, and cultural insights about Chinese customs and traditions.",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t7",
      name: "Li Wei",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Li Wei is a native Mandarin speaker from Beijing with 9 years of teaching experience. She specializes in helping students master Chinese tones and pronunciation.",
      experience: "9 years of teaching experience",
      students: 4500,
    },
    price: 95,
    discountPrice: 55,
    duration: "2 Months",
    totalClasses: 16,
    schedule: {
      days: ["Tuesday", "Thursday", "Saturday"],
      time: "8:30 PM EST",
      startDate: "2024-04-25",
      endDate: "2024-06-25",
    },
    seats: {
      total: 40,
      booked: 18,
    },
    status: "upcoming",
    createdAt: "2024-03-07",
    language: "Mandarin Chinese",
    level: "Beginner",
    prerequisites: ["No prior Chinese knowledge needed", "Eagerness to practice tones"],
    whatYouWillLearn: [
      "Master the four Mandarin tones",
      "Learn pinyin romanization system",
      "Build vocabulary for daily situations",
      "Read and write 50+ basic characters",
      "Order food and shop in Chinese",
      "Ask for directions and understand responses",
      "Discuss hobbies and daily routines",
      "Learn about Chinese festivals and customs"
    ],
    includes: [
      "16 live interactive sessions",
      "Tone practice audio files",
      "Character writing worksheets",
      "Class recordings for review",
      "Certificate of completion",
      "Access to Chinese learning community",
      "Cultural resources and videos"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Are tones really important?",
        answer: "Yes! Mandarin is a tonal language, meaning the tone changes the meaning. We'll spend plenty of time practicing tones to ensure you're understood."
      },
      {
        question: "Will I learn Chinese characters?",
        answer: "Yes, we'll introduce basic characters (50+) that are essential for reading signs and menus in China."
      }
    ]
  },
  {
    id: "8",
    title: "Arabic Modern Standard",
    description: "Learn formal Arabic and Egyptian dialect for real-world communication and professional settings.",
    longDescription: "Master Modern Standard Arabic (MSA) and Egyptian dialect in this comprehensive course. You'll learn formal Arabic for professional and academic contexts, along with Egyptian Arabic for everyday conversations. Our native instructor will guide you through the Arabic alphabet, grammar structures, and practical dialogues. Perfect for professionals, travelers, and anyone interested in Middle Eastern culture.",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t8",
      name: "Omar Hassan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Omar is a native Arabic speaker from Egypt with 10 years of teaching experience. He specializes in teaching both Modern Standard Arabic and Egyptian dialect.",
      experience: "10 years of teaching experience",
      students: 2900,
    },
    price: 85,
    discountPrice: 49,
    duration: "2.5 Months",
    totalClasses: 18,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "1:00 PM EST",
      startDate: "2024-04-18",
      endDate: "2024-07-03",
    },
    seats: {
      total: 35,
      booked: 22,
    },
    status: "ongoing",
    meetingLink: "https://zoom.us/join/987654321",
    createdAt: "2024-03-03",
    language: "Arabic",
    level: "Beginner",
    prerequisites: ["No prior Arabic knowledge needed", "Interest in Arabic culture"],
    whatYouWillLearn: [
      "Read and write Arabic alphabet",
      "Master Modern Standard Arabic grammar",
      "Learn Egyptian dialect for daily conversations",
      "Build vocabulary for business contexts",
      "Understand Arab culture and customs",
      "Order food and shop in Arabic",
      "Discuss current events in Arabic",
      "Write formal letters and emails"
    ],
    includes: [
      "18 live interactive sessions",
      "Arabic writing practice sheets",
      "Audio recordings for pronunciation",
      "Class recordings for review",
      "Certificate of completion",
      "Access to Arabic learning community",
      "Cultural resources and videos"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "What's the difference between MSA and Egyptian Arabic?",
        answer: "MSA is formal Arabic used in media and official contexts. Egyptian Arabic is widely understood across the Arab world and used in everyday conversations."
      },
      {
        question: "Do I need to learn both?",
        answer: "We teach both to give you versatility. MSA for professional contexts, Egyptian for practical conversations."
      }
    ]
  },
  {
    id: "9",
    title: "Korean K-Pop Edition",
    description: "Learn Korean through K-Pop songs, lyrics, and K-Drama dialogues. Fun and interactive sessions!",
    longDescription: "Love K-Pop and K-Dramas? Learn Korean through your favorite songs and shows! This fun course uses BTS, BLACKPINK, and popular K-Dramas to teach you Korean language and culture. You'll learn lyrics, understand dialogues, and discover Korean slang used by idols. Perfect for K-Pop fans who want to understand their favorite artists without subtitles!",
    thumbnail: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t9",
      name: "Min Ji-ho",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Ji-ho is a native Korean speaker from Seoul with 5 years of teaching experience. She uses K-Pop and K-Dramas to make learning Korean fun and engaging.",
      experience: "5 years of teaching experience",
      students: 5600,
    },
    price: 79,
    discountPrice: 44,
    duration: "1.5 Months",
    totalClasses: 12,
    schedule: {
      days: ["Thursday", "Saturday"],
      time: "9:00 PM EST",
      startDate: "2024-05-05",
      endDate: "2024-06-20",
    },
    seats: {
      total: 50,
      booked: 32,
    },
    status: "upcoming",
    createdAt: "2024-03-11",
    language: "Korean",
    level: "Beginner",
    prerequisites: ["No prior Korean knowledge needed", "Love for K-Pop and K-Dramas"],
    whatYouWillLearn: [
      "Read and write Hangul (Korean alphabet)",
      "Understand K-Pop lyrics and meanings",
      "Learn Korean slang used by idols",
      "Understand K-Drama dialogues",
      "Master Korean honorifics and politeness",
      "Discuss your favorite idols and groups",
      "Learn about Korean pop culture",
      "Sing along to popular K-Pop songs"
    ],
    includes: [
      "12 live interactive sessions",
      "K-Pop lyric breakdowns",
      "K-Drama dialogue scripts",
      "Class recordings for review",
      "Certificate of completion",
      "Access to K-Pop fan community",
      "Korean pop culture resources"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Will I learn to understand BTS songs?",
        answer: "Yes! We'll analyze BTS lyrics and many other K-Pop songs to help you understand the meaning behind the music."
      },
      {
        question: "Is this course serious language learning?",
        answer: "Yes! While it's fun, you'll actually learn proper Korean grammar, vocabulary, and pronunciation through your favorite content."
      }
    ]
  },
  {
    id: "10",
    title: "Hindi Bollywood Style",
    description: "Learn Hindi through Bollywood movies, songs, and everyday conversations. Perfect for beginners.",
    longDescription: "Namaste! Learn Hindi through the magic of Bollywood! This course uses popular movies, songs, and dialogues to teach you practical Hindi. You'll learn essential phrases, Bollywood slang, and cultural context that makes Hindi fun and accessible. Perfect for Bollywood fans, travelers to India, and anyone who wants to connect with Indian culture.",
    thumbnail: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t10",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Priya is a native Hindi speaker from Mumbai with 7 years of teaching experience. She uses Bollywood to make learning Hindi fun and engaging.",
      experience: "7 years of teaching experience",
      students: 3400,
    },
    price: 49,
    discountPrice: 29,
    duration: "1 Month",
    totalClasses: 8,
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "11:00 AM EST",
      startDate: "2024-04-12",
      endDate: "2024-05-10",
    },
    seats: {
      total: 60,
      booked: 45,
    },
    status: "ongoing",
    meetingLink: "https://meet.google.com/xyz-abc-123",
    createdAt: "2024-03-04",
    language: "Hindi",
    level: "Beginner",
    prerequisites: ["No prior Hindi knowledge needed", "Love for Bollywood and Indian culture"],
    whatYouWillLearn: [
      "Master Hindi pronunciation and Devanagari script",
      "Learn Bollywood slang and expressions",
      "Understand movie dialogues without subtitles",
      "Sing along to popular Bollywood songs",
      "Discuss Indian festivals and traditions",
      "Order food in Indian restaurants",
      "Learn about Indian culture and customs",
      "Make Indian friends with confidence"
    ],
    includes: [
      "8 live interactive sessions",
      "Bollywood movie clips and dialogues",
      "Song lyrics with translations",
      "Class recordings for review",
      "Certificate of completion",
      "Indian recipe guide",
      "Cultural resources and videos"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Will I learn to read Hindi script?",
        answer: "Yes, we'll introduce Devanagari script gradually, but the focus is on speaking and understanding through Bollywood content."
      },
      {
        question: "Is this course only for Bollywood fans?",
        answer: "While it's Bollywood-themed, you'll learn practical Hindi that you can use in real conversations and travel."
      }
    ]
  },
  {
    id: "11",
    title: "Russian Language Intensive",
    description: "Intensive Russian course covering grammar, pronunciation, and real-life conversation skills.",
    longDescription: "Take on the challenge of Russian language with this intensive course! You'll master Cyrillic alphabet, complex grammar structures, and authentic pronunciation. Our native instructor will guide you through real-life conversations, Russian literature excerpts, and cultural insights. Perfect for serious learners who want to achieve fluency in Russian.",
    thumbnail: "https://images.unsplash.com/photo-1526481280691-3c4691c5d1c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t11",
      name: "Dmitry Volkov",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Dmitry is a native Russian speaker from Moscow with 12 years of teaching experience. He specializes in teaching Russian to international students.",
      experience: "12 years of teaching experience",
      students: 2100,
    },
    price: 105,
    discountPrice: 65,
    duration: "3 Months",
    totalClasses: 24,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "3:00 PM EST",
      startDate: "2024-04-08",
      endDate: "2024-07-08",
    },
    seats: {
      total: 30,
      booked: 28,
    },
    status: "completed",
    createdAt: "2024-01-15",
    language: "Russian",
    level: "Intermediate",
    prerequisites: ["Basic Russian knowledge", "Familiarity with Cyrillic alphabet", "Commitment to intensive study"],
    whatYouWillLearn: [
      "Master Russian cases (6 cases)",
      "Perfect your pronunciation and accent",
      "Understand Russian verb aspects",
      "Build advanced vocabulary",
      "Read Russian literature excerpts",
      "Discuss current events in Russian",
      "Write formal and informal texts",
      "Understand Russian humor and idioms"
    ],
    includes: [
      "24 live intensive sessions",
      "Grammar exercises and worksheets",
      "Reading materials from Russian authors",
      "Class recordings for review",
      "Certificate of advanced Russian",
      "One-on-one speaking practice",
      "Access to Russian resources library"
    ],
    certificate: true,
    recordingAvailable: false,
    faqs: [
      {
        question: "Is this course very difficult?",
        answer: "Russian grammar is complex, but our structured approach and intensive practice will help you master it step by step."
      },
      {
        question: "What level will I reach?",
        answer: "By the end of this intensive course, you'll reach B1-B2 level proficiency, capable of having conversations on various topics."
      }
    ]
  },
  {
    id: "12",
    title: "Portuguese Brazilian Vibes",
    description: "Learn Brazilian Portuguese with music, culture, and lively conversations. Perfect for travelers and music lovers.",
    longDescription: "Experience the vibrant energy of Brazil while learning Portuguese! This course uses Brazilian music, samba, bossa nova, and cultural traditions to teach you authentic Portuguese. You'll learn pronunciation, essential phrases, and Brazilian slang while exploring the rich culture of Brazil. Perfect for travelers, music lovers, and anyone who wants to connect with Brazilian culture.",
    thumbnail: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    teacher: {
      id: "t12",
      name: "Lucas Silva",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      bio: "Lucas is a native Brazilian Portuguese speaker from Rio de Janeiro with 8 years of teaching experience. He loves sharing Brazilian culture through language and music.",
      experience: "8 years of teaching experience",
      students: 3900,
    },
    price: 69,
    discountPrice: 39,
    duration: "2 Months",
    totalClasses: 16,
    schedule: {
      days: ["Wednesday", "Saturday"],
      time: "5:30 PM EST",
      startDate: "2024-05-15",
      endDate: "2024-07-10",
    },
    seats: {
      total: 40,
      booked: 10,
    },
    status: "upcoming",
    createdAt: "2024-03-09",
    language: "Portuguese",
    level: "Beginner",
    prerequisites: ["No prior Portuguese knowledge needed", "Love for Brazilian music and culture"],
    whatYouWillLearn: [
      "Master Brazilian Portuguese pronunciation",
      "Understand Brazilian slang and expressions",
      "Learn samba and bossa nova lyrics",
      "Discuss Brazilian food and festivals",
      "Order food and drinks in Portuguese",
      "Plan travel to Brazil with confidence",
      "Learn about Carnival and traditions",
      "Make Brazilian friends with ease"
    ],
    includes: [
      "16 live interactive sessions",
      "Brazilian music playlists",
      "Carnival and cultural resources",
      "Class recordings for review",
      "Certificate of completion",
      "Brazilian recipe guide",
      "Travel tips for Brazil"
    ],
    certificate: true,
    recordingAvailable: true,
    faqs: [
      {
        question: "Is this Brazilian Portuguese different from European Portuguese?",
        answer: "Yes, there are differences in pronunciation and vocabulary. This course focuses on Brazilian Portuguese, which is spoken by over 200 million people."
      },
      {
        question: "Will I learn samba?",
        answer: "You'll learn about samba culture and understand samba lyrics, though the focus is on language learning with musical elements!"
      }
    ]
  }
];