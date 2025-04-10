import React from 'react';
import VirtualMachines from './VirtualMachines';
import RunTest from './RunTest';
import SharedFolder from './SharedFolder';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      
      {/* VM Component at the top of the page */}
      <VirtualMachines />
      
      <section className="home-content">
        <div className="content-layout">
          {/* Left panel with RunTest component */}
          <div className="left-panel">
            <RunTest />
          </div>
          
          {/* Right panel with SharedFolder component */}
          <div className="right-panel">
            <SharedFolder />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 