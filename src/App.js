
import './App.css';
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useRef, startTransition } from 'react';
import { auth, signOut } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'; 
import Shop from './shop';
import ProductCards from './companents/ProductCards';
// import LikesProduct from './companents/LikesProduct';
function App() {
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleModal = () => {
    setShowModal(!showModal);
    setError('');
  };
  const handleAuth = async () => {
    if (!email.endsWith('@gmail.com')) {
      setError('Faqat @gmail.com emailga ruxsat beriladi');
      return;
    }

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowModal(false);
    } catch (err) {
      setError('Xatolik: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [stationeryName, setStationeryName] = useState('');
  const [stationeryImage, setStationeryImage] = useState('');
  const [stationeryDes, setStationeryDes] = useState('');
  const [stationeryCost, setStationeryCost] = useState('');

  const [isModal, setIsModal] = useState(false);

  const [stationeries, setStationeries] = useState(
    JSON.parse(localStorage.getItem('mystationery'))
      ? JSON.parse(localStorage.getItem('mystationery'))
      : []
  );

  const addStationeryHandler = () => {
    let newStationery = {
      stationery_name: stationeryName,
      stationery_image: stationeryImage,
      stationery_des: stationeryDes,
      cost: stationeryCost,
      isLiked: false,
    };

    setStationeries([...stationeries, newStationery]);

    setStationeryName('');
    setStationeryImage('');
    setStationeryDes('');
    setStationeryCost('');

    setIsModal(true); 
  };
  
  // if (stationeries.length === 0) {
  //   setIsModal(false);
  // } else {
  //   setIsModal(true);
  // }
  useEffect(() => {
    localStorage.setItem('mystationery', JSON.stringify(stationeries));
  }, [stationeries]);

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj1maotx9nF53KGnUTKa91rc65qPVzBi6MEw&s" alt="" />
          <h1>Stationery Shop</h1>
        </div>

        <div className="search">
          <div className="search-input">
            <input type="text" placeholder='Search stationeries...' />
          <button className="search-icon">
            <FaSearch  />
          </button>

          </div>
          {user ? (
            <div className="user-section" ref={dropdownRef}>
              <img
                src={user.photoURL || 'https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg'}
                alt="User Avatar"
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <span className="user-email">{user.email}</span>
                  {user.email === 'admin@gmail.com' && <button className='add_product' onClick={ () => setIsModal(true)}>Add Product</button>}
                  <button className="logout-btn" onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <button className='headerbtn' onClick={toggleModal}>Sign In</button>
          )}
        </div>
      </header>c

      {showModal && (
        <div className="modal_box">
          <div className="modal">
            <div className="modal_things">
              <div className='h1_and_btn'>
                <h1>{isRegister ? 'Sign Up' : 'Log In'}</h1>
              <button className='btn' onClick={toggleModal}>❌</button>
              </div>
              <input
                type="text"
                placeholder='Enter your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='Enter your password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className='login_btn' onClick={handleAuth}>{isRegister ? 'Sign Up' : 'Log In'}</button>
              <p>
                {isRegister ? 'Have an account?' : "Don't have an account?"}{' '}
                <a href="#" onClick={() => setIsRegister(!isRegister)}>
                  {isRegister ? 'Log In' : 'Sign Up'}
                </a>
              </p>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

          </div>
        </div>
      )}

      {user && <Shop user={user} />}




      {isModal ? (
        <div className='add_book_group'>
          <div className='book_form'>
            <input
              value={stationeryName}
              onChange={(e) => setStationeryName(e.target.value)}
              type='text'
              placeholder='Stationery name...'
              required
            />
            <input
              value={stationeryImage}
              onChange={(e) => setStationeryImage(e.target.value)}
              type='text'
              placeholder='Stationery image...'
              
            />

            <input
              value={stationeryCost}
              onChange={(e) => setStationeryCost(e.target.value)}
              type='text'
              placeholder='Stationery cost...'
              
            />
            <textarea
              rows={6}
              cols={30}
              value={stationeryDes}
              onChange={(e) => setStationeryDes(e.target.value)}
            > </textarea >
            <button className='add' onClick={addStationeryHandler}>Add Stationery</button>
            <button className='cancel_btn' onClick={() => setIsModal(false)}>Cancel</button>
          </div>
        </div>
      ) : null}

      <ProductCards stationeries={stationeries} />
       {user && <Shop user={user} />}

    </div>
  );
}

export default App;
