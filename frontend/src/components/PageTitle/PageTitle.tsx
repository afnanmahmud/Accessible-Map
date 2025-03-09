import { PageTitleProps } from "@/types";
import "./PageTitle.css"

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <h1 className="title">{title}</h1>
    );
}