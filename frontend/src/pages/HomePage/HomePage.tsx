import AccessibleMap from "@/components/AccessibleMap/AccessibleMap";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import "./HomePage.css"
import { useState } from "react";

const HomePage = () => {
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
        <div className="app-container">
            <PageTitle title="Kennesaw State University - Accessible Map" />
            <AccessibleMap highContrast={highContrast} setHighContrast={setHC} />
        </div>
    );
};

export const HomePageRoute = "/"
export default HomePage;