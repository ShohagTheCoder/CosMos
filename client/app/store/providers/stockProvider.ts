import { useDispatch } from "react-redux";
import { StockManager } from "./managers/stockManager";
import {
    initialStockState,
    StockState,
    updateStockState,
} from "../slices/stockSlice";

let stockManagerInstance: StockManager<StockState> | null = null;

export default function useStockManager() {
    const dispatch = useDispatch();

    if (stockManagerInstance == null) {
        stockManagerInstance = new StockManager(
            initialStockState,
            dispatch,
            updateStockState
        );
    }

    return stockManagerInstance;
}
