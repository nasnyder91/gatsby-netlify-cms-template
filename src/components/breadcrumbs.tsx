import { Link } from "gatsby";
import React from "react";

interface BreadcrumbsProps {
    breadcrumbs: Array<{ href: string; name: string }>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    return (
        <nav className="breadcrumb has-bullet-separator" aria-label="breadcrumbs">
            <ul>
                {breadcrumbs.map((bc) => (
                    <li key={bc.href}>
                        <Link to={bc.href}>{bc.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
