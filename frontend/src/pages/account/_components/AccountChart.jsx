"use client"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { endOfDay, format, startOfDay, subDays } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Month", days: 90 },
  "6M": { label: "Last 6 Month", days: 180 },
  All: { label: "All Time", days: 180 },
}
const AccountChart = ({ transactions }) => {


  const [dateRange, setDaterange] = useState("1M");
  const [symbol, setSymbol] = useState("$");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

    const filteredData = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now));

    const grouped = filteredData.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");

      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

   useEffect(() => {
    if (typeof window !== "undefined") { // Ensures it's running in browser
      const savedSymbol = localStorage.getItem("currencySymbol");
      if (savedSymbol) {
        setSymbol(savedSymbol);
      }
    }
  }, []);


  return (

    <Card>
      <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-7"}>
        <CardTitle className={"text-base font-normal"}>Transaction Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDaterange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => {
              return (

                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>

        <div className='flex justify-around mb-6 text-sm'>
          <div className='text-center'>
            <p className='text-muted-foreground'>Total Income</p>
            <p className='text-lg font-bold text-green-500'>{symbol}{totals.income.toFixed(2)}</p>
          </div>

          <div className='text-center'>
            <p className='text-muted-foreground'>Total Expenses</p>
            <p className='text-lg font-bold text-red-500'>{symbol}{totals.expense.toFixed(2)}</p>
          </div>

          <div className='text-center'>
            <p className='text-muted-foreground'>Net</p>
            <p className={`text-lg font-bold ${totals.income - totals.expense >= 0 ? "text-green-500" : "text-red-500"}`}>{symbol}{(totals.income - totals.expense).toFixed(2)}</p>
          </div>
        </div>

        <div className='h-[300px]'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${symbol}${value}`} />
              <Tooltip formatter={(value) => [`${symbol}${value}`, undefined]} />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>


  )
}

export default AccountChart