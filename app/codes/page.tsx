import { getCodes } from '@/lib/services/code-service';
import CodesClient from './codes-client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function CodesPage() {
    const allCodes = await getCodes();

    const activeCodes = allCodes.filter(code => code.status === 'Active');
    const expiredCodes = allCodes.filter(code => code.status === 'Expired');

    return <CodesClient activeCodes={activeCodes} expiredCodes={expiredCodes} />;
}
