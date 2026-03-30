import api from '../lib/api.js';

export const getCurrentBudget = async (token, accountId) => {
    try {
        const { data } = await api.get('/budgets', {
            headers: { Authorization: `Bearer ${token}` },
            params: { accountId }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch budget");
    }
}

export const updateBudget = async (token, amount) => {
    try {
        const { data } = await api.put('/budgets', { amount }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to update budget");
    }
}
