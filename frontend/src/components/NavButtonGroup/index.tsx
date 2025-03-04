import { AccountPageRoute } from "@/pages/AccountPage";
import "./styles.css"

import { IconButtonProps, NavButtonGroupProps, NavButtonProps } from "@/types";
import { Link } from "react-router-dom";
import { HomePageRoute } from "@/pages/HomePage";
import accountImage from "../../assets/accountIcon.svg";
import bookmark from "../../assets/bookmark.svg";
import { Dropdown } from "../Dropdown";
import { useState } from "react";

export const NavButton: React.FC<NavButtonProps> = ({
    route,
    title,
    style
}) => {
    return (
        <div className="nav-button" style={style}>
            <Link className="nav-link round" to={route} aria-label={`Navigate to ${title}`}>
                <a className="nav-button">{title}</a>
            </Link>
        </div>
    );
}

export const IconButton: React.FC<IconButtonProps> = ({
    src,
    route,
    style,
    onClick,
    children,
}) => {
    return (
        <div className="nav-button" style={style}>
            <img className="nav-icon-img" src={src} />
            {children}
        </div>
    );
}

const NavButtonGroup: React.FC<NavButtonGroupProps> = () => {
    const [dropdown, setDropdown] = useState(false);

    return (
        <div className="nav-button-group">
            <div className="nav-button">
                <img className="nav-icon-img" src={bookmark} />
            </div>
            <div className="nav-button">
                <img
                    className="nav-icon-img"
                    src={accountImage}
                    onClick={() => setDropdown(!dropdown)} />
                {
                    dropdown && <Dropdown />
                }
            </div>
            {/* <IconButton
                route={HomePageRoute}
                src={bookmark}
                style={{
                    padding: "1rem"
                }}
                aria-label="Go to Home Page"
            />
            <IconButton
                route={AccountPageRoute}
                src={accountImage}
                style={{
                    padding: "1rem"
                }}
                onClick={() => setDropdown(!dropdown)}
            >
                {
                    dropdown && <Dropdown />
                }
            </IconButton> */}

        </div>

    );
};

export default NavButtonGroup;
