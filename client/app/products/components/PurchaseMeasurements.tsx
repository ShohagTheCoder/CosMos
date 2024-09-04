import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
    addPurchaseMeasurement,
    updatePurchaseMeasurementUnit,
    updatePurchaseMeasurementValue,
} from "@/app/store/slices/productSlice";

function PurchaseMeasurements() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const purchaseMeasurements = product.purchaseMeasurements;

    return (
        <div className="border border-gray-500 mb-4">
            {product.purchaseEnable
                ? purchaseMeasurements.map((measurement, key) => (
                      <div key={key}>
                          <div className="measurement bg-gray-900 p-2">
                              Purchase Unit :{" "}
                              <select
                                  className="h-[40px] bg-black text-white p-2"
                                  value={measurement.unit}
                                  onChange={(e) =>
                                      dispatch(
                                          updatePurchaseMeasurementUnit({
                                              key,
                                              unit: e.target.value,
                                          })
                                      )
                                  }
                              >
                                  {Object.values(product.units).map(
                                      (unit: any, key: number) => (
                                          <option key={key} value={unit.unit}>
                                              {unit.label}
                                          </option>
                                      )
                                  )}
                              </select>
                              Value :{" "}
                              <input
                                  type="number"
                                  className="h-[30px] bg-black w-[60px] text-white p-2"
                                  value={measurement.value}
                                  onChange={(e) =>
                                      dispatch(
                                          updatePurchaseMeasurementValue({
                                              key,
                                              value: parseInt(e.target.value),
                                          })
                                      )
                                  }
                              />
                          </div>
                          <button
                              className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                              onClick={() => dispatch(addPurchaseMeasurement())}
                          >
                              Add Measurement
                          </button>
                      </div>
                  ))
                : ""}
        </div>
    );
}

export default PurchaseMeasurements;
