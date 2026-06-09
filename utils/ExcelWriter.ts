import * as XLSX from 'xlsx';

export class ExcelWriter {

    static updateResult(
        filePath: string,
        sheetName: string,
        testCaseId: string,
        actualResult: string,
        status: string
    ) {

        const workbook =
            XLSX.readFile(filePath);

        const sheet =
            workbook.Sheets[sheetName];

        const data: any[] =
            XLSX.utils.sheet_to_json(sheet);

        const row =
            data.find(
                tc => tc.TC_ID === testCaseId
            );

        if (!row) {

            throw new Error(
                `Test Case not found: ${testCaseId}`
            );
        }

        row.ActualResult =
            actualResult;

        row.Status =
            status;

        const updatedSheet =
            XLSX.utils.json_to_sheet(data);

        workbook.Sheets[sheetName] =
            updatedSheet;

        XLSX.writeFile(
            workbook,
            filePath
        );
    }
}