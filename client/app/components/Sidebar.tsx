import "./style.css";
import HomeIcon from "../icons/HomeIcon";
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

function Sidebar({
    active = "home",
    userId = undefined,
}: {
    active: string;
    userId: undefined | string;
}) {
    // let [userId, setUserId] = useState<string | undefined>(undefined);
    // useEffect(() => {
    //     setUserId(Cookies.get("user-id"));
    // }, []);

    function getBtnStyleClass(value: string) {
        return `h-[40px] w-[40px] hover:scale-125 transition-transform rounded-full ${
            active == value ? "sidebar-item-active" : ""
        }`;
    }

    return (
        <div className="bg-gray-300 dark:bg-gray-900 fixed text-black dark:text-white start-0 top-0 w-[80px] h-screen border-r-2 border-dashed border-slate-600 z-[1000]">
            <div className="h-full flex flex-col justify-between items-center py-6">
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
                    <button className={getBtnStyleClass("products")}>
                        <a
                            href={"/products"}
                            className="text-center flex justify-center items-center"
                        >
                            <ProductsIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("createProduct")}>
                        <a
                            href="/products/create"
                            className="text-center flex justify-center items-center"
                        >
                            <AddIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("customers")}>
                        <a
                            href="/customers"
                            className="text-center flex justify-center items-center"
                        >
                            <CustomersIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("createCustomer")}>
                        <a
                            href="/customers/create"
                            className="text-center flex justify-center items-center"
                        >
                            <AddIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("commands")}>
                        <a
                            href="/commands"
                            className="text-center flex justify-center items-center"
                        >
                            <CommandIcon />
                        </a>
                    </button>
                    <button className={getBtnStyleClass("trashes")}>
                        <a
                            href="/trashes"
                            className="text-center flex justify-center items-center"
                        >
                            <TrashIcon />
                        </a>
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center gap-5 border-t-2 border-dashed pt-5 border-gray-500">
                    {userId ? (
                        <button className={getBtnStyleClass("user")}>
                            <a
                                href={`/users/${userId}`}
                                className="text-center flex justify-center items-center"
                            >
                                <UserIcon />
                            </a>
                        </button>
                    ) : (
                        ""
                    )}
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
