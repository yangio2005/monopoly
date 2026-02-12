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
        <div className="min-h-screen bg-[#050505] text-[#aaa] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-retro">
            <div className="max-w-4xl mx-auto">
                {/* Main Retro Terminal Frame */}
                <div className="relative bg-[#0a0a0a] border-[4px] border-[#333] shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden">

                    {/* Header Bar */}
                    <div className="h-10 bg-[#1a1a1a] border-b-[2px] border-[#333] flex items-center justify-between px-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-[#ff4d4d] border border-black/20"></div>
                            <div className="w-3 h-3 bg-[#ffcc00] border border-black/20"></div>
                            <div className="w-3 h-3 bg-[#40ffcc] border border-black/20"></div>
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-[#555]">USER_PROFILE_SYSTEM_V4.0</span>
                    </div>

                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row gap-12 items-start">

                            {/* Left Column: Avatar & Info */}
                            <ProfileSidebar
                                user={user}
                                name={name}
                                avatarURL={avatarURL}
                            />

                            {/* Right Column: Form */}
                            <div className="w-full md:w-2/3 space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-[18px] font-black text-[#ffcc00] uppercase tracking-wider italic">
                                        EDIT_IDENTITY
                                    </h3>
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-[#ffcc00]/50 to-transparent"></div>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-8">
                                    {error && (
                                        <div className="p-4 bg-red-950/20 border-l-[4px] border-red-600 text-red-500 text-xs font-black uppercase animate-pulse">
                                            [!] ERROR: {error}
                                        </div>
                                    )}

                                    {successMsg && (
                                        <div className="p-4 bg-cyan-950/20 border-l-[4px] border-[#40ffcc] text-[#40ffcc] text-xs font-black uppercase">
                                            [+] STATUS: {successMsg}
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

                                    <div className="pt-6 border-t border-[#222]">
                                        <button
                                            type="submit"
                                            className="w-full py-4 px-6 bg-[#ffcc00] hover:bg-[#ffdd33] text-black font-black text-[14px] uppercase shadow-[4px_4px_0_0_#886600] active:translate-y-1 active:shadow-none transition-all"
                                        >
                                            UPDATE_DATABASE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Footer Garnish */}
                    <div className="h-6 bg-[#111] border-t-[2px] border-[#333] flex items-center px-4 justify-between">
                        <div className="text-[8px] text-[#444] font-black">CRC_CHECK: OK</div>
                        <div className="text-[8px] text-[#444] font-black">LOCAL_TIME: {new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
