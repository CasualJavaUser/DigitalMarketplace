import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Warning from "../Warning";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import {useTranslation} from "react-i18next";

const Register = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        password: "",
        rePass: ""
    });
    const [warning, setWarning] = useState("");

    const register = async () => {
        customer.name = customer.name.trim();
        customer.email = customer.email.trim().toLowerCase();
        customer.password = customer.password.trim();
        customer.rePass = customer.rePass.trim();

        if (customer.name.length === 0 || customer.email.length === 0 || customer.password.length === 0 || customer.rePass.length === 0) {
            setWarning(translate("require_all"));
            return;
        }

        if (!validateName(customer.name)) {
            setWarning(translate("incorrect_name"))
            return;
        }

        if (!validateEmail(customer.email)) {
            setWarning(translate("incorrect_email"))
            return;
        }

        if (!validatePassword(customer.password)) {
            setWarning(translate("password_invalid"))
            return;
        }

        if (customer.password !== customer.rePass) {
            setWarning(translate("password_not_identicals"));
            return;
        }

        const customers = await fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => data)

        for (const c of customers) {
            if (c.name === customer.name) {
                setWarning(translate("name_taken"));
                return;
            }
            if (c.email === customer.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        fetch("http://localhost:3001/customers", {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(customer)
        })
            .catch(err => alert(translate("operation_unsuccessful")));
        navigate("/login")
    }

    return (
        <div id="login-window" className="container">
            <h1>{translate("register_title")}</h1>
            <input type="text" placeholder={translate("name")} onChange={e => customer.name = e.target.value}/><br/>
            <input type="email" placeholder={translate("e-mail")} onChange={e => customer.email = e.target.value}/><br/>
            <input type="password" placeholder={translate("password")} onChange={e => customer.password = e.target.value}/><br/>
            <input type="password" placeholder={translate("repeat_password")} onChange={e => customer.rePass = e.target.value}/><br/>
            <button onClick={() => register()}>{translate("register")}</button>
            <Warning message={warning}/>
        </div>
    );
}

export default Register;