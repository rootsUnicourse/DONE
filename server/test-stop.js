// Test script to manually invoke VMware stop command
const { exec } = require('child_process');

// VMware executable path
const vmrunPath = "C:\\Program Files (x86)\\VMware\\VMware Workstation\\vmrun.exe";
// VM .vmx file path
const vmxPath = "C:\\Users\\danel\\Documents\\Virtual Machines\\DoneVmCrowdStrike\\DoneVmCrowdStrike.vmx";

console.log("Testing VMware stop command...");
console.log(`VM path: ${vmxPath}`);

// First check if VM is running
const checkCommand = `& "${vmrunPath}" list`;
exec(checkCommand, { shell: 'powershell.exe' }, (checkError, checkStdout, checkStderr) => {
  console.log("Checking if VM is running...");
  
  if (checkError) {
    console.error(`Error checking VM status: ${checkError.message}`);
    return;
  }
  
  if (checkStderr) {
    console.error(`Check stderr: ${checkStderr}`);
  }
  
  console.log(`Running VMs:\n${checkStdout}`);
  
  const isRunning = checkStdout.includes(vmxPath);
  console.log(`VM is running: ${isRunning}`);
  
  if (!isRunning) {
    console.log("VM is not running. No need to stop.");
    return;
  }
  
  // Try to stop the VM with hard parameter
  console.log("Attempting to stop VM with hard parameter...");
  const stopCommand = `& "${vmrunPath}" stop "${vmxPath}" hard`;
  
  exec(stopCommand, { shell: 'powershell.exe' }, (stopError, stopStdout, stopStderr) => {
    if (stopError) {
      console.error(`Error stopping VM: ${stopError.message}`);
      
      // If that fails, try PowerOff
      console.log("Hard stop failed. Trying poweroff...");
      const powerOffCommand = `& "${vmrunPath}" poweroff "${vmxPath}" hard`;
      
      exec(powerOffCommand, { shell: 'powershell.exe' }, (powerError, powerStdout, powerStderr) => {
        if (powerError) {
          console.error(`Error powering off VM: ${powerError.message}`);
          return;
        }
        
        console.log("VM powered off successfully.");
        if (powerStdout) console.log(`Power off stdout: ${powerStdout}`);
        if (powerStderr) console.log(`Power off stderr: ${powerStderr}`);
      });
      
      return;
    }
    
    console.log("VM stopped successfully.");
    if (stopStdout) console.log(`Stop stdout: ${stopStdout}`);
    if (stopStderr) console.log(`Stop stderr: ${stopStderr}`);
  });
}); 