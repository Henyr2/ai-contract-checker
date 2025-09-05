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
      ? "" // same domain as frontend when deployed
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
      const res = await fetch("http://localhost:5000/upload", {
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
      <p
        style={{
          color: "#555",
          marginBottom: "30px",
          textAlign: "center",
          maxWidth: "600px"
        }}>
        Paste your contract below and let AI highlight risky clauses in plain English.
      </p>
      {/* File Upload */}
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileUpload}
        style={{ marginBottom: "20px" }}
      />
      {/* Textarea */}
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
        {loading ? "Analyzing..." : "Analyze Contract"}
      </button>
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
    </div>
  );
}

export default App;
