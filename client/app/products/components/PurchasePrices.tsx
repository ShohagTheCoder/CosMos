import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPurchasePrice,
    updateProductField,
    updatePurchasePriceMax,
    updatePurchasePricePrice,
    updatePurchasePriceUnit,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import Switch from "@/app/elements/switch/Switch";

function PurchasePrices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const purchasePrices = product.purchasePrices;

    function handleUpdateProductPriceByPurchasePricesUnitValue(
        key: number,
        value: number
    ) {
        const divider = product.units[purchasePrices[key].unit].value;
        dispatch(updatePurchasePricePrice({ key, price: value / divider }));
    }

    return (
        <div className="border border-gray-500 mb-4">
            <div>
                <Switch
                    checked={product.purchaseEnable}
                    onChange={(value) =>
                        dispatch(
                            updateProductField({
                                field: "purchaseEnable",
                                value,
                            })
                        )
                    }
                    label="This product will be purchased"
                    className="justify-between bg-gray-900"
                />
            </div>
            {product.purchaseEnable
                ? purchasePrices.map((price, key) => (
                      <div key={key}>
                          <div className="price bg-gray-900 p-2">
                              Purchase Unit :{" "}
                              <select
                                  className="h-[40px] bg-black text-white p-2"
                                  value={price.unit}
                                  onChange={(e) => {
                                      console.log(product);
                                      dispatch(
                                          updatePurchasePriceUnit({
                                              key,
                                              unit: e.target.value,
                                          })
                                      );
                                  }}
                              >
                                  {Object.values(product.units).map(
                                      (unit: any, key: number) => (
                                          <option key={key} value={unit.unit}>
                                              {unit.label}
                                          </option>
                                      )
                                  )}
                              </select>{" "}
                              Max :{" "}
                              <input
                                  type="number"
                                  className="h-[30px] bg-black w-[60px] text-white p-2"
                                  value={price.max}
                                  onChange={(e) =>
                                      dispatch(
                                          updatePurchasePriceMax({
                                              key,
                                              max: e.target.value,
                                          })
                                      )
                                  }
                              />
                              Price : 1 {product.saleUnitsBase} =
                              <input
                                  type="number"
                                  className="h-[30px] bg-black w-[100px] text-white p-2"
                                  value={price.price}
                                  onChange={(e) =>
                                      dispatch(
                                          updatePurchasePricePrice({
                                              key,
                                              price: e.target.value,
                                          })
                                      )
                                  }
                              />
                              ৳
                              {price.unit == product.saleUnitsBase ? (
                                  ""
                              ) : (
                                  <>
                                      {" | 1 "}
                                      {product.units[price.unit].label}
                                      <input
                                          type="number"
                                          className="h-[30px] bg-black w-[100px] text-white p-2"
                                          value={
                                              price.price *
                                              product.units[price.unit].value
                                          }
                                          step={
                                              product.units[price.unit].value /
                                              2
                                          }
                                          onChange={(e) =>
                                              handleUpdateProductPriceByPurchasePricesUnitValue(
                                                  key,
                                                  parseInt(e.target.value)
                                              )
                                          }
                                      />
                                      ৳
                                  </>
                              )}
                          </div>
                          <button
                              onClick={() => dispatch(addPurchasePrice())}
                              className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                          >
                              Add Price
                          </button>
                      </div>
                  ))
                : ""}
        </div>
    );
}

export default PurchasePrices;
