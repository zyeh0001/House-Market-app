import { getAuth, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [changeDetail, setChangeDetail] = useState(false); //boolean to consider edit the profile detail or not

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const onLogOut = () => {
    auth.signOut();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update displayname in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Could not update user detail');
    }
    // e.preventDefault();
    console.log(123);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>My Profile</p>
        <button className='logOut' onClick={onLogOut}>
          Log Out{' '}
        </button>
      </header>
      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetialsText'>Personal Detial</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetail && handleSubmit();
              setChangeDetail((prev) => !prev);
            }}
          >
            {changeDetail ? 'done' : 'changed'}
          </p>
        </div>
        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetail ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetail}
              value={name}
              onChange={handleChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetail ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetail}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={HomeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={ArrowRightIcon} alt='arrow right' />
        </Link>
      </main>
    </div>
  );
}

export default Profile;
