import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { checkUser } from "./AuthService.js";

const AuthModule = () => {
    const navigate = useNavigate();

    useEffect(() => {
        alert("Already logged in");
        navigate("/")
    }, [navigate]);

    return (
        <div>
            <Link to="/register">
                <button>Register</button>
            </Link>
            <br />
            <br />
            <Link to="/login">
                <button>Login</button>
            </Link>
        </div>
    );
};

export default AuthModule;