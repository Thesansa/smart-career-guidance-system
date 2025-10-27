import { useEffect } from "react";
import {createUser, getRoles} from "../Services/api.ts";


type Form = {
    roleId: string;
    username: string;
    email: string;
    password: string;
};

export default function Signup() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [form, setForm] = useState<Form>({ roleId: '', username: '', email: '', password: '' });
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
    setLoadingRoles(true);
    getRoles()
    .then(res => setRoles(res.data || []))
        .catch(err => {
            console.error(err);
            setMessage('Failed to get roles. Ask backend dev to check /roles/all.');
        })
        .finally(() => setLoadingRoles(false));
    },[]);

    function  onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({...f,[e.target.name]:e.target.value}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (!form.roleId || !form.username || !form.email || !form.password) {
            setMessage('Please fill all  fields.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                roleId: Number(form.roleId),
                username: form.username,
                email: form.email,
                password: form.password,
            };
            await createUser(payload);
            setMessage('User created successfully');
            setForm({roleID:'',username:'',email:'',password:'',});
        }catch(err:any) {
            console.error(err);
            const errMsg = err?.response?.data?.Message || 'Failed to create user';
            setMessage(errMsg);
        }finally {
            setSubmitting(false);
        }
    }
    return (
        <div style={{ maxWidth: 560, margin: '240px auto', padding: 12 }}>
            <h1>Student Signup</h1>

            {message && <div style={{ marginBottom: 12 }}>(message)</div> }

            <form onSubmit={handleSubmit}>
                <label>Role</label>
                <div>
                    {loadingRoles ? (
                        <div>Loading roles...</div>
                    ):(
                        <select name="roleId" value={form.roleId} onChange={onChange}required >
                            <option value="">-- choose role --</option>
                            {roles.map(r => (
                                <option key={(r as any).id} value={(r as any).id}>
                                    {(r as any).name|| (r as any).roleName || `ROLE_${(r as any).id}`}
                                </option>
                            ))}
                            </select>
                        )}
                </div>

                <label>Username</label>
                <input name="username" value={form.username} onChange={onChange} required />

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} required />

                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={onChange} minLength={6} required />

                <div style={{ marginTop: 12 }}>
                    <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Create user'}</button>
                </div>
            </form>
        </div>
    );
}


