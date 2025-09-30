// frontend/src/components/About.jsx (Updated)

import React from 'react';
function About({ onBackClick }) {
  const handleBackClick = (event) => {
    event.preventDefault();
    onBackClick();
  };

  return (
    <div className="overlay">
      <div className="content-box">
        <h1>About <span className="gradient-text">NSE Stock Predictor</span></h1><br/>
        <p><strong>Hello Dear, </strong><h3>INVESTORS / TRADERS</h3></p>
        <p>
          <span style={{ color: 'rgb(10, 239, 227)' }}>&#9650;</span>
          NSE Stock Predictor is an intelligent stock forecasting tool that leverages machine learning techniques and technical indicators like RSI, MACD, Bollinger Bands, and more to predict the next day's stock price for companies listed on the NSE. It helps users make more data-driven decisions in the stock market by providing accurate, visually represented predictions.
        </p>
        <hr className="custom-hr"/><br/>
        <p>
          <span style={{ color: 'rgb(10, 239, 227)' }}>&#9650;</span>
          <strong>Co-engineered</strong> with LSTM MODEL — Long Short-Term Memory (LSTM) is a type of Recurrent Neural Network (RNN) designed to remember patterns over long time sequences. It excels at learning temporal dependencies, making it ideal for forecasting stock price movements based on historical trends.
        </p>
        <hr className="custom-hr"/><br/>
        <p>
          <span style={{ color: 'rgb(10, 239, 227)' }}>&#9650;</span>
          It works with powerful indicators that help investors and traders make informed decisions by identifying trends, momentum shifts, and potential price movements in the market.
        </p>
        <div className="indicators">
          <ul>
            <li>SMA (Simple Moving Average)  Smoothens short-term fluctuations to show price trends</li>
            <li>EMA (Exponential Moving Average)  Responds quickly to recent price changes</li>
            <li>RSI (Relative Strength Index)  Detects overbought or oversold market conditions</li>
            <li>MACD  Identifies trend direction and potential reversals</li>
            <li>OBV (On-Balance Volume)  Confirms price moves using volume analysis</li>
            <li>BB_Width (Bollinger Band Width)  Measures market volatility</li>
          </ul>
          <hr className="custom-hr"/>
        </div><br/>
        <p>
          <span style={{ color: 'rgb(10, 239, 227)' }}>&#9650;</span>
          We serve <strong>animated graphs</strong> showcasing both <strong>Actual</strong> and <strong>Predicted</strong> stock prices, allowing users to understand trends visually and gain clearer insights into market behavior.
        </p>
        <hr className="custom-hr"/><br/>
        
        <a href="/" onClick={handleBackClick} className="back-btn">
          <span className="arrow">&#x25C0;</span> Back to Home
        </a>
      </div>
    </div>
  );
}

export default About;