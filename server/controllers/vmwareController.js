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
    
    // Command to start a VM using VMware
    const command = `& "${VMWARE_PATHS.vmrun}" start "${vmxPath}"`;
    
    executeVMwareCommand(command, (error, result) => {
      if (error) {
        return res.status(500).json({ 
          error: 'Failed to start VM',
          details: error.message
        });
      }
      
      res.json({ 
        message: `VM '${vmName}' started successfully`,
        result
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
    
    // Command to stop a VM using VMware
    const command = `& "${VMWARE_PATHS.vmrun}" stop "${vmxPath}"`;
    
    executeVMwareCommand(command, (error, result) => {
      if (error) {
        return res.status(500).json({ 
          error: 'Failed to stop VM',
          details: error.message
        });
      }
      
      res.json({ 
        message: `VM '${vmName}' stopped successfully`,
        result
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