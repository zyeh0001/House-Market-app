import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from '../components/ListingItem';

function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const [changeDetail, setChangeDetail] = useState(false); //boolean to consider edit the profile detail or not

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  useEffect(() => {
    const fetchUserListing = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListing();
  }, [auth.currentUser.uid]);

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

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const docRef = doc(db, 'listings', listingId);
      await deleteDoc(docRef); //only delete in firestore, will not re-render
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success('Delete Successfully');
    }
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

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingList'>
              {listings.map((item) => (
                <ListingItem
                  key={item.id}
                  listing={item.data}
                  id={item.id}
                  onDelete={() => onDelete(item.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
