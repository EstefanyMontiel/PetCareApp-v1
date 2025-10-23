# Settings Screen Documentation

## Overview
Complete implementation of a functional settings screen with internationalization (i18n), profile editing, notification management, and password change functionality.

## Features Implemented

### 1. Language Context (Internationalization)
**File:** `src/context/LanguageContext.js`

- Manages app language state (Spanish/English)
- Automatically loads user's language preference from Firestore
- Provides translation function `t(key)` throughout the app
- Saves language preference to Firestore when changed

**Usage:**
```javascript
import { useLanguage } from '../context/LanguageContext';

const { t, language, changeLanguage } = useLanguage();

// Use translations
<Text>{t('settings.title')}</Text>

// Change language
changeLanguage('en'); // or 'es'
```

### 2. Translation Files
**Files:** 
- `src/locales/es.json` - Spanish translations
- `src/locales/en.json` - English translations

Comprehensive translations for:
- Settings screen
- Edit profile screen
- Notifications screen
- Change password screen
- Common UI elements
- Error messages

### 3. Edit Profile Screen
**File:** `src/components/EditProfileScreen.js`

**Features:**
- Edit user name (minimum 3 characters)
- Edit email address (with validation)
- Change profile photo (camera or gallery)
- Upload photos to Firebase Storage
- Update Firebase Auth profile
- Update Firestore user document
- Real-time validation
- Loading states and error handling

**Firebase Structure:**
```javascript
users/{uid} {
  uid: string,
  nombre: string,
  correo: string,
  photoURL: string, // Firebase Storage URL
  updatedAt: timestamp
}
```

### 4. Notifications Screen
**File:** `src/components/NotificationsScreen.js`

**Features:**
- Toggle general notifications on/off
- Toggle vaccine reminders
- Toggle deworming reminders
- Toggle annual exam reminders
- Save preferences to Firestore
- Child toggles disabled when general notifications off

**Firebase Structure:**
```javascript
users/{uid} {
  notifications: {
    enabled: boolean,
    vaccines: boolean,
    deworming: boolean,
    annualExam: boolean
  },
  updatedAt: timestamp
}
```

### 5. Change Password Screen
**File:** `src/components/ChangePasswordScreen.js`

**Features:**
- Requires current password
- New password validation (minimum 6 characters)
- Password confirmation
- Re-authentication before change
- Show/hide password toggles
- Comprehensive error handling

**Validations:**
- Current password must be correct
- New password minimum 6 characters
- New password must differ from current
- Confirmation must match new password

### 6. Updated Settings Screen
**File:** `src/components/SettingScreen.js`

**Features:**
- Dynamic translations based on selected language
- Navigation to edit profile, notifications, and change password
- Inline language toggle (ES/EN)
- Organized sections: Profile, Privacy, About
- Visual language indicator

## Navigation Flow

```
Settings Screen (Main)
├── Edit Profile → EditProfileScreen
├── Notifications → NotificationsScreen  
├── Change Password → ChangePasswordScreen
└── Language Toggle (inline)
```

## Integration

### App.js Updates
1. Import LanguageProvider
2. Wrap NavigationContainer with LanguageProvider
3. Add new screen routes:
   - EditProfile
   - Notifications
   - ChangePassword

```javascript
<AuthProvider>
  <LanguageProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </LanguageProvider>
</AuthProvider>
```

## Validation Rules

### Profile Editing
- Name: Minimum 3 characters
- Email: Valid email format (regex validation)
- Photo: Valid image file from camera/gallery

### Password Change
- Current password: Minimum 6 characters, must be correct
- New password: Minimum 6 characters, must differ from current
- Confirm password: Must match new password

## Error Handling

All screens include comprehensive error handling:
- Firebase Auth errors (wrong-password, requires-recent-login, etc.)
- Firestore errors
- Network errors
- Image upload errors
- Validation errors with specific messages

## Security Considerations

1. **Password Change**: Requires re-authentication before allowing password update
2. **Email Change**: May require re-authentication for sensitive operations
3. **Profile Photos**: Uploaded to Firebase Storage with proper access rules
4. **User Data**: Stored securely in Firestore with proper security rules

## UI/UX Features

- Consistent styling with existing app components
- Responsive design using `scale()` and `verticalScale()`
- Loading states for all async operations
- Success/error alerts with clear messages
- Keyboard handling with KeyboardAvoidingContainer
- Safe area support with SafeContainer
- Icon-based UI with Ionicons
- Shadow effects for visual depth

## Testing

All JavaScript files have been validated:
- ✅ Syntax validation passed
- ✅ JSON translation files validated
- ✅ CodeQL security scan passed (0 vulnerabilities)
- ✅ Import structure verified
- ✅ Firebase integration patterns followed

## Dependencies Used

- React Native core components
- @expo/vector-icons (Ionicons)
- expo-image-picker (photo selection)
- Firebase v8 (Auth, Firestore, Storage)
- React Navigation (screen navigation)

## Future Enhancements

Potential additions:
1. Biometric authentication option
2. Dark mode toggle
3. Notification scheduling/timing preferences
4. Export user data
5. Delete account functionality
6. More language options (French, German, etc.)
7. Profile photo cropping/editing
8. Email verification flow

## Support

For issues or questions:
1. Check Firebase console for user data structure
2. Verify Firebase rules allow read/write operations
3. Check network connectivity
4. Review console logs for detailed error messages
5. Ensure all required permissions are granted (camera, storage)
