// script.js

const fileInput = document.getElementById("pdfUpload");
const convertBtn = document.getElementById("convertBtn");
const outputText = document.getElementById("outputText");

convertBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file || file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }

  const fileReader = new FileReader();

  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    try {
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).join(" ");
        text += `\n--- Page ${i} ---\n` + strings + "\n";
      }

      outputText.value = text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      alert("Failed to extract text from the PDF. Please try again.");
    }
  };

  document.getElementById("removeText").addEventListener("click", () => {
    outputText.value = "";
  });

  fileReader.readAsArrayBuffer(file);
});
