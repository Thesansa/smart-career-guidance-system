// SignUpForm.jsx
import React, { useEffect, useState } from "react";
import { fetchRoles, createUser } from "./authService";

export default function SignUpForm() {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    roleId: "",
    username: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    let mounted = true;
    fetchRoles()
      .then(data => {
        if (!mounted) return;
        // backend might return [{id, name}] or [{role_id, role_name}] — normalize
        const normalized = (data || []).map(r => ({
          id: r.id ?? r.role_id,
          name: r.name ?? r.role_name ?? r.role
        }));
        setRoles(normalized);
      })
      .catch(err => {
        console.error(err);
        setMessage("Failed to load roles. Check backend or CORS.");
      })
      .finally(() => mounted && setLoadingRoles(false));
    return () => { mounted = false; };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);

    // Basic client-side validation
    if (!form.roleId || !form.username || !form.email || !form.password) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoadingSubmit(true);

    // Build payload to match backend expected keys.
    // Many backends expect role_id; if yours expects a nested role object, adapt accordingly.
    const payload = {
      role_id: Number(form.roleId),   // change to roleId if backend expects camelCase
      username: form.username,
      email: form.email,
      password: form.password
    };

    try {
      const result = await createUser(payload);
      setMessage("User created successfully.");
      setForm({ roleId: "", username: "", email: "", password: "" });
      console.log("create user result:", result);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create user: " + (err.message || err));
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "20px auto", padding: 12 }}>
      <h2>Sign up</h2>

      {message && <div style={{ marginBottom: 8 }}>{message}</div>}

      <form onSubmit={onSubmit}>
        <label>
          Role
          <br />
          <select name="roleId" value={form.roleId} onChange={onChange}>
            <option value="">Select role</option>
            {loadingRoles ? <option>Loading...</option> :
              roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)
            }
          </select>
        </label>

        <br /><br />

        <label>
          Username
          <br />
          <input name="username" value={form.username} onChange={onChange} />
        </label>

        <br /><br />

        <label>
          Email
          <br />
          <input name="email" type="email" value={form.email} onChange={onChange} />
        </label>

        <br /><br />

        <label>
          Password
          <br />
          <input name="password" type="password" value={form.password} onChange={onChange} />
        </label>

        <br /><br />

        <button type="submit" disabled={loadingSubmit}>
          {loadingSubmit ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
