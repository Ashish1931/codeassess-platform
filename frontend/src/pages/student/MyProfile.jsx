import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { User, Mail, Phone, Lock, Save, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const MyProfile = () => {
  const { user, setUser } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    subjectPreference: 'Data Structures',
    profilePictureUrl: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        subjectPreference: user.subjectPreference || 'Data Structures',
        profilePictureUrl: user.profilePictureUrl || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoadingProfile(true);

    try {
      const res = await userService.updateProfile(profileData);
      setUser({ ...user, ...res.data });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setLoadingPass(true);

    try {
      const res = await userService.changePassword(passwordData);
      setPasswordMsg({ type: 'success', text: res.data || 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border-indigo-500/30">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-3xl text-white shadow-xl shadow-indigo-500/30">
            {profileData.firstName ? profileData.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition-all">
            <Camera size={14} />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-100">{profileData.firstName} {profileData.lastName}</h2>
          <p className="text-xs text-indigo-400 font-medium">{profileData.email}</p>
          <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 mt-1">
            Student Account
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile Form */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <User size={18} className="text-indigo-400" /> Update Personal Information
          </h3>

          {profileMsg.text && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
              {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                required
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                required
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="form-input opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                required
                maxLength={10}
                value={profileData.mobileNumber}
                onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject Preference</label>
              <select
                value={profileData.subjectPreference}
                onChange={(e) => setProfileData({ ...profileData, subjectPreference: e.target.value })}
                className="form-select"
              >
                <option value="Data Structures">Data Structures</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
                <option value="DBMS">DBMS</option>
                <option value="Operating System">Operating System</option>
                <option value="Computer Networks">Computer Networks</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full btn btn-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Save size={16} />
              {loadingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-200 border-b border-slate-700/60 pb-3 flex items-center gap-2">
            <Lock size={18} className="text-purple-400" /> Security & Change Password
          </h3>

          {passwordMsg.text && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
              {passwordMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPass}
              className="w-full btn btn-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border-purple-500/30 text-purple-300"
            >
              <Lock size={16} />
              {loadingPass ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
