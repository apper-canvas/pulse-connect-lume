import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bio');
  const [saving, setSaving] = useState(false);
  
  // Bio editor state
  const [bioData, setBioData] = useState({
    bio: '',
    website: '',
    location: '',
    displayName: ''
  });
  const [bioLoading, setBioLoading] = useState(false);
  
  // Avatar editor state
  const [avatarData, setAvatarData] = useState({
    currentAvatar: '',
    selectedPreset: ''
  });
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setBioData({
        bio: userData?.bio || '',
        website: userData?.website || '',
        location: userData?.location || '',
        displayName: userData?.displayName || ''
      });
      setAvatarData({
        currentAvatar: userData?.avatar || '',
        selectedPreset: ''
      });
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleBioSave = async () => {
    try {
      setBioLoading(true);
      
      // Validation
      if (bioData.bio.length > 160) {
        toast.error('Bio must be 160 characters or less');
        return;
      }
      
      if (bioData.displayName.trim().length < 2) {
        toast.error('Display name must be at least 2 characters');
        return;
      }

      const updatedUser = await userService.updateBio(user.id, bioData);
      setUser(updatedUser);
      toast.success('Bio updated successfully!');
    } catch (error) {
      toast.error('Failed to update bio');
    } finally {
      setBioLoading(false);
    }
  };

  const handleAvatarSave = async () => {
    try {
      setAvatarLoading(true);
      
      const avatarUrl = avatarData.selectedPreset || avatarData.currentAvatar;
      if (!avatarUrl) {
        toast.error('Please select an avatar');
        return;
      }

      const updatedUser = await userService.updateAvatar(user.id, avatarUrl);
      setUser(updatedUser);
      setAvatarData(prev => ({
        ...prev,
        currentAvatar: avatarUrl,
        selectedPreset: ''
      }));
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset the input value to allow re-selecting the same file
    event.target.value = '';

    try {
      setUploadingAvatar(true);
      
      // Create object URL for immediate preview
      const previewUrl = URL.createObjectURL(file);
      
      // Clean up previous object URL to prevent memory leaks
      if (avatarData.selectedPreset && avatarData.selectedPreset.startsWith('blob:')) {
        URL.revokeObjectURL(avatarData.selectedPreset);
      }
      
      // Update avatar through service layer (handles validation and conversion)
      const updatedUser = await userService.updateAvatar(user.id, file);
      
      // Update user state and avatar preview
      setUser(updatedUser);
      setAvatarData(prev => ({
        ...prev,
        currentAvatar: updatedUser.avatar,
        selectedPreset: updatedUser.avatar
      }));
      
      // Clean up the preview URL since we now have the persistent URL
      URL.revokeObjectURL(previewUrl);
      
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-1/4 mb-6" />
            <div className="bg-surface rounded-xl border border-surface-200 p-6">
              <div className="h-6 bg-surface-200 rounded w-1/3 mb-4" />
              <div className="space-y-4">
                <div className="h-12 bg-surface-200 rounded" />
                <div className="h-12 bg-surface-200 rounded" />
                <div className="h-24 bg-surface-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-2xl font-display font-bold text-surface-900">Settings</h1>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl border border-surface-200 mb-6 overflow-hidden"
        >
          <div className="flex border-b border-surface-200">
            {[
              { id: 'bio', label: 'Edit Bio', icon: 'FileText' },
              { id: 'avatar', label: 'Avatar', icon: 'User' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'bio' && (
            <div className="bg-surface rounded-xl border border-surface-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-2">Edit Your Bio</h2>
                <p className="text-surface-600">Update your profile information and bio</p>
              </div>

              <div className="space-y-6">
                <Input
                  label="Display Name"
                  value={bioData.displayName}
                  onChange={(e) => setBioData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Your display name"
                  error={bioData.displayName.trim().length > 0 && bioData.displayName.trim().length < 2 ? 'Display name must be at least 2 characters' : ''}
                />
<div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Bio {bioData.bio.length > 0 && (
                      <span className={`text-xs ${bioData.bio.length > 160 ? 'text-error' : 'text-surface-500'}`}>
                        {bioData.bio.length}/160
                      </span>
                    )}
                  </label>
                  <textarea
                    value={bioData.bio}
                    onChange={(e) => setBioData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    className={`w-full px-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                      bioData.bio.length > 160 
                        ? 'border-error focus:border-error focus:ring-error/20' 
                        : 'border-surface-300 hover:border-surface-400'
                    }`}
                    rows={4}
                    maxLength={200}
                    onFocus={() => {}}
                  />
                  {bioData.bio.length > 160 && (
                    <p className="mt-1 text-sm text-error">Bio must be 160 characters or less</p>
                  )}
                </div>

                <Input
                  label="Website"
                  type="url"
                  value={bioData.website}
                  onChange={(e) => setBioData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://your-website.com"
                  icon="Link"
                />

                <Input
                  label="Location"
                  value={bioData.location}
                  onChange={(e) => setBioData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  icon="MapPin"
                />

                <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
                  <Button
                    variant="secondary"
                    onClick={loadUserData}
                    disabled={bioLoading}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBioSave}
                    disabled={bioLoading || bioData.bio.length > 160 || bioData.displayName.trim().length < 2}
                    loading={bioLoading}
                  >
                    {bioLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="bg-surface rounded-xl border border-surface-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-2">Customize Avatar</h2>
                <p className="text-surface-600">Choose or upload a new profile picture</p>
              </div>

              <div className="space-y-8">
                {/* Current Avatar */}
                <div className="text-center">
                  <div className="mb-4">
                    <Avatar
                      src={avatarData.selectedPreset || avatarData.currentAvatar}
                      alt="Current avatar"
                      size="3xl"
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-surface-600">Current Avatar</p>
                </div>

                {/* Upload Section */}
                <div className="border-2 border-dashed border-surface-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <div className="mb-4">
                    <ApperIcon name="Upload" className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-surface-900 mb-2">Upload Custom Avatar</h3>
                    <p className="text-surface-600 text-sm mb-4">
                      Choose a photo from your device. Max file size: 5MB
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploadingAvatar}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      as="span"
                      variant="outline"
                      disabled={uploadingAvatar}
                      loading={uploadingAvatar}
                    >
                      {uploadingAvatar ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </label>
                </div>

                {/* Preset Avatars */}
                <div>
                  <h3 className="text-lg font-medium text-surface-900 mb-4">Choose from Presets</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {presetAvatars.map((avatar, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAvatarData(prev => ({ ...prev, selectedPreset: avatar }))}
                        className={`relative rounded-full overflow-hidden border-4 transition-all ${
                          avatarData.selectedPreset === avatar
                            ? 'border-primary shadow-lg'
                            : 'border-transparent hover:border-surface-300'
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Preset avatar ${index + 1}`}
                          className="w-16 h-16 object-cover"
                        />
                        {avatarData.selectedPreset === avatar && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <ApperIcon name="Check" className="w-6 h-6 text-primary" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
                  <Button
                    variant="secondary"
                    onClick={() => setAvatarData(prev => ({ ...prev, selectedPreset: '' }))}
                    disabled={avatarLoading}
                  >
                    Clear Selection
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAvatarSave}
                    disabled={avatarLoading || (!avatarData.selectedPreset && !avatarData.currentAvatar)}
                    loading={avatarLoading}
                  >
                    {avatarLoading ? 'Saving...' : 'Save Avatar'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;