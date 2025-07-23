import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AddUser() {
    const [user, setUser] = useState({ username: '', password: '', name: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (!user.username || !user.password || !user.name || !user.role) {
            setError('Vui lòng nhập đầy đủ thông tin.');
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

            await axios.post('http://localhost:8888/users', user);
            navigate('/');
        } catch (err) {
            setError('Lỗi khi thêm người dùng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Thêm người dùng</h2>
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
                type="text"
                name="name"
                placeholder="Họ tên"
                value={user.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="role"
                placeholder="Vai trò"
                value={user.role}
                onChange={handleChange}
            />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Đang thêm...' : 'Thêm'}
            </button>
            <Link to="/" className="back-button">Quay lại</Link>
        </div>
    );
}