
import './App.css';
import { IoCartOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState, useRef, startTransition } from 'react';
import { auth, signOut } from './firebase';
  import image from './images/Vector (Stroke).svg';
  import image1 from './images/Vector (Stroke) (1).svg';
  import image2 from './images/Vector (Stroke) (2).svg';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'; 
import Shop from './shop';
import { FaTelegramPlane, FaWhatsapp, FaVk } from 'react-icons/fa';
import ProductCards from './companents/ProductCards';
import logo from './images/Group 1 (1).png';
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

  const deleteStationeryHandler = (index) => {
  const updatedStationeries = stationeries.filter((_, i) => i !== index);
  setStationeries(updatedStationeries);
};

  return (
    <div className="App">
      <header>
          <img className='logo' src={logo} alt="" />
          
         <ul>
          <li>Одежда</li>
          <li>Обувь</li>
          <li>Аксессуары</li>
          <li>Бренды</li>
          <li>Расчет стоимости</li>
          <li>Информация</li>
         </ul>

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
           <IoCartOutline />
        </div>
      </header>

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



      {/* <ProductCards stationeries={stationeries} /> */}
      <ProductCards
  stationeries={stationeries}
  onDelete={deleteStationeryHandler}
  user={user}   
/>

       {user && <Shop user={user} />}
       
       <section className="about-section">
      <div className="about-left">
        <h2 className="about-title">
          О ИНТЕРНЕТ-<br />МАГАЗИНЕ XWEAR
        </h2>
        <p>
          Команда XWEAR предоставляет услугу доставки только оригинальных товаров с крупнейшего китайского маркетплейса Poizon, чтобы наши клиенты экономили более 40% на каждой покупке.
        </p>
        <p>
          Работаем без посредников, благодаря чему можем предоставлять лучшую цену. Быстрая, бесплатная доставка.
        </p>
        <p>
          Сайт, на котором можно будет удобно оформить покупку, не скачивая китайское мобильное приложение Poizon, с удобной фильтрацией огромного количества товаров, а так же с возможностью сразу увидеть окончательную цену товара.
        </p>
      </div>

      <div className="about-right">
        <div className="feature">
          <img src={image} alt="box" className="icon" />
          <div>
            <h3>БЕСПЛАТНАЯ ДОСТАВКА ДО РОССИИ</h3>
            <p>Доставим вам заказ абсолютно бесплатно до России</p>
          </div>
        </div>
        <div className="feature">
          <img src={image1} alt="users" className="icon" />
          <div>
            <h3>МЫ РАБОТАЕМ БЕЗ ПОСРЕДНИКОВ</h3>
            <p>Между нами и клиентом нет третьего лишнего</p>
          </div>
        </div>
        <div className="feature">
          <img src={image2} alt="calendar" className="icon" />
          <div>
            <h3>ПРОСТОТА В ЗАКАЗЕ И ИСПОЛЬЗОВАНИИ</h3>
            <p>Для заказа с Poizon не нужно никаких приложений</p>
          </div>
        </div>
      </div>
    </section>

      <footer className="footer">
      <div className="container">

        <div className="column">
          <h4>КАТАЛОГ</h4>
          <ul>
            <li><a href="#">Одежда</a></li>
            <li><a href="#">Обувь</a></li>
            <li><a href="#">Аксессуары</a></li>
            <li><a href="#">Расчет стоимости</a></li>
          </ul>
          <div className="logo">XWEAR</div>
        </div>

        <div className="column">
          <h4>ИНФОРМАЦИЯ</h4>
          <ul>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Контакты</a></li>
            <li><a href="#">Доставка</a></li>
            <li><a href="#">Оплата</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
          <div className="dev">РАЗРАБОТКА САЙТА<br />READYOCODE.RU</div>
        </div>

        <div className="column">
          <h4>КОНТАКТЫ</h4>
          <p><a href="mailto:info@xwear.info">info@xwear.info</a></p>
          <p><a href="tel:+79936083885">+7 993 608 38 85</a></p>

          <div className="section-title">МЕССЕНДЖЕРЫ</div>
          <div className="icons">
            <FaTelegramPlane className="icon telegram" />
            <FaWhatsapp className="icon whatsapp" />
           </div>

          <div className="section-title">НАШИ СОЦСЕТИ</div>
          <div className="icons">
            <FaVk className="icon vk" />
          </div>
        </div>

        <div className="column">
          <h4>ПОДПИСКА НА НОВОСТИ</h4>
          <p>Будьте в курсе скидок и новостей</p>
          <form className="subscribe-form">
            <input type="email" placeholder="Ваш email" required />
            <button type="submit">➝</button>
          </form>
          <p className="small">
            Подписываясь на рассылку вы<br />
            соглашаетесь с обработкой персональных<br />
            данных
          </p>
          <a href="#">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</a><br />
          <a href="#">ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</a>
        </div>

      </div>
    </footer>
 



    </div>
  );
}

export default App;
