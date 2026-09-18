# Frontend-Backend Integration Guide

This guide explains how to integrate the Fitness Wala 2.0 frontend with the backend API.

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env` file in the frontend root directory:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5001/api

# Optional: JWT Secret (for development only)
REACT_APP_JWT_SECRET=your_jwt_secret_here

# Environment
NODE_ENV=development
```

### 2. Backend Requirements

Make sure your backend server is running on `http://localhost:5001` and has all the required endpoints as documented in `backend_doc.md`.

### 3. Start the Frontend

```bash
npm start
```

## 🔧 API Integration

### Authentication Flow

The frontend now uses real API calls instead of the fake backend. Here's how authentication works:

1. **Registration**: User data is sent to `/api/auth/register`
2. **Login**: Credentials are sent to `/api/auth/login`
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Auto-Auth**: Tokens are automatically included in API requests
5. **Logout**: Tokens are removed from localStorage

### API Service Structure

The new `src/services/api.ts` file contains all API calls:

- **Authentication**: register, login, logout, getCurrentUser
- **User Management**: updateProfile
- **Exercises**: CRUD operations with completion tracking
- **Meals**: CRUD operations with completion tracking
- **Healing Activities**: CRUD operations with completion tracking
- **Communities**: Get communities and posts
- **Challenges**: Join and manage challenges

### Error Handling

The API service includes comprehensive error handling:

- **401 Errors**: Automatic logout and redirect to login
- **Network Errors**: User-friendly error messages
- **Validation Errors**: Displayed via toast notifications

## 📁 Files Changed

### New Files
- `src/services/api.ts` - Real API service replacing fake backend

### Modified Files
- `src/contexts/AuthContext.tsx` - Updated to use real API
- `src/pages/Dashboard/Dashboard.tsx` - Updated to use real API

### Files to Update (if needed)
- `src/pages/Exercises/Exercises.tsx` - Replace fakeBackend with apiService
- `src/pages/Meals/Meals.tsx` - Replace fakeBackend with apiService
- `src/pages/Healing/Healing.tsx` - Replace fakeBackend with apiService
- Any other components using fakeBackend

## 🔄 Migration Steps

### Step 1: Update Imports
Replace all imports from:
```typescript
import { fakeBackend } from '../../services/fakeBackend';
```

To:
```typescript
import { apiService } from '../../services/api';
```

### Step 2: Update API Calls
Replace all function calls from:
```typescript
fakeBackend.someFunction()
```

To:
```typescript
apiService.someFunction()
```

### Step 3: Handle Authentication
The new API service automatically handles:
- Token storage in localStorage
- Token inclusion in requests
- Automatic logout on 401 errors

## 🧪 Testing

### Backend Connection Test
1. Start your backend server
2. Start the frontend
3. Try to register a new user
4. Check browser network tab for API calls
5. Verify data is saved in your database

### Common Issues

**CORS Errors**: Make sure your backend has CORS configured:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Port Configuration**: Ensure your backend is running on port 5001 and frontend is configured to connect to `http://localhost:5001/api`.

**401 Errors**: Check that your JWT tokens are being sent correctly in the Authorization header.

**Network Errors**: Verify your backend is running on the correct port and the API base URL is correct.

## 📊 Data Flow

### Registration Flow
1. User fills registration form
2. Frontend calls `apiService.register(userData)`
3. Backend creates user and returns JWT token
4. Frontend stores token and updates user state
5. User is redirected to dashboard

### Login Flow
1. User enters credentials
2. Frontend calls `apiService.login(credentials)`
3. Backend validates credentials and returns JWT token
4. Frontend stores token and updates user state
5. User is redirected to dashboard

### API Request Flow
1. Frontend makes API call via `apiService`
2. Request interceptor adds JWT token to headers
3. Backend validates token and processes request
4. Response interceptor handles errors
5. Frontend updates UI with response data

## 🔐 Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Tokens are automatically included in all API requests
- 401 errors trigger automatic logout
- All API responses are validated before use

## 🚀 Production Deployment

### Environment Variables
For production, update your `.env` file:
```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
NODE_ENV=production
```

### Build Process
```bash
npm run build
```

The built files will be in the `build` directory and ready for deployment.

## 📞 Support

If you encounter any issues during integration:

1. Check the browser console for errors
2. Verify your backend endpoints match the expected format
3. Ensure CORS is properly configured
4. Check that JWT tokens are being generated correctly
5. Verify database connections and schemas

## 🎯 Next Steps

After successful integration:

1. Test all features thoroughly
2. Add error boundaries for better error handling
3. Implement loading states for better UX
4. Add offline support if needed
5. Set up monitoring and logging
6. Deploy to production environment 