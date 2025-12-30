# 🧪 Testing Phase 2 Features

## Quick Test Guide for Pet Management + Profiles

---

## ⚡ Quick Start

### 1. Make sure everything is running:

**Check Docker services:**
```bash
docker-compose ps
```
All services should be "Up"

**Backend (Terminal 1):**
```bash
cd packages/backend
npm run dev
```
Should see: `✓ Server running on port 3000`

**Frontend (Terminal 2):**
```bash
cd packages/frontend
npm run serve
```
Should see: `Local: http://localhost:5173/`

---

## 🧪 Test Scenarios

### Test 1: Pet Management 🐕

#### Step 1: Login
1. Go to http://localhost:5173/login
2. Login with your existing account

#### Step 2: View My Pets
1. Click "**My Pets**" in the navigation
2. You should see an empty state (no pets yet)

#### Step 3: Add a New Pet
1. Click "**Add New Pet**" button
2. Fill in the form:
   - **Name:** Buddy
   - **Species:** Dog
   - **Breed:** Golden Retriever
   - **Gender:** Male
   - **Age:** 3
   - **Weight:** 30 kg
   - **Size:** Large
   - **Temperament:** Friendly and energetic
   - Check: ✅ Good with kids
   - Check: ✅ Good with dogs
   - **Energy Level:** High
3. Click "**Add Pet**"
4. You should be redirected to "My Pets" page
5. You should see your new pet in the list!

#### Step 4: Edit Pet
1. Click "**Edit**" button on the pet card
2. Change the age to 4
3. Click "**Save Changes**"
4. Verify the age updated

#### Step 5: Add Another Pet
1. Go back to "My Pets"
2. Click "Add New Pet"
3. Add a different pet (cat, bird, etc.)
4. View your pets list - should show 2 pets now

---

### Test 2: User Profile 👤

#### Step 1: View Profile
1. Click "**Profile**" in the navigation
2. You should see your current profile information

#### Step 2: Update Profile
1. Update your **Phone Number:** +1-555-1234
2. Add an address:
   - **Street:** 123 Main St
   - **City:** San Francisco
   - **State:** CA
   - **Zip Code:** 94102
   - **Country:** USA
3. Click "**Save Changes**"
4. You should see "Profile updated successfully!" message

#### Step 3: Change Avatar (Optional)
1. Click "**Change Avatar**" button
2. Enter a URL: `https://via.placeholder.com/150?text=Me`
3. Click "**Update Avatar**"
4. Your avatar should update

---

### Test 3: Business Profile 🏢 (If you're a business user)

#### Step 1: Access Business Page
1. Click "**Business**" in the navigation
2. If you don't have a business profile yet, you'll see "No Business Profile Yet"

#### Step 2: Create Business (First Time)
1. Click "**Create Business Profile**" button
2. Fill in:
   - **Business Name:** Happy Paws Pet Care
   - **Email:** contact@happypaws.com
   - **Phone:** +1-555-PETS
3. Click "**Create Business**"
4. Business profile is created!

#### Step 3: Update Business Info
1. Update the **Description:** "Professional pet care services with 10 years of experience"
2. Update **Business Type:** Company
3. Update **Website:** https://happypaws.com
4. Fill in complete address
5. Click "**Save Changes**"
6. View your business stats

---

## ✅ What to Check

### Pet Management
- ✅ Empty state shows when no pets
- ✅ Can add multiple pets
- ✅ Pet cards display correctly
- ✅ Can edit pet information
- ✅ Form validation works
- ✅ Loading states show
- ✅ Error messages display correctly

### User Profile
- ✅ Profile information displays
- ✅ Can update personal info
- ✅ Can change avatar
- ✅ Success messages show
- ✅ Validation works

### Business Profile
- ✅ Can create business profile
- ✅ Can update business info
- ✅ Stats display correctly
- ✅ Empty state for non-business users

---

## 🔍 Check Backend Logs

You should see logs like:

```
✓ POST /api/v1/pets - 201 Created
✓ GET /api/v1/pets - 200 OK
✓ PUT /api/v1/pets/:id - 200 OK
✓ GET /api/v1/users/me/profile - 200 OK
✓ PUT /api/v1/users/me/profile - 200 OK
```

---

## 🐛 Common Issues

### Issue 1: "Network Error"
**Solution:** Make sure backend is running on port 3000

### Issue 2: "Unauthorized"
**Solution:** Login again, token may have expired

### Issue 3: Pet not showing after creation
**Solution:** Refresh the page, or check backend logs for errors

### Issue 4: Can't create business
**Solution:** Make sure your user type is "business" (you can check in Profile page)

---

## 📱 Test on Mobile (Responsive)

1. Open developer tools (F12)
2. Click mobile device icon
3. Select iPhone or Android device
4. Test all pages - they should be responsive!

---

## 🎯 API Testing (Optional)

You can also test the API directly:

### Get My Pets
```bash
curl -X GET http://localhost:3000/api/v1/pets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Pet
```bash
curl -X POST http://localhost:3000/api/v1/pets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "dog",
    "breed": "Labrador",
    "age": 2
  }'
```

---

## 🎉 Success Criteria

Phase 2 is working if:

✅ You can add multiple pets  
✅ You can edit and view pets  
✅ You can update your profile  
✅ You can manage business profile (if business user)  
✅ All pages load without errors  
✅ Navigation works smoothly  
✅ UI is responsive on mobile  

---

## 📸 What You Should See

### My Pets Page:
- Grid of pet cards
- Pet photos (or placeholders)
- Pet name, breed, age
- Edit and View Details buttons

### Add Pet Page:
- Multi-section form
- Validation feedback
- Character counter
- Success redirect

### Profile Page:
- Your avatar
- Personal information form
- Address fields
- Save button

### Business Page:
- Business logo
- Business stats
- Information form
- Status badges

---

**Happy Testing! 🚀**

If everything works, you're ready for Phase 3! 🎉

