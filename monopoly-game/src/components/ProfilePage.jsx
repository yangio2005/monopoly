import React, { useState, useEffect } from 'react';
import { auth, database, ref, set, onValue } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (user) {
      try {
        await set(ref(database, 'users/' + user.uid), {
          name: name,
          avatarURL: avatarURL,
        });
        alert('Profile updated successfully!');
      } catch (saveError) {
        console.error("Error saving profile:", saveError);
        setError("Failed to save profile.");
      }
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading profile...</div>;
  }

  if (!user) {
    return <div className="container mt-5">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">User Profile</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="text-center mb-4">
                {avatarURL && <img
                  src={avatarURL}
                  alt="Avatar"
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />}
                <h3 className="mt-3">{name || 'No Name'}</h3>
                <p>Email: {user.email}</p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="avatarURLInput" className="form-label">Avatar URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="avatarURLInput"
                    value={avatarURL}
                    onChange={(e) => setAvatarURL(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
