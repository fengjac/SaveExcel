import { Promise } from 'bluebird';
import XLSX from 'xlsx';

const readOneExcelAsync = (data, opts) => new Promise((resolve, reject) => {
    try {
        let xlsxJson = XLSX.read(data, opts);
        resolve(xlsxJson);
    }
    catch(error){
        reject(error);
    }
});

const readAllExcelAsync = (datas, opts) => {
    return Promise.all(
        datas.map((innerData) => {
            return readOneExcelAsync(innerData.data, opts);
        })
    );
}

export { readAllExcelAsync, readOneExcelAsync };