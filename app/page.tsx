import { getCodes } from '@/lib/services/code-service';
import HomeClient from './home-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const codes = await getCodes();
  const activeCodes = codes.filter(code => code.status === 'Active');

  return <HomeClient activeCodes={activeCodes} />;
}
