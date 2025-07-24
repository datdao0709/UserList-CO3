import { Routes, Route, Link, Outlet, useLocation } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import UserList from "./component/UserList";
import AddUser from "./component/AddUser";
import EditUser from "./component/EditUser";
import ViewUser from "./component/ViewUser";
import './App.css';

function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div>
            {!isAuthPage && (
                <header className="header">
                    <nav>
                        <Link to="/login" className="btn">Login</Link>
                        <Link to="/register" className="btn">Register</Link>
                    </nav>
                </header>
            )}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<UserList />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/edit-user/:id" element={<EditUser />} />
                <Route path="/view-user/:id" element={<ViewUser />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>
        </Routes>
    );
}

export default App;
