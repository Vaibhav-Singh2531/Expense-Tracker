import { defaultCategories } from '@/data/categories.js';
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import TransactionForm from '../_components/TransactionForm.jsx';
import useFetch from '@/hooks/use-fetch.jsx';
import { getUserAccounts } from '@/actions/dashboard.js';
import { getTransaction } from '@/actions/transaction.js';
import { BarLoader } from 'react-spinners';

const AddTransactionPage = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const { data: accounts, loading: accountsLoading, fn: fetchAccounts } = useFetch(getUserAccounts);
  const { data: initialData, loading: initialDataLoading, fn: fetchInitialData } = useFetch(getTransaction);

  useEffect(() => {
    fetchAccounts();
    if (editId) {
      fetchInitialData(editId);
    }
  }, [editId]);

  if (accountsLoading || initialDataLoading || (editId && !initialData)) {
    return <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
  }

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title mb-8'>{editId ? "Edit" : "Add"} Transaction</h1>

      <TransactionForm 
        accounts={accounts || []} 
        categories={defaultCategories} 
        editMode={!!editId} 
        initialData={initialData} 
      />
    </div>
  )
}

export default AddTransactionPage;