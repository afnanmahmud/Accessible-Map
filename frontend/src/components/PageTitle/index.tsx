import { PageTitleProps } from "@/types";
import "./styles.css"

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <h1 className="title">{title}</h1>
    );
}