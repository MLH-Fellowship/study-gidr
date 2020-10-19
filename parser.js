const { rejects } = require('assert');
const { resolve } = require('path');
const fs = require('fs');
const PDFParser = require('pdf2json');
// var SummaryTool = require('node-summary');

// function summarize(text) {
//   SummaryTool.summarize("Textbook", text, function (err, summary) {
//     if (err) console.log("Something went wrong man!");
//     return summary;
//   })
// }
function findTextFontSize(fontSizes) {
  const counted = fontSizes.reduce((a, i) => {
    if (i in a) {
      a[i]++;
    } else {
      a[i] = 1;
    }
    return a;
  }, {});

  const fontSize = Object.keys(counted).reduce((a, b) =>
    counted[a] > counted[b] ? a : b,
  );

  return fontSize;
}

function cleanString(string) {
  string = string
    .split('%20')
    .join(' ')
    .split('%2C')
    .join(',')
    .split('%2F')
    .join('/')
    .split('%23')
    .join('#')
    .split('%3A')
    .join(':')
    .split('%40')
    .join('@')
    .split('%E2%80%94')
    .join('-')
    .split('%E2%80%99')
    .join("'");
  return string
    .split('%E2%80%90')
    .join('')
    .split('%5B')
    .join('[')
    .split('%5D')
    .join(']')
    .split('%3D')
    .join('=');
}

module.exports = {
  parsePDF(textbookName) {
    (async () => {
      const pdfParser = new PDFParser(this, 1);
      pdfParser.loadPDF(textbookName);

      const textbook = await new Promise(async (resolve, reject) => {
        pdfParser.on('pdfParser_dataError', errData =>
          console.error(errData.parserError),
        );
        pdfParser.on('pdfParser_dataReady', pdfData => {
          const fontSizes = new Array();
          for (let i = 0; i < pdfData.formImage.Pages.length; i++) {
            for (let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++) {
              fontSizes.push(pdfData.formImage.Pages[i].Texts[j].R[0].TS[1]);
            }
          }

          const textFontSize = findTextFontSize(fontSizes);

          let mainpoint = '';
          let textInfo = '';
          let textIsMain = true;
          const heading = [];
          const paragraph = [];

          for (let i = 0; i < pdfData.formImage.Pages.length; i++) {
            for (let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++) {
              if (
                textIsMain == false &&
                (pdfData.formImage.Pages[i].Texts[j].R[0].TS[2] == 1 &&
                  pdfData.formImage.Pages[i].Texts[j].R[0].TS[1] > textFontSize)
              ) {
                if (
                  mainpoint.length < 25 &&
                  mainpoint.length > 5 &&
                  !mainpoint.includes('%7C') &&
                  textInfo.length > 25
                ) {
                  heading.push(cleanString(mainpoint));
                  paragraph.push(cleanString(textInfo));
                }
                mainpoint = '';
                textInfo = '';
              }
              if (
                pdfData.formImage.Pages[i].Texts[j].R[0].TS[2] == 1 &&
                pdfData.formImage.Pages[i].Texts[j].R[0].TS[1] > textFontSize
              ) {
                mainpoint += pdfData.formImage.Pages[i].Texts[j].R[0].T;
                textIsMain = true;
              } else {
                textInfo = textInfo +=
                  pdfData.formImage.Pages[i].Texts[j].R[0].T;
                textIsMain = false;
              }
            }
          }

          resolve({
            name: textbookName,
            heading,
            paragraph,
          });
        });
      });
      console.log(textbook.heading.length);
      fs.writeFileSync('parsed_textbook.json', JSON.stringify(textbook));
    })();
  },
};
