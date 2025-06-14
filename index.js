// ---------------- PDF to TEXT ----------------
const fileInput = document.getElementById("pdfUpload");
const convertBtn = document.getElementById("convertBtn");
const outputText = document.getElementById("outputText");
const removeBtn = document.getElementById("removeText");
const copyBtn = document.getElementById("copyText");
const spinner = document.getElementById("spinner");
const titleEl = document.getElementById("dynamicTitle");

if (convertBtn) {
  convertBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    titleEl.textContent = `${file.name} - PDF Text Converter`;
    spinner.style.display = "inline-block";
    outputText.value = "";

    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      try {
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str).join(" ");
          text += `\n--- Page ${i} ---\n` + strings + "\n";
        }
        outputText.value = text;
      } catch (err) {
        console.error(err);
        alert("Error extracting text.");
      } finally {
        spinner.style.display = "none";
      }
    };
    reader.readAsArrayBuffer(file);
  });

  removeBtn?.addEventListener("click", () => {
    outputText.value = "";
  });

  copyBtn?.addEventListener("click", () => {
    outputText.select();
    document.execCommand("copy");
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy Text";
    }, 1500);
  });
}

// ---------------- TEXT to PDF ----------------
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearText");

if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const text = document.getElementById("inputText").value;
    const pdf = new jsPDF();

    if (!text.trim()) {
      alert("Please enter some text to generate PDF.");
      return;
    }

    const lines = pdf.splitTextToSize(text, 180);
    pdf.text(lines, 10, 20);

    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    // Show preview
    const previewFrame = document.getElementById("pdfPreview");
    previewFrame.src = blobUrl;
    document.getElementById("previewContainer").style.display = "block";

    // Download on click
    document.getElementById("downloadPdf").onclick = () => {
      pdf.save("text-generated.pdf");
    };
  });

  clearBtn?.addEventListener("click", () => {
    document.getElementById("inputText").value = "";
    document.getElementById("previewContainer").style.display = "none";
  });
}
