import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const Login = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [warning, setWarning] = useState('');
    const [customer] = useState({
        email: null,
        password: null
    });

    const checkLogin = async() => {
        if (customer.email === null || customer.email.trim().length === 0) {
            setWarning(translate("require_all"))
            return;
        }

        const promise = fetch("http://localhost:3001/customers/email/" + customer.email)
            .then(res => res.json())
            .then(data => {
                if (data[0] === undefined || data[0].password !== customer.password) {
                    setWarning(translate("incorrect_email_or_pass"));
                } else {
                    props.setUser(data[0])
                    navigate("/");
                }
            })
            .catch(err => alert(translate("connection_error")));
    }

    return (
        <div id="login-window" className="container">
            <h1>{translate("log_in_title")}</h1>
            <input type="email" id="email" placeholder={translate("e-mail")} onChange={e => customer.email = e.target.value}/><br/>
            <input type="password" id="password" placeholder={translate("password")} onChange={e => customer.password = e.target.value}/><br/>
            <button onClick={checkLogin}>{translate("login")}</button>
            <Warning message={warning}/><br/>
            <Link to={"/register"}>{translate("register")}</Link><br/>
            <Link to={"/emplogin"}>{translate("employee_platform")}</Link>
        </div>
    );
}

export default Login;