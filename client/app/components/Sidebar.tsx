import React from "react";
import "./style.css";
import Icon from "./Icon";

function Sidebar({ active = "home" }: { active: string }) {
    function getBtnStyleClass(value: string) {
        return `h-[40px] w-[40px] rounded-full bg-gray-800 hover:scale-125 hover:bg-blue-800 transition-transform ${
            active == value ? "sidebar-item-active" : ""
        }`;
    }

    return (
        <div className="fixed start-0 top-0 w-[80px] h-full bg-gray-950 border-r-2 border-dashed border-slate-600">
            <div className="h-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-5">
                    <button className={getBtnStyleClass("home")}>
                        <a href={"/"}>
                            <Icon type={"home"} />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("sell")}>
                        <a href={"/actions/sell"}>
                            <Icon type={"sell"} />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("purchase")}>
                        <a href={"/actions/purchase"}>
                            <Icon type={"products"} />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("users")}>
                        <a href="/customers">
                            <Icon type={"user"} />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("settings")}>
                        <a href={"/settings"}>
                            <Icon type={"settings"} />
                        </a>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
