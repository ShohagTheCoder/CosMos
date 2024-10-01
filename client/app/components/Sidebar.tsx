"use client";
import "./style.css";
import HomeIcon from "../icons/ShopIcon";
import ProductsIcon from "../icons/ProductsIcon";
import SellsIcon from "../icons/SellsIcon";
import UserIcon from "../icons/UserIcon";
import SettingIcon from "../icons/SettingIcon";
import CustomersIcon from "../icons/CustomersIcon";
import AddIcon from "../icons/AddIcon";
import CommandIcon from "../icons/CommandIcon";
import PurchaseIcon from "../icons/PurchaseIcon";
import SellIcon from "../icons/SellIcon";
import TrashIcon from "../icons/TrashIcon";
import SidebarItem from "./SidebarItem";
import ColsIcon from "../icons/ColsIcon";
import ShopIcon from "../icons/ShopIcon";

export default function Sidebar({
    active = "home",
    userId = undefined,
}: {
    active: string;
    userId: undefined | string;
}) {
    return (
        <div className="bg-gray-300 dark:bg-gray-900 fixed text-black dark:text-white start-0 top-0 w-[80px] h-screen border-r-2 border-dashed border-slate-600 z-[1000]">
            <div className="h-full flex flex-col justify-between items-center py-6">
                <div className="flex flex-col justify-center items-center gap-4">
                    <SidebarItem
                        label="Dashboard"
                        icon={<ColsIcon />}
                        link="/"
                        isActive={active === "home"}
                    />
                    <SidebarItem
                        label="Shop"
                        icon={<ShopIcon />}
                        link="/shop"
                        isActive={active === "shop"}
                    />
                    <SidebarItem
                        label="Sells"
                        icon={<SellIcon />}
                        link="/actions/sell"
                        isActive={active === "sell"}
                    />
                    <SidebarItem
                        label="Purchase"
                        icon={<PurchaseIcon />}
                        link="/actions/purchase"
                        isActive={active === "purchase"}
                    />
                    <SidebarItem
                        label="Sells List"
                        icon={<SellsIcon />}
                        link="/sells"
                        isActive={active === "sells"}
                    />
                    <SidebarItem
                        label="Products"
                        icon={<ProductsIcon />}
                        link="/products"
                        isActive={active === "products"}
                    />
                    <SidebarItem
                        label="Create Product"
                        icon={<AddIcon />}
                        link="/products/create"
                        isActive={active === "createProduct"}
                    />
                    <SidebarItem
                        label="Customers"
                        icon={<CustomersIcon />}
                        link="/customers"
                        isActive={active === "customers"}
                    />
                    <SidebarItem
                        label="Create Customer"
                        icon={<AddIcon />}
                        link="/customers/create"
                        isActive={active === "createCustomer"}
                    />
                    <SidebarItem
                        label="Commands"
                        icon={<CommandIcon />}
                        link="/commands"
                        isActive={active === "commands"}
                    />
                    <SidebarItem
                        label="Trashes"
                        icon={<TrashIcon />}
                        link="/trashes"
                        isActive={active === "trashes"}
                    />
                </div>
                <div className="flex flex-col justify-center items-center gap-4 border-t-2 border-dashed pt-5 border-gray-500">
                    {userId && (
                        <SidebarItem
                            label="User Profile"
                            icon={<UserIcon />}
                            link={`/users/${userId}`}
                            isActive={active === "user"}
                        />
                    )}
                    <SidebarItem
                        label="Settings"
                        icon={<SettingIcon />}
                        link="/settings"
                        isActive={active === "settings"}
                    />
                </div>
            </div>
        </div>
    );
}
