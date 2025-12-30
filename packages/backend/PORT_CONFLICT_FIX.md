# 🔧 Port 3000 Conflict Fix

## ✅ What I Fixed

I've added automatic port cleanup to prevent `EADDRINUSE` errors when nodemon restarts.

### **Changes Made:**

1. **`scripts/kill-port.js`** - Helper script that automatically kills processes on port 3000
2. **`src/server.js`** - Updated to run port cleanup before starting (development only)
3. **`nodemon.json`** - Added 1 second delay to give port time to be released
4. **`kill-port.ps1`** - PowerShell script for manual port cleanup

---

## 🚀 How It Works Now

When you start the backend:
1. **Automatically checks** if port 3000 is in use
2. **Kills any process** using that port
3. **Waits 500ms** for port to be released
4. **Starts the server**

This happens **automatically** - you don't need to do anything!

---

## 🛠️ Manual Fix (If Needed)

If you still get port conflicts, you can manually free the port:

### **Option 1: PowerShell Script**
```powershell
cd packages/backend
.\kill-port.ps1
```

### **Option 2: Manual Commands**
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

### **Option 3: Node Script**
```bash
cd packages/backend
node scripts/kill-port.js
```

---

## 📝 Nodemon Config

The `nodemon.json` file now includes:
- **1 second delay** before restarting (gives port time to be released)
- **Verbose logging** to see what's happening

---

## 🎯 What to Expect

When nodemon restarts:
1. You'll see: `🔄 Killing process X on port 3000...`
2. Then: `✅ Process X killed. Port 3000 is now free.`
3. Then: `🚀 Server running on port 3000`

**No more crashes!** 🎉

---

## ⚠️ If It Still Happens

If you still get port conflicts:
1. **Stop all backend processes** (Ctrl+C in all terminals)
2. **Run the kill script**: `.\kill-port.ps1`
3. **Restart the backend**

---

**The fix is automatic - just restart your backend and it should work!** ✨

