import { RootState } from "../../store/store";
import React from "react";
import { useSelector } from "react-redux";

function CustomerDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customer = cart.customer;

    if (customer) {
        return (
            <div>
                <p>Name: {customer.fullName}</p>
                <p>Number : {customer.phoneNumber}</p>
                <p>Address : {customer.address}</p>
            </div>
        );
    }
}

export default CustomerDetails;
