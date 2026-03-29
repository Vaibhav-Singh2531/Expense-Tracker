"use client"
import React, { useEffect, useState } from 'react'

const AccountHeader = ({ account }) => {


    const [symbol, setSymbol] = useState("$"); // Default until we fetch from localStorage

    useEffect(() => {
        if (typeof window !== "undefined") { // Ensures it's running in browser
            const savedSymbol = localStorage.getItem("currencySymbol");
            if (savedSymbol) {
                setSymbol(savedSymbol);
            }
        }
    }, []);

    return (
        <div className='flex gap-4 items-end justify-between'>
            <div>
                <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
                    {account.name}
                </h1>
                <p className='text-muted-foreground'>
                    {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                </p>
            </div>

            <div className='text-right pb-2'>
                <div className='text-xl sm:text-2xl font-bold'>
                    {symbol}{parseFloat(account.balance).toFixed(2)}
                </div>
                <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions</p>
            </div>
        </div>
    )
}

export default AccountHeader