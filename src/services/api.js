const rawBaseUrl = process.env.REACT_APP_API_URL || '/api';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;


export const login = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            return data.user;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (fullName, email, password, role) => {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password, role }),
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            return data.message;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    console.log("Logged out");
};

export const getDashboardA = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=dashboard_a`);
    if (!response.ok) throw new Error("Failed to fetch epidemiological forecast");
    return response.json();
};

export const getDashboardB = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=dashboard_b`);
    if (!response.ok) throw new Error("Failed to fetch operational flow");
    return response.json();
};

export const getDashboardC = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=dashboard_c`);
    if (!response.ok) throw new Error("Failed to fetch inventory forecast");
    return response.json();
};

export const getPatients = async () => {
    const response = await fetch(`${BASE_URL}/patients`);
    if (!response.ok) throw new Error("Failed to fetch patients");
    return response.json();
};

export const addPatient = async (patient) => {
    const response = await fetch(`${BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error("Failed to add patient");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const updatePatient = async (id, patient) => {
    const response = await fetch(`${BASE_URL}/patients?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error("Failed to update patient");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const deletePatient = async (id) => {
    const response = await fetch(`${BASE_URL}/patients?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete patient");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const clearAllPatients = async () => {
    const response = await fetch(`${BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearAll' }),
    });
    if (!response.ok) throw new Error("Failed to clear patients");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const getStats = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
};

export const getActivity = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=activity`);
    if (!response.ok) throw new Error("Failed to fetch activity");
    return response.json();
};

export const exportReport = async () => {
    const response = await fetch(`${BASE_URL}/dashboard?action=export`);
    if (!response.ok) throw new Error("Failed to export report");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `ecare_patient_report_${date}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
};

// --- ADMIN USER MANAGEMENT ENDPOINTS ---
export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/admin`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.users;
};

export const updateUserRole = async (id, role) => {
    const response = await fetch(`${BASE_URL}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
    });
    if (!response.ok) throw new Error("Failed to update user role");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}/admin?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete user");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

// --- BHW ASSIGNMENT ENDPOINTS ---
export const getBhwAssignments = async () => {
    const response = await fetch(`${BASE_URL}/bhw_handler`);
    if (!response.ok) throw new Error("Failed to fetch BHW assignments");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
};

export const addBhwAssignment = async (assignment) => {
    const response = await fetch(`${BASE_URL}/bhw_handler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignment),
    });
    if (!response.ok) throw new Error("Failed to log BHW assignment");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

// --- INVENTORY ENDPOINTS ---
export const getInventory = async () => {
    const response = await fetch(`${BASE_URL}/inventory`);
    if (!response.ok) throw new Error("Failed to fetch medicine inventory");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.data;
};

export const addInventory = async (item) => {
    const response = await fetch(`${BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error("Failed to add inventory item");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};
