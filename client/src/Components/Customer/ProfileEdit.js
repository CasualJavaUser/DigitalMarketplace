import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import {useTranslation} from "react-i18next";

const ProfileEdit = (props) => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    useEffect(() => {
        if (props.user.id === undefined)
            navigate("/login");
    }, []);

    const [user] = useState(props.user);
    const [warning, setWarning] = useState('');
    const [passWarning, setPassWarning] = useState('');

    const editUserData = async () => {
        if (!validateName(user.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }

        if (!validateEmail(user.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }

        const customers = await fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => data.filter(u => u.id !== user.id))

        for (const c of customers) {
            if (c.name === user.name) {
                setWarning(translate("name_taken"));
                return;
            }
            if (c.email === user.email) {
                setWarning(translate("email_taken"));
                return;
            }
        }

        fetch("http://localhost:3001/customer_data/" + props.user.id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        })
            .catch(err => alert(translate("connection-error")));

        props.user.name=user.name;
        props.user.email=user.email;
        navigate("/profile");
    }

    const editPassword = () => {
        const current = document.getElementById("current-pass").value;
        const newPass = document.getElementById("new-pass").value;
        const rePass = document.getElementById("re-pass").value;

        if (current !== user.password) {
            setPassWarning(translate("incorrect_password"));
            return;
        }

        if (!validatePassword(newPass)) {
            setPassWarning(translate("password_invalid"))
            return;
        }

        if (newPass !== rePass) {
            setPassWarning(translate("password_not_identical"));
            return;
        }

        fetch('http://localhost:3001/update_password/' + props.user.id, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password: newPass})
        })
            .catch(err => alert(translate("connection_error")))

        props.user.password = newPass;
        navigate("/profile");
    }

    return (
        <div className="center container">
            <h1>{translate("edit_profile")}</h1>
            <div className="form">
                <input type="text" placeholder={translate("name")} defaultValue={user.name} onChange={e => user.name = e.target.value}/><br/>
                <input type="email" placeholder={translate("e-mail")} defaultValue={user.email} onChange={e => user.email = e.target.value}/><br/>
                <button onClick={editUserData}>akceptuj</button>
                <Warning message={warning}/>
            </div>
            <h2>{translate("change_password")}</h2>
            <div className="form">
                <input id="current-pass" type="password" placeholder={translate("current_password")}/><br/>
                <input id="new-pass" type="password" placeholder={translate("new_password")}/><br/>
                <input id="re-pass" type="password" placeholder={translate("repeat_password")}/><br/>
                <button onClick={editPassword}>akceptuj</button>
                <Warning message={passWarning}/>
            </div>
        </div>
    );
}

export default ProfileEdit;