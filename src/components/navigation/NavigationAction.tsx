import { Plus } from "lucide-react";
import ActionTootip from "../ActionTootip";

const NavigationAction = () => {
    return (
        <div>
            <ActionTootip side="right" align="center" label="Add a server">
                <button className="group flex items-center justify-center">
                    <div className="flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500"
                            size={24}
                        />
                    </div>
                </button>
            </ActionTootip>
        </div>
    );
};

export default NavigationAction;
