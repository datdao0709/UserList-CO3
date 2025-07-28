import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/EditUser.css";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        name: "",
        email: ""
    });

    useEffect(() => {
        axios.get(`http://localhost:8888/users/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.error("Lỗi khi tải người dùng:", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8888/users/${id}`, user);
            navigate("/");
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
        }
    };

    return (
        <div className="edit-container">
            <h2>Cập nhật người dùng</h2>
            <form className="edit-form" onSubmit={handleSubmit}>
                <label>
                    Tên đăng nhập:
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />
                </label>
                <label>
                    Họ tên:
                    <input type="text" name="name" value={user.name} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} />
                </label>
                <button type="submit">Lưu</button>
                <button type="button" className="back-btn" onClick={() => navigate("/")}>
                    Quay lại
                </button>
            </form>
        </div>
    );
}
