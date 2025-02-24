import { AccoundFieldProps, AccountFormProps, AccountPreferencesAndInfoProps } from "@/types";
import "./styles.css"

export const AccoundField: React.FC<AccoundFieldProps> = ({
    fieldName,
    hidden
}) => {
    const fieldClassName = fieldName.trim().toLowerCase().split(" ").join("-");
    return (
        <div className={`account-field ${fieldClassName}`}>
            <p className="account-field-name">{fieldName}</p>
            <input type={hidden ? "password" : ""} className={`account-field-input ${fieldClassName}`} />
            <button className={`account-field-button ${fieldClassName}`}>Edit</button>
        </div>
    );
};

export const AccountPreferencesAndInfo: React.FC<AccountPreferencesAndInfoProps> = () => {
    const accessibilityOptions = [
        "Accessibility Entrances",
        "Screen Reader",
        "High Contrast Mode"
    ];
    const lifestyleOptions = [
        "Prioritize Longer Routes",
        "Show Steps and Calories"
    ]
    return (
        <div className="account-preferences">
            <div className="accessibility-preferences">
                <p>Accessibility</p>
                {
                    accessibilityOptions.map((option) => {
                        const optionClassName = option.trim().toLowerCase().split(" ").join("-")
                        return (
                            <div>
                                <input className={`accessibility-option ${optionClassName}`} type="checkbox" />
                                <label className="label">{option}</label>
                            </div>
                        )
                    })
                }
            </div>
            <div className="lifestyle-preferences">
                <p>Lifestyle</p>
                <div className="weight">
                    <p className="label">Weight</p>
                    <input className="weight-input" placeholder="lbs" />
                </div>
                <div className="height">
                    <p className="label">Height</p>
                    <input className="height-input-ft" placeholder="ft" />
                    <br />
                    <input className="height-input-in" placeholder="in" />
                    <br />
                </div>
                {
                    lifestyleOptions.map((option) => {
                        const optionClassName = option.trim().toLowerCase().split(" ").join("-")
                        return (
                            <div>
                                <input className={`lifestyle-option ${optionClassName}`} type="checkbox" />
                                <label className="label">{option}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

const AccountForm: React.FC<AccountFormProps> = () => {
    const accountFormFields = [
        { fieldName: "Email ID", hidden: false },
        { fieldName: "Password", hidden: true }
    ]
    return (
        <div className="account-form">
            {
                accountFormFields.map((field) => {
                    return (
                        <AccoundField
                            fieldName={field.fieldName}
                            hidden={field.hidden}
                        />
                    )
                })
            }
            <AccountPreferencesAndInfo />
        </div>
    );
};

export default AccountForm;