import React, { useState, useEffect } from 'react';
import { auth, database, ref, set, onValue } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useVoiceNotification } from '../GameRoom/hooks/useVoiceNotification';

import ProfileSidebar from './ProfileSidebar';
import BasicInfo from './BasicInfo';
import VoiceSettings from './VoiceSettings';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [avatarURL, setAvatarURL] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Voice notification settings
    const [sentTemplate, setSentTemplate] = useState('Đã chuyển {amount} {currency}');
    const [receivedTemplate, setReceivedTemplate] = useState('Đã nhận {amount} {currency}');
    const [testSender, setTestSender] = useState('Người gửi');
    const [testReceiver, setTestReceiver] = useState('Người nhận');

    const { announceMoneySent, announceMoneyReceived } = useVoiceNotification();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = ref(database, 'users/' + currentUser.uid);
                const unsubscribeDB = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setName(data.name || '');
                        setAvatarURL(data.avatarURL || '');

                        // Load voice settings
                        if (data.voiceSettings) {
                            setSentTemplate(data.voiceSettings.sentTemplate || 'Đã chuyển {amount} {currency}');
                            setReceivedTemplate(data.voiceSettings.receivedTemplate || 'Đã nhận {amount} {currency}');
                            setTestSender(data.voiceSettings.testSender || 'Người gửi');
                            setTestReceiver(data.voiceSettings.testReceiver || 'Người nhận');
                        }
                    }
                    setLoading(false);
                }, (dbError) => {
                    console.error("Error fetching user data:", dbError);
                    setError("Failed to load profile data.");
                    setLoading(false);
                });
                return () => unsubscribeDB();
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        if (user) {
            try {
                await set(ref(database, 'users/' + user.uid), {
                    name: name,
                    avatarURL: avatarURL,
                    voiceSettings: {
                        sentTemplate: sentTemplate,
                        receivedTemplate: receivedTemplate,
                        testSender: testSender,
                        testReceiver: testReceiver
                    }
                });
                setSuccessMsg('Profile updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } catch (saveError) {
                console.error("Error saving profile:", saveError);
                setError("Failed to save profile.");
            }
        }
    };

    const handleTestSent = () => {
        announceMoneySent(50000, '₫', {
            template: sentTemplate,
            sender: testSender,
            receiver: testReceiver
        });
    };

    const handleTestReceived = () => {
        announceMoneyReceived(100000, '₫', {
            template: receivedTemplate,
            sender: testSender,
            receiver: testReceiver
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-cyan-500 font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="animate-pulse">LOADING PROFILE...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
                <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-xl backdrop-blur-xl max-w-md w-full text-center">
                    <h3 className="text-xl font-bold mb-2">ACCESS DENIED</h3>
                    <p>Please log in to view your profile.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#0a0a0f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-black text-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">

                            {/* Left Column: Avatar & Info */}
                            <ProfileSidebar
                                user={user}
                                name={name}
                                avatarURL={avatarURL}
                            />

                            {/* Right Column: Form */}
                            <div className="w-full md:w-2/3">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit Profile
                                </h3>

                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-3">
                                            <span>⚠️</span> {error}
                                        </div>
                                    )}

                                    {successMsg && (
                                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-3">
                                            <span>✅</span> {successMsg}
                                        </div>
                                    )}

                                    <BasicInfo
                                        name={name}
                                        setName={setName}
                                        avatarURL={avatarURL}
                                        setAvatarURL={setAvatarURL}
                                    />

                                    {/* Voice Notification Settings */}
                                    <VoiceSettings
                                        sentTemplate={sentTemplate}
                                        setSentTemplate={setSentTemplate}
                                        receivedTemplate={receivedTemplate}
                                        setReceivedTemplate={setReceivedTemplate}
                                        testSender={testSender}
                                        setTestSender={setTestSender}
                                        testReceiver={testReceiver}
                                        setTestReceiver={setTestReceiver}
                                        handleTestSent={handleTestSent}
                                        handleTestReceived={handleTestReceived}
                                    />

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02]"
                                        >
                                            SAVE CHANGES
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
