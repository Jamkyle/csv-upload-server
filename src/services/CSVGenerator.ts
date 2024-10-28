
import { ICSVGenerator } from '@/types/ICSVGenerator';
import { Person } from '@/types/Person';
import { stringify } from 'csv-stringify';

export class CSVGenerator implements ICSVGenerator {
    async generateCSV(data: Person[]): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!data || data.length === 0) {
                return resolve('');
            }
            stringify(data, { header: true }, (err, output) => {
                if (err) {
                    console.error('errerr', err)
                    return reject(err);
                }
                resolve(output);
            });
        });
    }
    formatRow(data: Person): string {
        // console.log('data', data)
        // const name = this.escapeCSV(data.name ?? 'Unknown');
        // const age = (data.age ?? 0).toString();
        // const gender = this.escapeCSV(data.gender ?? 'Unknown');
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