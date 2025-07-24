import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/Register.css';

export default function Register() {
    const [user, setUser] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateInput = () => {
        const { username, password, confirmPassword } = user;
        if (!username || !password || !confirmPassword) return 'Vui lòng nhập đầy đủ thông tin.';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
        if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp.';
        return '';
    };

    const handleRegister = async () => {
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:8888/users/check?username=${user.username}`);
            if (data.exists) {
                setError('Tên đăng nhập đã tồn tại.');
                return;
            }

            await axios.post('http://localhost:8888/users', {
                username: user.username,
                password: user.password,
            });

            navigate('/login');
        } catch (err) {
            console.error('Lỗi API:', err);
            setError('Lỗi khi đăng ký. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Đăng ký</h2>

            {error && <p className="register-error">{error}</p>}
            {loading && <p className="register-loading">Đang tải...</p>}

            <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={user.username}
                onChange={handleChange}
                className="register-input"
                autoComplete="off"
            />
            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={user.password}
                onChange={handleChange}
                className="register-input"
                autoComplete="off"
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={user.confirmPassword}
                onChange={handleChange}
                className="register-input"
                autoComplete="off"
            />

            <button
                onClick={handleRegister}
                disabled={loading}
                className="register-button"
            >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <p className="register-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
        </div>
    );
}
