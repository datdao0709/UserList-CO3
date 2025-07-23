import { Routes, Route } from "react-router-dom";
import Login from "./baitap/Login";
import Register from "./baitap/Register";
import UserList from "./baitap/UserList";
import AddUser from "./baitap/AddUser";
import EditUser from "./baitap/EditUser";
import ViewUser from "./baitap/ViewUser";

function App() {
    return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<UserList />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/edit-user/:id" element={<EditUser />} />
                <Route path="/view-user/:id" element={<ViewUser />} />
            </Routes>
    );
}

export default App;
