import { AccoundFieldProps, AccountFormProps, AccountPreferencesAndInfoProps } from "@/types";
import "./styles.css"

//user profile page
export const AccoundField: React.FC<AccoundFieldProps> = ({
    fieldName,
    hidden
}) => {
    const fieldClassName = fieldName.trim().toLowerCase().split(" ").join("-");
    return (
        <div className={`account-field ${fieldClassName}`}>
            <p className="account-field-name">{fieldName}</p>
            <input type={hidden ? "password" : "text"} //added text, unsure if correct
                className={`account-field-input ${fieldClassName}`}
                aria-label={`Enter your ${fieldName}`} />
            <button className={`account-field-button ${fieldClassName}`}
                aria-label={`Edit $fieldName}`}>Edit</button>
        </div>
    );
};

//accessability + lifestyle preferences
export const AccountPreferencesAndInfo: React.FC<AccountPreferencesAndInfoProps> = () => {
    const accessibilityOptions = [
        "Accessibility Entrances",
        "Screen Reader",
        "High Contrast Mode",
        "Show elevators"
    ];
    const lifestyleOptions = [
        "Prioritize Longer Routes",
        "Show Steps and Calories"
    ]
    return (
        <div className="account-preferences">
            <div className="accessibility-preferences">
                <p>Accessibility</p> <br />
                {
                    accessibilityOptions.map((option) => {
                        const optionClassName = option.trim().toLowerCase().split(" ").join("-")
                        return (
                            <div className="account-info-row">
                                <input className={`accessibility-option ${optionClassName}`} type="checkbox"
                                    id={optionClassName} />
                                <label className="label" htmlFor={optionClassName}>{option}</label>
                            </div>
                        )
                    })
                }
            </div>
            <div className="lifestyle-preferences">
                <p>Lifestyle</p>
                <div className="weight">
                    <p className="label">Weight</p>
                    <input className="weight-input" placeholder="lbs"
                        aria-label="Enter weight in pounds" />
                </div>
                <div className="height">
                    <p className="label">Height</p>
                    <input className="height-input-ft" placeholder="ft"
                        aria-label="Enter height in feet" />
                    <br />
                    <input className="height-input-in" placeholder="in"
                        aria-label="Enter height in inches" />
                    <br />
                </div>
                {
                    lifestyleOptions.map((option) => {
                        const optionClassName = option.trim().toLowerCase().split(" ").join("-")
                        return (
                            <div className="fitness-options">
                                <input className={`lifestyle-option ${optionClassName}`} type="checkbox"
                                    id={optionClassName} />
                                <label className="label" htmlFor={optionClassName}>{option}</label>
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
