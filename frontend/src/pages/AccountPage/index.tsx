import AccountIconAndName from "@/components/AccountIconAndName";
import NavButtonGroup, { NavButton } from "@/components/NavButtonGroup";
import accountImage from "../../assets/accountIcon.svg";
import AccoundFieldForm from "@/components/AccountFieldForm";

const AccountPage = () => {
    return (
        <div className="app-container">
            <div className="top-bar">
                <NavButton
                    title="&#8249; Back"
                    route="/"
                />
                <NavButtonGroup />
            </div>
            <AccountIconAndName
                src={accountImage}
                userName="John Smith"
            />
            <AccoundFieldForm />
        </div>
    );
};

export const AccountPageRoute = "/account";
export default AccountPage;