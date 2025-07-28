import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../style/UserList.css';

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8888/users")
            .then(res => setUsers(res.data))
            .catch(err => console.log("Lỗi khi gọi API:", err));
    }, []);

    return (
        <div className="container">
            <h2>Danh sách người dùng</h2>

            <Link to="/add-user">
                <button className="add-btn">Thêm người dùng</button>
            </Link>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Phòng ban</th>
                    <th>Chức vụ</th>
                    <th>Điểm hiệu suất</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.department}</td>
                        <td>{user.role}</td>
                        <td>{user.performanceScore}</td>
                        <td className="actions">
                            <Link to={`/view-user/${user.id}`}>
                                <button className="view">Xem</button>
                            </Link>
                            <Link to={`/edit-user/${user.id}`}>
                                <button className="edit">Sửa</button>
                            </Link>
                            <button
                                className="delete"
                                onClick={() => {
                                    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
                                        axios.delete(`http://localhost:8888/users/${user.id}`)
                                            .then(() => {
                                                setUsers(users.filter(u => u.id !== user.id));
                                            });
                                    }
                                }}
                            >Xóa</button>
                        </td>

                    </tr>
                )) : (
                    <tr>
                        <td colSpan="7">Không có người dùng nào.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
