# 🐛 Backend Debugging Guide

## 🎯 Quick Start: Debug in VS Code/Cursor

### **Method 1: VS Code Debugger (Easiest!)** ⭐

#### **Step 1: Open Debug Panel**
- Press `F5` OR
- Click the **Run and Debug** icon in the sidebar (looks like a play button with a bug)
- Or press `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)

#### **Step 2: Select Configuration**
- At the top, you'll see a dropdown
- Select **"Debug Backend (Node.js)"**

#### **Step 3: Set Breakpoints**
1. Open any backend file (e.g., `packages/backend/src/modules/pets/controllers/pet.controller.js`)
2. Click in the **left gutter** (left of line numbers) to add a red dot
3. This is a **breakpoint** - code will pause here

#### **Step 4: Start Debugging**
- Click the **green play button** ▶️ OR press `F5`
- Your backend will start in debug mode
- When code hits your breakpoint, it will **pause**

#### **Step 5: Debug Controls**
When paused, you can:
- **Continue** (`F5`) - Resume execution
- **Step Over** (`F10`) - Execute current line, don't go into functions
- **Step Into** (`F11`) - Go inside function calls
- **Step Out** (`Shift+F11`) - Exit current function
- **Restart** (`Ctrl+Shift+F5`) - Restart debugging
- **Stop** (`Shift+F5`) - Stop debugging

#### **Step 6: Inspect Variables**
- **Hover** over any variable to see its value
- **Variables panel** (left side) shows all variables in scope
- **Watch panel** - Add expressions to watch
- **Debug Console** (bottom) - Run JavaScript code in current context

---

### **Method 2: Chrome DevTools** (Like Frontend!)

#### **Step 1: Start Backend in Debug Mode**
In your terminal:
```bash
cd packages/backend
npm run dev:debug
```

You'll see:
```
Debugger listening on ws://127.0.0.1:9229/...
```

#### **Step 2: Open Chrome DevTools**
1. Open Chrome browser
2. Go to: `chrome://inspect`
3. Click **"Open dedicated DevTools for Node"**

#### **Step 3: Set Breakpoints**
- In Chrome DevTools, go to **Sources** tab
- Navigate to your file (e.g., `packages/backend/src/modules/pets/controllers/pet.controller.js`)
- Click line numbers to set breakpoints

#### **Step 4: Make a Request**
- Make an API call from your frontend
- Code will pause at breakpoints
- Use Chrome DevTools just like frontend debugging!

---

## 🔍 Debugging Tips

### **1. Debug API Requests**

**Set breakpoint in controller:**
```javascript
// packages/backend/src/modules/pets/controllers/pet.controller.js
const createPet = asyncHandler(async (req, res) => {
  // 👈 Set breakpoint here
  const pet = await petService.createPet(req.body, req.user._id);
  apiResponse.success(res, pet, 'Pet created successfully', 201);
});
```

**What you can inspect:**
- `req.body` - Request data
- `req.user` - Authenticated user
- `req.params` - URL parameters
- `req.query` - Query string

### **2. Debug Services**

**Set breakpoint in service:**
```javascript
// packages/backend/src/modules/pets/services/pet.service.js
const createPet = async (petData, ownerId) => {
  // 👈 Set breakpoint here
  const pet = new Pet({
    ...petData,
    ownerId,
  });
  await pet.save();
  return pet;
};
```

**Inspect:**
- `petData` - What data was passed
- `ownerId` - User ID
- `pet` - Created pet object

### **3. Debug Database Queries**

**Set breakpoint before/after database operations:**
```javascript
const getUserPets = async (userId) => {
  // 👈 Set breakpoint here
  const pets = await Pet.find({ ownerId: userId });
  // 👈 Or here to see results
  return pets;
};
```

### **4. Debug Authentication**

**Set breakpoint in auth middleware:**
```javascript
// packages/backend/src/shared/middleware/auth.middleware.js
const protect = asyncHandler(async (req, res, next) => {
  // 👈 Set breakpoint here
  const decoded = jwtService.verifyAccessToken(token);
  // Inspect: decoded, user, token
});
```

