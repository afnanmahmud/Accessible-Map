import { AccountPageRoute } from "@/pages/AccountPage";
import "./styles.css"

import { IconButtonProps, NavButtonGroupProps, NavButtonProps } from "@/types";
import { Link } from "react-router-dom";
import { HomePageRoute } from "@/pages/HomePage";
import accountImage from "../../assets/accountIcon.svg";
import bookmark from "../../assets/bookmark.svg";

export const NavButton: React.FC<NavButtonProps> = ({
    route,
    title,
    style
}) => {
    return (
        <div className="nav-button" style={style}>
            <Link className="nav-link round" to={route}>
                <a className="nav-button">{title}</a>
            </Link>
        </div>
    );
}

export const IconButton: React.FC<IconButtonProps> = ({
    src,
    route,
    style
}) => {
    return (
        <div className="nav-button" style={style}>
            <Link className="nav-icon-link" to={route}>
                <img className="nav-icon-img" src={src} />
            </Link>
        </div>
    );
}

const NavButtonGroup: React.FC<NavButtonGroupProps> = () => {
    return (
        <div className="nav-button-group">
            <IconButton
                route={HomePageRoute}
                src={bookmark}
                style={{
                    padding: "1rem"
                }}
            />
            <IconButton
                route={AccountPageRoute}
                src={accountImage}
                style={{
                    padding: "1rem"
                }}
            />
        </div>
    );
};

export default NavButtonGroup;