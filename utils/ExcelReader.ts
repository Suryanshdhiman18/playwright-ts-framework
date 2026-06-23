import * as XLSX from 'xlsx';

export class ExcelReader {

    static readTestData(filePath: string,sheetName: string) {

        const workbook = XLSX.readFile(filePath);

        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {

            throw new Error(`Sheet not found: ${sheetName}`);
        }

        return XLSX.utils.sheet_to_json(sheet);
    }
}