---

## 🛠️ Advanced Debugging

### **1. Conditional Breakpoints**

Right-click on a breakpoint → **Edit Breakpoint** → Add condition:
```javascript
userId === "507f1f77bcf86cd799439011"
```

### **2. Logpoints** (No code changes!)

Right-click on a breakpoint → **Add Logpoint**:
```javascript
User ID: {userId}, Pet Data: {JSON.stringify(petData)}
```

### **3. Watch Expressions**

In Watch panel, add:
```javascript
req.user._id
petData.name
```

### **4. Debug Console**

When paused, in Debug Console you can:
```javascript
// Run any JavaScript
console.log(req.body)
JSON.stringify(petData)
req.user.email
```

---

## 📊 Debugging Workflow Example

**Scenario: "Pet creation is failing"**

1. **Set breakpoint** in `pet.controller.js` → `createPet` function
2. **Start debugging** (F5)
3. **Make request** from frontend (add pet)
4. **Code pauses** at breakpoint
5. **Inspect:**
   - `req.body` - Is data correct?
   - `req.user._id` - Is user authenticated?
6. **Step Into** (F11) → Go into `petService.createPet`
7. **Inspect:**
   - `petData` - What's being passed?
   - `ownerId` - Is it correct?
8. **Continue** (F5) → See if error occurs
9. **Check error** in Debug Console or terminal

---

## 🎯 Common Debugging Scenarios

### **Debug 401 Unauthorized**
```javascript
// Set breakpoint in auth.middleware.js
const protect = asyncHandler(async (req, res, next) => {
  // Check: token, decoded, user
});
```

### **Debug 400 Validation Error**
```javascript
// Set breakpoint in validator
const validateCreatePet = validateRequest(createPetSchema);
// Check: req.body, error.details
```

### **Debug 500 Server Error**
```javascript
// Set breakpoint in errorHandler.js
// Check: err, err.stack, req.path
```

### **Debug Database Issues**
```javascript
// Set breakpoint before/after query
const pets = await Pet.find({ ownerId: userId });
// Check: pets, userId
```

---

## 🔧 VS Code Debug Settings

The `.vscode/launch.json` file includes:

1. **Debug Backend (Node.js)** - Full debugging with breakpoints
2. **Attach to Backend** - Attach to already running process

---

## 💡 Pro Tips

1. **Use `console.log()` for quick debugging:**
   ```javascript
   console.log('🔍 Debug:', { petData, ownerId });
   ```

2. **Use `debugger;` statement:**
   ```javascript
   const createPet = async (petData, ownerId) => {
     debugger; // 👈 Code pauses here automatically
     const pet = new Pet({ ...petData, ownerId });
   };
   ```

3. **Check terminal logs:**
   - Backend logs show in terminal
   - Look for error messages
   - Check request/response logs

4. **Use Postman/Thunder Client:**
   - Test API endpoints directly
   - See request/response
   - No frontend needed

5. **Network tab in browser:**
   - See API requests
   - Check request payload
   - See response data

---

## 🚀 Quick Reference

| Action | Shortcut |
|--------|----------|
| Start Debugging | `F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Continue | `F5` |
| Restart | `Ctrl+Shift+F5` |
| Stop | `Shift+F5` |
| Toggle Breakpoint | `F9` |

---

## 📝 Example: Debug Pet Creation

1. **Open:** `packages/backend/src/modules/pets/controllers/pet.controller.js`
2. **Set breakpoint** on line 11 (inside `createPet`)
3. **Press F5** to start debugging
4. **Go to frontend:** http://localhost:5174/pets/add
5. **Fill form and submit**
6. **Code pauses** at breakpoint
7. **Inspect:**
   - Hover over `req.body` → See pet data
   - Hover over `req.user._id` → See user ID
8. **Press F11** (Step Into) → Go into service
9. **Continue debugging** step by step!

---

**Happy Debugging! 🐛✨**

