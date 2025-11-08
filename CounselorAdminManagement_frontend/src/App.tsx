import React, {useState} from "react";
import "./app.css";

type Counselor = {
  id: number;
  name: string;
  title?: string;
  avatarColor?: string;
};

type Student = {
  id: number;
  name: string;
};

export default function App(): JSX.Element {
  const counselors: Counselor[] = [
    { id: 1, name: "Nethula Pawan", title: "Senior Counselor", avatarColor: "#2f9bff" },
    { id: 2, name: "Kalindu Nuwan", title: "Counselor", avatarColor: "#6fb3ff" },
    { id: 3, name: "Nethuki Sadira", title: "Counselor", avatarColor: "#2c8cff" },
  ];

  const students: Student[] = [
    { id: 101, name: "Student One" },
    { id: 102, name: "Student Two" },
    { id: 103, name: "Student Three" },
  ];

const [role, setRole] = useState<'ADMIN'|'COUNSELOR'>('ADMIN');
// local mappings state (mock for now)
const [mappings, setMappings] = useState<
  { id: number; studentId: number; counselorId: number; feedback?: string }[]
>([]);

// add a mapping (admin action)
const assignMapping = (studentId: number, counselorId: number) => {
  const newMap = { id: Date.now(), studentId, counselorId, feedback: "" };
  setMappings(prev => [newMap, ...prev]);
};

// update feedback (counselor action)
const updateMappingFeedback = (mappingId: number, feedback: string) => {
  setMappings(prev => prev.map(m => m.id === mappingId ? { ...m, feedback } : m));
};



  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="top-left">
          <div className="logo-pill">CA</div>
          <div className="title-block">
            <h1>COUNSELOR &amp; ADMIN MANAGEMENT</h1>
            <p className="subtitle">Manage counselors, assign students, collect feedback</p>
          </div>
        </div>

        <div className="top-controls">
          <div className="role-pill" onClick={() => setRole(role === 'ADMIN' ? 'COUNSELOR' : 'ADMIN')}>
            <span className="role-label">Role</span>
            <select
                className="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'COUNSELOR')}
               >
               <option value="ADMIN">ADMIN</option>
                    <option value="COUNSELOR">COUNSELOR</option>
                  </select>
          </div>
          <div className="icon-pill">☰</div>
        </div>
      </header>

      <main className="content">
        {role === "ADMIN" ? (
          /* ---------- ADMIN VIEW ---------- */
          <>
            <aside className="left-panel card">
              <h3 className="panel-title">Counselors</h3>
              <ul className="counselor-list">
                {counselors.map((c) => (
                  <li key={c.id} className="c-item">
                    <div className="c-avatar" style={{ background: c.avatarColor }}>
                      <span>{c.name.split(" ").map(n => n[0]).slice(0,2).join("")}</span>
                    </div>
                    <div className="c-meta">
                      <div className="c-name">{c.name}</div>
                      <div className="c-role">{c.title}</div>
                    </div>
                    <button className="btn-edit">Edit</button>
                  </li>
                ))}
              </ul>
              <button className="btn-create">Create</button>

              <img
                  src="/src/assets/counselor-illustration.png"
                  alt="Counselor illustration"
                  className="counselor-image"
                />
            </aside>

            <section className="center-panel">
              <div className="panel card large-card">
                <div className="panel-header">
                  <div className="panel-title-block">
                    <h2>Student – Counselor Mappings</h2>
                    <div className="small-meta">Role: <strong>{role}</strong></div>
                  </div>
                </div>

                <div className="mapping-row">
                  <div className="mapping-card">
                    <h4>Assign Student to Counselor</h4>

                    <select id="admin-counselor-select" className="select" defaultValue="">
                      <option value="" disabled>Select Counselor</option>
                      {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select id="admin-student-select" className="select" defaultValue="">
                      <option value="" disabled>Select Student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <button
                      className="btn-assign"
                      onClick={() => {
                        const selCounselor = (document.getElementById("admin-counselor-select") as HTMLSelectElement).value;
                        const selStudent = (document.getElementById("admin-student-select") as HTMLSelectElement).value;
                        if (selCounselor && selStudent) assignMapping(Number(selStudent), Number(selCounselor));
                      }}
                    >
                      Assign
                    </button>
                  </div>

                  <div className="mapping-card right">
                    <h4>All Mappings</h4>
                    <div style={{ maxHeight: 340, overflow: "auto" }}>
                      {mappings.length === 0 ? (
                        <div className="table-empty">No mappings yet — assign a student to a counselor using the form.</div>
                      ) : (
                        mappings.map(m => {
                          const student = students.find(s => s.id === m.studentId);
                          const counselor = counselors.find(c => c.id === m.counselorId);
                          return (
                            <div key={m.id} style={{ padding: 10, borderRadius: 8, background: "#fff", marginBottom: 10 }}>
                              <div style={{ fontWeight: 700 }}>{student?.name} → {counselor?.name}</div>
                              <div style={{ marginTop: 8, fontSize: 13, color: "#446" }}>Feedback: {m.feedback || <em>— none</em>}</div>
                              <div style={{ marginTop: 8 }}>
                                <button
                                  className="btn-edit"
                                  onClick={() => setMappings(prev => prev.filter(x => x.id !== m.id))}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mappings-table">
                  <div className="table-headers">
                    <div>Student</div>
                    <div>Counselor</div>
                    <div>Feedback</div>
                    <div>Actions</div>
                  </div>

                  <div className="table-empty">
                    No mappings yet — assign a student to a counselor using the form above.
                  </div>
                </div>

            </section>
          </>
        ) : (
          /* ---------- COUNSELOR VIEW ---------- */
          <>
            <aside className="left-panel card">
              <h3 className="panel-title">My Students</h3>
              <ul className="counselor-list">
                {mappings
                  .filter(m => m.counselorId === counselors[0].id) /* replace counselors[0].id with logged-in counselor id later */
                  .map((m) => {
                    const student = students.find(s => s.id === m.studentId);
                    return (
                      <li key={m.id} className="c-item">
                        <div className="c-avatar" style={{ background: "#7aaeff" }}>
                          <span>{student?.name?.split(" ").map(n => n[0]).slice(0,2).join("")}</span>
                        </div>
                        <div className="c-meta">
                          <div className="c-name">{student?.name}</div>
                          <div className="c-role">Assigned student</div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </aside>

            <section className="center-panel">
              <div className="panel card large-card">
                <div className="panel-header">
                  <div className="panel-title-block">
                    <h2>My Assigned Students</h2>
                    <div className="small-meta">Role: <strong>{role}</strong></div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {mappings.filter(m => m.counselorId === counselors[0].id).length === 0 ? (
                    <div className="table-empty">No students assigned to you yet.</div>
                  ) : (
                    mappings
                      .filter(m => m.counselorId === counselors[0].id)
                      .map(m => {
                        const student = students.find(s => s.id === m.studentId);
                        return (
                          <div key={m.id} style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                            <div style={{ fontWeight: 700 }}>{student?.name}</div>
                            <textarea
                              placeholder="Add feedback..."
                              defaultValue={m.feedback}
                              onBlur={(e) => updateMappingFeedback(m.id, e.currentTarget.value)}
                              style={{ width: "100%", marginTop: 8, padding: 8, borderRadius: 8, border: "1px solid #e6eefc" }}
                            />
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bottombar">
        YOU’RE NOT ALONE — WE’LL WALK THIS PATH TOGETHER.
      </footer>
    </div>
  );
}
