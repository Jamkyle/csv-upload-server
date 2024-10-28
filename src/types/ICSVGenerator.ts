import { Person } from "./Person";

export interface ICSVGenerator {
    formatRow(data: Person): string;
}