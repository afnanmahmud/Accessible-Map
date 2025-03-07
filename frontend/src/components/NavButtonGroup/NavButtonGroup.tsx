import "./styles.css"
import { NavButtonGroupProps, NavButtonProps } from "@/types";
import { Link } from "react-router-dom";
import accountImage from "../../assets/accountIcon.svg";
import bookmark from "../../assets/bookmark.svg";
import { Dropdown } from "../Dropdown/Dropdown";
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
        </div>

    );
};

export default NavButtonGroup;
