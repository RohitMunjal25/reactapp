import React from "react";
import "./ResultPage.css";
import jsPDF from "jspdf";

export default function ResultPage({ setPage, file, resultData }) {

  const report = resultData?.report || {};
  const fileName = file?.name || "evidence.jpg";

  const verdictLabel = report.final_verdict || "Unknown";

  const verdictColor =
    verdictLabel.includes("Original") ? "#4ade80" :
    verdictLabel.includes("Edited") || report.editing_detected ? "#f87171" :
    "#fbbf24";

  const verdictIcon =
    verdictLabel.includes("Original") ? "✅" :
    verdictLabel.includes("Edited") || report.editing_detected ? "❌" :
    "⚠️";


  const downloadPDF = () => {
    const pdf = new jsPDF();

    pdf.setFont("helvetica","bold");
    pdf.setFontSize(22);
    pdf.text("AI Evidence Forensic Report", 20, 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica","normal");

    pdf.text(`File Name: ${fileName}`, 20, 40);
    pdf.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 20, 50);
    pdf.text(`Final Verdict: ${report.final_verdict}`, 20, 60);

    pdf.line(20, 65, 190, 65);

    let y = 80;

    const addLine = (label, value) => {
      pdf.setFont("helvetica","bold");
      pdf.text(label, 20, y);
      pdf.setFont("helvetica","normal");
      pdf.text(String(value), 90, y);
      y += 10;
    };

    addLine("Camera Present:", report.camera_present ? "YES" : "NO");
    addLine("Editing Detected:", report.editing_detected ? "YES" : "NO");
    addLine("GPS Metadata:", report.gps_present ? "YES" : "NO");

    y += 10;
    pdf.setFont("helvetica","bold");
    pdf.text("Full Metadata:", 20, y);
    y += 10;

    Object.entries(report).forEach(([key, value]) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFont("helvetica","normal");
      pdf.text(`${key} : ${String(value)}`, 20, y);
      y += 8;
    });

    pdf.save("AI_Evidence_Report.pdf");
  };

  return (
    <div>

      <div className="result-topbar">
        <div className="result-file">
          <span style={{ fontSize: 28 }}>🖼️</span>
          <div>
            <div className="result-filename">{fileName}</div>
            <div className="result-filemeta">
              Analyzed · {new Date().toLocaleDateString("en-IN")}
            </div>
          </div>
        </div>

        <span className="badge"
          style={{ background: verdictColor, color:"#000", padding:"6px 16px" }}>
          {verdictIcon} {verdictLabel}
        </span>
      </div>

      <div className="result-actions">
        <button className="btn btn-blue" onClick={() => setPage("upload")}>
          Analyze Another
        </button>

        <button className="btn btn-outline" onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

        <button className="btn btn-green" onClick={downloadPDF}>
          Download PDF Report
        </button>
      </div>

    </div>
  );
}