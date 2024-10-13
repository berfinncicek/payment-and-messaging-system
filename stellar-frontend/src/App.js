import React, { useState } from 'react';
import './App.css';  // Yenilenmiş App CSS dosyasını projenize dahil ettiğinizden emin olun

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [interval, setInterval] = useState('');
  const [address, setAddress] = useState('');
  const [response, setResponse] = useState(null);

  const handleSendPayment = async (event) => {
    event.preventDefault();

    const data = {
      from,
      to,
      amount: parseInt(amount),
      message,
    };

    console.log('Sending Data:', data);

    const response = await fetch('http://localhost:3000/send_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResponse(result);
    console.log(result);
  };

  const handleGetBalance = async (event) => {
    event.preventDefault();

    const data = {
      address,
    };

    console.log('Sending Data:', data);

    const response = await fetch('http://localhost:3000/get_balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResponse(result);
    console.log(result);
  };

  const handleGetTransactionHistory = async (event) => {
    event.preventDefault();

    const data = {
      address,
    };

    console.log('Sending Data:', data);

    const response = await fetch('http://localhost:3000/get_transaction_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResponse(result);
    console.log(result);
  };

  const handleSchedulePayment = async (event) => {
    event.preventDefault();

    const data = {
      from,
      to,
      amount: parseInt(amount),
      message,
      interval: parseInt(interval),
    };

    console.log('Sending Data:', data);

    const response = await fetch('http://localhost:3000/schedule_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setResponse(result);
    console.log(result);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <a href="/">Stellar Bootcamp</a>
      </nav>

      <div className="container">
        <div className='blok'>
          <form onSubmit={handleSendPayment}>
            <h2>Send Payment</h2>
            <label>
              From:
              <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
            </label>
            <label>
              To:
              <input type="text" value={to} onChange={(e) => setTo(e.target.value)} required />
            </label>
            <label>
              Amount:
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </label>
            <label>
              Message:
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <button type="submit">Send Payment</button>
          </form>
          <hr />
        </div>

        <div className='blok'>
          <form onSubmit={handleGetBalance}>
            <h2>Get Balance</h2>
            <label>
              Address:
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </label>
            <button type="submit">Get Balance</button>
          </form>        
          <hr />
        </div>
        
        <div className='blok'>
        <form onSubmit={handleGetTransactionHistory}>
          <h2>Get Transaction History</h2>
          <label>
            Address:
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <button type="submit">Get Transaction History</button>
        </form>
        <hr />
        </div>

        <div className='blok'>
        <form onSubmit={handleSchedulePayment}>
          <h2>Schedule Payment</h2>
          <label>
            From:
            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
          </label>
          <label>
            To:
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} required />
          </label>
          <label>
            Amount:
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </label>
          <label>
            Message:
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <label>
            Interval (seconds):
            <input type="number" value={interval} onChange={(e) => setInterval(e.target.value)} required />
          </label>
          <button type="submit">Schedule Payment</button>
        </form>
        <hr />
        </div>

        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default App;