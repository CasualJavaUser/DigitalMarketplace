import {useTranslation} from "react-i18next";

const Home = (props) => {
    const [translate, i18n] = useTranslation("global");
    return (
        <div className="center container">
            <h1>{translate("welcome")}, {props.user.name} {props.user.surname}!</h1>
        </div>
    );
}

export default Home;