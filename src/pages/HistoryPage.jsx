import React, { useState, useEffect } from "react";
import "./HistoryPage.css";

function getVerdict(score) {
  if (score >= 80) return { label: "Authentic", cls: "badge-green", pill: "pill-green" };
  if (score >= 50) return { label: "Suspicious", cls: "badge-yellow", pill: "pill-yellow" };
  return { label: "Tampered", cls: "badge-red", pill: "pill-red" };
}

export default function HistoryPage({ setPage }) {

  const currentUser = localStorage.getItem("currentUser");

  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleted, setDeleted] = useState(new Set());

  useEffect(() => {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === currentUser);

    if (!user) return;

    const formatted = (user.history || []).map((h, i) => ({
      id: i,
      name: h.name,
      date: h.date,
      score: h.verdict.includes("Original") ? 90 : 30,
      dur: "2s",
      type: "🖼️",
      size: "Uploaded file",
      verdictText: h.verdict
    }));

    setRecords(formatted.reverse());
  }, []);

  const filteredRecords = records
    .filter(r => !deleted.has(r.id))
    .filter(r => {
      const v = getVerdict(r.score);
      const matchFilter = filter === "all" || v.label.toLowerCase() === filter;
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

  return (
    <div>
      <div className="page-header">
        <h1>Evidence History</h1>
        <p>{records.length - deleted.size} records · {filteredRecords.length} shown</p>
      </div>

      
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16, alignItems:'center' }}>
        {[
          { id:'all', label:'All' },
          { id:'authentic', label:'✅ Authentic' },
          { id:'suspicious', label:'⚠️ Suspicious' },
          { id:'tampered', label:'❌ Tampered' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{
              padding:'6px 16px', borderRadius:50, fontSize:13, fontWeight:600,
              background: filter === f.id ? 'rgba(56,189,248,0.15)' : '#1e293b',
              border: filter === f.id ? '1px solid #38bdf8' : '1px solid #334155',
              color: filter === f.id ? '#38bdf8' : '#94a3b8',
              cursor:'pointer'
            }}>
            {f.label}
          </button>
        ))}

        
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, background:'#1e293b', border:'1px solid #334155', borderRadius:50, padding:'6px 14px' }}>
          🔍
          <input
            placeholder="Search file..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background:'none', border:'none', outline:'none', color:'#e2e8f0' }}
          />
        </div>
      </div>

      
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-wrap">
          {filteredRecords.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#64748b' }}>
              <p>No analyses yet</p>
              <button className="btn btn-blue" onClick={() => setPage("upload")}>
                Upload Evidence
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Verdict</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(row => {
                  const v = getVerdict(row.score);
                  return (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.date}</td>
                      <td><span className={`pill ${v.pill}`}>{row.score}%</span></td>
                      <td><span className={`badge ${v.cls}`}>{v.label}</span></td>
                      <td>
                        <button
                          className="btn btn-red btn-sm"
                          onClick={() => setDeleted(prev => new Set([...prev, row.id]))}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ marginTop:10, fontSize:12, color:'#475569' }}>
        Showing {filteredRecords.length} of {records.length - deleted.size} records
      </div>
    </div>
  );
}