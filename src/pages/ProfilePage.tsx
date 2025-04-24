import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, Save, KeyRound, AlertCircle, Sun, Moon, Laptop } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { UserMetadata, UserSettings } from '../types/user';
import UserAvatar from '../components/UserAvatar';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata.full_name || '');
      setAvatarUrl(user.user_metadata.avatar_url || '');
    } else if (!loading) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle profile image upload
  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error('File must be an image (JPG, PNG, or GIF)');
      }
      
      const fileExt = file.name.split('.').pop();
      // Create a path with user ID as folder name for proper access control
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;

      console.log('Uploaded image URL:', publicUrl);
      
      // Update user metadata
      const success = await updateProfile({ avatar_url: publicUrl });
      
      if (success) {
        // Small delay to ensure Supabase processes the update completely
        setTimeout(() => {
          setAvatarUrl(publicUrl);
          
          // Refresh user session to get updated metadata
          supabase.auth.refreshSession().then(() => {
            console.log('Session refreshed with new avatar');
          });
          
          toast.success('Profile picture updated');
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Update user profile (name, avatar, settings)
  const updateProfile = async (metadata: Partial<UserMetadata>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Update user settings
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    // Get current settings
    const currentSettings = (user?.user_metadata.settings || {}) as UserSettings;
    
    // Merge with new settings
    const updatedSettings = {
      ...currentSettings,
      ...settings
    };
    
    // Update metadata
    const success = await updateProfile({
      settings: updatedSettings
    });
    
    return success;
  };

  // Handle theme change
  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    const success = await updateUserSettings({ theme: newTheme });
    if (success) {
      toast.success('Theme preference saved');
    }
  };

  // Handle name update
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (fullName.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }
    
    const success = await updateProfile({ full_name: fullName });
    if (success) {
      toast.success('Name updated successfully');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error('Current password is incorrect');
        return;
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Not authenticated or loading
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
            <User size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Your Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and profile information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 text-center">
              <div className="mb-6 flex flex-col items-center">
                <div className="relative group">
                  <UserAvatar 
                    userId={user?.id || ''}
                    avatarUrl={avatarUrl}
                    fullName={fullName}
                    size="xl"
                    className="border-4 border-primary-100"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <button 
                      onClick={handleUploadClick}
                      className="text-white p-2 rounded-full bg-primary-500 hover:bg-primary-600 transition"
                      disabled={uploading}
                    >
                      <Upload size={20} />
                    </button>
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={uploadProfileImage}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleUploadClick}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Change Profile Picture</span>
                    </>
                  )}
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: JPG, PNG. Max size: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              
              <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    className="input-field bg-gray-50"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email address cannot be changed
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </form>
            </div>

            {/* Theme Preferences */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Theme Preferences
              </h2>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-lg border ${
                    theme === 'light' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } flex flex-col items-center gap-2 transition`}
                >
                  <Sun size={24} />
                  <span className="text-sm font-medium">Light</span>
                </button>
                
                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } flex flex-col items-center gap-2 transition`}
                >
                  <Moon size={24} />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                
                <button 
                  onClick={() => handleThemeChange('system')}
                  className={`p-4 rounded-lg border ${
                    theme === 'system' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  } flex flex-col items-center gap-2 transition`}
                >
                  <Laptop size={24} />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Choose your preferred theme for the application.
              </p>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h2>
              
              {user.app_metadata.provider === 'email' ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input-field ${confirmPassword && newPassword !== confirmPassword ? 'border-error-500 ring-error-500' : ''}`}
                      placeholder="Confirm new password"
                      required
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="mt-1 text-xs text-error-600 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Passwords do not match
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-outline flex items-center gap-2"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <KeyRound size={18} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <AlertCircle size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Password management is not available for accounts created with Google authentication.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage; 