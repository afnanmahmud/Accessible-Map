import AccountIconAndName from "@/components/AccountIconAndName";
import NavButtonGroup, { NavButton } from "@/components/NavButtonGroup";
import accountImage from "../../assets/account.png";
import AccoundFieldForm from "@/components/AccountFieldForm";

const AccountPage = () => {
    return (
        <div>
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