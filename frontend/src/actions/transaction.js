import api from '../lib/api.js';

export const createTransaction = async (token, transactionData) => {
    try {
        const { data } = await api.post('/transactions', transactionData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data; // Expected { success: true, data: ... }
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to create transaction");
    }
}

export const updateTransaction = async (token, transactionId, transactionData) => {
    try {
        // Since useFetch expects fn(token, ...args), if called with two args on useFetch:
        // fn(transactionId, formData) => gets expanded to (token, transactionId, formData).
        const { data } = await api.put(`/transactions/${transactionId}`, transactionData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data; 
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to update transaction");
    }
}

export const getTransaction = async (token, transactionId) => {
    try {
        const { data } = await api.get(`/transactions/${transactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data; 
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to fetch transaction");
    }
}

export const scanReceipt = async (token, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await api.post('/transactions/scan-receipt', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            }
        });
        return data; 
    } catch (error) {
        throw new Error(error.response?.data?.error || "Failed to scan receipt");
    }
}
