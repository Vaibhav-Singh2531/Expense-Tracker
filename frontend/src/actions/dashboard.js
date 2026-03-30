import api from '../lib/api.js';

export const getUserAccounts = async (token) => {
    try {
        const { data } = await api.get('/accounts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch accounts");
    }
}

export const getDashboardData = async (token) => {
    try {
        const { data } = await api.get('/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data; // Returns the transactions for the dashboard
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch dashboard data");
    }
}
