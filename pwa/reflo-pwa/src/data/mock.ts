import mangoLassiImg from '../mangolassi.png';
import masalaDosaImg from '../masaladosa.png';
import haraBharaKababImg from '../harabharakabab.png';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  tags: { label: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  images?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: Review[];
  prepTime: number; // in minutes
  ingredients: string[];
  sentimentSummary: {
    taste: 'positive' | 'mixed' | 'negative';
    portion: 'positive' | 'mixed' | 'negative';
    spice: 'positive' | 'mixed' | 'negative';
  };
}

export interface Order {
  id: string;
  items: { item: MenuItem; quantity: number }[];
  status: 'confirmed' | 'preparing' | 'ready' | 'completed';
  total: number;
  estimatedTime: number; // timestamp
  createdAt: number; // timestamp
}

export const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Drinks'];

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes simmered in a rich, spicy tomato-cream gravy with bell peppers.',
    price: 350,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTime: 25,
    ingredients: ['Paneer', 'Tomato', 'Cream', 'Bell Peppers', 'Spices'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'mixed' },
    reviews: [
      {
        id: 'r1',
        userName: 'Rahul K.',
        rating: 5,
        text: 'The paneer was so soft and the gravy was perfect!',
        date: '2023-10-15',
        tags: [{ label: 'Taste', sentiment: 'positive' }, { label: 'Texture', sentiment: 'positive' }]
      },
      {
        id: 'r2',
        userName: 'Sarah J.',
        rating: 4,
        text: 'Delicious, but a bit too spicy for my taste.',
        date: '2023-10-12',
        tags: [{ label: 'Taste', sentiment: 'positive' }, { label: 'Spice', sentiment: 'negative' }]
      }
    ]
  },
  {
    id: '2',
    name: 'Vegetable Biryani',
    description: 'Aromatic basmati rice cooked with mixed vegetables, saffron, and exotic spices. Served with raita.',
    price: 300,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prepTime: 30,
    ingredients: ['Basmati Rice', 'Carrots', 'Peas', 'Potatoes', 'Saffron'],
    sentimentSummary: { taste: 'positive', portion: 'mixed', spice: 'positive' },
    reviews: [
      {
        id: 'r3',
        userName: 'Amit P.',
        rating: 5,
        text: 'Authentic flavors. The best veg biryani I have had.',
        date: '2023-10-18',
        tags: [{ label: 'Flavor', sentiment: 'positive' }, { label: 'Taste', sentiment: 'positive' }]
      }
    ]
  },
  {
    id: '3',
    name: 'Hara Bhara Kabab',
    description: 'Healthy and delicious spinach and green pea patties, shallow fried to perfection.',
    price: 220,
    category: 'Starters',
    image: haraBharaKababImg,
    rating: 4.7,
    prepTime: 20,
    ingredients: ['Spinach', 'Green Peas', 'Potatoes', 'Spices'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'positive' },
    reviews: [
      {
        id: 'r4',
        userName: 'Aisha K.',
        rating: 5,
        text: 'The best starter ever! So soft from inside and crunchy outside.',
        date: '2023-11-20',
        tags: [{ label: 'Taste', sentiment: 'positive' }]
      }
    ]
  },
  {
    id: '4',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt based drink with sweet mango',
    price: 120,
    category: 'Drinks',
    image: mangoLassiImg,
    rating: 4.9,
    prepTime: 5,
    ingredients: ['Yogurt', 'Mango Pulp', 'Sugar', 'Cardamom'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'positive' },
    reviews: [
      {
        id: 'r5',
        userName: 'Vikram S.',
        rating: 5,
        text: 'Perfectly sweet and refreshing drink after a spicy meal.',
        date: '2023-12-05',
        tags: [{ label: 'Flavor', sentiment: 'positive' }]
      }
    ]
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Soft milk solids dumplings soaked in rose-flavored sugar syrup.',
    price: 100,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    prepTime: 0,
    ingredients: ['Milk Solids', 'Sugar', 'Rose Water', 'Cardamom'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'positive' },
    reviews: []
  },
  {
    id: '6',
    name: 'Masala Dosa',
    description: 'Crispy fermented rice crepe stuffed with spiced potato filling. Served with coconut chutney and sambar.',
    price: 180,
    category: 'Main Course',
    image: masalaDosaImg,
    rating: 4.8,
    prepTime: 15,
    ingredients: ['Rice Batter', 'Potatoes', 'Onions', 'Mustard Seeds', 'Curry Leaves'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'positive' },
    reviews: [
      {
        id: 'r6',
        userName: 'Priya R.',
        rating: 5,
        text: 'Crispy, hot, and delicious. The sambar is highly recommended!',
        date: '2024-01-10',
        tags: [{ label: 'Taste', sentiment: 'positive' }]
      }
    ]
  },
  {
    id: '7',
    name: 'Aloo Tikki Chaat',
    description: 'Crispy potato patties topped with yogurt, chutneys, and spices.',
    price: 150,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    prepTime: 10,
    ingredients: ['Potatoes', 'Yogurt', 'Tamarind Chutney', 'Mint Chutney', 'Sev'],
    sentimentSummary: { taste: 'positive', portion: 'mixed', spice: 'positive' },
    reviews: []
  },
  {
    id: '8',
    name: 'Samosa',
    description: 'Crispy fried pastry filled with spiced potatoes and peas. Served with tamarind chutney.',
    price: 50,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: 15,
    ingredients: ['All Purpose Flour', 'Potatoes', 'Peas', 'Spices'],
    sentimentSummary: { taste: 'positive', portion: 'positive', spice: 'mixed' },
    reviews: []
  }
];
