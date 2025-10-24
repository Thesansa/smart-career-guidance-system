const KEY = "student_profiles_v1";

export function loadStudents(){
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) as Array <any> : [];
    } catch (e) {
        console.error("Failed to load students:" , e);
        return [];
    }
}

export function saveStudents(students: Array<any>) {
    try {
        localStorage.setItem(KEY, JSON.stringify(students));
    } catch (e) {
        console.error("Failed to save students:", e);
    }
}

