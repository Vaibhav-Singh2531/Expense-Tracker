import React, { Suspense, useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/AccountChart.jsx';
import { TransactionTable } from '../_components/transaction-table.jsx';
import AccountHeader from '../_components/account-header.jsx';

const AccountPage = () => {
    const { id } = useParams();
    
    // Mock placeholder state, to be replaced by actual fetching in Day 7
    const [accountData, setAccountData] = useState({
        id,
        name: "Mock Account",
        balance: 0,
        transactions: []
    });

    if (!accountData) {
        return <Navigate to="/" replace />;
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