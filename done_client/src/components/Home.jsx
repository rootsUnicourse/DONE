import React from 'react';
import VirtualMachines from './VirtualMachines';
import RunTest from './RunTest';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Virtual Machine Management</h1>
      </header>
      
      {/* VM Component at the top of the page */}
      <VirtualMachines />
      
      <section className="home-content">
        <div className="content-layout">
          {/* RunTest component in the bottom left */}
          <div className="left-panel">
            <RunTest />
          </div>
          
          <div className="right-panel">
            <div className="home-info-panel">
              <h3>Welcome to the VM Dashboard</h3>
              <p>
                This dashboard allows you to monitor and control your virtual machines.
                Use the toggle switches above to start or stop each VM.
              </p>
              <p>
                The Testing Suite on the left provides various diagnostics and tests
                you can run on the active virtual machines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 