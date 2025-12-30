/**
 * Helper script to kill process on port 3000
 * Used before starting the server to avoid EADDRINUSE errors
 */

const { exec } = require('child_process');
const isWindows = process.platform === 'win32';
const PORT = process.env.PORT || 3000;

function killPort(port) {
  return new Promise((resolve, reject) => {
    if (isWindows) {
      // Windows: Find process using port and kill it
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (err || !stdout || !stdout.trim()) {
          // Port is free, nothing to kill
          resolve();
          return;
        }

        // Parse output - look for LISTENING lines
        const lines = stdout.trim().split(/\r?\n/).filter(line => 
          line.includes('LISTENING') && line.includes(`:${port}`)
        );
        
        if (lines.length === 0) {
          resolve();
          return;
        }

        // Extract PID - it's the last number in the line
        const pids = new Set();
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && /^\d+$/.test(pid)) {
            pids.add(pid);
          }
        });

        if (pids.size === 0) {
          resolve();
          return;
        }

        // Kill all processes
        const pidArray = Array.from(pids);
        console.log(`🔄 Killing process(es) ${pidArray.join(', ')} on port ${port}...`);
        
        let killedCount = 0;
        const totalPids = pidArray.length;
        
        pidArray.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (killErr, killStdout) => {
            if (killErr) {
              // Process might already be dead, that's okay
              console.log(`⚠️  Process ${pid} not found or already terminated.`);
            } else {
              console.log(`✅ Process ${pid} killed.`);
            }
            
            killedCount++;
            if (killedCount === totalPids) {
              // Wait a bit for port to be released
              setTimeout(() => {
                console.log(`✅ Port ${port} should now be free.`);
                resolve();
              }, 1000);
            }
          });
        });
      });
    } else {
      // Unix/Linux/Mac: Use lsof
      exec(`lsof -ti:${port}`, (err, stdout) => {
        if (err || !stdout) {
          // Port is free
          resolve();
          return;
        }

        const pids = stdout.trim().split('\n');
        console.log(`🔄 Killing processes on port ${port}: ${pids.join(', ')}...`);
        
        exec(`kill -9 ${pids.join(' ')}`, (killErr) => {
          if (killErr) {
            console.log(`⚠️  Could not kill processes. Port may still be in use.`);
            resolve();
          } else {
            console.log(`✅ Processes killed. Port ${port} is now free.`);
            setTimeout(resolve, 500);
          }
        });
      });
    }
  });
}

// Run if called directly
if (require.main === module) {
  killPort(PORT)
    .then(() => {
      console.log('✅ Port check complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

module.exports = killPort;

