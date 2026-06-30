import * as XLSX from 'xlsx';

export class ExcelWriter {

    static updateResult(
        filePath: string,
        sheetName: string,
        testCaseId: string,
        actualResult: string,
        status: string,
        searchApiTime?: number,
        detailApiTime?: number,
        pageLoadTime?: number
    ) {

        const workbook =
            XLSX.readFile(filePath);

        const sheet =
            workbook.Sheets[sheetName];

        if (!sheet) {

            throw new Error(
                `Sheet not found: ${sheetName}`
            );
        }

        const data: any[] =
            XLSX.utils.sheet_to_json(sheet);

        const row =
            data.find(
                tc =>
                    String(tc.TC_ID).trim() ===
                    String(testCaseId).trim()
            );

        if (!row) {

            throw new Error(
                `Test Case not found: ${testCaseId}`
            );
        }

        // ---------- Common Columns ----------

        row.ActualResult =
            actualResult;

        row.Status =
            status;

        // ---------- Performance Columns ----------

        if (
            searchApiTime !== undefined
        ) {

            row['GetProduct360SearchResults (ms)'] = searchApiTime;
        }

        if (
            detailApiTime !== undefined
        ) {

            row['LoadProduct360ViewV5 (ms)'] = detailApiTime;
        }

        if (
            pageLoadTime !== undefined
        ) {

            row['ProductDetailPageLoad (ms)'] = pageLoadTime;
        }

        const updatedSheet =
            XLSX.utils.json_to_sheet(
                data
            );

        workbook.Sheets[sheetName] =
            updatedSheet;

        XLSX.writeFile(
            workbook,
            filePath
        );
    }
}