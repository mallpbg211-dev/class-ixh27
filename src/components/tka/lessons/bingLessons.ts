import { TkaMateriLesson } from '../tkaMateriLessonsData';

export const BING_LESSONS: TkaMateriLesson[] = [
  // 1. BING_UNIT_1
  {
    id: 'BING_LESSON_1',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_1',
    chapterNumber: 'Unit 1',
    chapterTitle: 'Procedure Text',
    overview: 'Have you ever wondered why recipe instructions sound so straightforward and punchy? That is the magic of Procedure Text! In this unit, we master the art of sequential instructions, imperative command verbs, transitional time connectors, and practical life manuals so you can guide anyone step-by-step without a hitch.',
    keyPoints: [
      {
        title: 'Social Function and Purpose of Procedure Text',
        description: 'The primary communicative purpose of a procedure text is to explain to the reader or listener how to make, operate, or accomplish something through a chronological sequence of actions and steps.',
        formulaOrConcept: 'Communicative Purpose: "To describe how something is made or done through a sequence of steps."'
      },
      {
        title: 'Generic Structure of Procedure Text',
        description: 'Procedure texts follow a rigid three-part architectural layout: (1) Goal or Aim (often clearly stated in the title, e.g., "How to Make Dalgona Coffee"), (2) Materials or Ingredients (a detailed list of tools, utensils, and food components with precise quantities), and (3) Steps or Methods (chronological instructions detailing the action sequence).',
        formulaOrConcept: 'Generic Structure: Goal / Aim ⟶ Materials / Ingredients ⟶ Steps / Methods'
      },
      {
        title: 'Imperative Sentences (Action Commands)',
        description: 'Procedure instructions are written in the imperative mood. They start directly with a bare infinitive (Base Verb / Verb 1) without any subject pronoun ("you", "we"). Instead of saying "You must chop the garlic", we state directly: "Chop the garlic finely!"',
        formulaOrConcept: 'Imperative Pattern: [Verb 1] + [Object / Complement]!\nExamples: "Pour the milk", "Whisk the batter", "Do not overheat the pan".'
      },
      {
        title: 'Sequence Markers & Temporal Conjunctions',
        description: 'To ensure the reader executes the actions in the exact chronological order, use time transition words: First, Second, Next, Then, After that, While, Meanwhile, and Finally.',
        formulaOrConcept: 'Chronological Connectors: First ⟶ Then ⟶ Next ⟶ After that ⟶ Finally'
      },
      {
        title: 'Adverbials of Manner, Time, and Quantity',
        description: 'Clear procedures use precise adverbs: Adverbs of manner describe how to perform the action (e.g., "stir gently", "shake vigorously"); Adverbs of time state durations (e.g., "bake for 25 minutes"); Adverbs of quantity specify amounts (e.g., "add 2 tablespoons of sugar").',
        formulaOrConcept: 'Adverb Types: Manner ("slowly", "evenly") | Time ("for 10 minutes") | Quantity ("200 ml", "a pinch of salt")'
      },
      {
        title: 'Negative Commands (Prohibitions & Warnings)',
        description: 'When an action might ruin the recipe or damage the electronic gadget, use negative imperatives starting with "Do not" or "Don\'t" followed by the base verb.',
        formulaOrConcept: 'Negative Command: "Do not / Don\'t" + [Verb 1]!\nExample: "Do not touch the hot metal plate!"'
      }
    ],
    exampleProblems: [
      {
        question: 'Read the following instruction: "You should gently blend the sliced bananas and fresh milk for two minutes." How can you transform this sentence into an authentic procedure imperative sentence?',
        stepByStep: [
          '1. Identify and remove modal auxiliary phrases and personal pronouns: eliminate "You should".',
          '2. Locate the main action verb: "blend".',
          '3. Place the bare action verb (Verb 1) right at the beginning of the sentence: "Blend...".',
          '4. Retain the adverb of manner, object, and adverb of time: "Blend the sliced bananas and fresh milk gently for two minutes!"'
        ],
        theKingTip: 'THE KING: Drop "You must/should" immediately! Start directly with Verb 1: "Blend the sliced bananas and fresh milk gently for two minutes!"',
        answer: '"Blend the sliced bananas and fresh milk gently for two minutes!"'
      },
      {
        question: 'What is the communicative purpose of a text entitled "How to Operate a Digital Microwave Oven Safely"?',
        stepByStep: [
          '1. Identify the text type: the title begins with "How to Operate", which is the hallmark of a manual procedure text.',
          '2. Identify the target audience and object: operating a digital microwave oven safely.',
          '3. Formulate the purpose: to guide or tell the reader how to use and operate the digital microwave oven in a safe step-by-step manner.'
        ],
        theKingTip: 'THE KING: For "How to..." titles, look for option starting with: "To tell / show the reader how to operate / make [object]".',
        answer: 'To guide the reader on how to operate a digital microwave oven safely.'
      },
      {
        question: 'Which section of a recipe text contains the following sentence: "Whisk two eggs in a medium bowl until frothy and bubbly"? (A) Goal, (B) Ingredients, (C) Steps/Methods, (D) Reorientation.',
        stepByStep: [
          '1. The sentence begins with an imperative action verb "Whisk" and describes an active cooking instruction.',
          '2. Ingredients only list items and quantities (e.g., "2 fresh eggs").',
          '3. Goal is the title/objective.',
          '4. Therefore, active instructions belong to the Steps or Methods section.'
        ],
        theKingTip: 'THE KING: Action verb + instruction = "Steps / Methods" section!',
        answer: 'Pilihan (C) Steps / Methods'
      },
      {
        question: 'Complete the sentence with the most appropriate sequence connector: "Wash the apples thoroughly under running water. (....), peel the skin and slice them into thin wedges."',
        stepByStep: [
          '1. The first action is washing the apples.',
          '2. Peeling and slicing is the immediate subsequent action in the process.',
          '3. Appropriate chronological sequence connectors for the second step include: "Then", "Next", or "After that".'
        ],
        theKingTip: 'THE KING: "First" is followed naturally by "Next", "Then", or "After that".',
        answer: '"Next" (or "Then" / "After that")'
      },
      {
        question: 'Identify the adverb of manner in the following instruction: "Tighten the bicycle screws securely with a wrench to avoid loose joints."',
        stepByStep: [
          '1. An adverb of manner answers the question "How should the action be done?".',
          '2. The verb is "Tighten". How should the screws be tightened? "Securely" (firmly and safely).',
          '3. Words ending in suffix "-ly" describing action methods are typically adverbs of manner.'
        ],
        theKingTip: 'THE KING: Look for the "-ly" word that describes HOW to do the verb: "securely" is the adverb of manner.',
        answer: 'securely'
      },
      {
        question: 'In a recipe for fruit jelly, why is it crucial to specify "refrigerate for at least 3 hours until completely set" rather than simply "chill in fridge"?',
        stepByStep: [
          '1. Gelatin requires a specific chilling duration and low temperature to transition from liquid to solid state.',
          '2. Vague wording like "chill in fridge" does not inform the cook when the dessert is ready to serve.',
          '3. Precise adverbials of time ("for at least 3 hours") and condition ("until completely set") prevent the user from taking out runny, unformed jelly.'
        ],
        theKingTip: 'THE KING: Precision prevents failure! Exact time guarantees the gelatin solidifies properly.',
        answer: 'To provide an exact time benchmark so the gelatin solidifies completely before serving.'
      },
      {
        question: 'Change the following positive instruction into a negative prohibition warning: "Plug the electric kettle into the socket while your hands are still wet."',
        stepByStep: [
          '1. A negative prohibition command begins with "Do not" or "Never".',
          '2. Place "Do not" before the base verb "plug".',
          '3. Resulting warning: "Do not plug the electric kettle into the socket while your hands are still wet!"'
        ],
        theKingTip: 'THE KING: Add "Do not" or "Never" at the front: "Do not plug the electric kettle..."',
        answer: '"Do not plug the electric kettle into the socket while your hands are still wet!"'
      },
      {
        question: 'Which of the following verbs is NOT a typical action verb used in procedure recipes? (A) Sauté, (B) Contemplate, (C) Marinate, (D) Simmer.',
        stepByStep: [
          '1. "Sauté" means to fry quickly in a little hot fat (culinary action).',
          '2. "Marinate" means to soak food in seasoned liquid (culinary action).',
          '3. "Simmer" means to cook gently just below boiling point (culinary action).',
          '4. "Contemplate" means to think deeply or meditate (mental process, not a culinary physical action).',
          '5. The correct answer is (B).'
        ],
        theKingTip: 'THE KING: "Contemplate" means daydreaming/meditating! Not a cooking verb.',
        answer: 'Pilihan (B) Contemplate'
      },
      {
        question: 'What is the difference between "Materials" and "Equipment" in a procedure text?',
        stepByStep: [
          '1. Materials (or Ingredients) are consumable substances that become part of the final product or are used up during the process (e.g., flour, sugar, water, glue).',
          '2. Equipment (or Tools/Utensils) are durable instruments and devices used to perform the tasks and can be reused repeatedly (e.g., knife, blender, frying pan, scissors).'
        ],
        theKingTip: 'THE KING: Materials = Consumable items that run out (flour, eggs). Equipment = Reusable tools (pan, knife, blender).',
        answer: 'Materials are consumable substances used up in the product; equipment refers to reusable tools and utensils.'
      },
      {
        question: 'Arrange the following jumbled steps into a coherent procedure: (1) Serve the warm tea in your favorite porcelain cup. (2) Boil fresh tap water in a kettle. (3) Steep the black tea bag in the hot water for 3 minutes. (4) Pour the boiling water into a teapot containing a tea bag.',
        stepByStep: [
          '1. Step (2): First, boil the water.',
          '2. Step (4): Next, pour the boiling water into the teapot.',
          '3. Step (3): Then, allow the tea bag to steep for 3 minutes.',
          '4. Step (1): Finally, serve the warm tea.',
          '5. Chronological order: (2) ⟶ (4) ⟶ (3) ⟶ (1).'
        ],
        theKingTip: 'THE KING: Boil water (2) ⟶ Pour into teapot (4) ⟶ Steep 3 minutes (3) ⟶ Serve (1). Chronology: 2-4-3-1.',
        answer: '(2) ⟶ (4) ⟶ (3) ⟶ (1)'
      }
    ],
    summary: 'Procedure text guides the reader chronologically through Goal, Materials, and Steps. Master imperative verbs at the start of sentences and sequence markers (First, Next, Then, Finally).'
  },

  // 2. BING_UNIT_2 (NEW)
  {
    id: 'BING_LESSON_2',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_2',
    chapterNumber: 'Unit 2',
    chapterTitle: 'Advertisements',
    overview: 'Look around you: billboards, YouTube pre-roll ads, Instagram sponsored posts! Commercial advertisements are everywhere. In this unit, we unlock the secrets of persuasive language (the AIDA principle), catchy slogans, discount terms, call-to-action phrases, and learning how to read between the lines so you can become a savvy, smart consumer.',
    keyPoints: [
      {
        title: 'Social Function of Commercial Advertisements',
        description: 'The primary goal of an advertisement (ad) is to persuade, influence, and convince the target audience to purchase a product, use a service, or attend a commercial event.',
        formulaOrConcept: 'Core Purpose: "To promote, persuade, and attract potential consumers to buy [product/service]."'
      },
      {
        title: 'The AIDA Marketing Formula',
        description: 'Effective advertisements follow the classic psychological framework: Attention (bold headline & eye-catching graphics), Interest (relevant benefits and solutions to customer problems), Desire (appealing offers, testimonials, exclusivity), and Action (clear contact details or discount deadline).',
        formulaOrConcept: 'AIDA: Attention (Hook) ⟶ Interest (Need) ⟶ Desire (Want) ⟶ Action (Buy Now)'
      },
      {
        title: 'Persuasive Language & Emotive Adjectives',
        description: 'Advertisers deliberately choose power words and positive superlatives to make their offer irresistible: "exclusive", "limited edition", "mouth-watering", "unbeatable price", "eco-friendly", "guaranteed quality", "premium".',
        formulaOrConcept: 'Persuasive Vocabulary: "Grab it fast!", "Hurry up!", "Best deal in town!", "Don\'t miss out!"'
      },
      {
        title: 'Call to Action (CTA)',
        description: 'A Call to Action is a direct, imperative prompt that tells the prospective customer exactly what step to take next. Without a CTA, an ad loses its converting power.',
        formulaOrConcept: 'CTA Examples: "Order now via WhatsApp", "Visit our store today", "Click the link in bio", "Call 0812-XXXX for free consultation".'
      },
      {
        title: 'Commercial Promotional Terms & Discounts',
        description: 'Understanding retail terminology frequently tested in examinations: "BOGO" (Buy One Get One Free), "Up to 50% off", "Cashback", "Clearance sale", "Terms and conditions apply (T&C)", "While supplies last".',
        formulaOrConcept: '"Up to 70% off" means the maximum discount is 70%, but most items may only have 10% or 20% discount.'
      },
      {
        title: 'Target Audience Analysis',
        description: 'Every advertisement is designed for a specific demographic group: teenagers, parents, athletes, business professionals, or pet owners. Pay close attention to the visual imagery and vocabulary style to determine the intended audience.',
        formulaOrConcept: 'Target Audience: Identify age group, interest, and profession from the ad context.'
      }
    ],
    exampleProblems: [
      {
        question: 'An advertisement reads: "MEGA BACK-TO-SCHOOL SALE! Get up to 40% discount on all ergonomic backpacks and stationery. Valid only until July 31st. Visit www.schoolsmart.id now!" What is the main intention of the advertiser?',
        stepByStep: [
          '1. Analyze the keywords: "MEGA SALE", "Get up to 40% discount", "Visit www.schoolsmart.id now!".',
          '2. The text is an advertisement promoting backpacks and school stationery.',
          '3. The underlying communicative intention is to attract students and parents to buy school supplies on discount before the deadline.'
        ],
        theKingTip: 'THE KING: Advertisements always aim "to persuade/promote people to purchase the advertised products".',
        answer: 'To promote discounted school supplies and persuade consumers to purchase them before July 31st.'
      },
      {
        question: 'What does the promotional phrase "Buy 1 Get 1 Free (BOGO)" literally mean for a shopper?',
        stepByStep: [
          '1. "Buy 1": The customer pays the full price for one item.',
          '2. "Get 1 Free": The retailer gives a second identical (or equal value) item without charging any extra money.',
          '3. In essence, the shopper receives two items for the price of one, which equals a 50% discount per item.'
        ],
        theKingTip: 'THE KING: BOGO = 2 items for the price of 1 (an effective 50% savings per unit).',
        answer: 'The shopper receives two items while only paying for the price of one.'
      },
      {
        question: 'Identify the "Call to Action" (CTA) in the following promotional snippet: "Crispy, juicy fried chicken with authentic spicy sambal! Only Rp15.000 this weekend. Dial 0811-2345 to order your lunch box today!"',
        stepByStep: [
          '1. A Call to Action tells the reader what physical action to take immediately.',
          '2. "Crispy, juicy fried chicken..." is the product description.',
          '3. "Only Rp15.000 this weekend" is the promotional price offer.',
          '4. "Dial 0811-2345 to order your lunch box today!" provides the direct command and contact number, making it the CTA.'
        ],
        theKingTip: 'THE KING: CTA = The direct command telling you how to buy/contact: "Dial 0811-2345 to order...".',
        answer: '"Dial 0811-2345 to order your lunch box today!"'
      },
      {
        question: 'An ad states: "Special offer valid while supplies last." What happens if a customer visits the store when the warehouse stock is completely sold out?',
        stepByStep: [
          '1. The phrase "while supplies last" means the promotional deal is strictly limited by the available inventory of goods.',
          '2. Once the stock is depleted (sold out), the promotion ends automatically.',
          '3. Therefore, the customer cannot claim the discounted price once the goods are out of stock.'
        ],
        theKingTip: 'THE KING: "While supplies last" = As long as items are available. If sold out, the discount terminates!',
        answer: 'The special discount is no longer available because the inventory has run out.'
      },
      {
        question: 'Who is the most likely target audience for an advertisement featuring colorful cute stickers, washable non-toxic crayons, and a bold caption: "Let your toddler unleash their boundless creativity safely!"?',
        stepByStep: [
          '1. The products are non-toxic crayons and cute stickers designed for toddlers (anak balita).',
          '2. Toddlers do not have money to purchase products themselves.',
          '3. The wording appeals to safety and fostering children\'s creativity.',
          '4. The actual purchasing target audience is parents of young children/toddlers.'
        ],
        theKingTip: 'THE KING: Children\'s products are targeted at PARENTS who hold the purchasing budget!',
        answer: 'Parents of young children / toddlers'
      },
      {
        question: 'What is the purpose of including customer testimonials (e.g., "This laptop helped me score top grades! - Sarah, Grade 9") in a tech advertisement?',
        stepByStep: [
          '1. Testimonials represent social proof (evidence from real everyday users).',
          '2. Prospective buyers trust the honest opinions of peers more than commercial claims made by corporate companies.',
          '3. The purpose is to build credibility, trustworthiness, and spark desire in potential buyers.'
        ],
        theKingTip: 'THE KING: Testimonials = Social Proof to build consumer trust and authenticity.',
        answer: 'To build credibility and convince potential buyers through authentic social proof.'
      },
      {
        question: 'If an advertisement banner boasts "Discounts Up to 70% Off", does every single item in the store receive a 70% price cut? Explain why or why not!',
        stepByStep: [
          '1. The key preposition is "Up to" (sampai dengan).',
          '2. "Up to 70%" indicates the maximum ceiling discount applied to selected clearance items.',
          '3. Other items may only receive 10%, 20%, or even no discount at all.',
          '4. Therefore, not all items are discounted by 70%.'
        ],
        theKingTip: 'THE KING: "Up to" = Maximum cap, NOT universal! Most items have much lower discounts.',
        answer: 'No, because "up to" means 70% is the maximum discount, while most items receive lower discounts.'
      },
      {
        question: 'Which of the following slogans best employs persuasive rhyming technique? (A) Eat fresh vegetables every day, (B) A Mars a day helps you work, rest and play, (C) We provide fast internet for your family, (D) Buy books at our bookstore.',
        stepByStep: [
          '1. Rhyming slogans use matching end sounds to stick in consumer memory.',
          '2. In option (B), the words "day" and "play" rhyme perfectly (/deɪ/ and /pleɪ/).',
          '3. It also has a balanced rhythmic meter: "work, rest and play".',
          '4. Correct answer is (B).'
        ],
        theKingTip: 'THE KING: Look for matching sound endings: "day" rhymes with "play" in option (B).',
        answer: 'Pilihan (B) "A Mars a day helps you work, rest and play"'
      },
      {
        question: 'What does the asterisk symbol (*) next to a promotional price usually indicate in commercial advertising?',
        stepByStep: [
          '1. An asterisk (*) signals a footnote reference.',
          '2. In retail advertising, it invariably points to "Terms and Conditions (T&C) apply".',
          '3. It often hides exclusions, minimum purchase requirements, tax exclusions, or specific branch limitations.'
        ],
        theKingTip: 'THE KING: Asterisk (*) = "Terms & conditions apply" (syarat dan ketentuan tersembunyi).',
        answer: 'It indicates that specific terms and conditions apply to the offer.'
      },
      {
        question: 'Write a compelling two-sentence promotional ad copy for a student-run bakery selling homemade chocolate chip cookies!',
        stepByStep: [
          '1. Sentence 1 (Hook & Sensory Appeal): "Craving the ultimate melt-in-your-mouth sweet treat after a tough school day?"',
          '2. Sentence 2 (Offer & CTA): "Grab our freshly baked, gooey chocolate chip cookies for only Rp10.000 a pouch—DM @CookieCrunch on Instagram before 5 PM to get a free topping!"'
        ],
        theKingTip: 'THE KING Formula: Hook with sensory emotion ⟶ Present attractive price + Urgent CTA!',
        answer: '"Craving the ultimate melt-in-your-mouth treat? Grab our freshly baked chocolate chip cookies for only Rp10.000—order now via WhatsApp 0812-XXXX to claim a free topping!"'
      }
    ],
    summary: 'Commercial advertisements persuade consumers using the AIDA model: Attention (headline), Interest (benefits), Desire (emotive words/offers), and Action (clear Call to Action). Watch out for terms like "up to" and "while supplies last".'
  },

  // 3. BING_UNIT_3 (NEW)
  {
    id: 'BING_LESSON_3',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_3',
    chapterNumber: 'Unit 3',
    chapterTitle: 'Report Text',
    overview: 'How do giant blue whales communicate across thousands of miles of ocean, or what makes a dormant volcano erupt violently? Report texts deliver factual scientific knowledge about the world as it is. In this unit, we dissect the difference between descriptive and report texts, master the Simple Present Tense, and explore technical scientific terminology.',
    keyPoints: [
      {
        title: 'Social Function of Report Text',
        description: 'Report text describes the way things are with reference to a range of natural, man-made, and social phenomena in our environment. It presents factual information about an entire class or species of things (in general), rather than one specific individual thing.',
        formulaOrConcept: 'Communicative Purpose: "To present factual scientific information about [subject] in general as a result of systematic observation."'
      },
      {
        title: 'Report Text vs Descriptive Text (Crucial Distinction)',
        description: 'A Descriptive Text describes a single, specific, unique subject (e.g., "My pet cat, Milo" or "Mount Bromo"). A Report Text describes an entire general category or natural species as a collective whole (e.g., "Felines / Cats in general" or "Volcanoes around the world").',
        formulaOrConcept: 'Report = GENERAL category ("Whales", "Smartphones", "Tsunamis")\nDescriptive = SPECIFIC entity ("My puppy Bonbon", "The Eiffel Tower")'
      },
      {
        title: 'Generic Structure of Report Text',
        description: 'Report texts are organized into two fundamental sections: (1) General Classification (introduces and categorizes the subject, defining what it is and what group it belongs to), and (2) Description (provides detailed scientific accounts of parts, physical appearance, habitat, diet, behavior, reproduction, or survival mechanisms).',
        formulaOrConcept: 'Generic Structure: General Classification ⟶ Description of Physical Traits, Habitat, Diet, & Habits'
      },
      {
        title: 'Dominant Grammar: Simple Present Tense',
        description: 'Because report texts state timeless scientific facts, universal truths, and general habits, they strictly use the Simple Present Tense (Subject + Verb 1 / Verb 1+s/es, or Subject + is/am/are).',
        formulaOrConcept: 'Simple Present Tense Pattern:\n$$\\text{Subject (Plural)} + V_1 \\implies \\text{Whales breathe air through blowholes.}$$\n$$\\text{Subject (Singular)} + V_{1+\\text{s/es}} \\implies \\text{A chameleon changes its skin color.}$$'
      },
      {
        title: 'Technical and Scientific Terminology',
        description: 'Report texts use domain-specific scientific vocabulary appropriate for biology, geology, or technology (e.g., "mammal", "nocturnal", "herbivore", "photosynthesis", "tectonic plates", "echolocation").',
        formulaOrConcept: 'Scientific Jargon: Herbivore (plant-eater), Carnivore (meat-eater), Nocturnal (active at night), Habitat (natural living home).'
      },
      {
        title: 'Passive Voice in Scientific Reports',
        description: 'To maintain an objective, formal scientific tone, report texts frequently employ passive voice where the action or process is more important than the agent.',
        formulaOrConcept: 'Passive Voice Pattern:\n$$\\text{Subject} + \\text{is / are} + \\text{Verb 3 (Past Participle)}$$\nExample: "Solar energy is converted into electrical energy by photovoltaic cells."'
      }
    ],
    exampleProblems: [
      {
        question: 'Read the sentence: "Komodo dragons (Varanus komodoensis) are the heaviest lizards on Earth, weighing up to 150 kilograms." Which generic structure component does this opening sentence represent in a report text?',
        stepByStep: [
          '1. The sentence introduces the subject by its general name and scientific taxonomic nomenclature (Varanus komodoensis).',
          '2. It classifies the creature into the broader family of reptiles/lizards ("heaviest lizards on Earth").',
          '3. This opening categorization is the hallmark of the General Classification section.'
        ],
        theKingTip: 'THE KING: Opening sentence stating scientific identity and general category = "General Classification".',
        answer: 'General Classification'
      },
      {
        question: 'Which of the following titles indicates a REPORT TEXT rather than a descriptive text? (A) My Beloved Siamese Cat, (B) The Majestic African Elephants, (C) Visiting My Uncle\'s Dairy Farm, (D) A Memorable Trip to Komodo Island.',
        stepByStep: [
          '1. Option (A) is about a specific personal pet ("My Beloved..."). That is descriptive.',
          '2. Option (C) and (D) are personal recount experiences.',
          '3. Option (B) discusses the whole species "African Elephants" in general scientific terms.',
          '4. Therefore, (B) is a Report Text.'
        ],
        theKingTip: 'THE KING: Plural species noun without "my/our" = Report Text ("African Elephants", "Volcanoes", "Solar Systems").',
        answer: 'Pilihan (B) The Majestic African Elephants'
      },
      {
        question: 'Fill in the blank with the correct form of the verb: "Unlike fish that absorb oxygen through gills, dolphins (breathe) (....) atmospheric air through a blowhole situated on top of their heads."',
        stepByStep: [
          '1. Identify the subject: "dolphins" is a plural noun (they).',
          '2. Scientific fact texts require the Simple Present Tense.',
          '3. For plural subjects, use the bare base verb (Verb 1) without adding -s/-es.',
          '4. The correct verb form is "breathe".'
        ],
        theKingTip: 'THE KING: Plural subject "dolphins" = Verb 1 bare "breathe" without -s.',
        answer: 'breathe'
      },
      {
        question: 'What is the biological meaning of the technical term "nocturnal predator" often used in report texts about owls and bats?',
        stepByStep: [
          '1. "Nocturnal" refers to animals that sleep during the daytime and become active during the night.',
          '2. "Predator" refers to an organism that hunts, catches, and eats other animals (prey).',
          '3. Combining both terms: an animal that hunts for its prey predominantly during the nighttime.'
        ],
        theKingTip: 'THE KING: Nocturnal = Active at night; Diurnal = Active during daylight.',
        answer: 'An animal that hunts and feeds on other animals during the night.'
      },
      {
        question: 'Transform the following active scientific statement into passive voice: "Worker bees collect sweet nectar from blooming flowers."',
        stepByStep: [
          '1. Identify Subject: "Worker bees", Verb: "collect" (Present), Object: "sweet nectar".',
          '2. Move the object to the front: "Sweet nectar".',
          '3. "Nectar" is uncountable singular, so use auxiliary verb "is".',
          '4. Change "collect" to past participle (Verb 3): "collected".',
          '5. Add agent phrase: "by worker bees from blooming flowers".',
          '6. Full sentence: "Sweet nectar is collected by worker bees from blooming flowers."'
        ],
        theKingTip: 'THE KING Passive Formula: Object + is/are + Verb 3: "Sweet nectar is collected by worker bees..."',
        answer: '"Sweet nectar is collected by worker bees from blooming flowers."'
      },
      {
        question: 'Why does report text use Simple Present Tense instead of Past Tense?',
        stepByStep: [
          '1. Simple Present Tense is the grammatical mood used to express universal truths, natural laws, and enduring scientific facts.',
          '2. Whales do not just breathe air in the past; they continue to breathe air today and in the future.',
          '3. Past Tense would imply that the species behavior has ended or is an isolated historical event.'
        ],
        theKingTip: 'THE KING: Scientific facts are timeless truths, so they must use Simple Present Tense!',
        answer: 'Because report texts state general truths, permanent scientific facts, and ongoing natural phenomena.'
      },
      {
        question: 'In a report text about "Tropical Rainforests", which paragraph would you expect to find details about annual rainfall, temperature ranges, and soil composition?',
        stepByStep: [
          '1. General Classification introduces what tropical rainforests are and where they are situated geographically.',
          '2. Description paragraphs elaborate on physical environmental characteristics, climate, flora, and fauna.',
          '3. Details regarding rainfall, temperature, and soil belong to the Description of Climate and Physical Characteristics.'
        ],
        theKingTip: 'THE KING: Specific scientific metrics (rainfall, temperature, anatomy) always belong to "Description".',
        answer: 'The Description section (specifically addressing Climate and Environmental Characteristics)'
      },
      {
        question: 'What does the term "habitat loss" refer to in environmental conservation report texts?',
        stepByStep: [
          '1. "Habitat" is the natural home or environment where an animal, plant, or organism lives.',
          '2. "Loss" means destruction or reduction.',
          '3. Therefore, "habitat loss" refers to the degradation, destruction, or fragmentation of natural ecosystems caused by human activities (such as deforestation or urbanization).'
        ],
        theKingTip: 'THE KING: Habitat = Home of wild species. Habitat loss = Destruction of natural living environments.',
        answer: 'The destruction or fragmentation of natural living environments where wildlife species reside.'
      },
      {
        question: 'Identify the sentence containing an incorrect verb agreement for a report text: (A) Platypuses lay eggs rather than giving birth to live young. (B) Bamboo grow faster than most trees. (C) An eagle possesses keen eyesight.',
        stepByStep: [
          '1. Sentence (A): "Platypuses" (plural) + "lay" (plural verb) ⟶ Correct.',
          '2. Sentence (C): "An eagle" (singular) + "possesses" (singular verb) ⟶ Correct.',
          '3. Sentence (B): "Bamboo" when used as an uncountable singular plant noun requires a singular verb with -s: "grows".',
          '4. Therefore, sentence (B) has incorrect subject-verb agreement.'
        ],
        theKingTip: 'THE KING: "Bamboo" is treated as singular mass noun: it must be "Bamboo grows", not "grow"!',
        answer: 'Pilihan (B) "Bamboo grow faster than most trees" (should be "grows")'
      },
      {
        question: 'What is the difference in communicative focus between a Report Text about "Earthquakes" and a News Item text about "An Earthquake in Cianjur"?',
        stepByStep: [
          '1. The Report Text discusses earthquakes as a global geological phenomenon: what causes seismic waves, tectonic plates, and how magnitudes are measured generally.',
          '2. The News Item reports a single, specific newsworthy historical event: date, casualties, damage, and rescue efforts in Cianjur on a particular day.',
          '3. Report is general science; News Item is a specific current event.'
        ],
        theKingTip: 'THE KING: Report Text = General science (all earthquakes). News Item = One specific event (Cianjur earthquake yesterday).',
        answer: 'The report text explains earthquakes as a general geological phenomenon, while the news item reports a specific newsworthy event with local victims and dates.'
      }
    ],
    summary: 'Report texts provide objective scientific facts about general categories (plural species/phenomena) using General Classification and Description. They rely heavily on the Simple Present Tense and technical domain vocabulary.'
  },

  // 4. BING_UNIT_4
  {
    id: 'BING_LESSON_4',
    subject: 'B_INGGRIS',
    chapterId: 'BING_UNIT_4',
    chapterNumber: 'Unit 4',
    chapterTitle: 'Product Labels',
    overview: 'Ever picked up a snack or bottle of medicine and felt overwhelmed by tiny tables and technical warnings? Reading product labels is an essential life skill! In this unit, we learn to decipher nutrition facts, allergen warnings, dosage instructions, and expiration dates so you stay healthy, safe, and exam-ready.',
    keyPoints: [
      {
        title: 'Social Function of Food and Medicine Labels',
        description: 'To provide detailed, truthful factual information regarding a commercial food, beverage, or pharmaceutical product so consumers can use, store, or consume it safely and effectively.',
        formulaOrConcept: 'Purpose: "To give detailed factual information about the ingredients, dosage, and safety of a product."'
      },
      {
        title: 'Essential Components of Medicine Labels',
        description: 'Medicine labels feature critical fields: Brand name, Generic drug name, Description / Purpose, Active Ingredients, Dosage & Directions to use (how much to take and how often), Storage instructions, Warnings, and Expiration Date.',
        formulaOrConcept: 'Key Sections: Brand ⟶ Active Ingredients ⟶ Dosage / Directions ⟶ Warnings ⟶ Storage ⟶ Expiry Date'
      },
      {
        title: 'Deciphering Nutrition Facts on Food Labels',
        description: 'Nutrition labels display: Serving Size (takaran saji), Servings Per Container (jumlah sajian per kemasan), Calories per serving, Total Fat, Sodium (salt), Dietary Fiber, and Sugars. Be careful: all nutrition numbers are calculated per SERVING, not per entire box!',
        formulaOrConcept: 'Total Calories of Whole Box = Calories per Serving $\\times$ Servings per Container!'
      },
      {
        title: 'Storage Instructions & Product Integrity',
        description: 'Labels guide consumers on preserving product freshness and preventing chemical breakdown: "Store in a cool, dry place", "Keep away from direct sunlight", "Refrigerate after opening", "Keep out of reach of children".',
        formulaOrConcept: 'Storage Terms: "Keep refrigerated" (simpan di kulkas) | "Keep tightly closed" (tutup rapat)'
      },
      {
        title: 'Expiration Dates vs Best Before Dates',
        description: '"Expiration Date (Exp. Date / Use by)" indicates the safety deadline after which the product may turn toxic or harmful. "Best Before (BBD)" indicates the date until which the product retains peak taste, aroma, and crispness, though it might still be safe shortly after.',
        formulaOrConcept: 'Exp. Date = Safety deadline (DO NOT consume after this date!)\nBest Before = Optimal quality deadline'
      },
      {
        title: 'Allergen Warnings and Contraindications',
        description: 'Labels highlight common allergens to protect allergic consumers: "Contains peanuts, soy, and dairy", "Manufactured on shared equipment that processes tree nuts", "Not suitable for children under 2 years old".',
        formulaOrConcept: 'Allergen Warning: Highlights ingredients causing adverse immune reactions (gluten, shellfish, peanuts).'
      }
    ],
    exampleProblems: [
      {
        question: 'A nutrition fact panel states: "Serving Size: 30 grams (about 4 biscuits). Servings per container: 5. Calories per serving: 140 kcal." If Toni eats the entire box of biscuits in one afternoon, how many total calories has he consumed?',
        stepByStep: [
          '1. Identify calories per single serving: 140 kcal.',
          '2. Identify total servings in the container: 5 servings.',
          '3. Since Toni consumed the whole box, multiply the calories per serving by the total number of servings.',
          '4. Total Calories = $140 \\times 5 = 700\\text{ kcal}$.'
        ],
        theKingTip: 'THE KING Classic Exam Trap: Always multiply by "Servings Per Container"! Calories = $140 \\times 5 = 700\\text{ kcal}$. Never answer just 140!',
        answer: '700 kcal'
      },
      {
        question: 'What is the main danger of consuming a pharmaceutical drug past its designated "Expiration Date"?',
        stepByStep: [
          '1. The chemical active compounds decompose over time into degraded by-products.',
          '2. The drug loses its medical potency (cannot cure the illness).',
          '3. Decomposed chemicals can become toxic and cause severe liver or kidney damage.',
          '4. Therefore, taking expired medicine risks toxicity and treatment failure.'
        ],
        theKingTip: 'THE KING: "Expiration Date" = Safety deadline. Past this date, the drug may become toxic or ineffective.',
        answer: 'The drug loses its medical potency and chemical decomposition may cause toxic health hazards.'
      },
      {
        question: 'A cough syrup label reads: "Dosage: Children 6-12 years: 1 teaspoonful (5 ml) every 4 hours. Adults: 2 teaspoonfuls (10 ml) every 4 hours. Do not exceed 4 doses in 24 hours." What is the maximum volume of syrup an 8-year-old child may safely consume in one day?',
        stepByStep: [
          '1. An 8-year-old falls into the "Children 6-12 years" category.',
          '2. Dosage per intake for this category = 1 teaspoonful ($5\\text{ ml}$).',
          '3. The maximum frequency warning states: "Do not exceed 4 doses in 24 hours".',
          '4. Maximum daily volume = $5\\text{ ml} \\times 4\\text{ doses} = 20\\text{ ml}$.'
        ],
        theKingTip: 'THE KING: Check the age bracket (8 years ⟶ 5 ml). Multiply by max doses ($5 \\times 4 = 20\\text{ ml}$).',
        answer: '20 ml'
      },
      {
        question: 'What does the instruction "Refrigerate after opening and consume within 3 days" imply for the consumer?',
        stepByStep: [
          '1. Before opening, the sealed container can be stored at room temperature.',
          '2. Once the seal is broken, exposure to air introduces bacteria and oxygen.',
          '3. The product must immediately be moved to the refrigerator (kulkas).',
          '4. It remains safe and fresh for a maximum of 3 days after unsealing.'
        ],
        theKingTip: 'THE KING: "Refrigerate after opening" = Put in the fridge once opened, and finish it within 3 days!',
        answer: 'Keep the product in the refrigerator once unsealed, and finish consuming it within 3 days.'
      },
      {
        question: 'Why do food product labels print allergen statements such as "Contains dairy and soy" in bold capital letters?',
        stepByStep: [
          '1. Certain individuals have severe, potentially life-threatening food allergies (anaphylaxis) to proteins like dairy and soy.',
          '2. Bold capital letters immediately catch the eye of consumers with allergies before they purchase or eat the product.',
          '3. It is a legal consumer safety requirement mandated by food and drug administrations.'
        ],
        theKingTip: 'THE KING: Bold Allergen alerts prevent life-threatening allergic reactions in sensitive consumers.',
        answer: 'To warn consumers with food allergies so they can avoid severe adverse health reactions.'
      },
      {
        question: 'Where would you find the phrase "Keep out of reach of children" on a label, and what is its purpose?',
        stepByStep: [
          '1. It is found in the "Warnings" or "Precautions" section of medicine and household chemical labels.',
          '2. Its purpose is to prevent young children from accidentally ingesting or playing with potentially hazardous substances.',
          '3. It instructs adults to store the item in a high or locked cabinet.'
        ],
        theKingTip: 'THE KING: Found in "Warnings / Precautions" to prevent accidental poisoning in kids.',
        answer: 'In the Warnings / Precautions section, to prevent accidental ingestion or poisoning by curious young children.'
      },
      {
        question: 'A bottle of multivitamin tablets reads: "Dietary Supplement. Not for medicinal use. Consult a physician before use if pregnant." What does "consult a physician" mean?',
        stepByStep: [
          '1. "Physician" is a formal medical term for a licensed medical doctor.',
          '2. "Consult" means to seek professional advice or permission.',
          '3. The warning advises pregnant women to ask their doctor before taking the supplement to ensure safety for the fetus.'
        ],
        theKingTip: 'THE KING: Physician = Medical Doctor. Consult = Ask for professional medical advice.',
        answer: 'Ask advice from a licensed medical doctor before consuming the supplement.'
      },
      {
        question: 'A beverage label displays "0 grams Sugar per serving", but the ingredient list includes "Aspartame and Sucralose". What does this reveal about the drink?',
        stepByStep: [
          '1. The drink contains zero natural granulated cane sugar (sucrose), which is why the nutrition panel states 0g Sugar.',
          '2. However, Aspartame and Sucralose are artificial zero-calorie sweeteners.',
          '3. This reveals that the beverage still tastes sweet, but its sweetness originates from synthetic chemical sweeteners.'
        ],
        theKingTip: 'THE KING: "0g Sugar" with aspartame/sucralose = Artificially sweetened diet beverage!',
        answer: 'The drink is artificially sweetened using synthetic non-sugar sweeteners (Aspartame/Sucralose).'
      },
      {
        question: 'Which of the following items is an "Inactive Ingredient" typically found in tablet medicine labels? (A) Paracetamol 500 mg, (B) Amoxicillin 250 mg, (C) Starch binder and food coloring, (D) Ibuprofen 200 mg.',
        stepByStep: [
          '1. Active ingredients are the chemical substances that biologically cure or treat the symptoms (Paracetamol, Amoxicillin, Ibuprofen).',
          '2. Inactive ingredients are excipients, binders, preservatives, flavorings, and colorings that give the pill its shape and stability.',
          '3. Therefore, starch binder and food coloring are inactive ingredients.'
        ],
        theKingTip: 'THE KING: Active = The healing medicine. Inactive = Fillers, coloring, and binders (starch).',
        answer: 'Pilihan (C) Starch binder and food coloring'
      },
      {
        question: 'A sunscreen bottle specifies "Apply liberally 15 minutes before sun exposure. Reapply at least every 2 hours or after 80 minutes of swimming." What must a swimmer do to maintain skin protection?',
        stepByStep: [
          '1. The swimmer must apply the sunscreen 15 minutes prior to entering sunlight.',
          '2. While swimming, water gradually washes off the protective lotion.',
          '3. The label specifies reapplication "after 80 minutes of swimming".',
          '4. Therefore, after 80 minutes in the pool or ocean, the swimmer must towel dry and put on a fresh coat of sunscreen.'
        ],
        theKingTip: 'THE KING: Reapply after 80 minutes of swimming to restore the washed-off sunscreen barrier.',
        answer: 'Reapply the sunscreen lotion after 80 minutes in the water (or every 2 hours under dry conditions).'
      }
    ],
    summary: 'Product labels communicate vital health and safety benchmarks. Always calculate total nutrition by multiplying by the number of servings, respect expiration safety deadlines, and adhere strictly to dosage limits.'
  }
];
