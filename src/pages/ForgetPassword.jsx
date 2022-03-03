import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPasswrod() {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email sent');
    } catch (error) {
      toast.error('Send email error');
    }
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forget Password</p>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            value={email}
            className='emailInput'
            placeholder='Email'
            id='email'
            onChange={handleChange}
          />
          <Link to='/sign-in' className='forgotPasswordLink'>
            Sign In
          </Link>

          <div className='signInBar'>
            <div className='signInText' onClick={handleSubmit}>
              Send Reset Link
            </div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#fff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPasswrod;
