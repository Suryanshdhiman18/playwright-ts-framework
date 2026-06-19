import * as XLSX from 'xlsx';

export class ExcelWriter {

    static updateResult(filePath: string,sheetName: string,testCaseId: string,actualResult: string,status: string) {

        const workbook = XLSX.readFile(filePath);

        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            throw new Error(`Sheet not found: ${sheetName}`);
        };

        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        // console.log('Sheet Name:', sheetName);

        // console.log('First Row:', data[0]);

        // console.log(
        //     'Keys:',
        //     Object.keys(data[0] || {})
        // );

        // console.log(
        //     'Looking for:',
        //     testCaseId
        // );

        // console.log(
        //     'Available TC IDs:',
        //     data.map(tc => tc.TC_ID)
        // );

        const row = data.find(tc => String(tc.TC_ID).trim() === String(testCaseId).trim());

        if (!row) {
            throw new Error(`Test Case not found: ${testCaseId}`);
        }

        row.ActualResult = actualResult;

        row.Status = status;

        const updatedSheet = XLSX.utils.json_to_sheet(data);

        workbook.Sheets[sheetName] = updatedSheet;

        XLSX.writeFile(workbook,filePath);
    }
}