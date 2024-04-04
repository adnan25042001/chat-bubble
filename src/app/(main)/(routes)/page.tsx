import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
    return (
        <div>
            <UserButton afterSignOutUrl="/" />
            <ThemeToggle />
        </div>
    );
};

export default Home;
