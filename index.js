const fs = require('fs'),
 PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);

textbookName = "Yves Hilpisch - Python for Finance  Analyze Big Financial Data-O'Reilly Media (2015).pdf";

pdfParser.loadPDF(textbookName);

let textbook = {
  "name" : textbookName
}

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
   fs.writeFile("package.json", JSON.stringify(pdfData), () => {
   });

  let fontSizes = new Array();
  for(let i = 0; i < pdfData.formImage.Pages.length; i++)
  {
    for(let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++)
    {
      fontSizes.push(pdfData.formImage.Pages[i].Texts[j].R[0].TS[1]);
    }
  }

  const textFontSize = findTextFontSize(fontSizes);


  let mainpoint = "";
  let textInfo = "";
  let textIsMain = true;

  for(let i = 0; i < pdfData.formImage.Pages.length; i++)
  {
    for(let j = 0; j < pdfData.formImage.Pages[i].Texts.length; j++)
    {
      if(textIsMain == false && ((pdfData.formImage.Pages[i].Texts[j].R[0].TS[2] == 1 && pdfData.formImage.Pages[i].Texts[j].R[0].TS[1] > textFontSize)))
      {
        textbook.heading = cleanString(mainpoint);
        textbook[mainpoint] = cleanString(textInfo);
        console.log(cleanString(mainpoint));
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
});

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
  return (((((((string.split("%20").join(" ")).split("%2C").join(",")).split("%2F").join("/")).split("%23").join("#").split("%3A").join(":")).split("%40").join("@")).split("%E2%80%94").join("-")).split("%E2%80%99").join("'"));
}
