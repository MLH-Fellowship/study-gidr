const { rejects } = require('assert');
const { resolve } = require('path');


function parsePDF(textbookName)
{
  const fs = require('fs'),
    PDFParser = require("pdf2json");

  (async () => {

    let pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(textbookName);

    let textbook = await new Promise(async (resolve, reject) => {

      pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {

        let fontSizes = new Array();
        for(let i = 0; i < pdfData.formImage.Pages.length; i++)
        {
          for(let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++)
          {
            fontSizes.push(pdfData.formImage.Pages[i].Texts[j].R[0].TS[1]);
          }
        }

        const textFontSize = Number(findTextFontSize(fontSizes)) + 3;

        let mainpoint = "";
        let textInfo = "";
        let textIsMain = true;
        let heading = [];
        let paragraph = [];

        for(let i = 0; i < pdfData.formImage.Pages.length; i++)
        {
          for(let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++)
          {
            if(textIsMain == false && ((pdfData.formImage.Pages[i].Texts[j].R[0].TS[2] == 1 && pdfData.formImage.Pages[i].Texts[j].R[0].TS[1] > textFontSize)))
            {
              if((mainpoint.length < 25 && mainpoint.length > 5 && !mainpoint.includes("%7C")) && textInfo.length > 25)
              {
                heading.push(cleanString(mainpoint));
                paragraph.push(cleanString(textInfo));
              }
              mainpoint = "";
              textInfo = "";
            }
            if(pdfData.formImage.Pages[i].Texts[j].R[0].TS[2] == 1 && pdfData.formImage.Pages[i].Texts[j].R[0].TS[1] > textFontSize)
            {
              mainpoint = mainpoint + pdfData.formImage.Pages[i].Texts[j].R[0].T;
              textIsMain = true;
            }
            else
            {
              textInfo = textInfo + pdfData.formImage.Pages[i].Texts[j].R[0].T;
              textIsMain = false;
            }
          }
        }

        resolve({
          "name" : textbookName,
          "heading" : heading,
          "paragraph" : paragraph
        });

      });

    });

    fs.writeFileSync("package.json", JSON.stringify(textbook));
  })();
}

function findTextFontSize(fontSizes)
{
  let counted = fontSizes.reduce((a, i) => { 
    if (i in a) {
        a[i]++;
    } 
    else {
        a[i] = 1;
    }
    return a;
    }, {});

  let fontSize = Object.keys(counted).reduce((a, b) => counted[a] > counted[b] ? a : b);

  return fontSize;
}

function cleanString(string)
{
  string = (((((((string.split("%20").join(" ")).split("%2C").join(",")).split("%2F").join("/")).split("%23").join("#").split("%3A").join(":")).split("%40").join("@")).split("%E2%80%94").join("-")).split("%E2%80%99").join("'"));
  return (((string.split("%E2%80%90").join("")).split("%5B").join("[")).split("%5D").join("]")).split("%3D").join("=");
}
