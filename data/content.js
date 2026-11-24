// todos los textos visibles del juego van aqui
// asi la revision de ortografia se hace en un solo archivo

var CONTENT = {
  appTitle: "EI Survival Kit",
  tagline: "Stay cool, stay in control",

  disclaimer: "This kit is a learning tool, not therapy. If you are struggling, talk to a trusted person or a professional.",
  privacy: "Your answers stay on this device. Nothing is sent anywhere.",
  memoryOnly: "Saving is turned off in this browser, so your progress will last only until you close this tab.",

  nav: {
    hub: "The Box",
    kit: "My Kit",
    references: "References",
    skip: "Skip to content"
  },

  welcome: {
    title: "Welcome to your EI Survival Kit",
    paragraphs: [
      "Emotional intelligence is the ability to notice, understand and manage emotions, in yourself and in others.",
      "This box has 6 compartments. Each one is a short mission based on a topic from class. Complete a mission and you earn a tool card you can use in real life.",
      "Every answer is just a tap, and everything stays on this device."
    ],
    start: "Start with a check-in",
    stageTag: "EI field case"
  },

  checkin: {
    title: "Mood weather check-in",
    question: "If your feelings were the weather right now, what would it be?",
    save: "Save and open the box",
    update: "Save my check-in",
    error: "Please pick a weather first."
  },

  weather: [
    { id: "stormy", label: "Stormy", score: 1, hint: "Intense or overwhelming" },
    { id: "rainy", label: "Rainy", score: 2, hint: "Low or heavy" },
    { id: "cloudy", label: "Cloudy", score: 3, hint: "Mixed or unclear" },
    { id: "partly", label: "Partly sunny", score: 4, hint: "Okay, with a few clouds" },
    { id: "sunny", label: "Sunny", score: 5, hint: "Calm and bright" }
  ],

  hub: {
    title: "The Box",
    intro: "Six compartments, six missions. Complete a mission to earn its emotional intelligence tool card.",
    stageTag: "Field case",
    stageHint: "Drag to turn the case, click a module to start",
    listTitle: "Mission list",
    unlocked: "Tool unlocked",
    newTool: "New tool!",
    tapToUnlock: "Tap to unlock",
    backToBox: "Back to the box",
    progress: "{n} of 6 tools collected",
    mood: "Today's mood weather:",
    moodEmpty: "No check-in yet",
    moodButton: "Update",
    statusReady: "Start mission",
    statusDone: "Mission complete",
    levelWord: "Mission"
  },

  // intro tipo cinematica con creditos, mitad y mitad
  intro: {
    label: "Intro",
    startTitle: "EI Survival Kit",
    startGame: "Start game",
    coverAlt: "Emotional Intelligence Final Project cover",
    replay: "Watch intro",
    pre: "A BIG CARLOS BERNABÉ  production",
    title: "Emotional Intelligence",
    subtitle: "Final Project",
    credits: [
      [
        { role: "Creative direction", name: "CARLOS BERNABÉ" },
        { role: "Frontend design", name: "CARLOS BERNABÉ" }
      ],
      [
        { role: "Programming and functions", name: "CARLOS BERNABÉ" },
        { role: "3D scene", name: "Claude" },
        { role: "Intro music", name: "Grand Theft Auto: San Andreas Theme Song" }
      ],
      [
        { role: "Organization", name: "Carlos B. Becerra Z." },
        { role: "Operations", name: "Claude" }
      ],
      [
        { role: "Game design and content", name: "Carlos B. Becerra Z. and Claude" },
        { role: "Final project", name: "Emotional Intelligence" }
      ]
    ],
    
  },

  // textos pintados dentro de la escena 3d
  scene: {
    lidTitle: "EI Survival Kit",
    lidSub: "Emotional intelligence field case",
    lidSmall: "6 missions, 6 tools",
    plate: "EI kit 06"
  },

  badges: {
    application: "EI application",
    activity: "Activity for yourself"
  },

  levels: [
    {
      id: 1,
      unit: "Unit 1",
      title: "Who am I?",
      topic: "Self-awareness",
      color: "orange",
      icon: "mirror",
      application: true,
      activity: "Feelings check and values",
      tool: {
        name: "Name it to tame it",
        takeaway: "When I put a precise name to what I feel, it gets easier to calm down and choose my next step."
      }
    },
    {
      id: 2,
      unit: "Unit 2",
      title: "Hold the Line",
      topic: "Self-control",
      color: "cyan",
      icon: "breath",
      application: true,
      activity: "4-step reset practice",
      tool: {
        name: "The 4-step reset",
        takeaway: "Pause, breathe, name the emotion, then choose how I want to respond."
      }
    },
    {
      id: 3,
      unit: "Unit 3",
      title: "Climb Down the Ladder",
      topic: "Empathy",
      color: "yellow",
      icon: "ladder",
      application: true,
      activity: "",
      tool: {
        name: "Back to the data",
        takeaway: "Before I judge someone, I climb down the ladder and check what I actually saw and heard."
      }
    },
    {
      id: 4,
      unit: "Unit 4",
      title: "Say It Right",
      topic: "Assertive communication",
      color: "green",
      icon: "speech",
      application: true,
      activity: "",
      tool: {
        name: "Facts and feelings",
        takeaway: "I share what happened and how I feel, and I leave the judgments out."
      }
    },
    {
      id: 5,
      unit: "Unit 5",
      title: "Unlearn to Learn",
      topic: "Humility and forgiveness",
      color: "red",
      icon: "backpack",
      application: true,
      activity: "Forgiveness exercise",
      tool: {
        name: "Unlearn card",
        takeaway: "I can admit when I am wrong, drop what weighs me down and choose to forgive."
      }
    },
    {
      id: 6,
      unit: "Unit 6",
      title: "Measure Your Success",
      topic: "Measuring success",
      color: "steel",
      icon: "chart",
      application: false,
      activity: "Mood check-in and my EI map",
      tool: {
        name: "My EI map",
        takeaway: "Checking in with myself shows me how far I have come and what to practice next."
      }
    }
  ],

  kit: {
    title: "My Kit",
    intro: "Every tool you earn is saved here. Come back and use them whenever you need them.",
    lockedName: "Locked tool",
    lockedText: "Complete this mission to unlock the card.",
    empty: "Your kit is empty for now. Complete a mission in the box to earn your first tool.",
    download: "Download my kit",
    downloadHelp: "Saves a text file with your tools and answers. The file is created on this device.",
    reset: "Start over",
    resetConfirm: "This will erase all your answers on this device. Are you sure?",
    resetDone: "Your kit is empty again. You can start fresh.",
    goToLevel: "Start mission"
  },

  placeholder: {
    title: "This mission is still locked",
    text: "This mission is being built. Check back soon.",
    back: "Back to the box"
  },

  references: {
    title: "References",
    text: "Sources used in this kit, in APA 7 style.",
    aboutTitle: "About this kit",
    about: "Made by Carlos B. Becerra Z. and Claude for the Emotional Intelligence course. The 3D graphics use Three.js, which is free under the MIT license.",
    list: [
      [{ t: "Argyris, C. (1990). " }, { i: "Overcoming organizational defenses: Facilitating organizational learning" }, { t: ". Allyn and Bacon." }],
      [{ t: "Burklund, L. J., Creswell, J. D., Irwin, M. R., & Lieberman, M. D. (2014). The common and distinct neural bases of affect labeling and reappraisal in healthy adults. " }, { i: "Frontiers in Psychology, 5" }, { t: ", Article 221. " }, { url: "https://doi.org/10.3389/fpsyg.2014.00221" }],
      [{ t: "Feldman Barrett, L. (2018). " }, { i: "La vida secreta del cerebro: Cómo se construyen las emociones" }, { t: " (G. Sánchez Barberán, Trans.). Paidós. (Original work published 2017)" }],
      [{ t: "Goleman, D. (1995). " }, { i: "Emotional intelligence" }, { t: ". Bantam Books." }],
      [{ t: "Goleman, D., Boyatzis, R., & McKee, A. (2002). " }, { i: "Primal leadership: Realizing the power of emotional intelligence" }, { t: ". Harvard Business School Press." }],
      [{ t: "Kahneman, D. (2012). " }, { i: "Thinking, fast and slow" }, { t: ". Penguin Books." }],
      [{ t: "Lieberman, M. D., Inagaki, T. K., Tabibnia, G., & Crockett, M. J. (2011). Subjective responses to emotional stimuli during labeling, reappraisal, and distraction. " }, { i: "Emotion, 11" }, { t: "(3), 468–480. " }, { url: "https://doi.org/10.1037/a0023503" }],
      [{ t: "Senge, P. M., Kleiner, A., Roberts, C., Ross, R. B., & Smith, B. J. (1994). " }, { i: "The fifth discipline fieldbook: Strategies and tools for building a learning organization" }, { t: ". Currency Doubleday." }]
    ]
  },

  // textos del archivo que se descarga
  exportFile: {
    fileName: "my-ei-survival-kit.txt",
    title: "MY EI SURVIVAL KIT",
    exportedOn: "Exported on:",
    note: "This file was created in your browser. Nothing was sent anywhere.",
    moodTitle: "MOOD WEATHER",
    before: "Before:",
    after: "After:",
    notYet: "not yet",
    toolsTitle: "TOOLS COLLECTED",
    answersTitle: "MY ANSWERS",
    noAnswers: "No answers saved yet."
  }
};

