import React, { Suspense, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/AccountChart.jsx';
import { TransactionTable } from '../_components/transaction-table.jsx';
import AccountHeader from '../_components/account-header.jsx';
import { getAccountWithTransactions } from '@/actions/accounts.js';
import useFetch from '@/hooks/use-fetch.jsx';

const AccountPage = () => {
    const { id } = useParams();
    
    const { data: accountData, loading, fn: fetchAccount, error } = useFetch(getAccountWithTransactions);

    useEffect(() => {
        if (id) {
            fetchAccount(id);
        }
    }, [id]);

    if (loading || !accountData) {
        return <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
    }

    if (error) {
        return <Navigate to="/dashboard" replace />;
    }

    const { transactions, ...account } = accountData;

    return (
        <div className='space-y-8 px-5'>
            <AccountHeader account={account}/>
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>

            </Suspense>
            <AccountChart transactions={transactions} />
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea' />}>
                <TransactionTable transactions={transactions} />
            </Suspense>
        </div>
    )
}

export default AccountPage;