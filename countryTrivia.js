const countryTrivia = {
    "Afghanistan": [
        "Has been inhabited for over 50,000 years",
        "Famous for its handwoven carpets",
        "Known as the 'Graveyard of Empires'",
        "Home to the ancient Silk Road trading route"
    ],
    "Albania": [
        "Has over 360 species of birds",
        "Never had a McDonald's restaurant",
        "Has over 360 ancient castles and fortresses",
        "First European country to elect a female president"
    ],
    "Algeria": [
        "Largest country in Africa",
        "Has seven UNESCO World Heritage sites",
        "80% of its land is covered by the Sahara Desert",
        "Home to seven ancient Roman ruins"
    ],
    "Australia": [
        "Home to 21 of the world's 25 most venomous snakes",
        "The Great Barrier Reef is the world's largest living structure",
        "Has the world's largest population of wild camels",
        "First country to have a complete continent to itself"
    ],
    "Brazil": [
        "Home to the largest rainforest in the world",
        "Only country to have played in every FIFA World Cup",
        "Portuguese is the official language",
        "Rio Carnival is the world's largest carnival"
    ],
    "Canada": [
        "Has the longest coastline of any country",
        "Home to 10% of the world's forests",
        "Has more lakes than the rest of the world combined",
        "Invented basketball, hockey skates, and baseball gloves"
    ],
    "China": [
        "Built the Great Wall spanning over 13,000 miles",
        "Invented paper, gunpowder, printing, and compass",
        "Has 56 recognized ethnic groups",
        "Home to the world's largest population"
    ],
    "Egypt": [
        "Home to the only remaining ancient wonder of the world",
        "The Nile River flows from South to North",
        "Invented the 365-day calendar",
        "Has over 100 pyramids"
    ],
    "France": [
        "Most visited country in the world",
        "Has won the most Nobel prizes for literature",
        "Invented cinema, hot air balloon, and pasteurization",
        "Has the largest art museum (The Louvre)"
    ],
    "Germany": [
        "Invented the printing press and automobile",
        "Has over 20,000 castles",
        "Home to the world's oldest brewery",
        "First country to adopt daylight saving time"
    ],
    "India": [
        "Home to the world's largest postal network",
        "Invented the number system and zero",
        "Has the world's largest film industry",
        "Home to over 1,600 languages",
        "Has the world's largest democracy"
    ],
    "Japan": [
        "Has the world's oldest company (1,428 years old)",
        "Made up of 6,852 islands",
        "Invented instant noodles, karaoke, and emoji",
        "Has the world's oldest population"
    ],
    "Yemen": [
        "Home to the oldest skyscraper city (Shibam)",
        "Known as Arabia Felix by ancient Romans",
        "Oldest inhabited city in the world (Sana'a)",
        "First country to cultivate coffee commercially"
    ],
    "Zambia": [
        "Named after the Zambezi River",
        "Home to Victoria Falls, one of the Seven Natural Wonders",
        "Has 73 ethnic groups and languages",
        "First African country to default on its debt (1983)"
    ],
    "Zimbabwe": [
        "Home to the largest waterfall in the world (Victoria Falls)",
        "Great Zimbabwe ruins are a UNESCO World Heritage site",
        "Has the largest ancient stone structure in Africa",
        "Known for its ancient rock art dating back 13,000 years"
    ]
};

// Regional trivia
const regionalTrivia = {
    "Africa": [
        "Home to the world's longest river (Nile)",
        "Has the world's largest hot desert (Sahara)",
        "Contains over 3,000 different ethnic groups",
        "Has more countries than any other continent"
    ],
    "Asia": [
        "Largest continent by area and population",
        "Home to Mount Everest, the highest peak",
        "Birthplace of major world religions",
        "Contains over 60% of world's population"
    ],
    "Europe": [
        "Most visited continent for tourism",
        "Has the world's smallest country (Vatican City)",
        "Birthplace of democracy and modern science",
        "Home to the world's northernmost capital (Reykjavik)"
    ],
    "North America": [
        "Has every climate type on Earth",
        "Home to the longest cave system (Mammoth Cave)",
        "Contains the world's longest border between two countries",
        "Has the world's oldest living trees"
    ],
    "South America": [
        "Home to the world's highest waterfall (Angel Falls)",
        "Contains the world's largest rainforest (Amazon)",
        "Has the world's highest capital city (La Paz)",
        "Home to the world's southernmost city (Ushuaia)"
    ],
    "Oceania": [
        "Contains the world's largest coral reef system",
        "Home to unique animals found nowhere else",
        "Has the world's largest monolith (Uluru)",
        "Contains thousands of islands across the Pacific"
    ]
};

export function getRegionalTrivia(region) {
    return regionalTrivia[region] || [];
}

export default countryTrivia;