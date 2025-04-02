import "./NavButtonGroup.css"
import { NavButtonGroupProps, NavButtonProps } from "@/types";
import { Link } from "react-router-dom";
import accountImage from "../../assets/hamburger-menu.png";
import bookmark from "../../assets/bookmark.svg";
import Dropdown from "../Dropdown/Dropdown";
import { useRef, useState } from "react";

export const NavButton: React.FC<NavButtonProps> = ({
    route,
    title,
    style,
    highContrast
}) => {
    return (
        <div className={`nav-button`} style={style}>
            <Link className={`nav-link round ${highContrast ? "high-contrast" : ""}`} to={route} aria-label={`Navigate to ${title}`}>
                <a className="nav-button">{title}</a>
            </Link>
        </div>
    );
}

const NavButtonGroup: React.FC<NavButtonGroupProps> = () => {
    const [dropdown, setDropdown] = useState(false);
    const catMenu = useRef<HTMLInputElement>(null)
    const closeOpenMenus = (e: any) => {
        if (dropdown && !catMenu.current?.contains(e.target)) {
            setDropdown(false)
        }
    }
    document.addEventListener('mousedown', closeOpenMenus);

    return (
        <div className="nav-button-group" ref={catMenu}>
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
