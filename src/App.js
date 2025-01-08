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
  const [showStockForm, setShowStockForm] = useState(false);

  const [realEstateFormData, setRealEstateFormData] = useState({
    name: '',
    marketValue: '',
  });
  const [showRealEstateForm, setShowRealEstateForm] = useState(false);

  const [btcFormData, setBtcFormData] = useState({
    btcAmount: '',
    btcPrice: '',
  });
  const [showBtcForm, setShowBtcForm] = useState(false);

  const [cashFormData, setCashFormData] = useState({
    cash: '',
  });
  const [showCashForm, setShowCashForm] = useState(false);


  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
  };

  const colors = {
    stocks: '#D8B2FF',
    realEstate: '#60A5FA',
    bitcoin: '#FF9900',
    cash: '#22C55E',
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
        colors.stocks,
        colors.realEstate,
        colors.bitcoin,
        colors.cash
      ],
    }],
  };

  // Form submission function
  const handleAssetSubmit = (category) => {
    if (category === 'stocks' && stocksFormData.name && stocksFormData.quantity && stocksFormData.price) {
      setStocks([...stocks, stocksFormData]);
      setStocksFormData({});
      setShowStockForm(false); // Hide the form and show the plus icon
    } else if (category === 'realEstate' && realEstateFormData.name && realEstateFormData.marketValue) {
      const updatedRealEstate = { ...realEstateFormData, marketValue: parseFloat(realEstateFormData.marketValue) };
      setRealEstate([...realEstate, updatedRealEstate]);
      setRealEstateFormData({ name: '', marketValue: '' });
      setShowRealEstateForm(false);
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
  const deleteAsset = (category, index = null) => {
    if (category === 'stocks') {
      setStocks(stocks.filter((_, i) => i !== index));
    } else if (category === 'realEstate') {
      setRealEstate(realEstate.filter((_, i) => i !== index));
    } else if (category === 'bitcoin') {
      setBtcAmount(0);
      setBtcPrice(0);
      setShowBtcForm(false);
    } else if (category === 'cash') {
      setCash(0);
      setShowCashForm(false);
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
          <h1 style={{ textAlign: 'center' }}>Total Portfolio Value - ${formatNumber(totalValue)}</h1>
          {/* Stocks Section */}
          <div className="category" style={{ backgroundColor: colors.stocks }}>
            <h2 style={{ marginBottom: '1rem' }}>Stocks - ${formatNumber(stocksValue)}</h2>
            {stocks.map((stock, index) => (
              <div key={index} className="asset-container">
                <span onClick={() => deleteAsset('stocks', index)}>
                  <i className="fas fa-trash"></i> {/* Font Awesome trash icon */}
                </span>
                <p>{stock.name}: {formatNumber(stock.quantity)} shares @ ${formatNumber(stock.price)} each = ${formatNumber(stock.quantity * stock.price)}</p>
                {/* Update price input */}
                <input
                  type="number"
                  placeholder="Price"
                  onChange={(e) => updateStockPrice(index, e.target.value)}
                />
              </div>
            ))}
            <div className="asset-container add-asset" onClick={() => setShowStockForm(true)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
              {!showStockForm ? (
                <span>
                  <i className="fas fa-plus-circle"></i> {/* Font Awesome "+" inside of circle icon */}
                </span>
              ) : (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={stocksFormData.name || ''}
                    onChange={(e) => handleChange(e, 'stocks')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('stocks')}
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={stocksFormData.quantity || ''}
                    onChange={(e) => handleChange(e, 'stocks')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('stocks')}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={stocksFormData.price || ''}
                    onChange={(e) => handleChange(e, 'stocks')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('stocks')}
                  />
                  <button onClick={() => {
                    handleAssetSubmit('stocks');
                    setShowStockForm(false); // Hide the form after submission
                  }}>
                    Add
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent onClick from triggering the parent container
                      setShowStockForm(false); // Cancel and revert to the plus icon
                    }}
                    style={{ marginLeft: '1rem', backgroundColor: 'red', color: 'white' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Real Estate Section */}
          <div className="category" style={{ backgroundColor: colors.realEstate}}>
            <h2 style={{ marginBottom: '1rem' }}>Real Estate - ${formatNumber(realEstateValue)}</h2>
            {realEstate.map((property, index) => (
              <div key={index} className="asset-container">
                <span onClick={() => deleteAsset('realEstate', index)}>
                  <i className="fas fa-trash"></i> {/* Font Awesome trash icon */}
                </span>
                <p>{property.name}: ${formatNumber(property.marketValue)}</p>
              </div>
            ))}
            <div
              className="asset-container add-asset"
              onClick={!showRealEstateForm ? () => setShowRealEstateForm(true) : undefined}
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
            >
              {!showRealEstateForm ? (
                <span>
                  <i className="fas fa-plus-circle"></i> {/* Font Awesome "+" inside of circle icon */}
                </span>
              ) : (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={realEstateFormData.name || ''}
                    onChange={(e) => handleChange(e, 'realEstate')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('realEstate')}
                  />
                  <input
                    type="number"
                    name="marketValue"
                    placeholder="Price"
                    value={realEstateFormData.marketValue || ''}
                    onChange={(e) => handleChange(e, 'realEstate')}
                    onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('realEstate')}
                  />
                  <button
                    onClick={() => {
                      handleAssetSubmit('realEstate');
                      setShowRealEstateForm(false); // Hide the form after submission
                    }}
                  >
                    Add Property
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent onClick from triggering the parent container
                      setShowRealEstateForm(false); // Cancel and revert to the plus icon
                    }}
                    style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bitcoin Section */}
          <div className="category" style={{ backgroundColor: colors.bitcoin }}>
            <h2 style={{ marginBottom: '1rem' }}>Bitcoin - ${formatNumber(btcValue)}</h2>
            {btcValue > 0 ? (
              <div className="asset-container">
                <span onClick={() => deleteAsset('bitcoin')}>
                  <i className="fas fa-trash"></i> {/* Font Awesome trash icon */}
                </span>
                <p>{formatNumber(btcAmount)} BTC @ ${formatNumber(btcPrice)} each</p>
              </div>
            ) : (
              <div
                className="asset-container add-asset"
                onClick={() => setShowBtcForm(true)}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              >
                {!showBtcForm ? (
                  <span>
                    <i className="fas fa-plus-circle"></i> {/* "+" icon */}
                  </span>
                ) : (
                  <div>
                    <input
                      type="number"
                      name="btcAmount"
                      placeholder="Quantity"
                      value={btcFormData.btcAmount || ''}
                      onChange={(e) => handleChange(e, 'bitcoin')}
                      onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('bitcoin')}
                    />
                    <input
                      type="number"
                      name="btcPrice"
                      placeholder="Price"
                      value={btcFormData.btcPrice || ''}
                      onChange={(e) => handleChange(e, 'bitcoin')}
                      onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('bitcoin')}
                    />
                    <button
                      onClick={() => {
                        handleAssetSubmit('bitcoin');
                        setShowBtcForm(false); // Hide form
                      }}
                    >
                      Add Bitcoin
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click on parent
                        setShowBtcForm(false); // Cancel
                      }}
                      style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cash Section */}
          <div className="category" style={{ backgroundColor: colors.cash }}>
            <h2 style={{ marginBottom: '1rem' }}>Cash - ${formatNumber(cash)}</h2>
            {cash > 0 ? (
              <div className="asset-container">
                <span onClick={() => deleteAsset('cash')}>
                  <i className="fas fa-trash"></i> {/* Font Awesome trash icon */}
                </span>
                <p>{formatNumber(cash)} USD</p>
              </div>
            ) : (
              <div
                className="asset-container add-asset"
                onClick={() => setShowCashForm(true)}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              >
                {!showCashForm ? (
                  <span>
                    <i className="fas fa-plus-circle"></i> {/* "+" icon */}
                  </span>
                ) : (
                  <div>
                    <input
                      type="number"
                      name="cash"
                      placeholder="Quantity"
                      value={cashFormData.cash || ''}
                      onChange={(e) => handleChange(e, 'cash')}
                      onKeyDown={(e) => e.key === 'Enter' && handleAssetSubmit('cash')}
                    />
                    <button
                      onClick={() => {
                        handleAssetSubmit('cash');
                        setShowCashForm(false); // Hide form
                      }}
                    >
                      Add Cash
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click on parent
                        setShowCashForm(false); // Cancel
                      }}
                      style={{ marginLeft: '0.5rem', backgroundColor: 'red', color: 'white' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
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
