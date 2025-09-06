import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";



function App() {
  const [contractText, setContractText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const severityColors = {
    Low: "#D9EAD3",     // light green
    Medium: "#FEF4E6",  // orange
    High: "#F4CCCC",     // red
  };
  const API_BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-8fz8.onrender.com" // same domain as frontend when deployed
      : "http://localhost:5000";
  const analyzeContract = async () => {
    if (!contractText) return alert("Please paste contract text.");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error calling backend:", err);
      alert("Failed to analyze contract.");
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.contractText) {
        setContractText(data.contractText); // auto-fills textarea
      } else {
        alert("Failed to extract text.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px",
        fontFamily: "Montserrat, sans-serif",
        backgroundColor: "#f9f9fb",
      }}>
      {/* Title */}
      <h1
        style={{
          fontSize: "48px",
          textAlign: "center",
          marginBottom: "10px",
          color: "#222",
        }}>
        AI Contract Checker
      </h1>
      {/* Landing Section */}
      <h style={{ fontSize: "20px", color: "#222", marginBottom: "10px" }}>
        Spot Risky Contract Clauses in Seconds – No Lawyer Required
      </h>
      <p style={{ fontSize: "18px", color: "#555", marginBottom: "10px" }}>
        Paste your contract and let AI highlight potential risks in plain English. Fast, easy, and free to test.
      </p>
      {/* Bullets */}
      <ul
        style={{
          textAlign: "left",
          marginBottom: "30px",
          fontSize: "16px",
          lineHeight: "1.6",
          margin: "0 auto",
          display: "inline-block",
        }}
      >
        <li>✅ Instant Risk Analysis – Identify termination, liability, IP, payment, and confidentiality risks immediately.</li>
        <li>✅ Plain English Explanations – Understand legal jargon without a law degree.</li>
        <li>✅ AI-Powered & Reliable – Uses GPT-4 technology to spot hidden clauses.</li>
        <li>✅ Free to Try – No signup, no credit card required.</li>
        <li>✅ Works for Any Contract Type – Employment, freelance, vendor, NDA, and more.</li>
      </ul>
      <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>
        Spot Risky Contract Clauses Instantly
      </h2>
      <p style={{ color: "#555", marginBottom: "24px" }}>
        Let AI review your contract and explain risks in plain English.
      </p>
      {/* Primary CTA */}
      <button
        onClick={() =>
          document.getElementById("contract-input").scrollIntoView({ behavior: "smooth" })
        }
        onMouseEnter={(e) => { e.target.style.backgroundColor = "#357ABD"; }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = "#4a90e2"; }}
        style={{
          backgroundColor: "#4a90e2",
          color: "#fff",
          padding: "14px 28px",
          fontSize: "18px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "15px",
          marginBottom: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        Analyze My Contract Now
      </button>
      {/* Secondary CTA */}
      <button
        onClick={() =>
          document.getElementById("brief-explaination").scrollIntoView({ behavior: "smooth" })
        }
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#4a90e2"; // hover background
          e.target.style.color = "#fff"; // hover text color
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent"; // original background
          e.target.style.color = "#4a90e2"; // original text color
        }}
        style={{
          backgroundColor: "transparent",
          color: "#4a90e2",
          padding: "14px 20px",
          fontSize: "16px",
          border: "2px solid #4a90e2",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Not ready yet? Learn how AI can protect you in contracts.
      </button>
      {/* Third CTA: FAQ Button */}
      <button
        onClick={() =>
          document.getElementById("faq-section").scrollIntoView({ behavior: "smooth" })
        }
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#4a90e2"; // hover background
          e.target.style.color = "#fff"; // hover text color
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent"; // original background
          e.target.style.color = "#4a90e2"; // original text color
        }}
        style={{
          display: "block",
          margin: "15px auto 0 auto", // centered under secondary CTA
          backgroundColor: "#fff",
          color: "#4a90e2",
          padding: "10px 20px",
          fontSize: "14px",
          border: "2px solid #4a90e2",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Learn More in FAQ
      </button>
      {/* Contract Input Section (anchor for first CTA)*/}
      <div id="contract-input" style={{ textAlign: "center" }}>
        {/*Heading for Analyze section*/}
        <div id="analyze-section" style={{ width: "100%", maxWidth: "900px" }}></div>
        <h2 style={{ fontSize: "36px", marginBottom: "10px", color: "#222" }}>
          Contract Area
        </h2>
        {/* File Upload */}
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          style={{ marginBottom: "20px" }}
        />
        {/* Analyze Section */}
        <textarea
          rows={12}
          cols={80}
          placeholder="Paste your contract text here..."
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          style={{
            width: "80%",
            maxWidth: "800px",
            padding: "15px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "20px",
            outline: "none",
          }}>
        </textarea>
        <br />
        {/* Analyze Button */}
        <button
          onClick={analyzeContract}
          disabled={loading}
          style={{
            backgroundColor: "#4a90e2",
            color: "#fff",
            padding: "12px 24px",
            fontSize: "18px",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#357ABD")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4a90e2")}
        >
          {loading ? "Analyzing..." : "Analyze My Contract Now"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div
          style={{
            marginTop: "40px",
            width: "80%",
            maxWidth: "900px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}>

          <h2 style={{ marginBottom: "10px" }}> Contract Summary </h2>
          <pre
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: "#fafafa",
            }}>

            {result.contract_summary || JSON.stringify(result.raw_output, null, 2)}</pre>
          {result.risky_clauses && result.risky_clauses.length > 0 && (<>
            <h2 style={{ marginTop: "20px" }}>Risky Clauses</h2>
            {result.risky_clauses.map((clause, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 15,
                  border: "1px solid #eee",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: severityColors[clause.severity] || "#fafafa" // default white
                }}>
                <strong>Category:</strong> {clause.category} <br />
                <strong>Severity:</strong> {clause.severity}
                <br
                  style={{
                    color:
                      clause.severity === "High"
                        ? "red"
                        : clause.severity === "Medium"
                          ? "orange"
                          : "green",
                    fontWeight: "bold",
                  }} />
                <strong >Clause Text:</strong>
                <SyntaxHighlighter language="markdown"
                  style={{
                    ...coy, // spread the theme first
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    fontSize: "14px"
                  }}>
                  {clause.clause_text}
                </SyntaxHighlighter>
                <strong>Explanation:</strong> {clause.risk_explanation}
              </div>
            ))}
          </>
          )}
        </div>
      )}
      {/*brief explaination (anchor for second CTA) */}
      <div
        id="brief-explaination"
        style={{
          marginTop: "80px",
          padding: "20px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "800px",
          textAlign: "left",
        }}
      >
        <h2>How AI Contract Checker Protects You</h2>
        <p>
          Our AI analyzes legal language and highlights risky clauses such as unfair
          termination terms, hidden fees, IP transfers, or one-sided liability. It
          translates complex legal text into plain English so you can make informed
          decisions.
        </p>
      </div>
      {/* FAQ Section (anchor for third CTA) */}
      <div
        id="faq-section"
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "800px",
          textAlign: "left",
        }}>
        <h2>Frequently Asked Questions</h2>
        <h3>1. Is this a replacement for a lawyer?</h3>
        <p>
          No. AI Contract Checker highlights potential risks and explains clauses
          in plain English. It does **not provide legal advice**. Always consult a
          licensed attorney for binding legal decisions.
        </p>

        <h3>2. What types of contracts can I analyze?</h3>
        <p>
          You can analyze employment contracts, freelance agreements, vendor
          contracts, NDAs, and most standard legal documents written in English.
        </p>

        <h3>3. How accurate is the AI?</h3>
        <p>
          The AI is trained to spot common risk patterns and unusual clauses. It
          gives you an **early warning** about risky terms, but it may not catch
          everything. Use it as a supplement to your own review or a lawyer’s advice.
        </p>

        <h3>4. Is my contract text secure?</h3>
        <p>
          All data is sent to OpenAI’s API for processing. We do **not store** your
          contract text permanently. Avoid sharing extremely sensitive information
          unless you are comfortable with this.
        </p>

        <h3>5. Do I need an account or payment to use this?</h3>
        <p>
          No. You can try AI Contract Checker immediately without signing up or
          providing payment information. OpenAI API usage limits may apply if we
          move to a larger scale later.
        </p>

        <h3>6. Can I upload PDF?</h3>
        <p>
          Yes, the tool accepts **text copy-pasted** and file uploads.
        </p>
      </div>
    </div>
  );
}

export default App;
