function handleKeyDown(e: KeyboardEvent): void {
    // console.log("---------------------------------");
    // console.log(e.key);
    // console.log(e.code);

    if (e.code == "Minus") {
        e.preventDefault();
        setCommand("");
        return;
    }

    const repeatableKeys = ["Backspace", "Space", "Numpad0"];
    if (!repeatableKeys.includes(e.code)) {
        if (pressedKeysRef.current.has(e.code)) {
            e.preventDefault();
            return;
        }
    }

    if (command.length == 1 && /^[a-zA-Z]$/.test(command) && command == e.key) {
        let productKey = productsMap[command];
        if (!productKey) return;
        let product = products[productKey];
        if (!product) return;
        e.preventDefault();
        setCommand("");
        dispatch(addToCart(product));
        return;
    }

    // Add to pressed keys
    pressedKeysRef.current.add(e.code);
    // Remove previous saved key so we can click again if keyup even occur in the keyup handler
    groupPressedRef.current = false;

    // Important: preventDefault special keys
    const specialKeys = [
        "Enter",
        "NumpadAdd",
        "NumpadSubtract",
        "ArrowUp",
        "ArrowDown",
    ];
    if (specialKeys.includes(e.code)) {
        e.preventDefault();
    }

    // Handle sell page navigation
    const sellPageNavigationKeys = ["F5", "F6", "F7", "F8"];
    if (sellPageNavigationKeys.includes(e.key)) {
        e.preventDefault();
        stopKeyUpHandlerRef.current = true;
        handleSellPageChange(e.key);
        return;
    }

    const longPressKeys = [
        "NumpadAdd",
        "NumpadEnter",
        "F9",
        "Delete",
        "ArrowUp",
        "ArrowDown",
        "NumpadSubtract",
    ];
    if (
        longPressKeys.includes(e.code) &&
        keyPressTimerRef.current == undefined
    ) {
        switch (e.code) {
            case "NumpadAdd":
            case "NumpadEnter":
            case "ArrowUp":
            case "ArrowDown":
                e.preventDefault();
                keyPressTimerRef.current = setTimeout(
                    () => handleLongKeyPress(e),
                    longPressDuration
                );
                break;
            case "NumpadSubtract":
                e.preventDefault();
                keyPressTimerRef.current = setTimeout(() => {
                    longPressedRef.current = true;
                    setCommand("");
                }, longPressDuration);
                break;
            case "Delete":
                e.preventDefault();
                keyPressTimerRef.current = setTimeout(() => {
                    longPressedRef.current = true;
                    dispatch(removeFromCart(undefined));
                }, longPressDuration);
                break;
        }
    }

    if (e.key == "/") {
        setCommand("");
    }
    if (e.key == "*") {
        setCommand("");
    }

    // Complete sell
    if (
        ["Numpad0", "Numpad1"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        setCommand("");
        stopKeyUpHandlerRef.current = true;
        groupPressedRef.current = true;

        if (commandCounter.current.name === "completeSell") {
            commandCounter.current.value += 1;
            if (commandCounter.current.value >= 3) {
                commandCounter.current = { name: "unknown", value: 0 };
                console.log("Complete sell");
            }
        } else {
            commandCounter.current = { name: "completeSell", value: 1 };
        }

        return;
    }
    // Chage cart active product to previous
    if (pressedKeysRef.current.has("NumpadEnter") && e.code == "NumpadAdd") {
        e.preventDefault();
        groupPressedRef.current = true;
        if (keyPressTimerRef.current) {
            clearTimeout(keyPressTimerRef.current);
            keyPressTimerRef.current = undefined;
        }
        changeCartActiveProductTo(-1);
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Chage cart active product to next
    if (pressedKeysRef.current.has("NumpadAdd") && e.code == "NumpadEnter") {
        e.preventDefault();
        groupPressedRef.current = true;
        if (keyPressTimerRef.current) {
            clearTimeout(keyPressTimerRef.current);
            keyPressTimerRef.current = undefined;
        }
        changeCartActiveProductTo(1);
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Increase discount
    if (
        ["Numpad2", "Numpad5"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        dispatch(updateDiscountAmount({ key: undefined, amount: 1 }));
        setCommand("");
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Decrease discount
    if (
        ["Numpad8", "Numpad5"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        dispatch(updateDiscountAmount({ key: undefined, amount: -1 }));
        setCommand("");
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Increase extra discount
    if (
        ["Numpad1", "Numpad4"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        dispatch(updateExtraDiscountAmount({ key: undefined, amount: 1 }));
        setCommand("");
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Decrease extra discount
    if (
        ["Numpad4", "Numpad7"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        dispatch(updateExtraDiscountAmount({ key: undefined, amount: -1 }));
        setCommand("");
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        return;
    }

    // Rrset product price
    if (
        ["PageUp", "PageDown"].every((key) => pressedKeysRef.current.has(key))
    ) {
        e.preventDefault();
        groupPressedRef.current = true;
        stopKeyUpHandlerRef.current = true;
        dispatch(resetSalePrice(undefined));
        return;
    }

    // Dont go down. Work has done
    const notToHandleKeys = ["PageUp", "PageDown"];
    if (notToHandleKeys.includes(e.key)) {
        e.preventDefault();
        return;
    }

    if (e.code == "NumpadDecimal") {
        if (command == "..") {
            stopKeyUpHandlerRef.current = true;
            e.preventDefault();
            setCommand("");
            return;
        }
    }

    if (e.code == "Numpad0") {
        switch (command) {
            case ".":
                e.preventDefault();
                setCommand("");
                dispatch(updatePaid(0));
                return;
        }
    }

    if (e.key == "Enter" || e.code == "NumpadAdd") {
        if (/^[1-9]$/.test(command)) {
            stopLongPress();
            stopKeyUpHandlerRef.current = true;
            e.preventDefault();
            setCommand("");
            dispatch(
                updateQuantity({
                    key: undefined,
                    quantity: parseInt(command),
                })
            );
            return;
        }

        if (/^[a-zA-Z]$/.test(command)) {
            let productKey = productsMap[command];
            if (!productKey) return;
            let product = products[productKey];
            if (!product) return;
            stopKeyUpHandlerRef.current = true;
            stopLongPress();
            e.preventDefault();
            setCommand("");
            dispatch(addToCart(product));
            return;
        }

        if (/^\.[1-9]*[0-9]*$/.test(command)) {
            stopLongPress();
            stopKeyUpHandlerRef.current = true;
            e.preventDefault();
            setCommand("");

            if (command == ".") {
                dispatch(updatePaid(cart.totalPrice));
                return;
            }

            if (command.length > 1) {
                let amount = parseInt(command.slice(1));
                if (amount) {
                    dispatch(updatePaid(amount));
                }
                return;
            }
        }

        if (command.length <= 4) {
            if (/^0[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                e.preventDefault();
                const quantity = parseInt(command.slice(1));
                setCommand("");
                dispatch(updateQuantity({ key: undefined, quantity }));
                return;
            }
        }

        if (command.length >= 4) {
            if (/^[1-9]{2}0[1-9][0-9]+$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                e.preventDefault();
                setCommand("");
                const key = command.slice(0, 2);
                const quantity = parseInt(command.slice(2));
                const productId = productsMap[key];
                if (productId) {
                    dispatch(
                        addToCartWith({
                            product: products[productId],
                            quantity,
                        })
                    );
                }
                return;
            }
        }

        // To add extra discount amount dynamically with one . at the start
        if (/^\/[1-9][0-9]*$/.test(command)) {
            stopLongPress();
            stopKeyUpHandlerRef.current = true;
            e.preventDefault();
            let amount = parseInt(command.slice(1));
            setCommand("");
            dispatch(addExtraDiscount({ key: undefined, amount }));
            return;
        }

        // To add discount amount dynamically with two .. at the start
        if (/^\*[1-9][0-9]*$/.test(command)) {
            stopLongPress();
            stopKeyUpHandlerRef.current = true;
            e.preventDefault();
            let amount = parseInt(command.slice(1));
            setCommand("");
            dispatch(addDiscount({ key: undefined, amount }));
            return;
        }
    }

    let max = 0;
    switch (e.key) {
        case "Shift":
            // setIsShift(true);
            break;

        case "Tab":
            e.preventDefault();
            noteRef.current?.focus();
            break;

        case "ArrowLeft":
            e.preventDefault();
            if (filteredCustomers && filteredProducts) {
                max = isCustomers
                    ? Object.keys(filteredCustomers).length - 1
                    : Object.keys(filteredProducts).length - 1;
                if (command.length > 0) {
                    dispatch(selectPreviousProduct(max));
                } else {
                    dispatch(shiftMeasurementTo(-1));
                }
            }
            break;
        case "ArrowRight":
            e.preventDefault();
            if (filteredCustomers && filteredProducts) {
                max = isCustomers
                    ? Object.keys(filteredCustomers).length - 1
                    : Object.keys(filteredProducts).length - 1;
                if (command.length > 0) {
                    dispatch(selectNexProduct(max));
                } else {
                    dispatch(shiftMeasurementTo(1));
                }
            }
            break;
        case "F10":
            e.preventDefault();
            window.location.href = "./return";
            break;
        case "Enter":
            if (
                !isCustomers &&
                command.length > 0 &&
                filteredCustomers &&
                filteredProducts
            ) {
                if (
                    Object.keys(filteredProducts).length > 0 &&
                    /^[a-zA-Z]+/.test(command)
                ) {
                    const product = {
                        ...Object.values(filteredProducts)[
                            cart.selectedProductIndex
                        ],
                        quantity: 1,
                    };
                    dispatch(addToCart(product));
                    setCommand("");
                }
            } else if (command.length > 1 && filteredCustomers) {
                if (Object.keys(filteredCustomers).length > 0) {
                    handleAddCustomer();
                    setCommand("");
                }
            }
            break;
    }
}