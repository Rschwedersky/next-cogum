"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar(){

    const pathname = usePathname();

    const isAdminPage = pathname?.includes("/admin");
    const isProPage = pathname?.includes("/pro");
    const isUserPage = pathname?.includes("/user");

    return(
        <div className=" fixed top-12 left-0 w-full flex items-center justify-center">
            <div className=" flex items-center bg-slate-200/10 gap-2 py-1 px-2 rounded-lg">
            <Link className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-lg" href={"/"}>Go to Home Page</Link>
            {!isUserPage &&(<Link className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-lg" href={"user"}>Go to User Page</Link>)}
            {!isProPage &&(<Link className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-lg" href={"pro"}>Go to Pro Page</Link>)}
            {!isAdminPage &&(<Link className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-lg" href={"admin"}>Go to Admin Page</Link>)}
            </div>
        </div>
    )
}