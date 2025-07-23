import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const [user, setUser] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleRegister = async () => {
        if (!user.username || !user.password || !user.confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (user.password !== user.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (user.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const checkRes = await axios.get(`http://localhost:8888/users/check?username=${user.username}`);
            if (checkRes.data.exists) {
                setError('Tên đăng nhập đã tồn tại.');
                setLoading(false);
                return;
            }

            await axios.post('http://localhost:8888/users', {
                username: user.username,
                password: user.password,
            });
            navigate('/login');
        } catch (error) {
            setError('Lỗi khi đăng ký. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Đăng ký</h2>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Đang tải...</p>}
            <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={user.username}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={user.password}
                onChange={handleChange}
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={user.confirmPassword}
                onChange={handleChange}
            />
            <button onClick={handleRegister} disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <p>
                Đã có tài khoản? <Link to="/login" className="add-new-link">Đăng nhập</Link>
            </p>
        </div>
    );
}