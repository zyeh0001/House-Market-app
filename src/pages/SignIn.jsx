import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

function SignIn() {
  const [showPassword, setShowPasswrod] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad User Credential');
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={handleChange}
          />
          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              id='password'
              onChange={handleChange}
              className='passwordInput'
            />
            <img
              src={visibilityIcon}
              alt='password'
              className='showPassword'
              onClick={() => {
                setShowPasswrod((prev) => !prev);
              }}
            />
          </div>
          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgor Password
          </Link>
          <div className='signInBar'>
            <div className='signInText' onClick={handleSubmit}>
              Sign In
            </div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        {/* Google OAuth */}
        <OAuth />

        <Link to='/sign-up' className='registerLink'>
          Sign Up Now
        </Link>
        <br />
        <br />
      </div>
    </>
  );
}

export default SignIn;
