import AccountIconAndName from "@/components/AccountIconAndName/AccountIconAndName";
import NavButtonGroup, { NavButton } from "@/components/NavButtonGroup/NavButtonGroup";
import accountImage from "../../assets/accountIcon.svg";
import AccoundFieldForm from "@/components/AccountFieldForm/AccountFieldForm";
import "./AccountPage.css";
import { useState } from "react";

const AccountPage = () => {
    const [highContrast, setHighContrast] = useState(false)
    const setHC = (flag: boolean) => {
        setHighContrast(flag)
        if (flag) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    return (
        <div className={`app-container`}>
            <div className="top-bar">
                <NavButton
                    title="&#8249; Back"
                    route="/"
                    highContrast={highContrast}
                />
                <NavButtonGroup />
            </div>
            <AccountIconAndName
                src={accountImage}
                userName="John Smith"
                highContrast={highContrast}
            />
            <AccoundFieldForm highContrast={highContrast} setHighContrast={setHC} />
        </div>
    );
};

export const AccountPageRoute = "/account";
export default AccountPage;

function setState(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