// textos comunes de las pantallas de mision
CONTENT.missionUi = {
  back: "Back to the box",
  step: "Step {n} of {total}",
  next: "Next",
  start: "Start",
  correct: "Nice!",
  toKit: "See my kit",
  nextMission: "Next mission",
  save: "Save and continue",
  skip: "Skip",
  time: "About 90 seconds"
};

// textos de cada mision
CONTENT.missions = {
  1: {
    short: "Learn to name what you feel, so you can choose what to do next.",
    quizTitle: "Find the precise word",
    quizText: "Read the clue and pick the word that fits best.",
    quiz: [
      {
        clue: "Your chest feels tight before an exam and your mind keeps asking: what if I fail?",
        options: [
          { text: "Anxious", ok: true, why: "Anxious fits: it is a worry about something that has not happened yet." },
          { text: "Sad", why: "Sadness is about a loss. This clue is about a worry about the future." },
          { text: "Bored", why: "Boredom is low energy. Here your body is on alert." }
        ]
      },
      {
        clue: "Someone takes credit for your work and your face gets hot.",
        options: [
          { text: "Embarrassed", why: "Embarrassment is about feeling exposed. This clue is about something unfair." },
          { text: "Angry", ok: true, why: "Angry fits: something unfair happened to you." },
          { text: "Tired", why: "Tired is a body state, not the emotion in this clue." }
        ]
      },
      {
        clue: "The concert you waited months for gets canceled and you feel heavy.",
        options: [
          { text: "Nervous", why: "Nervous is about something coming up. This already happened." },
          { text: "Proud", why: "Pride comes from an achievement. This clue is about a loss." },
          { text: "Disappointed", ok: true, why: "Disappointed fits: something you hoped for did not happen." }
        ]
      }
    ],
    nowTitle: "How do you feel right now?",
    nowText: "Pick the word that fits you best. There are no wrong answers.",
    nowWords: ["Calm", "Happy", "Grateful", "Excited", "Tired", "Bored", "Worried", "Stressed", "Sad", "Lonely", "Annoyed", "Confused"],
    valuesTitle: "Pick your 3 core values",
    valuesText: "Values show who you are and where you are going. Tap the 3 that matter most to you.",
    values: ["Family", "Friendship", "Honesty", "Health", "Learning", "Freedom", "Respect", "Fun"],
    valuesCount: "{n} of 3 picked",
    goalLabel: "Where do you want these values to take you?",
    goals: ["Stronger relationships", "A career I enjoy", "A healthier life", "Helping others", "Growing as a person"],
    summaryNow: "How I felt:",
    summaryValues: "My core values:",
    summaryGoal: "Where I am going:"
  },

  2: {
    short: "Stay in control when something sets you off.",
    howTitle: "The 4-step reset",
    howText: "Something just made you angry and your reaction meter is going up. Calm down before it fills up: tap each step when it lights up.",
    steps: ["Pause", "Breathe", "Name", "Choose"],
    stepHints: ["Stop before you react.", "One slow breath in and out.", "Say what you feel.", "Pick what you will do."],
    meterLabel: "Reaction meter",
    roundLabel: "Round {n} of {total}",
    rounds: [
      {
        trigger: "A classmate posts: your project is trash, lol.",
        feelings: ["Hurt", "Excited", "Sleepy"],
        choices: [
          { text: "Post something mean back like you sucks.", ok: false },
          { text: "Wait until I am calm, then ask them what they meant.", ok: true }
        ]
      },
      {
        trigger: "You are stuck in traffic and you will be late for something important.",
        feelings: ["Proud", "Stressed", "Bored"],
        choices: [
          { text: "Send a short message saying I will be late, then focus on the road.", ok: true },
          { text: "Honk and yell at the cars around me.", ok: false }
        ]
      }
    ],
    feelingOk: ["Hurt", "Stressed"],
    overflow: "The meter overflowed. Take a breath and try this round again.",
    retry: "Try again",
    breatheIn: "Breathe in",
    breatheOut: "Breathe out",
    nameTitle: "Name it: what do you feel?",
    nameWrong: "That word does not fit this moment. Try another one.",
    chooseTitle: "Choose your move",
    chooseWrong: "That would make things worse. Pick the calmer move.",
    roundWin: "You held the line!",
    yourTitle: "Your own trigger",
    yourText: "Knowing what sets you off helps you spot it next time.",
    triggerLabel: "What usually triggers you?",
    triggers: ["Being interrupted", "Criticism", "Being ignored", "Unfair treatment", "Traffic and delays", "Too much pressure"],
    planLabel: "Which step will help you most next time?",
    summaryTrigger: "My trigger:",
    summaryPlan: "Step that helps me most:"
  },

  3: {
    short: "Check the facts before you judge someone.",
    storyTitle: "Climb down the ladder",
    story: "You sent a message to Sam. Sam saw it and left you on read. F",
    storyText: "Your mind already climbed to the top. Tap each step, from the top down, to check it.",
    climb: [
      { rung: "Action", text: "I will ignore Sam too.", check: "An action based on a story, not on facts." },
      { rung: "Belief", text: "Sam does not care about me.", check: "A belief built on guesses." },
      { rung: "Conclusion", text: "Sam does not want to be my friend.", check: "A conclusion I jumped to." },
      { rung: "Assumption", text: "Sam is mad at me.", check: "An assumption. I do not know this." },
      { rung: "Meaning", text: "Sam is ignoring me on purpose.", check: "A meaning I added to the data." },
      { rung: "Data", text: "Sam saw the message and has not replied yet.", check: "This is the only fact." }
    ],
    bottomText: "Back to the data: the only fact is that Sam has not replied yet. Sam could be busy, tired or having a hard day.",
    replyTitle: "What do you do now?",
    replies: [
      { text: "Send: Fine, I will never text you again.", why: "This acts on the story, not on the facts." },
      { text: "Send: Hey, is everything okay? No rush to reply.", ok: true, why: "Checking in with kindness tests your assumption and shows compassion." },
      { text: "Ignore Sam for a week.", why: "This keeps the story going without testing it." }
    ],
    sortTitle: "Observe or judge?",
    sortText: "Could anyone observe it, or is it a judgment someone added?",
    fact: "Observation",
    judge: "Judgment",
    sort: [
      { text: "Ana arrived 20 minutes late.", fact: true },
      { text: "Ana is irresponsible.", fact: false },
      { text: "Luis did not say hello this morning.", fact: true },
      { text: "Luis is rude.", fact: false }
    ],
    sortRight: "Correct.",
    sortWrong: "Look again: could a camera record it?"
  },

  4: {
    short: "Say what you need, honestly and with respect.",
    replyTitle: "Pick the assertive reply",
    situations: [
      {
        text: "A friend keeps showing up 30 minutes late every time you meet.",
        options: [
          { text: "No problem, I don't mind waiting.", style: "Passive" },
          { text: "I've waited 30 minutes the last few times and it bothers me. Can we pick a time that works for you?", style: "Assertive", ok: true },
          { text: "You're so selfish, you never respect anyone.", style: "Aggressive" }
        ]
      },
      {
        text: "Someone cuts in front of you in a long line.",
        options: [
          { text: "Hey, move! Who do you think you are?", style: "Aggressive" },
          { text: "Say nothing and let it go, even though it bothers you.", style: "Passive" },
          { text: "Excuse me, the line starts back there.", style: "Assertive", ok: true }
        ]
      }
    ],
    styleWas: "That reply is {style}.",
    sortTitle: "Fact, emotion or judgment?",
    sortText: "Assertive messages use facts and emotions, and leave judgments out. Sort each piece.",
    kinds: ["Fact", "Emotion", "Judgment"],
    pieces: [
      { text: "We agreed to meet at 8:00.", kind: "Fact" },
      { text: "You're so careless.", kind: "Judgment" },
      { text: "I felt worried.", kind: "Emotion" },
      { text: "You arrived at 8:30.", kind: "Fact" },
      { text: "You never care about anyone.", kind: "Judgment" },
      { text: "I feel disappointed.", kind: "Emotion" }
    ],
    sortRight: "Correct.",
    sortWrong: "Look again: is it something that happened, something you feel, or a label about the person?",
    bodyTitle: "Words and body",
    bodyText: "You say I'm fine, but your arms are crossed and you avoid eye contact. Which message do people usually believe?",
    bodyOptions: [
      { text: "My words", why: "When words and body do not match, people often trust the body." },
      { text: "My body language", ok: true, why: "Right. When words and body do not match, people often trust the body, so keep them aligned." }
    ]
  },

  5: {
    short: "Let go of what weighs you down.",
    humbleTitle: "Humble or defensive?",
    humbleText: "Someone gives you feedback. Pick the humble reply.",
    humble: [
      {
        situation: "Your friend tells you one of your jokes hurt them.",
        options: [
          { text: "Relax, it was just a joke.", why: "Defensive: it protects your ego and ignores how they feel." },
          { text: "I didn't mean to hurt you. Thanks for telling me, I'll be more careful.", ok: true, why: "Humble: you listen, own it and learn." }
        ]
      },
      {
        situation: "Your teacher points out a mistake in your work.",
        options: [
          { text: "Thanks, can you show me how to fix it?", ok: true, why: "Humble: a mistake is a chance to learn." },
          { text: "Everyone else made the same mistake.", why: "Defensive: blaming others stops you from learning." }
        ]
      }
    ],
    packTitle: "Lighten the backpack",
    packText: "Some ideas weigh you down. Tap the heavy ones to drop them, and keep the ones that help you grow.",
    weightLabel: "Backpack weight",
    items: [
      { text: "I am never wrong.", drop: true },
      { text: "Mistakes help me learn.", drop: false },
      { text: "If someone hurts me, I can never forgive them.", drop: true },
      { text: "People can change.", drop: false },
      { text: "Asking for help makes me weak.", drop: true },
      { text: "I can say sorry and start again.", drop: false }
    ],
    dropped: "Dropped. The backpack feels lighter.",
    keepIt: "That idea helps you grow. Keep it in the backpack.",
    allDropped: "Only the ideas that help you grow are left.",
    forgiveTitle: "Let it go",
    forgiveText: "Think of someone you want to forgive, maybe yourself. Pick who it is and let the weight go. Your choice is never saved.",
    forgiveLabel: "Who do you want to forgive?",
    forgiveWho: ["Myself", "A friend", "A family member", "Someone from school or work"],
    forgiveNote: "I choose to let go of this weight.",
    release: "Release it",
    released: "Let it go. Forgiving is a choice you can keep making."
  },

  6: {
    short: "See how far you have come.",
    afterTitle: "Check in again",
    afterText: "You started this kit with a mood check-in. How is the weather inside you now?",
    afterError: "Please pick a weather first.",
    slidersTitle: "Rate your confidence",
    slidersText: "From 1 to 5, how confident do you feel in each area? These are the 4 domains of emotional intelligence described by Goleman et al., 2002.",
    domains: [
      { name: "Self-awareness", hint: "I notice and name what I feel." },
      { name: "Self-management", hint: "I can pause and choose how I react." },
      { name: "Social awareness", hint: "I try to understand how others feel." },
      { name: "Relationship management", hint: "I communicate honestly and respectfully." }
    ],
    mapTitle: "My EI map",
    mapText: "This map is a snapshot of how you see yourself today, not a test score. Come back and check again.",
    before: "Before",
    after: "After",
    tools: "Tools collected",
    summaryDomains: "My confidence from 1 to 5:"
  }
};
