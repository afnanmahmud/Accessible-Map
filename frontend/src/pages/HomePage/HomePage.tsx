import AccessibleMap from "@/components/AccessibleMap/AccessibleMap";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import "./HomePage.css"

const HomePage = () => {
    return (
        <div className="app-container">
            <PageTitle title="Kennesaw State University - Accessible Map" />
            <AccessibleMap />
        </div>
    );
};

export const HomePageRoute = "/"
export default HomePage;