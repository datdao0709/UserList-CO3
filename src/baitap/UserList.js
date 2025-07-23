import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get('http://localhost:8888/users');
                setUsers(res.data);
            } catch (err) {
                setError('Lỗi khi tải danh sách người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await axios.delete(`http://localhost:8888/users/${id}`);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            navigate('/'); // Refresh trang sau khi xóa
        } catch (err) {
            setError('Lỗi khi xóa người dùng.');
        }
    };

    return (
        <div className="container">
            <h2>Danh sách người dùng</h2>
            <Link to="/add-user" className="add-new-link">Thêm mới</Link>
            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Đang tải...</p>}
            {!loading && users.length === 0 && <p>Không có người dùng nào.</p>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <span>{user.username} ({user.name || 'Chưa có tên'})</span>
                        <div>
                            <Link to={`/view-user/${user.id}`}>Xem</Link> |{' '}
                            <Link to={`/edit-user/${user.id}`}>Sửa</Link> |{' '}
                            <Link to="#" onClick={() => handleDelete(user.id)}>Xóa</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}