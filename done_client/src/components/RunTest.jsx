import React, { useState } from 'react';
import './RunTest.css';

const RunTest = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    scanNetwork: false,
    checkSecurity: false,
    testPerformance: false,
    runDiagnostics: false
  });
  
  const [isRunning, setIsRunning] = useState(false);

  const handleOptionChange = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [option]: !selectedOptions[option]
    });
  };

  const handleRunTest = () => {
    // Check if at least one option is selected
    const hasSelectedOption = Object.values(selectedOptions).some(value => value);
    
    if (!hasSelectedOption) {
      alert('Please select at least one test option');
      return;
    }
    
    setIsRunning(true);
    
    // Simulate test running
    setTimeout(() => {
      setIsRunning(false);
      alert('Tests completed successfully!');
    }, 3000);
  };

  return (
    <div className="run-test-container">
      <h3>VM Testing Suite</h3>
      
      <div className="test-options">
        <div className="option-item">
          <input 
            type="checkbox" 
            id="scanNetwork" 
            checked={selectedOptions.scanNetwork}
            onChange={() => handleOptionChange('scanNetwork')}
            disabled={isRunning}
          />
          <label htmlFor="scanNetwork">Network Scan</label>
        </div>
        
        <div className="option-item">
          <input 
            type="checkbox" 
            id="checkSecurity" 
            checked={selectedOptions.checkSecurity}
            onChange={() => handleOptionChange('checkSecurity')}
            disabled={isRunning}
          />
          <label htmlFor="checkSecurity">Security Check</label>
        </div>
        
        <div className="option-item">
          <input 
            type="checkbox" 
            id="testPerformance" 
            checked={selectedOptions.testPerformance}
            onChange={() => handleOptionChange('testPerformance')}
            disabled={isRunning}
          />
          <label htmlFor="testPerformance">Performance Test</label>
        </div>
        
        <div className="option-item">
          <input 
            type="checkbox" 
            id="runDiagnostics" 
            checked={selectedOptions.runDiagnostics}
            onChange={() => handleOptionChange('runDiagnostics')}
            disabled={isRunning}
          />
          <label htmlFor="runDiagnostics">Run Diagnostics</label>
        </div>
      </div>
      
      <button 
        className={`run-test-button ${isRunning ? 'running' : ''}`}
        onClick={handleRunTest}
        disabled={isRunning}
      >
        {isRunning ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      {isRunning && (
        <div className="test-progress">
          <div className="progress-indicator"></div>
        </div>
      )}
    </div>
  );
};

export default RunTest; 