import { DropdownOptionProps, DropdownProps } from "@/types";
import "./styles.css"
import { Link } from "react-router-dom";
import { AccountPageRoute } from "@/pages/AccountPage/AccountPage";

export const DropdownOption: React.FC<DropdownOptionProps> = ({
    optionName,
    optionUrl
}) => {
    return (
        <li className="dropdown-option">
            <Link to={optionUrl}>{optionName}</Link>
        </li>
    );
}

export const Dropdown: React.FC<DropdownProps> = () => {
    return (
        <div className="dropdown-container">
            <ul className="dropdown-list">
                <DropdownOption optionName="Account" optionUrl={AccountPageRoute} />
                <DropdownOption optionName="Help" optionUrl="#" />
                <DropdownOption optionName="Sign out" optionUrl="#" />
            </ul>
        </div>
    );
}