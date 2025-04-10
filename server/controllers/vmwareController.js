const { exec } = require('child_process');

// VMware configuration - MODIFY THESE PATHS FOR YOUR SYSTEM
const VMWARE_PATHS = {
  // Change this to your VMware executable path
  vmrun: "C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe",
  // Map VM names to their .vmx file paths
  vms: {
    "DoneVmCrowdStrike": "C:\\Users\\danel\\Documents\\Virtual Machines\\DoneVmCrowdStrike\\DoneVmCrowdStrike.vmx",
    // Add other VMs here
  }
};

// VM state constants
const VM_STATES = {
  RUNNING: 'running',
  STOPPED: 'stopped',
  SUSPENDED: 'suspended'
};

// Helper function to execute VMware commands
const executeVMwareCommand = (command, callback) => {
  console.log(`Executing VMware command: ${command}`);
  
  // Execute the PowerShell command
  exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }
    console.log(`Command stdout: ${stdout}`);
    callback(null, stdout);
  });
};

// Controller methods
const vmwareController = {
  // Start a VM
  startVM: (req, res) => {
    const { vmName } = req.body;
    
    if (!vmName) {
      return res.status(400).json({ error: 'VM name is required' });
    }
    
    // Get the VMX file path for the requested VM
    const vmxPath = VMWARE_PATHS.vms[vmName];
    if (!vmxPath) {
      return res.status(404).json({ error: `VM '${vmName}' not found. Add it to the VMWARE_PATHS configuration.` });
    }

    // First check if the VM is already running
    const checkCommand = `& "${VMWARE_PATHS.vmrun}" list`;
    
    executeVMwareCommand(checkCommand, (checkError, checkResult) => {
      if (checkError) {
        return res.status(500).json({ 
          error: 'Failed to check VM status',
          details: checkError.message
        });
      }
      
      const isRunning = checkResult.includes(vmxPath);
      
      if (isRunning) {
        // VM is already running, just return success
        return res.json({ 
          message: `VM '${vmName}' is already running`,
          result: "VM is already powered on"
        });
      }
      
      // VM is not running, start it with GUI mode
      // This will automatically handle suspended VMs properly
      const startCommand = `& "${VMWARE_PATHS.vmrun}" start "${vmxPath}" gui`;
      
      executeVMwareCommand(startCommand, (startError, startResult) => {
        if (startError) {
          return res.status(500).json({ 
            error: 'Failed to start VM',
            details: startError.message
          });
        }
        
        res.json({ 
          message: `VM '${vmName}' started successfully`,
          result: startResult
        });
      });
    });
  },

  // Stop a VM
  stopVM: (req, res) => {
    const { vmName } = req.body;
    
    if (!vmName) {
      return res.status(400).json({ error: 'VM name is required' });
    }
    
    // Get the VMX file path for the requested VM
    const vmxPath = VMWARE_PATHS.vms[vmName];
    if (!vmxPath) {
      return res.status(404).json({ error: `VM '${vmName}' not found. Add it to the VMWARE_PATHS configuration.` });
    }
    
    // Check if the VM is running first
    const checkCommand = `& "${VMWARE_PATHS.vmrun}" list`;
    
    executeVMwareCommand(checkCommand, (checkError, checkResult) => {
      if (checkError) {
        return res.status(500).json({ 
          error: 'Failed to check VM status',
          details: checkError.message
        });
      }
      
      const isRunning = checkResult.includes(vmxPath);
      
      if (!isRunning) {
        // VM is already stopped
        return res.json({ 
          message: `VM '${vmName}' is already stopped`,
          result: "VM is not running"
        });
      }
      
      // Use poweroff command without any parameters
      console.log(`Powering off VM: ${vmName}`);
      const poweroffCommand = `& "${VMWARE_PATHS.vmrun}" poweroff "${vmxPath}"`;
      
      executeVMwareCommand(poweroffCommand, (poweroffError, poweroffResult) => {
        if (poweroffError) {
          return res.status(500).json({ 
            error: 'Failed to power off VM',
            details: poweroffError.message
          });
        }
        
        res.json({ 
          message: `VM '${vmName}' powered off successfully`,
          result: poweroffResult
        });
      });
    });
  },

  // Get VM status
  getVMStatus: (req, res) => {
    const { vmName } = req.query;
    
    if (!vmName) {
      return res.status(400).json({ error: 'VM name is required' });
    }
    
    // Command to check VM status
    const command = `& "${VMWARE_PATHS.vmrun}" list`;
    
    executeVMwareCommand(command, (error, result) => {
      if (error) {
        return res.status(500).json({ 
          error: 'Failed to check VM status',
          details: error.message
        });
      }
      
      // When vmrun list is run, it returns a list of running VMs with their full paths
      // We need to check if any of the paths contain our VM name
      const isRunning = VMWARE_PATHS.vms[vmName] && result.includes(VMWARE_PATHS.vms[vmName]);
      
      res.json({ 
        vmName,
        isRunning,
        status: isRunning ? 'running' : 'stopped',
        allVMs: result
      });
    });
  },

  // Get all VMs
  getAllVMs: (req, res) => {
    // Format the VMs in a way that's useful for the client
    const vms = Object.keys(VMWARE_PATHS.vms).map(name => ({
      name,
      path: VMWARE_PATHS.vms[name]
    }));
    
    res.json(vms);
  }
};

module.exports = vmwareController; 