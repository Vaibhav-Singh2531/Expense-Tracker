import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense, useEffect } from 'react'
import AccountCard from './_components/account-card.jsx'
import BudgetProgress from './_components/BudgetProgress.jsx'
import { DashboardOverview } from './_components/DashboardOverview.jsx'
import { getUserAccounts, getDashboardData } from '@/actions/dashboard.js'
import { getCurrentBudget } from '@/actions/budget.js'
import useFetch from '@/hooks/use-fetch.jsx'
import { BarLoader } from 'react-spinners'

const Dashboard = () => {
  const { data: accounts, loading: accountsLoading, fn: fetchAccounts } = useFetch(getUserAccounts);
  const { data: transactions, loading: transactionsLoading, fn: fetchTransactions } = useFetch(getDashboardData);
  const { data: budgetData, loading: budgetLoading, fn: fetchBudget } = useFetch(getCurrentBudget);

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  useEffect(() => {
    if (defaultAccount) {
      fetchBudget(defaultAccount.id);
    }
  }, [defaultAccount]);

  if (accountsLoading || transactionsLoading) {
    return <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
  }

  return (
    <div className='space-y-8'>
      {defaultAccount && (
        <BudgetProgress initialBudget={budgetData?.budget} currentExpenses={budgetData?.currentExpenses || 0} />
      )}

      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts || []}
          transactions={transactions || []}
        />
      </Suspense>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
          <Card className={"hover:shadow-md transition-shadow cursor-pointer"}>
            <CardContent className={"flex flex-col items-center justify-center text-muted-foreground h-full pt-5"}>
              <Plus className='h-10 w-10 mb-2' />
              <p className='text-sm font-medium'>Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        
        {accounts && accounts.length > 0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />
        })}
      </div>
    </div>
  )
}

export default Dashboard;