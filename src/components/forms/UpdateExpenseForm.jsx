import React from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const UpdateExpenseForm = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [notes, setNotes] = useState("");

  const { authenticateUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
  const nav = useNavigate();

  // ******************* get the information of the ad **********************
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios(`${API_URL}/new/${productId}`);
        console.log("here is details of edited product", response.data);
        setTitle(response.data.title);
        setCategory(response.data.category)
        setCondition(response.data.condtion)
        setDescription(response.data.description)
        setPrice(response.data.price)
        setImageUrl(response.data.imageUrl)
        setEmail(response.data.email)
        setPhone(response.data.phone)
        setPostCode(response.data.postCode)
        setStreet(response.data.street)

      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [productId]);



// *********** create new expense *************
  const handleExpense = event => {
    event.preventDefault();
    const newExpense = {
      description,
      amount,
      category,
      date,
      paymentMethod,
      expenseType,
      notes,
    };

    axios
      .post(`${API_URL}/expenses`, newExpense)
      .then((response) => {
        console.log("new expense was created", response.data);
        nav("/");
      })
      .catch((err) => {
        console.log("there was an error while adding new expense", err.response.data.message);
        setError(err.response.data.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleExpense}>
        <div>
          <div>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
              placeholder="Description"
            />
          </div>
          <div>
            <label>Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              required
              placeholder="amount"
            />
          </div>
          <div>
            <label>Category</label>
            <select
              name="category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option value="Home">Home</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoping">Shoping</option>
              <option value="Transportation">Transportation</option>
              <option value="Repair">Repair</option>
              <option value="Pet">Pet</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              required
              placeholder="Date"
            />
          </div>
          <div>
            <label>payment Method</label>
            <select
              name="paymentMethod"
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            >
              <option value="bankAccount">Bank Account</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label>Expense Type</label>
            <input
              type="text"
              value={expenseType}
              onChange={(e) => {
                setExpenseType(e.target.value);
              }}
              placeholder="Expense Type"
            />
          </div>
          <div>
          <label>Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="Notes"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
