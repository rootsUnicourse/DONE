import React, { useState } from 'react';
import './VirtualMachines.css';

const VirtualMachines = () => {
  // Mock data for VMs - in a real app this would come from an API
  const [vms, setVms] = useState([
    { id: 1, name: 'VM 1', isRunning: false },
    { id: 2, name: 'VM 2', isRunning: false },
    { id: 3, name: 'VM 3', isRunning: false },
    { id: 4, name: 'VM 4', isRunning: false },
  ]);

  const toggleVmStatus = (id) => {
    setVms(vms.map(vm => 
      vm.id === id ? { ...vm, isRunning: !vm.isRunning } : vm
    ));
  };

  return (
    <div className="virtual-machines-container">
      <h2>Virtual Machines</h2>
      <div className="vm-grid">
        {vms.map(vm => (
          <div key={vm.id} className="vm-card">
            <div className={`vm-screen ${vm.isRunning ? 'running' : 'off'}`}>
              {vm.isRunning && (
                <div className="vm-content">
                  <span className="cursor">_</span>
                </div>
              )}
            </div>
            <div className="vm-controls">
              <p className="vm-name">{vm.name}</p>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={vm.isRunning}
                  onChange={() => toggleVmStatus(vm.id)}
                />
                <span className="toggle-slider"></span>
              </label>
              <p className="vm-status">{vm.isRunning ? 'Running' : 'Stopped'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualMachines; 