import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense, useState, useEffect } from 'react'
import AccountCard from './_components/account-card.jsx'
import BudgetProgress from './_components/BudgetProgress.jsx'
import { DashboardOverview } from './_components/DashboardOverview.jsx'

const Dashboard = () => {
  // Temporary state placeholders (will be replaced by React Query in Day 7)
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetData, setBudgetData] = useState(null);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  return (
    <div className='space-y-8'>
      {defaultAccount && (
        <BudgetProgress initialBudget={budgetData?.budget} currentExpenses={budgetData?.currentExpenses || 0} />
      )}

      <Suspense fallback={"Loading Overview..."}>
        <DashboardOverview
          accounts={accounts}
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
        
        {accounts.length > 0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />
        })}
      </div>
    </div>
  )
}

export default Dashboard;