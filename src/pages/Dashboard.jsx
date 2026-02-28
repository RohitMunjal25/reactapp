import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard({ setPage }) {

  const currentUser = localStorage.getItem("currentUser");
  const isGuest = !currentUser;

  const [stats, setStats] = useState({
    total: 0,
    authentic: 0,
    suspicious: 0,
    tampered: 0,
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === currentUser);

    if (!user) return;

    const history = user.history || [];

    const total = history.length;
    const authentic = history.filter(h => h.verdict.includes("Original")).length;
    const tampered = history.filter(h => h.verdict.includes("Edited")).length;
    const suspicious = total - authentic - tampered;

    setStats({ total, authentic, suspicious, tampered });

    setRecent(history.slice(-5).reverse());

  }, []);

  const statCards = [
    { label: "Total Analyzed", value: stats.total, color: "#38bdf8", icon: "📊" },
    { label: "Authentic", value: stats.authentic, color: "#4ade80", icon: "✅" },
    { label: "Suspicious", value: stats.suspicious, color: "#fbbf24", icon: "⚠️" },
    { label: "Tampered", value: stats.tampered, color: "#f87171", icon: "❌" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your evidence analysis activity</p>
      </div>

      
      <div className="stat-grid">
        {statCards.map((s, i) => (
          <div className="stat-card card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      
      <div className="quick-actions card">
        <div className="section-title">Quick Actions</div>
        <div className="action-row">
          <button className="btn btn-blue" onClick={() => setPage("upload")}>
            📤 Upload Evidence
          </button>
          <button className="btn btn-outline" onClick={() => setPage("history")}>
            📁 View History
          </button>

        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">Recent Analyses</div>

        {isGuest && (
          <p style={{ padding: 20, color: "#64748b" }}>
            Please login to see your analysis history.
          </p>
        )}

        {!isGuest && recent.length === 0 && (
          <p style={{ padding: 20 }}>
            No analyses yet. Upload evidence to start.
          </p>
        )}

        {!isGuest && recent.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Verdict</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.verdict}</td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}