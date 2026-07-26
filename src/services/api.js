const BASE_URL = 'http://localhost/ecare';

export const login = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch(`${BASE_URL}/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password, role }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
    // Clear user session/local storage if needed
    console.log("Logged out");
};

export const getDashboardA = async () => {
    const response = await fetch(`${BASE_URL}/dashboard.php?action=dashboard_a`);
    if (!response.ok) throw new Error("Failed to fetch epidemiological forecast");
    return response.json();
};

export const getDashboardB = async () => {
    const response = await fetch(`${BASE_URL}/dashboard.php?action=dashboard_b`);
    if (!response.ok) throw new Error("Failed to fetch operational flow");
    return response.json();
};

export const getDashboardC = async () => {
    const response = await fetch(`${BASE_URL}/dashboard.php?action=dashboard_c`);
    if (!response.ok) throw new Error("Failed to fetch inventory forecast");
    return response.json();
};

export const getPatients = async () => {
    const response = await fetch(`${BASE_URL}/patients.php`);
    if (!response.ok) throw new Error("Failed to fetch patients");
    return response.json();
};

export const addPatient = async (patient) => {
    const response = await fetch(`${BASE_URL}/patients.php`, {
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
    const response = await fetch(`${BASE_URL}/patients.php?id=${id}`, {
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
    const response = await fetch(`${BASE_URL}/patients.php?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete patient");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};

export const clearAllPatients = async () => {
    const response = await fetch(`${BASE_URL}/patients.php`, {
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
    const response = await fetch(`${BASE_URL}/dashboard.php?action=stats`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
};

export const getActivity = async () => {
    const response = await fetch(`${BASE_URL}/dashboard.php?action=activity`);
    if (!response.ok) throw new Error("Failed to fetch activity");
    return response.json();
};

export const exportReport = async () => {
    const response = await fetch(`${BASE_URL}/dashboard.php?action=export`);
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
    const response = await fetch(`${BASE_URL}/admin.php`);
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data.users;
};

export const updateUserRole = async (id, role) => {
    const response = await fetch(`${BASE_URL}/admin.php`, {
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
    const response = await fetch(`${BASE_URL}/admin.php?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete user");
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    return data;
};


