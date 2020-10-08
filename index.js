let fs = require('fs'),
  PDFParser = require("pdf2json");

let pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
  fs.writeFile("./pdf2json/test/F1040EZ.json", JSON.stringify(pdfData), () => {
    console.log(JSON.stringify(pdfData))
  });
});

pdfParser.loadPDF("Yves Hilpisch - Python for Finance  Analyze Big Financial Data-O'Reilly Media (2015).pdf");