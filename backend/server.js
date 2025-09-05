// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const app = express();

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is missing. Check your .env file.");
  process.exit(1);
}

const path = require("path");
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// File upload
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      // PDF file
      const dataBuffer = require("fs").readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // DOCX file
      const dataBuffer = require("fs").readFileSync(req.file.path);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }
    res.json({ contractText: extractedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File processing failed." });
  }
});

// AI contract analysis route
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/analyze", async (req, res) => {
  try {
    const { contractText } = req.body;

    if (!contractText || contractText.length < 50) {
      return res.status(400).json({ error: "Contract text is too short." });
    }

    const systemPrompt = `
      You are an expert contract analyst trained in legal risk spotting. 
      Your role is NOT to give legal advice but to highlight potential risks in contracts 
      and explain them in clear, plain English so a non-lawyer can understand.
      Always respond with structured JSON so the results can be parsed by software.
    `;

    const userPrompt = `
      Analyze the following contract. 
      Identify clauses that may create risks for the user in the following categories:

      - Termination
      - Liability / Indemnification
      - Intellectual Property
      - Payment Terms
      - Confidentiality / Non-Compete
      - Governing Law / Dispute Resolution
      - Other Unusual Clauses

      For each risky clause you find:
      1. Quote the exact clause text.
      2. Label which category it belongs to.
      3. Explain in plain English why this clause could be risky (max 3 sentences).
      4. Rate the severity as: Low / Medium / High.

      Return your results in JSON with this structure:

      {
        "contract_summary": "One-paragraph plain English summary of overall contract tone and risk level.",
        "risky_clauses": [
          {
            "category": "Liability",
            "clause_text": "...",
            "risk_explanation": "...",
            "severity": "High"
          }
        ]
      }

      Contract Text:
      """${contractText}"""
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0,
    });

    const output = response.choices[0].message.content;

    // Robust JSON parsing
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      const match = output.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = { raw_output: output };
        }
      } else {
        parsed = { raw_output: output };
      }
    }

    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed.", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Contract Checker API running on port ${PORT}`);
});
