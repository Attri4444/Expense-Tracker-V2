import React, { useState } from 'react'
import styles from "./AddExpenses.module.css";
import Button from '../../Button/Button';
import { useSnackbar } from 'notistack';


export default function AddExpenses({setIsOpen, balance, setBalance, expenses, setExpenses, editId}) {
  const { enqueueSnackbar }= useSnackbar();

  const initExpenses = editId ? expenses.find((item)=> item.id === editId) : { title: "", category: "", price: "", date: "",};

    // if there is no editId is present, State for adding empty templete, data  = { title: "", category: "", price: "", date: "",}.
    // to set expenses (main).
    const [data, setData] = useState(initExpenses);

    const handleChange = (e) => {
      const name = e.target.name; // Extract the 'name' attribute of the input field (e.g., 'title', 'price', etc.)
      // Use Computed Property Names to dynamically update the 'data' object.
     // [name] allows accessing the property with the key specified in the 'name' variable.
     // Without [name], it would create a property literally named 'name' instead of updating the desired key.
      setData((prev) => ({ ...prev, [name]: e.target.value })); // Dynamically set the value of the property matching the 'name' key
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if(balance < Number(data.price)){
        enqueueSnackbar("Price should be less than Wallet Balance", {variant: "warning"});
        setIsOpen(false);
        return;
      }

      setBalance((prevBal) => prevBal - Number(data.price));

      const prevId = expenses.length > 0 ? expenses[0].id : 0;

      setExpenses((prev) => [{...data, id: prevId + 1}, ...prev]);

      setData({
        title: "",
        category: "",
        price: "",
        date: "",
      });

      setIsOpen(false);
    };

    
    const handleEdit = (e) => {
      e.preventDefault();
      const updateExpense = expenses.map((item) => {
        if(item.id === editId){
          const priceDifference = item.price - Number(data.price);

          if(priceDifference < 0 && Math.abs(Number(priceDifference) > balance)){
            enqueueSnackbar("Price should not exceed wallet balance", {variant: "warning"});
            setIsOpen(false);
            return {...item};
          }

          setBalance((prev) => prev + priceDifference);
          return {...data, id: editId}

        } else {
          return item;
        }
      });

      setExpenses(updateExpense);
      setIsOpen(false);
    };

  return (
    <div className={styles.formWrapper}>
      <h3>{editId ? "Edit Expenses": "Add Expenses"}</h3>

      <form onSubmit={editId ? handleEdit : handleSubmit}>

        <input type="text" name="title" placeholder='Title' value={data.title} onChange={handleChange} required/>

        <input type="number" name='price' value={data.price} placeholder='Price' onChange={handleChange} required/>

        <select name="category" value={data.category} onChange={handleChange} required>
            <option value="" disabled>Select Category</option>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="travel">Travel</option>
        </select>

        <input type="date" name='date' value={data.date} onChange={handleChange}/>

        <Button type='submit' stylebtn='primary' shadow>{editId ? "Edit Expenses": "Add Expenses"}</Button>
        <Button stylebtn='secondary' handleClick={()=>setIsOpen(false)} shadow>Cancel</Button>

      </form>
    </div>
  )
}