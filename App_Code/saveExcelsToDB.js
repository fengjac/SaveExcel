import { Promise } from 'bluebird';

const saveOneExcel = (excel) => {
    return excel.save();
};

const saveAllExcel = (excels) => {
    return Promise.all(
        excels.map((innerExcel) => {
            return saveOneExcel(innerExcel);
        })
    );
};

export { saveAllExcel, saveOneExcel };