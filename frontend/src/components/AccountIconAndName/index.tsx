import { AccountIconAndNameProps } from "@/types";
import "./styles.css"

const AccountIconAndName: React.FC<AccountIconAndNameProps> = ({
    src,
    userName
}) => {
    return (
        <div className="account-icon-container">
            <div className="account-icon">
                <img className="icon" src={src} />
            </div>
            <div className="user-name">
                <p>{userName}</p>
            </div>
        </div>
    );
};

export default AccountIconAndName;