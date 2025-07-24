import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/ViewUser.css';

export default function ViewUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ criteria: '', score: '', comment: '', reviewer: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:3000/users/${id}`),
                    axios.get(`http://localhost:3000/reviews?userId=${id}`)
                ]);
                setUser(userRes.data);
                setReviews(reviewsRes.data);
            } catch {
                setError('Không thể tải dữ liệu người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleAddReview = async () => {
        const { criteria, score, comment, reviewer } = newReview;
        if (!criteria || !comment || !reviewer || score === '') {
            return setError('Vui lòng điền đầy đủ thông tin.');
        }
        if (score < 0 || score > 10) {
            return setError('Điểm phải từ 0 đến 10.');
        }

        try {
            setLoading(true);
            const review = {
                ...newReview,
                userId: id,
                score: Number(score),
                date: new Date().toISOString()
            };
            const { data } = await axios.post('http://localhost:3000/reviews', review);
            setReviews([...reviews, data]);
            setNewReview({ criteria: '', score: '', comment: '', reviewer: '' });
        } catch {
            setError('Lỗi khi thêm đánh giá.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rid) => {
        if (!window.confirm('Xóa đánh giá này?')) return;
        try {
            await axios.delete(`http://localhost:3000/reviews/${rid}`);
            setReviews(reviews.filter(r => r.id !== rid));
        } catch {
            setError('Lỗi khi xóa.');
        }
    };

    if (loading) return <p className="loading">Đang tải...</p>;
    if (!user) return <p className="error">Không tìm thấy người dùng.</p>;

    const avgScore = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)
        : 'Chưa có';

    return (
        <div className="view-user">
            <h2>Thông tin người dùng</h2>
            {error && <p className="error">{error}</p>}

            <div className="user-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Họ tên:</strong> {user.name || 'Chưa có'}</p>
                <p><strong>Phòng ban:</strong> {user.department || 'Chưa có'}</p>
                <p><strong>Vai trò:</strong> {user.role || 'Chưa có'}</p>
                <p><strong>Điểm hiệu suất:</strong> {avgScore}</p>
            </div>

            <h3>Đánh giá</h3>
            {reviews.length === 0 ? (
                <p>Chưa có đánh giá nào.</p>
            ) : (
                <table className="review-table">
                    <thead>
                    <tr>
                        <th>Tiêu chí</th>
                        <th>Điểm</th>
                        <th>Nhận xét</th>
                        <th>Ngày</th>
                        <th>Người đánh giá</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map(r => (
                        <tr key={r.id}>
                            <td>{r.criteria}</td>
                            <td>{r.score}</td>
                            <td>{r.comment}</td>
                            <td>{new Date(r.date).toLocaleDateString()}</td>
                            <td>{r.reviewer}</td>
                            <td><button onClick={() => handleDelete(r.id)}>Xóa</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="add-review">
                <h4>Thêm đánh giá mới</h4>
                <input name="criteria" placeholder="Tiêu chí" value={newReview.criteria} onChange={handleChange} />
                <input name="score" type="number" min="0" max="10" placeholder="Điểm (0-10)" value={newReview.score} onChange={handleChange} />
                <textarea name="comment" placeholder="Nhận xét" value={newReview.comment} onChange={handleChange} />
                <input name="reviewer" placeholder="Người đánh giá" value={newReview.reviewer} onChange={handleChange} />
                <div className="btn-group">
                    <button onClick={handleAddReview} disabled={loading}>Thêm đánh giá</button>
                    <button onClick={() => navigate("/")}>Quay lại</button>
                </div>
            </div>
        </div>
    );
}
