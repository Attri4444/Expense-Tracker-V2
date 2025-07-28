import React, { useState, useEffect } from 'react';
import styles from './Transactions.module.css';
import TransactionCards from '../TransactionCards/TransactionCards';
import Pagination from '../Pagination/Pagination';
import AddExpenses from '../Form/AddExpenses/AddExpenses';
import Modal from '../Modal/Modal';


export default function Transactions({title, transactions, editTransactions, balance, setBalance}) {

    const [editId, setEditId] = useState(0);
    const [editOption, setEditOption] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const maxExpenses = 3;

    // console.log(totalPages);

    // Deleting the Transaction from the Expenses
    const handleDelete = (id) => {
        const record = transactions.find((item) => item.id == id);
        const price = Number(record.price);
        setBalance((prev) => prev + price);
        editTransactions((prev) => prev.filter((item) => item.id !== id));
    };
    
    // Editing the Transaction
    const handleEdit = (id) => {
        setEditId(id);
        setEditOption(true);
    };

    // Logic for Pagination and Transaction per Card
    useEffect(()=>{
        const startIndex = (currentPage - 1)* maxExpenses;
        const endIndex = Math.min(currentPage * maxExpenses, transactions.length);
        setTotalPages(Math.ceil(transactions.length/maxExpenses));
        setCurrentTransaction([...transactions].slice(startIndex, endIndex));
    }, [currentPage, transactions]);

    useEffect(()=>{
        if(totalPages < currentPage && currentPage > 1){
            setCurrentPage((prev) => prev - 1);
        }
    }, [totalPages]);

  return (
    <div className={styles.transactionsWrapper}>
      {title && <h2>{title}</h2>}

        {transactions.length > 0 ? (
            <div className={styles.list}>
                <div>
                    {currentTransaction.map((transaction) => (
                        <TransactionCards 
                        details={transaction} key={transaction.id} 
                        handleEdit={() => handleEdit(transaction.id)} 
                        handleDelete={()=>handleDelete(transaction.id)}/>
                    ))}
                </div>
                    {totalPages > 1 && (<Pagination updatePage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>)}
            </div>
        ) : (
            <div className={styles.emptyTransactionsWrapper}>
                <p>No transactions!</p>
            </div>
        )}

        <Modal isOpen={editOption} setIsOpen={setEditOption}>
            <AddExpenses setIsOpen={setEditOption} balance={balance} setBalance={setBalance} expenses={transactions} setExpenses={editTransactions} editId={editId}/>
        </Modal>

    </div>
  );
}