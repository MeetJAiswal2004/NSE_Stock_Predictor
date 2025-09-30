// frontend/src/components/PanelToggle.jsx

import React from 'react';

function PanelToggle({ activePanel, onToggle }) {
  return (
    <div className="panel-toggle-container">
      <button 
        className={`toggle-btn ${activePanel === 'details' ? 'active' : ''}`}
        onClick={() => onToggle('details')}
      >
        Stock Info
      </button>
      <button 
        className={`toggle-btn ${activePanel === 'graph' ? 'active' : ''}`}
        onClick={() => onToggle('graph')}
      >
        Graph
      </button>
    </div>
  );
}
export default PanelToggle;