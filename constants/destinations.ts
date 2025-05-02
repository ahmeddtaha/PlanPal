interface Destination {
  id: string;
  country: string;
  capital: string;
  flag: string;
  image: string;
  description: string;
  funFact: string;
  majorAttraction: string;
}

export const destinations: Destination[] = [
  {
    id: '1',
    country: 'Japan',
    capital: 'Tokyo',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1971&auto=format&fit=crop',
    description: 'Tokyo seamlessly blends ultramodern technology with traditional culture. From ancient temples to neon-lit districts, the city offers an unforgettable fusion of old and new Japan. Experience world-class cuisine, efficient public transport, and unique cultural experiences.',
    funFact: 'Tokyo has the world\'s busiest pedestrian crossing - the Shibuya Crossing, where over 2.4 million people cross each day!',
    majorAttraction: 'Mount Fuji'
  },
  {
    id: '2',
    country: 'France',
    capital: 'Paris',
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    description: 'Paris, the City of Light, captivates visitors with its iconic architecture, world-renowned art museums, and exquisite cuisine. Walk along the Seine River, explore charming neighborhoods, and immerse yourself in the city\'s rich cultural heritage.',
    funFact: 'There are 6,100 streets in Paris, and one of them - Rue des Degrés - is just 3.3 meters long and consists entirely of steps!',
    majorAttraction: 'Eiffel Tower'
  },
  {
    id: '3',
    country: 'Italy',
    capital: 'Rome',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop',
    description: 'Rome, the Eternal City, is a living museum where ancient history meets modern life. Discover iconic landmarks like the Colosseum and Vatican City, indulge in authentic Italian cuisine, and embrace the vibrant atmosphere of Roman piazzas.',
    funFact: 'The Pantheon in Rome has the world\'s largest unreinforced concrete dome, and it\'s been standing for nearly 2,000 years!',
    majorAttraction: 'Colosseum'
  },
  {
    id: '4',
    country: 'Spain',
    capital: 'Madrid',
    flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop',
    description: 'Madrid, Spain\'s central capital, is known for its elegant boulevards, manicured parks, and rich repositories of European art. The city\'s energy is infectious, from its world-class museums to its passionate football culture.',
    funFact: 'Madrid\'s Sobrino de Botín is the world\'s oldest operating restaurant, continuously open since 1725!',
    majorAttraction: 'Sagrada Familia'
  },
  {
    id: '5',
    country: 'Thailand',
    capital: 'Bangkok',
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2070&auto=format&fit=crop',
    description: 'Bangkok captivates visitors with its ornate temples, bustling markets, and modern shopping districts. Experience the city\'s famous street food, traditional culture, and vibrant nightlife.',
    funFact: 'Bangkok\'s full ceremonial name is the longest city name in the world, with 169 characters!',
    majorAttraction: 'Grand Palace'
  },
  {
    id: '6',
    country: 'Greece',
    capital: 'Athens',
    flag: '🇬🇷',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2070&auto=format&fit=crop',
    description: 'Athens, the birthplace of democracy, is a city where ancient ruins stand alongside modern architecture. Visit the Acropolis, explore charming neighborhoods, and enjoy Mediterranean cuisine.',
    funFact: 'The Parthenon has been a temple, a church, a mosque, and even a gunpowder store throughout its history!',
    majorAttraction: 'Acropolis of Athens'
  },
  {
    id: '7',
    country: 'India',
    capital: 'New Delhi',
    flag: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop',
    description: 'New Delhi, India\'s capital, is a fascinating blend of ancient and modern. Explore historic monuments, vibrant markets, and experience the rich cultural heritage of India.',
    funFact: 'The Red Fort in Delhi was originally white! It was painted red by the British in the 19th century.',
    majorAttraction: 'Taj Mahal'
  },
  {
    id: '8',
    country: 'Mexico',
    capital: 'Mexico City',
    flag: '🇲🇽',
    image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?q=80&w=2070&auto=format&fit=crop',
    description: 'Mexico City, one of the largest cities in the world, offers a rich cultural experience with its historic center, world-class museums, and vibrant street life.',
    funFact: 'Mexico City is built on top of the ancient Aztec city of Tenochtitlan, and some of the original structures are still visible!',
    majorAttraction: 'Chichen Itza'
  },
  {
    id: '9',
    country: 'Peru',
    capital: 'Lima',
    flag: '🇵🇪',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2070&auto=format&fit=crop',
    description: 'Lima, Peru\'s capital, is known for its colonial architecture, world-class cuisine, and rich cultural heritage. The city offers a perfect blend of history and modern life.',
    funFact: 'Lima is the second-driest capital city in the world after Cairo!',
    majorAttraction: 'Machu Picchu'
  },
  {
    id: '10',
    country: 'Russia',
    capital: 'Moscow',
    flag: '🇷🇺',
    image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2070&auto=format&fit=crop',
    description: 'Moscow, Russia\'s capital, is a city of contrasts with its historic landmarks, modern architecture, and vibrant cultural scene. Visit the Kremlin, Red Square, and world-class museums.',
    funFact: 'Moscow\'s metro system is considered one of the most beautiful in the world, with many stations featuring chandeliers and marble walls!',
    majorAttraction: 'Red Square'
  },
  {
    id: '11',
    country: 'South Africa',
    capital: 'Pretoria',
    flag: '🇿🇦',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2070&auto=format&fit=crop',
    description: 'Pretoria, one of South Africa\'s three capitals, is known for its jacaranda-lined streets, historic buildings, and beautiful gardens. The city offers a mix of history and natural beauty.',
    funFact: 'Pretoria is known as the "Jacaranda City" because of the thousands of jacaranda trees that line its streets!',
    majorAttraction: 'Table Mountain'
  },
  {
    id: '12',
    country: 'Turkey',
    capital: 'Ankara',
    flag: '🇹🇷',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop',
    description: 'Ankara, Turkey\'s capital, is a modern city with a rich history. Visit ancient ruins, explore museums, and experience Turkish culture and cuisine.',
    funFact: 'Ankara was the capital of the ancient Galatian state of Tectosages!',
    majorAttraction: 'Hagia Sophia'
  },
  {
    id: '13',
    country: 'New Zealand',
    capital: 'Wellington',
    flag: '🇳🇿',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071&auto=format&fit=crop',
    description: 'New Zealand is a land of stunning natural beauty, from snow-capped mountains to pristine beaches. Experience Maori culture, adventure sports, and breathtaking landscapes.',
    funFact: 'New Zealand has more sheep than people - about 6 sheep for every person!',
    majorAttraction: 'Milford Sound'
  },
  {
    id: '14',
    country: 'Vietnam',
    capital: 'Hanoi',
    flag: '🇻🇳',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop',
    description: 'Vietnam offers a rich cultural heritage, stunning landscapes, and delicious cuisine. From bustling cities to peaceful rice fields, experience the perfect blend of tradition and modernity.',
    funFact: 'Vietnam is the world\'s second-largest coffee exporter after Brazil!',
    majorAttraction: 'Ha Long Bay'
  },
  {
    id: '15',
    country: 'Argentina',
    capital: 'Buenos Aires',
    flag: '🇦🇷',
    image: 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?q=80&w=2070&auto=format&fit=crop',
    description: 'Argentina is a land of passion, from tango dancing to football. Experience vibrant cities, stunning natural wonders, and world-class wine regions.',
    funFact: 'Argentina has the widest street in the world - Avenida 9 de Julio in Buenos Aires is 140 meters wide!',
    majorAttraction: 'Iguazu Falls'
  },
  {
    id: '16',
    country: 'Iceland',
    capital: 'Reykjavik',
    flag: '🇮🇸',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
    description: 'Iceland is a land of fire and ice, where volcanoes meet glaciers. Experience stunning waterfalls, geothermal hot springs, and the magical Northern Lights in this unique Nordic island nation.',
    funFact: 'Iceland has no mosquitoes - they can\'t survive in the country\'s climate!',
    majorAttraction: 'Blue Lagoon'
  },
  {
    id: '17',
    country: 'Egypt',
    capital: 'Cairo',
    flag: '🇪🇬',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2070&auto=format&fit=crop',
    description: 'Egypt is home to ancient wonders, the Nile River, and vibrant culture. Explore the pyramids, cruise the Nile, and discover the rich history of this fascinating country.',
    funFact: 'The Great Pyramid of Giza is the only surviving wonder of the ancient world!',
    majorAttraction: 'Great Pyramids of Giza'
  },
  {
    id: '18',
    country: 'Brazil',
    capital: 'Brasília',
    flag: '🇧🇷',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop',
    description: 'Brazil offers stunning beaches, vibrant cities, and the Amazon rainforest. Experience the famous Carnival, samba music, and the warm Brazilian culture.',
    funFact: 'Brazil has the largest number of Catholics in the world, with over 123 million followers!',
    majorAttraction: 'Christ the Redeemer'
  },
  {
    id: '19',
    country: 'Switzerland',
    capital: 'Bern',
    flag: '🇨🇭',
    image: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?q=80&w=2070&auto=format&fit=crop',
    description: 'Switzerland is known for its stunning Alps, pristine lakes, and charming cities. Experience world-class skiing, chocolate, and watchmaking in this beautiful country.',
    funFact: 'Switzerland has the highest concentration of mountains in Europe, with 48 peaks over 4,000 meters!',
    majorAttraction: 'Matterhorn'
  },
  {
    id: '20',
    country: 'Australia',
    capital: 'Canberra',
    flag: '🇦🇺',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop',
    description: 'Australia offers diverse landscapes, unique wildlife, and vibrant cities. From the Great Barrier Reef to the Outback, experience the natural wonders of this vast country.',
    funFact: 'Australia is home to the world\'s longest fence - the Dingo Fence, which is 5,614 km long!',
    majorAttraction: 'Sydney Opera House'
  },
  {
    id: '21',
    country: 'Canada',
    capital: 'Ottawa',
    flag: '🇨🇦',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2070&auto=format&fit=crop',
    description: 'Canada offers stunning natural beauty, multicultural cities, and friendly people. Experience the Rocky Mountains, Niagara Falls, and the vibrant culture of this vast country.',
    funFact: 'Canada has the longest coastline in the world, stretching over 202,080 kilometers!',
    majorAttraction: 'Niagara Falls'
  }
];