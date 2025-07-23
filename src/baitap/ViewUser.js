import { useEffect, useState } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import axios from 'axios';

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
            setError('');
            try {
                const [userRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:8888/users/${id}`),
                    axios.get(`http://localhost:8888/reviews?userId=${id}`),
                ]);
                setUser(userRes.data);
                setReviews(reviewsRes.data);
            } catch (err) {
                setError('Lỗi khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (field, value) => {
        setNewReview((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleAddReview = async () => {
        const { criteria, score, comment, reviewer } = newReview;
        if (!criteria.trim() || !score || !comment.trim() || !reviewer.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin đánh giá.');
            return;
        }
        if (score < 0 || score > 10) {
            setError('Điểm phải từ 0 đến 10.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const reviewToAdd = {
                userId: id,
                criteria,
                score: Number(score),
                comment,
                reviewer,
                date: new Date().toISOString(),
            };
            const res = await axios.post('http://localhost:8888/reviews', reviewToAdd);
            setReviews((prev) => [...prev, res.data]);
            setNewReview({ criteria: '', score: '', comment: '', reviewer: '' });
        } catch (err) {
            setError('Lỗi khi thêm đánh giá.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
        try {
            await axios.delete(`http://localhost:8888/reviews/${reviewId}`);
            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } catch (err) {
            setError('Lỗi khi xóa đánh giá.');
        }
    };

    if (loading) return <div className="container"><p className="loading">Đang tải...</p></div>;
    if (!user) return <div className="container"><p className="error">Không tìm thấy người dùng.</p></div>;

    const performanceScore = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)
        : 'Chưa có';

    return (
        <div className="container">
            <h2>Chi tiết người dùng</h2>
            {error && <p className="error">{error}</p>}
            <p><strong>Tên đăng nhập:</strong> {user.username}</p>
            <p><strong>Họ tên:</strong> {user.name || 'Chưa có'}</p>
            <p><strong>Phòng ban:</strong> {user.department || 'Chưa có'}</p>
            <p><strong>Vai trò:</strong> {user.role || 'Chưa có'}</p>
            <p><strong>Điểm hiệu suất:</strong> {performanceScore}</p>

            <h3>Đánh giá</h3>
            {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
            {reviews.map((r) => (
                <div key={r.id} className="review-item">
                    <p><strong>Tiêu chí:</strong> {r.criteria}</p>
                    <p><strong>Điểm:</strong> {r.score}</p>
                    <p><strong>Nhận xét:</strong> {r.comment}</p>
                    <p><small>{new Date(r.date).toLocaleString()}</small></p>
                    <p><em>Người đánh giá: {r.reviewer}</em></p>
                    <button onClick={() => handleDeleteReview(r.id)}>Xóa</button>
                </div>
            ))}

            <h4>Thêm đánh giá mới</h4>
            <input
                type="text"
                placeholder="Tiêu chí đánh giá"
                value={newReview.criteria}
                onChange={(e) => handleChange('criteria', e.target.value)}
            />
            <input
                type="number"
                placeholder="Điểm (0-10)"
                min="0"
                max="10"
                value={newReview.score}
                onChange={(e) => handleChange('score', e.target.value)}
            />
            <textarea
                placeholder="Nhận xét"
                value={newReview.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
            />
            <input
                type="text"
                placeholder="Người đánh giá"
                value={newReview.reviewer}
                onChange={(e) => handleChange('reviewer', e.target.value)}
            />
            <button onClick={handleAddReview} disabled={loading}>
                {loading ? 'Đang thêm...' : 'Thêm đánh giá'}
            </button>
            <button onClick={() => navigate('/')} className="back-button">Quay lại</button>
        </div>
    );
}