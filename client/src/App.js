import './App.css';
import EmpLayout from "./Components/Employee/EmpLayout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PurchaseList from "./Components/Employee/PurchaseList";
import NoPage from "./Components/NoPage";
import CustomerList from "./Components/Employee/CustomerList";
import Home from "./Components/Employee/Home";
import EmpLogin from "./Components/Employee/EmpLogin";
import OfferDetails from "./Components/Employee/OfferDetails";
import OfferEdit from "./Components/Employee/OfferEdit";
import OfferList from "./Components/Employee/OfferList";
import KeyDetails from "./Components/Employee/KeyDetails";
import {useState} from "react";
import Layout from "./Components/Customer/Layout";
import ProductList from "./Components/Customer/ProductList";
import ProductDetails from "./Components/Customer/ProductDetails";
import ThankYou from "./Components/Customer/ThankYou";
import Login from "./Components/Customer/Login";
import Register from "./Components/Customer/Register";
import Profile from "./Components/Customer/Profile";
import PurchaseHistory from "./Components/Customer/PurchaseHistory";
import UserOffers from "./Components/Customer/UserOffers";
import ProfileEdit from "./Components/Customer/ProfileEdit";
import PurchaseDetails from "./Components/Employee/PurchaseDetails";
import CustomerDetails from "./Components/Employee/CustomerDetails";
import CustomerEdit from "./Components/Employee/CustomerEdit";
import EmpPurchaseHistory from "./Components/Employee/EmpPurchaseHistory";
import EmpUserOffers from "./Components/Employee/EmpUserOffers";
import EditProduct from "./Components/Customer/EditProduct";
import PurchaseEdit from "./Components/Employee/PurchaseEdit";

function App() {
    const [user, setUser] = useState({});
    const [currency, setCurrency] = useState('pln');
    const [language, setLanguage] = useState('pl');
    const [keyCode, setKeyCode] = useState('');
    const [searched, setSearched] = useState('')

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout setCurrency={setCurrency} setLanguage={setLanguage} user={user} setSearched={setSearched}/>}>
                    <Route path="login" element={<Login setUser={setUser}/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route index element={<ProductList currency={currency} searched={searched}/>}/>
                    <Route path=":offerId" element={<ProductDetails currency={currency} setKeyCode={setKeyCode} keyCode={keyCode} user={user}/>}/>
                    <Route path="thankyou" element={<ThankYou keyCode={keyCode}/>}/>
                    <Route path="profile" element={<Profile user={user}/>}>
                        <Route path="purchases" element={<PurchaseHistory user={user} currency={currency}/>}/>
                        <Route path="offers" element={<UserOffers user={user} currency={currency}/>}/>
                    </Route>
                    <Route path="profile/edit" element={<ProfileEdit user={user}/>}/>
                    <Route path="edit_offer/:offerId" element={<EditProduct user={user}/>}/>
                </Route>

                <Route path="/emplogin" element={<EmpLogin setUser={setUser}/>}/>
                <Route path="/emp" element={<EmpLayout setCurrency={setCurrency} setLanguage={setLanguage} user={user}/>}>
                    <Route index element={<Home user={user}/>}/>

                    <Route path="offers" element={<OfferList currency={currency}/>}/>
                    <Route path="offers/:offerId" element={<OfferDetails currency={currency}/>}/>
                    <Route path="edit_offer/:offerId" element={<OfferEdit/>}/>
                    <Route path="keys/:keyCode" element={<KeyDetails/>}/>

                    <Route path="purchases" element={<PurchaseList/>}/>
                    <Route path="purchases/:purchaseId" element={<PurchaseDetails currency={currency}/>}/>
                    <Route path="edit_purchase/:purchaseId" element={<PurchaseEdit/>}/>

                    <Route path="customers" element={<CustomerList/>}/>
                    <Route path="customers/:customerId" element={<CustomerDetails currency={currency}/>}>
                        <Route path="purchases" element={<EmpPurchaseHistory currency={currency}/>}/>
                        <Route path="offers" element={<EmpUserOffers currency={currency}/>}/>
                    </Route>
                    <Route path="edit_customer/:customerId" element={<CustomerEdit/>}/>
                </Route>
                <Route path="*" element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
