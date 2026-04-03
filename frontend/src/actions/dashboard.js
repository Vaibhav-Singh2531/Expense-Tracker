import api from '../lib/api.js';

export const getUserAccounts = async (token) => {
    try {
        const { data } = await api.get('/dashboard/accounts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data?.data || data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch accounts");
    }
}

export const getDashboardData = async (token) => {
    try {
        const { data } = await api.get('/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data?.data || data; // Returns the transactions for the dashboard
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch dashboard data");
    }
}

export const createAccount = async (token, formData) => {
    try {
        const { data } = await api.post('/dashboard/accounts', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data?.data || data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to create account");
    }
}
