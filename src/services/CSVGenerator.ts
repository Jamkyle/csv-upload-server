
import { ICSVGenerator } from '@/types/ICSVGenerator';
import { Person } from '@/types/Person';

export class CSVGenerator implements ICSVGenerator {
    formatRow(data: Person): string {
        const formattedValues = Object.entries(data).map(([key, value]) => {
            return this.escapeCSV(value ?? 'Unknown'); // Escape each value
        });

        return `${formattedValues.join(',')}\n`;
    }

    private escapeCSV(value: string): string {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = value.replace(/"/g, '""');
            return `"${value}"`;
        }
        return value;
    }
}