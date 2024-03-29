import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const EmpLogin = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [warning, setWarning] = useState('');

    const [employee] = useState({
        email: null,
        password: null
    });

    const checkLogin = () => {
        if (employee.email === null || employee.email.trim().length === 0) {
            setWarning(translate("require-all"))
            return;
        }

        fetch("http://localhost:3001/employees/" + employee.email)
            .then(res => res.json())
            .then(data => {
                if (data[0] === undefined || data[0].password !== employee.password) {
                    setWarning(translate("incorrect_email_or_pass"))
                } else {
                    props.setUser({
                        name: data[0].name,
                        surname: data[0].surname
                    })
                    navigate("/emp");
                }
            })
            .catch(err => alert(translate("operation_unsuccessful")));
    }

    return (
        <>
            <header>
                <img src="/logo.png" alt="logo" id="logo"/>
                <h1 className="inline">{translate("employee_platform")}</h1>
            </header>
            <div id="login-window" className="container">
                <h1>{translate("log_in_title")}</h1>
                <input type="email" id="email" placeholder={translate("e-mail")} onChange={e => employee.email = e.target.value}/><br/>
                <input type="password" id="password" placeholder={translate("password")} onChange={e => employee.password = e.target.value}/><br/>
                <button onClick={checkLogin}>{translate("login")}</button>
                <Warning message={warning}/>
            </div>
        </>
    );
}

export default EmpLogin;