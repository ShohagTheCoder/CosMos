import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateProductState } from "../store/slices/productSlice";
import StateManager from "../store/providers/managers/common/stateManager";

// Singleton variable to hold the instance
let productManagerInstance: StateManager | null = null;

// Custom hook for managing the product state as a singleton
export const useProductManager = () => {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    if (!productManagerInstance) {
        // Create the instance if it doesn't exist
        productManagerInstance = new StateManager(
            product,
            dispatch,
            updateProductState
        );
    }

    return productManagerInstance;
};
