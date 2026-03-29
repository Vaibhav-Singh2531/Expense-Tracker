import { defaultCategories } from '@/data/categories.js';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import TransactionForm from '../_components/TransactionForm.jsx';

const AddTransactionPage = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  // Mock values (actual fetching will be done in Day 7 with React Query)
  const [accounts, setAccounts] = useState([]);
  const [initialData, setInitialData] = useState(null);

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl gradient-title mb-8'>{editId ? "Edit" : "Add"} Transaction</h1>

      <TransactionForm 
        accounts={accounts} 
        categories={defaultCategories} 
        editMode={!!editId} 
        initialData={initialData} 
      />
    </div>
  )
}

export default AddTransactionPage;