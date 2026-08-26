import { Company } from "@/Pages/Admin/Types/company";
import { NavItem } from "./navTypes";
import {
    Building2,
    BriefcaseBusiness,
    GitBranchPlus,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

export default function getNavLinks(companies: Company[]): NavItem[] {
    return [
        {
            group: "Organization",
            links: [
                {
                    icon: <Building2 />,
                    title: "Companies",
                    path: "/admin/companies",
                },
                {
                    icon: <BriefcaseBusiness />,
                    title: "Job Positions",
                    path: "/admin/job-positions",
                },
                {
                    icon: <GitBranchPlus />,
                    title: "Job Assignments",
                    path: "/admin/all-job-positions",
                },
            ],
        },

        {
            group: "Users",
            links: [
                {
                    icon: <ShieldCheck />,
                    title: "Admin",
                    path: "/admin/users/admins",
                },
                {
                    icon: <UsersRound />,
                    title: "Employee",
                    path: "/admin/users/employees",
                },
            ],
        },
        {
            group: "Workspace",
            links: [
                ...companies.map((company) => ({
                    logo_path: company.logo_path,
                    title: company.name,
                    path: `/admin/folders/${company.slug}`,
                })),
            ],
        },
    ];
}
