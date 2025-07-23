import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:8888/login', { username, password });
            if (res.data.success) {
                navigate('/');
            } else {
                setError('Sai tên đăng nhập hoặc mật khẩu.');
            }
        } catch (error) {
            setError('Lỗi khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Đăng nhập</h2>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Đang tải...</p>}
            <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <p>
                Chưa có tài khoản? <Link to="/register" className="add-new-link">Đăng ký</Link>
            </p>
        </div>
    );
}