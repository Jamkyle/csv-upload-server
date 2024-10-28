import { Person } from "./Person";

export interface ICSVGenerator {
    generateCSV(data: Person[]): Promise<string>;
}