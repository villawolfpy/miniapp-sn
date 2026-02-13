/** Canonical list of territories to display */
export const TERRITORY_NAMES = [
  'art',
  'Contruction_and_Engineering',
  'dotnet',
  'ideasfromtheedge',
  'mempool',
  'openagents',
  'bitdevs',
  'DIY',
  'Animal_World',
  'aliens_and_UFOs',
  'bitcoin_Mining',
  'lol',
  'science',
  'lightning',
  'food_and_drinks',
  'bitcoin',
  'nostr',
  'tech',
  'Design',
  'devs',
  'Memes',
  'news',
  'BooksAndArticles',
  'HealthAndFitness',
  'Photography',
  'Stacker_Sports',
  'Politics_And_law',
  'bitcoin_beginners',
  'spirituality',
  'econ',
  'alter_nat',
  'AskSN',
  'Cartalk',
  'crypto',
  'Education',
  'events',
  'gaming',
  'movies',
  'music',
  'oracle',
  'podcasts',
  'security',
  'Video',
  'charts_and_numbers',
  'AGORA',
  'meta',
  'culture',
  'tutorials',
  'FiresidePhilosophy',
  'mostly_harmless',
  'privacy',
  'AMA',
  'builders',
  'jobs',
] as const;

export type TerritoryName = (typeof TERRITORY_NAMES)[number];

export interface Territory {
  name: string;
  desc: string | null;
  status: string;
  nsfw: boolean;
}

export interface Post {
  id: string;
  title: string;
  sats: number;
  createdAt: string;
  ncomments: number;
  user: { name: string };
}
