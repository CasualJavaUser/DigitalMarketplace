import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SearchBar from "../SearchBar";
import {useTranslation} from "react-i18next";

const CustomerList = () => {
    const [translate, i18n] = useTranslation("global");
    const [customers, setCustomers] = useState([]);
    const [searched, setSearched] = useState('');

    useEffect(() => {
        fetch("http://localhost:3001/customers")
            .then(res => res.json())
            .then(data => {
                setCustomers(data
                    .filter(c => c.name.includes(searched) || c.email.includes(searched) || c.id+''===searched)
                )
            });
    }, [searched, customers]);

    const deleteCustomer = (customerId) => {
        if (window.confirm(translate("user_delete_confirm")) === true) {
            fetch("http://localhost:3001/customers/" + customerId, {method: "DELETE"})
        }
    }

    const customerList = customers.map(customer => {
        return (
            <tbody key={customer.id}>
            <tr>
                <th>{customer.id}</th>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td><Link to={customer.id + ""}>{translate("details")}</Link></td>
                <td><Link to={"/emp/edit_customer/" + customer.id}>{translate("edit")}</Link></td>
                <td><a onClick={() => deleteCustomer(customer.id)} className="underlined">{translate("delete")}</a></td>
            </tr>
            </tbody>
        );
    });

    return (
        <div className="center container">
            <h1>{translate("customers")}</h1>
            <SearchBar setSearched={setSearched}/><br/>
            <Link to={"/emp/edit_customer/new"}>{translate("add_customer")}</Link><br/>
            <table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>{translate("name")}</th>
                    <th>{translate("e-mail")}</th>
                    <th>{translate("details")}</th>
                    <th>{translate("edit")}</th>
                    <th>{translate("delete")}</th>
                </tr>
                </thead>
                {customerList}
            </table>
        </div>
    );
}

export default CustomerList;