import api from '../lib/api.js';

export const getAccountWithTransactions = async (token, accountId) => {
    try {
        const { data } = await api.get(`/accounts/${accountId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch account transactions");
    }
}

export const updateDefaultAccount = async (token, accountId) => {
    try {
        const { data } = await api.put(`/accounts/${accountId}/default`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data };
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to set default account");
    }
}

export const bulkDeleteTransactions = async (token, transactionIds) => {
    try {
        const { data } = await api.post(`/accounts/bulk-delete`, { transactionIds }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to bulk delete transactions");
    }
}
