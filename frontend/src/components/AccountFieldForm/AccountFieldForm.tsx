import { AccoundFieldProps, AccountFormProps, AccountPreferencesAndInfoProps } from "@/types";
import "./AccountFieldForm.css"

//user profile page
export const AccoundField: React.FC<AccoundFieldProps> = ({
    fieldName,
    hidden,
    highContrast
}) => {
    const fieldClassName = fieldName.trim().toLowerCase().split(" ").join("-");
    const highContrastClass = highContrast ? "high-contrast" : "";
    return (
        <div className={`account-field ${fieldClassName}`}>
            <p className={`account-field-name ${highContrastClass}`}>{fieldName}</p>
            <input
                type={hidden ? "password" : "text"} //added text, unsure if correct
                className={`account-field-input ${fieldClassName} ${highContrastClass}`}
                aria-label={`Enter your ${fieldName}`} />
            <button className={`account-field-button ${fieldClassName} ${highContrastClass}`}
                aria-label={`Edit $fieldName}`}>Edit</button>
        </div>
    );
};

//accessability + lifestyle preferences
export const AccountPreferencesAndInfo: React.FC<AccountPreferencesAndInfoProps> = ({
    highContrast,
    setHighContrast
}) => {
    const getOptionId = (name: string) => {
        return name.trim().toLowerCase().split(" ").join("-")
    }
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

    const handleAccessibilityCheckboxClick = (e) => {
        if (e.target.id === getOptionId("High Contrast Mode")) {
            setHighContrast(e.target.checked)
        }
    }
    const highContrastClass = highContrast ? "high-contrast" : "";
    return (
        <div className="account-preferences">
            <div className="accessibility-preferences">
                <p className={`${highContrastClass}`}>Accessibility</p> <br />
                {
                    accessibilityOptions.map((option) => {
                        const optionClassName = getOptionId(option)
                        return (
                            <div className="account-info-row">
                                <input
                                    className={`accessibility-option ${optionClassName}`}
                                    type="checkbox"
                                    onClick={handleAccessibilityCheckboxClick}
                                    id={optionClassName} />
                                <label className={`label ${highContrastClass}`} htmlFor={optionClassName}>{option}</label>
                            </div>
                        )
                    })
                }
            </div>
            <div className="lifestyle-preferences">
                <p className={`${highContrastClass}`}>Lifestyle</p>
                <div className="weight">
                    <p className={`label ${highContrastClass}`}>Weight</p>
                    <input className={`weight-input ${highContrastClass}`} placeholder="lbs"
                        aria-label="Enter weight in pounds" />
                </div>
                <div className="height">
                    <p className={`label ${highContrastClass}`}>Height</p>
                    <input className={`height-input-ft ${highContrastClass}`} placeholder="ft"
                        aria-label="Enter height in feet" />
                    <br />
                    <input className={`height-input-in ${highContrastClass}`} placeholder="in"
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
                                <label className={`label ${highContrastClass}`} htmlFor={optionClassName}>{option}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

const AccountForm: React.FC<AccountFormProps> = ({
    highContrast,
    setHighContrast
}) => {
    const accountFormFields = [
        { fieldName: "Email ID", hidden: false },
        { fieldName: "Password", hidden: true }
    ]

    return (
        <div className={`account-form`}>
            {
                accountFormFields.map((field) => {
                    return (
                        <AccoundField
                            fieldName={field.fieldName}
                            hidden={field.hidden}
                            highContrast={highContrast}
                        />
                    )
                })
            }
            <AccountPreferencesAndInfo
                highContrast={highContrast}
                setHighContrast={setHighContrast}
            />
        </div>
    );
};

export default AccountForm;
