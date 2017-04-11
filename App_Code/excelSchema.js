import mongoose from './db';

let Schema = mongoose.Schema;

const dataSchema = new Schema({
    position: { type: String },
    text: { type: String }
});

const sheetsSchema = new Schema({
    sheetName: { type: String },
    ref: { type: String },
    data: [dataSchema]
});

const ExcelSchema = new Schema({
    bookName: { type: String },
    sheets: [sheetsSchema]
});

ExcelSchema.set('collection', 'uploadexcel');

module.exports = mongoose.model('uploadexcel', ExcelSchema);