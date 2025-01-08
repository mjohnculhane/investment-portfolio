import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [stocks, setStocks] = useState([]);
  const [realEstate, setRealEstate] = useState([]);
  const [btcAmount, setBtcAmount] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);
  const [cash, setCash] = useState(0);
  const [yieldRate, setYieldRate] = useState(0);

  // Form states for each category
  const [stocksFormData, setStocksFormData] = useState({});
  const [realEstateFormData, setRealEstateFormData] = useState({
    name: '',
    marketValue: '',
  });
  const [btcFormData, setBtcFormData] = useState({
    btcAmount: '',
    btcPrice: '',
  });
  const [cashFormData, setCashFormData] = useState({
    cash: '',
  });

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
  };

  const colors = {
    stocks: '#FF6384',
    realEstate: '#36A2EB',
    bitcoin: '#FFCE56',
    cash: '#4CAF50',
    grey: '#B0B0B0',
  };

  const calculatePortfolioValue = () => {
    let stocksValue = stocks.reduce((total, stock) => total + stock.quantity * stock.price, 0);
    let realEstateValue = realEstate.reduce((total, property) => total + property.marketValue, 0);
    let btcValue = btcAmount * btcPrice;
    let cashValue = cash * (1 + yieldRate / 100);

    let totalValue = stocksValue + realEstateValue + btcValue + cashValue;
    return { totalValue, stocksValue, realEstateValue, btcValue, cashValue };
  };

  const { totalValue, stocksValue, realEstateValue, btcValue, cashValue } = calculatePortfolioValue();
  const data = {
    labels: ['Stocks', 'Real Estate', 'Bitcoin', 'Cash'],
    datasets: [{
      data: [stocksValue, realEstateValue, btcValue, cashValue].map(value => value > 0 ? value : 1),
      backgroundColor: [
        stocksValue > 0 ? colors.stocks : colors.grey,
        realEstateValue > 0 ? colors.realEstate : colors.grey,
        btcValue > 0 ? colors.bitcoin : colors.grey,
        cashValue > 0 ? colors.cash : colors.grey
      ],
    }],
  };

  // Form submission function
  const handleAssetSubmit = (category) => {
    if (category === 'stocks' && stocksFormData.name && stocksFormData.quantity && stocksFormData.price) {
      setStocks([...stocks, stocksFormData]);
      setStocksFormData({});
    } else if (category === 'realEstate' && realEstateFormData.name && realEstateFormData.marketValue) {
      const updatedRealEstate = { ...realEstateFormData, marketValue: parseFloat(realEstateFormData.marketValue) };
      setRealEstate([...realEstate, updatedRealEstate]);
      setRealEstateFormData({ name: '', marketValue: '' });
    } else if (category === 'bitcoin' && btcFormData.btcAmount && btcFormData.btcPrice) {
      setBtcAmount(btcFormData.btcAmount);
      setBtcPrice(btcFormData.btcPrice);
      setBtcFormData({ btcAmount: '', btcPrice: '' });
    } else if (category === 'cash' && cashFormData.cash) {
      setCash(cashFormData.cash);
      setCashFormData({ cash: '' });
    }
  };

  // Delete asset from the portfolio
  const deleteAsset = (category, index) => {
    if (category === 'stocks') {
      setStocks(stocks.filter((_, i) => i !== index));
    } else if (category === 'realEstate') {
      setRealEstate(realEstate.filter((_, i) => i !== index));
    }
  };

  // Update price for stocks
  const updateStockPrice = (index, newPrice) => {
    const updatedStocks = [...stocks];
    updatedStocks[index] = { ...updatedStocks[index], price: parseFloat(newPrice) };
    setStocks(updatedStocks);
  };

  // Handle form input change for each category
  const handleChange = (e, category) => {
    const { name, value } = e.target;
    if (category === 'stocks') {
      setStocksFormData({ ...stocksFormData, [name]: value });
    } else if (category === 'realEstate') {
      setRealEstateFormData({ ...realEstateFormData, [name]: value });
    } else if (category === 'bitcoin') {
      setBtcFormData({ ...btcFormData, [name]: value });
    } else if (category === 'cash') {
      setCashFormData({ ...cashFormData, [name]: value });
    }
  };

  return (
    <div className="App">
      <h1>Investment Portfolio Tracker</h1>
      <div className="main-content">
        <div className="breakdown">
          <h2>Total Portfolio Value: ${formatNumber(totalValue)}</h2>
          <h3>Portfolio Breakdown:</h3>

          {/* Stocks Section */}
          <div className="category" style={{ backgroundColor: stocksValue > 0 ? colors.stocks : colors.grey }}>
            <h4>Stocks - ${formatNumber(stocksValue)}</h4>
            {stocks.map((stock, index) => (
              <div key={index}>
                <p>{stock.name}: {formatNumber(stock.quantity)} shares @ ${formatNumber(stock.price)} each = ${formatNumber(stock.quantity * stock.price)}</p>
                <button onClick={() => deleteAsset('stocks', index)}>Delete</button>
                {/* Update price input */}
                <input
                  type="number"
                  placeholder="Update Price"
                  onChange={(e) => updateStockPrice(index, e.target.value)}
                />
              </div>
            ))}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Stock Name"
                value={stocksFormData.name || ''}
                onChange={(e) => handleChange(e, 'stocks')}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={stocksFormData.quantity || ''}
                onChange={(e) => handleChange(e, 'stocks')}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={stocksFormData.price || ''}
                onChange={(e) => handleChange(e, 'stocks')}
              />
              <button onClick={() => handleAssetSubmit('stocks')}>Add Stock</button>
            </div>
          </div>

          {/* Real Estate Section */}
          <div className="category" style={{ backgroundColor: realEstateValue > 0 ? colors.realEstate : colors.grey }}>
            <h4>Real Estate - ${formatNumber(realEstateValue)}</h4>
            {realEstate.map((property, index) => (
              <div key={index}>
                <p>{property.name}: ${formatNumber(property.marketValue)}</p>
                <button onClick={() => deleteAsset('realEstate', index)}>Delete</button>
              </div>
            ))}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Property Name"
                value={realEstateFormData.name || ''}
                onChange={(e) => handleChange(e, 'realEstate')}
              />
              <input
                type="number"
                name="marketValue"
                placeholder="Market Value"
                value={realEstateFormData.marketValue || ''}
                onChange={(e) => handleChange(e, 'realEstate')}
              />
              <button onClick={() => handleAssetSubmit('realEstate')}>Add Property</button>
            </div>
          </div>

          {/* Bitcoin Section */}
          <div className="category" style={{ backgroundColor: btcValue > 0 ? colors.bitcoin : colors.grey }}>
            <h4>Bitcoin - ${formatNumber(btcValue)}</h4>
            <p>{formatNumber(btcAmount)} BTC @ ${formatNumber(btcPrice)} each</p>
            <div>
              <input
                type="number"
                name="btcAmount"
                placeholder="BTC Amount"
                value={btcFormData.btcAmount || ''}
                onChange={(e) => handleChange(e, 'bitcoin')}
              />
              <input
                type="number"
                name="btcPrice"
                placeholder="BTC Price"
                value={btcFormData.btcPrice || ''}
                onChange={(e) => handleChange(e, 'bitcoin')}
              />
              <button onClick={() => handleAssetSubmit('bitcoin')}>Add Bitcoin</button>
            </div>
          </div>

          {/* Cash Section */}
          <div className="category" style={{ backgroundColor: cashValue > 0 ? colors.cash : colors.grey }}>
            <h4>Cash - ${formatNumber(cashValue)}</h4>
            <p>{formatNumber(cash)} USD</p>
            <div>
              <input
                type="number"
                name="cash"
                placeholder="Cash Amount"
                value={cashFormData.cash || ''}
                onChange={(e) => handleChange(e, 'cash')}
              />
              <button onClick={() => handleAssetSubmit('cash')}>Add Cash</button>
            </div>
          </div>
        </div>

        <div className="pie-chart">
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
