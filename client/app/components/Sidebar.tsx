import React from "react";
import "./style.css";
import Icon from "./Icon";
import HomeIcon from "../icons/HomeIcon";
import ProductsIcon from "../icons/ProductsIcon";
import SellIcon from "../icons/SellIcon";
import PurchaseIcon from "../icons/PurchaseIcon";
import SellsIcon from "../icons/SellsIcon";
import UserIcon from "../icons/UserIcon";
import SettingIcon from "../icons/SettingIcon";
import CustomersIcon from "../icons/CustomersIcon";

function Sidebar({ active = "home" }: { active: string }) {
    function getBtnStyleClass(value: string) {
        return `h-[40px] w-[40px] hover:scale-125 transition-transform rounded-full ${
            active == value ? "sidebar-item-active" : ""
        }`;
    }

    return (
        <div className="bg-gray-300 dark:bg-gray-900 fixed start-0 top-0 w-[80px] h-full border-r-2 border-dashed border-slate-600">
            <div className="h-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-5">
                    <button className={getBtnStyleClass("home")}>
                        <a
                            href={"/"}
                            className="text-center flex justify-center items-center"
                        >
                            <HomeIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("sell")}>
                        <a
                            href={"/actions/sell"}
                            className="text-center flex justify-center items-center"
                        >
                            <SellIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("purchase")}>
                        <a
                            href={"/actions/purchase"}
                            className="text-center flex justify-center items-center"
                        >
                            <PurchaseIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("sells")}>
                        <a
                            href={"/sells"}
                            className="text-center flex justify-center items-center"
                        >
                            <SellsIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("purchase")}>
                        <a
                            href={"/products"}
                            className="text-center flex justify-center items-center"
                        >
                            <ProductsIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("users")}>
                        <a
                            href="/customers"
                            className="text-center flex justify-center items-center"
                        >
                            <CustomersIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("users")}>
                        <a
                            href={`/users}`}
                            className="text-center flex justify-center items-center"
                        >
                            <UserIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("settings")}>
                        <a
                            className="text-center flex justify-center items-center"
                            href={"/settings"}
                        >
                            <SettingIcon />
                        </a>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
