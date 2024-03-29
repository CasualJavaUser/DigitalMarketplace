import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {validateEmail, validateName, validatePassword} from "../../Utils";
import Warning from "../Warning";
import NoPage from "../NoPage";
import {useTranslation} from "react-i18next";

const CustomerEdit = () => {
    const navigate = useNavigate();
    const [translate, i18n] = useTranslation("global");
    const {customerId} = useParams();
    const [customer, setCustomer] = useState({id: ''});
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (customerId !== 'new') {
            fetch("http://localhost:3001/customers/" + customerId)
                .then(res => res.json())
                .then(data => setCustomer(data[0]))
                .catch(err => alert("Błąd połączenia z bazą danych."));
        }
    }, []);

    if (customer.id === null)
        return <NoPage/>

    const editUserData = async () => {
        if (!validateName(customer.name)) {
            setWarning(translate("incorrect_name"));
            return;
        }
        if (!validateEmail(customer.email)) {
            setWarning(translate("incorrect_email"));
            return;
        }
        if(!validatePassword(customer.password)) {
            setWarning(translate("invalid_password"));
            return;
        }

        const customers = await fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => data.filter(u => u.id !== customer.id))

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

        if (customerId === 'new') {
            fetch("http://localhost:3001/customers/", {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(customer)
            })
            navigate("/emp/customers/");
        }
        else {
            fetch("http://localhost:3001/customers/" + customerId, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(customer)
            })
            navigate("/emp/customers/" + customerId);
        }

    }

    return (
        <div className="center container">
            <h1>{translate("edit_profile")}</h1>
            <div className="form">
                <label>{translate("name")}</label><br/>
                <input type="text" defaultValue={customer.name} onChange={e => customer.name = e.target.value}/><br/>
                <label>{translate("e-mail")}</label><br/>
                <input type="email" defaultValue={customer.email} onChange={e => customer.email = e.target.value}/><br/>
                <label>{translate("password")}</label><br/>
                <input type="text" defaultValue={customer.password} onChange={e => customer.password = e.target.value}/><br/>
                <button onClick={editUserData}>{translate("accept")}</button>
                <button onClick={() => navigate("/emp/customers/" + customerId)}>{translate("cancel")}</button>
                <Warning message={warning}/>
            </div>
        </div>
    );
}

export default CustomerEdit;