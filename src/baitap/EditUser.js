import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '', name: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`http://localhost:8888/users/${id}`);
                setUser(res.data);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

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
            if (checkRes.data.exists && checkRes.data.id !== id) {
                setError('Tên đăng nhập đã tồn tại.');
                setLoading(false);
                return;
            }

            await axios.put(`http://localhost:8888/users/${id}`, user);
            navigate('/');
        } catch (err) {
            setError('Lỗi khi cập nhật người dùng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Sửa người dùng</h2>
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
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
            <Link to="/" className="back-button">Quay lại</Link>
        </div>
    );
}