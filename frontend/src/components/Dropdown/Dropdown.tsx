import React, { useState, useRef, useEffect } from "react";
import { DropdownOptionProps, DropdownProps } from "@/types";
import "./Dropdown.css";
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

const Dropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle the dropdown when the profile image is clicked


    // Close the dropdown if a click happens outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);




    return (
        <div className="user-dropdown" ref={dropdownRef}>

            <div className="dropdown-menu">
                <ul className="dropdown-list">
                    <DropdownOption optionName="Account" optionUrl={AccountPageRoute} />
                    <DropdownOption optionName="Help" optionUrl="#" />
                    <DropdownOption optionName="Sign out" optionUrl="#" />
                </ul>
            </div>

        </div>
    );
};

export default Dropdown;


// import { DropdownOptionProps, DropdownProps } from "@/types";
// import "./Dropdown.css"
// import { Link } from "react-router-dom";
// import { AccountPageRoute } from "@/pages/AccountPage/AccountPage";

// export const DropdownOption: React.FC<DropdownOptionProps> = ({
//     optionName,
//     optionUrl
// }) => {
//     return (
//         <li className="dropdown-option">
//             <Link to={optionUrl}>{optionName}</Link>
//         </li>
//     );
// }

// export const Dropdown: React.FC<DropdownProps> = () => {
//     return (
//         <div className="dropdown-container">
//             <ul className="dropdown-list">
//                 <DropdownOption optionName="Account" optionUrl={AccountPageRoute} />
//                 <DropdownOption optionName="Help" optionUrl="#" />
//                 <DropdownOption optionName="Sign out" optionUrl="#" />
//             </ul>
//         </div>
//     );
// }