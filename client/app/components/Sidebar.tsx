import React from "react";
import "./style.css";
import Icon from "./Icon";

function Sidebar() {
    return (
        <div className="fixed start-0 top-0 w-[80px] h-full bg-gray-950 border-r border-r-2 border-dashed border-slate-600">
            <div className="h-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-5">
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-900 transition-transform">
                        <Icon type={"home"} />
                    </button>
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-900 transition-transform sidebar-item-active">
                        <Icon type={"sell"} />
                    </button>
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-900 transition-transform">
                        <Icon type={"products"} />
                    </button>
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-900 transition-transform">
                        <Icon type={"user"} />
                    </button>
                    <button className="h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-900 transition-transform">
                        <Icon type={"settings"} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
