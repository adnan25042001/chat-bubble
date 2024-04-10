import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
    name?: string;
    src?: string;
    className?: string;
}

const UserAvatar = ({ name, src, className }: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src} />
            <AvatarFallback>{name && name[0]}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
