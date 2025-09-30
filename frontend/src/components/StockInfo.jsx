// frontend/src/components/StockInfo.jsx

import React from 'react';
function StockInfo({ data }) {
  const { stock_info, predicted_price, accuracy } = data;
  const formatPrice = (price) => {
    return price ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  };

  return (
    <div className="left-panel">
      <h2>{stock_info.name} ({stock_info.symbol})</h2>
      <ul>
        <li><strong>Sector:</strong> <span style={{ color: '#f7ef08' }}>{stock_info.sector || "N/A"}</span></li><br />
        <li>
          <strong>Website:</strong>
          {stock_info.website ? <a href={stock_info.website} target="_blank" rel="noopener noreferrer">{stock_info.website}</a> : ' N/A'}
        </li><br />
        <li><strong>Latest Price:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.latest_price)}</span></li><br />
        <li><strong>Previous Close:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.previous_close)}</span></li><br />
        <li><strong>Day High:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.day_high)}</span></li><br />
        <li><strong>Day Low:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.day_low)}</span></li><br />
        <li><strong>52-Week High:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.fifty_two_week_high)}</span></li><br />
        <li><strong>52-Week Low:</strong> <span style={{ color: '#00ff00' }}>{formatPrice(stock_info.fifty_two_week_low)}</span></li>
      </ul><hr />

      <div className="prediction-section">
        <p>
          <strong>Predicted Next Day Price:</strong>
          <span style={{ color: '#00FFFF' }}>{formatPrice(predicted_price)}</span>
        </p>
        <p>
          <strong>Prediction Accuracy:</strong>
          <span style={{ color: '#00FFFF' }}>{accuracy ? `${accuracy.toFixed(2)}%` : 'N/A'}</span>
        </p>
      </div>
    </div>
  );
}

export default StockInfo;