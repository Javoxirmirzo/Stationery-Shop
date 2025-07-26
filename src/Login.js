// src/Login.jsx
import { useState } from 'react';
import {
  auth,
  provider,
  signInWithPopup
} from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminEmail = 'admin@gmail.com';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email.endsWith('@gmail.com')) {
        onLogin(result.user);
      } else {
        setError('Faqat @gmail.com email orqali kirish mumkin!');
      }
    } catch (err) {
      setError('Google orqali kirishda xatolik.');
    }
  };

  const handleEmailLogin = async (isRegister = false) => {
    if (!email.endsWith('@gmail.com')) {
      setError('Faqat @gmail.com domenidagi emailga ruxsat beriladi.');
      return;
    }

    try {
      let result;
      if (isRegister) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(result.user);
    } catch (err) {
      setError(isRegister ? 'Ro‘yxatdan o‘tishda xatolik.' : 'Kirishda xatolik.');
    }
  };

  return (
    <div >
      <h2>Stationery Shop – Kirish</h2>

      <div >
        <input
          type="email"
          placeholder="Email (faqat @gmail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}

        />
        <br />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={() => handleEmailLogin(false)}>Email orqali kirish</button>
        <button onClick={() => handleEmailLogin(true)} style={{ marginLeft: 8 }}>
          Ro‘yxatdan o‘tish
        </button>
      </div>

      <div>
        <button onClick={handleGoogleLogin}>Google bilan kirish</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
