import AccessibleMap from "@/components/AccessibleMap";
import { PageTitle } from "@/components/PageTitle";
import "./styles.css"

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