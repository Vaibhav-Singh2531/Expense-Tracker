import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

const useFetch = (cb) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();

    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const response = await cb(token, ...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error)
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    return {data , loading , error , fn , setData};
};

export default useFetch;