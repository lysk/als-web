import { getUnits } from '@/lib/services/unit-service';
import { getTechniques } from '@/lib/services/technique-service';
import CalculatorClient from './calculator-client';



export default async function CalculatorPage() {
    const [units, techniques] = await Promise.all([
        getUnits(),
        getTechniques(),
    ]);

    return <CalculatorClient initialUnits={units} initialTechniques={techniques} />;
}
