import React, { useState, useEffect } from 'react';
import './VirtualMachines.css';

const API_URL = 'http://localhost:3001/api';

const VirtualMachines = () => {
  // Mock data for VMs - in a real app this would come from an API
  const [vms, setVms] = useState([
    { id: 1, name: 'DoneVmCrowdStrike', isRunning: false },
    { id: 2, name: 'VM 2', isRunning: false },
    { id: 3, name: 'VM 3', isRunning: false },
    { id: 4, name: 'VM 4', isRunning: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check VM status on load
  useEffect(() => {
    checkVmStatus(1);
  }, []);

  const checkVmStatus = async (id) => {
    const vm = vms.find(vm => vm.id === id);
    if (!vm) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vmware/status?vmName=${vm.name}`);
      if (!response.ok) throw new Error('Failed to check VM status');
      
      const data = await response.json();
      
      setVms(vms.map(vm => 
        vm.id === id ? { ...vm, isRunning: data.isRunning } : vm
      ));
      setError(null);
    } catch (err) {
      console.error('Error checking VM status:', err);
      setError(`Failed to check VM status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startVMwareVM = async (vmName) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vmware/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vmName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start VM');
      }
      
      const data = await response.json();
      console.log(data.message);
      setError(null);
      return true;
    } catch (error) {
      console.error('Failed to start VM:', error);
      setError(`Failed to start VM: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const stopVMwareVM = async (vmName) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vmware/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vmName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to stop VM');
      }
      
      const data = await response.json();
      console.log(data.message);
      setError(null);
      return true;
    } catch (error) {
      console.error('Failed to stop VM:', error);
      setError(`Failed to stop VM: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleVmStatus = async (id) => {
    const vm = vms.find(vm => vm.id === id);
    
    // For VM 1 (DoneVmCrowdStrike), actually try to start/stop the real VMware VM
    if (id === 1) {
      let success;
      
      if (!vm.isRunning) {
        success = await startVMwareVM(vm.name);
      } else {
        success = await stopVMwareVM(vm.name);
      }
      
      if (success) {
        setVms(vms.map(vm => 
          vm.id === id ? { ...vm, isRunning: !vm.isRunning } : vm
        ));
      }
    } else {
      // For other VMs, just toggle the UI state
      setVms(vms.map(vm => 
        vm.id === id ? { ...vm, isRunning: !vm.isRunning } : vm
      ));
    }
  };

  return (
    <div className="virtual-machines-container">
      <h2>Virtual Machines</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-indicator">Processing...</div>}
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
                  disabled={loading}
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