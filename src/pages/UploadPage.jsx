import React, { useState, useRef } from "react";
import "./UploadPage.css";

export default function UploadPage({ goScan }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://sampleforpc.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      
      const currentUser = localStorage.getItem("currentUser");

      if (currentUser) {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const index = users.findIndex(u => u.email === currentUser);

        if (index !== -1) {
          users[index].history.push({
            name: file.name,
            date: new Date().toLocaleDateString(),
            verdict: data?.report?.final_verdict || "Unknown"
          });

          localStorage.setItem("users", JSON.stringify(users));
        }
      }

      goScan(file, data);

    } catch (err) {
      alert("Backend connection failed!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">

      <div className="upload-box" onClick={() => fileRef.current.click()}>
        <input
          type="file"
          ref={fileRef}
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />

        {!file && <p>📁 Click to upload image/video</p>}
        {file && <p>✅ {file.name}</p>}
      </div>

      <button
        className="btn btn-blue"
        onClick={handleAnalyze}
        disabled={!file || loading}
      >
        {loading ? "⏳ Uploading..." : "🔍 Analyze Now"}
      </button>

    </div>
  );
}