import React, { useEffect, useState } from 'react'
import { useCart } from "react-use-cart";
import { database } from "../../firebase";
import { ref, get, remove } from "firebase/database";
export default function ItemPayments() {
    const userData = localStorage.getItem("user");
    const {
        isEmpty,
        items,
        updateItemQuantity,
        removeItem,
        emptyCart,
        setItems,
    } = useCart();
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                if (userData) {
                    const dbRef = ref(database, `user_cart/${userData}`);
                    const snapshot = await get(dbRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const itemsArray = Object.keys(data).map((key) => ({
                            ...data[key],
                            id: key,
                        }));

                        // Update cart with new data
                        setItems(itemsArray);
                    }
                }
            } catch (error) {
                console.error("Error fetching cart data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [userData]);

    useEffect(() => {
        const cartData = {
            items,
            isEmpty: items.length === 0,
            totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
            totalUniqueItems: items.length,
            cartTotal: items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            ),
            metadata: {},
        };

        setTotalItems(cartData.totalItems);
        localStorage.setItem("react-use-cart", JSON.stringify(cartData));
    }, [items]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    };

    const handleUpdateItemQuantity = (itemId, quantity) => {
        updateItemQuantity(itemId, quantity);
    };

    const handleRemoveItem = async (itemId) => {
        console.log("id xóa:", itemId);
        try {
            // Remove item from Firebase
            await remove(ref(database, `user_cart/${userData}/${itemId}`));

            // Remove item locally
            removeItem(itemId); // This updates the local state managed by useCart hook
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };
    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h5 className="offcanvas-title" id="offcanvasCartLabel">
                Giỏ hàng của bạn
            </h5>
            <div style={{width: 530}}>
                {isEmpty ? (
                    <p>Giỏ hàng đang trống</p>
                ) : (
                    <ul className="list-group">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        src={item?.product_images?.[0]?.image_url}
                                        alt={item.name}
                                        style={{ width: "50px", marginRight: "10px" }}
                                    />
                                    <div>
                                        <div>{item.name}</div>
                                        <div>
                                            {item.quantity} x {formatPrice(item.price)}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-sm btn-primary me-1"
                                        onClick={() =>
                                            handleUpdateItemQuantity(item.id, item.quantity - 1)
                                        }
                                    >
                                        -
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary me-1"
                                        onClick={() =>
                                            handleUpdateItemQuantity(item.id, item.quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {!isEmpty && (
                    <>
                        <div className="mt-3">
                            <h5 className="text-end">
                                Tổng tiền:{" "}
                                {items
                                    .reduce(
                                        (total, item) => total + item.price * item.quantity,
                                        0
                                    )
                                    .toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                            </h5>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
