import React, { useEffect, useState } from "react";
import "./App.css";


/**
 * Performance & Academic UI
 * - Single file frontend (React + TSX)
 * - Uses VITE_API_BASE (import.meta.env.VITE_API_BASE) or fallback to localhost
 *
 * Endpoints expected:
 * GET  /api/performance/{studentId}            -> grades array
 * GET  /api/performance/skills/{studentId}     -> skills array
 * GET  /api/performance/summary/{studentId}    -> latest summary (object)
 * POST /api/performance/{studentId}            -> add grade (body: {subject,term,grade})
 * PUT  /api/performance/{studentId}            -> update grade (body: {id,subject,term,grade})
 * POST /api/performance/summary/{studentId}    -> generate summary (server calculates)
 */

type Grade = { id?: number; subject: string; term?: string; grade: number };
type Skill = { id?: number; name: string; level?: string };
type Summary = { averageGrade?: number; topSkills?: string[] };

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8080";

export default function App(): JSX.Element {
  const [role, setRole] = useState<"STUDENT" | "COUNSELOR" | "ADMIN">("STUDENT");
  const [userId] = useState<string>("1"); // pretend logged-in user
  const [selectedStudent, setSelectedStudent] = useState<string>(userId);

  const [grades, setGrades] = useState<Grade[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state for add/update grade
  const [form, setForm] = useState<Grade>({ subject: "", term: "", grade: 0 });

  // simple student list (replace or fetch in real app)
  const studentOptions = [
    { id: "1", name: "Student One" },
    { id: "2", name: "Student Two" },
    { id: "3", name: "Student Three" },
  ];

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  };

  async function fetchAll(studentId: string) {
    setLoading(true);
    setError(null);
    try {
      const perf = await fetch(`${API_BASE}/api/performance/${encodeURIComponent(studentId)}`, { headers: getHeaders() });
      const skillsR = await fetch(`${API_BASE}/api/performance/skills/${encodeURIComponent(studentId)}`, { headers: getHeaders() });
      const sumR = await fetch(`${API_BASE}/api/performance/summary/${encodeURIComponent(studentId)}`, { headers: getHeaders() });

      if (!perf.ok && perf.status !== 404) throw new Error(`Grades fetch failed: ${perf.status}`);
      if (!skillsR.ok && skillsR.status !== 404) throw new Error(`Skills fetch failed: ${skillsR.status}`);

      const gradesData = perf.ok ? (await perf.json()) : [];
      const skillsData = skillsR.ok ? (await skillsR.json()) : [];
      const summaryData = sumR.ok ? (await sumR.json()) : null;

      setGrades(Array.isArray(gradesData) ? gradesData : []);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setSummary(summaryData);
    } catch (e: any) {
      setError(String(e.message || e));
      setGrades([]);
      setSkills([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedStudent) fetchAll(selectedStudent);
  }, [selectedStudent]);

  async function handleAddGrade(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selectedStudent) return alert("Select a student first");
    try {
      const res = await fetch(`${API_BASE}/api/performance/${encodeURIComponent(selectedStudent)}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Add failed: ${res.status} ${txt}`);
      }
      setForm({ subject: "", term: "", grade: 0 });
      await fetchAll(selectedStudent);
      alert("Grade added");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  async function handleUpdateGrade(id?: number) {
    if (!selectedStudent) return alert("Select a student first");
    if (!id) return alert("Provide grade id in the form before updating (form.id)");
    try {
      const res = await fetch(`${API_BASE}/api/performance/${encodeURIComponent(selectedStudent)}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, ...form }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update failed: ${res.status} ${txt}`);
      }
      setForm({ subject: "", term: "", grade: 0 });
      await fetchAll(selectedStudent);
      alert("Grade updated");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  async function handleGenerateSummary() {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${API_BASE}/api/performance/summary/${encodeURIComponent(selectedStudent)}`, {
        method: "POST",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to generate summary: " + res.status);
      await fetchAll(selectedStudent);
      alert("Summary generated");
    } catch (e: any) {
      alert(String(e.message || e));
    }
  }

  // small helper to prefill update when user clicks a grade row (optional)
  function fillUpdate(g: Grade) {
    setForm({ id: g.id, subject: g.subject, term: g.term, grade: g.grade });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="perf-app">
      <header className="perf-topbar">
        <div className="top-left">
          <div className="logo">📊</div>
          <div>
            <h1>Performance & Metrics</h1>
            <div className="subtitle">Track academic grades & skill assessments</div>
          </div>
        </div>

        <div className="role-box">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="STUDENT">STUDENT</option>
            <option value="COUNSELOR">COUNSELOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </header>

      <main className="perf-main">
        <aside className="left-col">
          <div className="card selector-card" style={{ minHeight: '440px' }} >
            <h3>Student Selector</h3>
            <div className="illustration">

              <img src="student-illustration.png" alt="student" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.opacity="0.0"; }} />
            </div>

            <div className="student-list">
              {studentOptions.map((s) => (
                <button
                  key={s.id}
                  className={`student-item ${selectedStudent === s.id ? "active" : ""}`}
                  onClick={() => setSelectedStudent(s.id)}
                >
                  <div className="avatar">{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                  <div className="s-label">{s.name}</div>
                </button>
              ))}
            </div>

            <div className="actions">
              {(role === "COUNSELOR" || role === "ADMIN") ? (
                <button className="btn primary" onClick={handleGenerateSummary}>Generate Summary</button>
              ) : (
                <button className="btn primary" onClick={() => fetchAll(selectedStudent)}>Refresh</button>
              )}
            </div>
          </div>


        </aside>

        <section className="center-col">
          <div className="card grades-card">
            <h2>Grades</h2>
            {error && <div className="error">{error}</div>}

            {loading ? (
              <div>Loading grades…</div>
            ) : grades.length === 0 ? (
              <div className="empty">No grades found</div>
            ) : (
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Term</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g.id ?? `${g.subject}-${g.term}`} onClick={() => fillUpdate(g)} style={{cursor: 'pointer'}}>
                      <td>{g.subject}</td>
                      <td>{g.term ?? "—"}</td>
                      <td>{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card summary-large">
                      <h3>Summary</h3>
                      {summary ? (
                        <div>
                          <p><strong>Average grade:</strong> {summary.averageGrade ?? "—"}</p>
                          <p><strong>Top skills:</strong> {(summary.topSkills && summary.topSkills.join(", ")) || "—"}</p>
                        </div>
                      ) : (
                        <div>No summary ready</div>
                      )}
                    </div>
        </section>

        <aside className="right-col">
          <div className="card skills-card">
            <h3>Skills</h3>
            {skills.length === 0 ? <div>No skills</div> : <ul>{skills.map(s => <li key={s.id ?? s.name}>{s.name}{s.level ? ` — ${s.level}` : ""}</li>)}</ul>}
          </div>

          {(role === "COUNSELOR" || role === "ADMIN") && (
            <div className="card form-card">
              <h3>Add / Update Grade</h3>
              <form onSubmit={handleAddGrade}>
                <label>Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" required />

                <label>Term</label>
                <input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="Term (eg. Mar)" />

                <label>Grade</label>
                <input type="number" value={String(form.grade)} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })} required />

                <div className="form-actions">
                  <button type="submit" className="btn primary">Add Grade</button>
                  <button type="button" className="btn secondary" onClick={() => handleUpdateGrade(form.id)}>Update (by id)</button>
                </div>
              </form>
            </div>
          )}
        </aside>
      </main>

      <footer className="perf-footer">

      </footer>
    </div>
  );
}
