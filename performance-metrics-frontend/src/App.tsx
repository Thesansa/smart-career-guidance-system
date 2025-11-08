import React, { useEffect, useState } from "react";
import "./App.css";

/**
 * Simple Performance & Metrics frontend (single-file)
 * - Student: view own grades, skills, summary
 * - Counselor: select student and add/update grade
 * - Admin: view any student
 *
 * Uses fetch against import.meta.env.VITE_API_BASE (set this in .env)
 */

type Grade = { id?: number; subject: string; term?: string; grade: number };
type Skill = { id?: number; name: string; level?: string };
type Summary = { averageGrade?: number; topSkills?: string[] };

const API_BASE = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8080";

export default function App(): JSX.Element {
  const [role, setRole] = useState<"STUDENT" | "COUNSELOR" | "ADMIN">("STUDENT");
  const [userId, setUserId] = useState<string>("1"); // supply logged-in user id
  const [selectedStudent, setSelectedStudent] = useState<string>(userId);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for counselor add/update
  const [form, setForm] = useState<Grade>({ subject: "", term: "", grade: 0 });

  // helper: build auth headers (if you have JWT saved in localStorage)
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  };

  // fetch functions
  async function fetchAll(studentId: string) {
    setLoading(true);
    setError(null);
    try {
      const perfR = await fetch(`${API_BASE}/api/performance/${encodeURIComponent(studentId)}`, { headers: getHeaders() });
      const skillsR = await fetch(`${API_BASE}/api/performance/skills/${encodeURIComponent(studentId)}`, { headers: getHeaders() });
      const summaryR = await fetch(`${API_BASE}/api/performance/summary/${encodeURIComponent(studentId)}`, { headers: getHeaders() });

      if (!perfR.ok && perfR.status !== 404) throw new Error(`Grades fetch failed: ${perfR.status}`);
      if (!skillsR.ok && skillsR.status !== 404) throw new Error(`Skills fetch failed: ${skillsR.status}`);

      const gradesData = perfR.ok ? (await perfR.json()) : [];
      const skillsData = skillsR.ok ? (await skillsR.json()) : [];
      const summaryData = summaryR.ok ? (await summaryR.json()) : null;

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
    // on role/student change, load data
    if (selectedStudent) fetchAll(selectedStudent);
  }, [selectedStudent]);

  // counselor: add grade
  async function handleAddGrade(e: React.FormEvent) {
    e.preventDefault();
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
      // reload
      setForm({ subject: "", term: "", grade: 0 });
      await fetchAll(selectedStudent);
      alert("Grade added successfully");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  // counselor: update grade (requires grade id)
  async function handleUpdateGrade(id?: number) {
    if (!id) return alert("No grade id to update");
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

  // generate summary (counselor/admin)
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

  // simple mock student list (in real app fetch from API)
  const studentOptions = [
    { id: "1", name: "Student One" },
    { id: "2", name: "Student Two" },
    { id: "3", name: "Student Three" },
  ];

  return (
    <div className="perf-app">
      <header className="perf-header">
        <div>
          <h1>📊 Performance & Metrics</h1>
          <p className="subtitle">Track academic grades & skill assessments</p>
        </div>
        <div className="role-switch">
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
          <div className="card">
            <h3>Student Selector</h3>
            <p>
              {role === "STUDENT" ? "Viewing your own performance" : role === "COUNSELOR" ? "Pick a student to edit" : "Admin: view any student"}
            </p>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {studentOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>

            <div className="actions">
              {(role === "COUNSELOR" || role === "ADMIN") && (
                <button className="btn" onClick={handleGenerateSummary}>
                  Generate Summary
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h3>Summary</h3>
            {loading ? (
              <div>Loading...</div>
            ) : summary ? (
              <div>
                <p>
                  <strong>Average grade:</strong> {summary.averageGrade ?? "—"}
                </p>
                <p>
                  <strong>Top skills:</strong> {(summary.topSkills && summary.topSkills.join(", ")) || "—"}
                </p>
              </div>
            ) : (
              <p>No summary available</p>
            )}
          </div>
        </aside>

        <section className="right-col">
          <div className="card">
            <h2>Grades</h2>
            {error && <div className="error">{error}</div>}
            {loading ? (
              <div>Loading grades…</div>
            ) : grades.length === 0 ? (
              <div>No grades found</div>
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
                    <tr key={g.id ?? `${g.subject}-${g.term}`}>
                      <td>{g.subject}</td>
                      <td>{g.term ?? "—"}</td>
                      <td>{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <h2>Skills</h2>
            {skills.length === 0 ? <div>No skills</div> : <ul>{skills.map((s) => <li key={s.id ?? s.name}>{s.name} — {s.level}</li>)}</ul>}
          </div>

          {(role === "COUNSELOR" || role === "ADMIN") && (
            <div className="card">
              <h2>Add / Update Grade</h2>
              <form onSubmit={handleAddGrade}>
                <div className="form-row">
                  <label>Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="form-row">
                  <label>Term</label>
                  <input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
                </div>
                <div className="form-row">
                  <label>Grade</label>
                  <input type="number" value={String(form.grade)} onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })} required />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn">
                    Add Grade
                  </button>
                  <button type="button" className="btn secondary" onClick={() => handleUpdateGrade(form.id)}>
                    Update (by id)
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>

      <footer className="perf-footer">All API calls must include JWT in Authorization: Bearer &lt;token&gt; (server enforces roles)</footer>
    </div>
  );
}
