import { getCodes } from '@/lib/services/code-service';
import HomeClient from './home-client';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const date = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return {
    title: `Anime Last Stand Tools - Calculator, Codes & Tier List (${month} ${year})`,
    description: `The ultimate Anime Last Stand (ALS) companion. Features the best DPS Calculator, updated ${month} ${year} Codes, and S+ Tier List. Dominate Story and Infinite modes now.`,
    keywords: [`Anime Last Stand`, `Anime Last Stand Calculator`, `ALS Tools`, `Anime Last Stand Wiki`, `ALS Codes`, `ALS Tier List`],
    openGraph: {
      title: `Anime Last Stand Tools - Calculator, Codes & Tier List (${month} ${year})`,
      description: `The ultimate Anime Last Stand (ALS) companion. Features the best DPS Calculator, updated ${month} ${year} Codes, and S+ Tier List.`,
      type: 'website',
    }
  };
}

export default async function HomePage() {
  const codes = await getCodes();
  const activeCodes = codes.filter(code => code.status === 'Active');

  const date = new Date();
  const lastUpdated = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

  return <HomeClient activeCodes={activeCodes} lastUpdated={lastUpdated} />;
}
