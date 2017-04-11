var Excel = require('./excelSchema.js');

const oneExcelToJson = (filename, workbook) => new Excel({
    bookName: filename,
    sheets: workbook.SheetNames.map(sheetName => {
        let worksheet = workbook.Sheets[sheetName];
        let keys = Object.keys(worksheet);
        return {
            sheetName: sheetName,
            ref: worksheet['!ref'],
            data: keys.filter(k => k[0] != '!').map(k => {
                return {
                    position: k,
                    text: worksheet[k].v
                }
            })
        }
    })
});

export { oneExcelToJson };