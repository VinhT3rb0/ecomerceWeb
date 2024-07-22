import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { database } from "../../firebase";
import { ref, get, remove } from "firebase/database";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CartOffcanvas = () => {
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
            console.log(99999999, itemsArray);
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

  const DeleteAllItem = async () => {
    emptyCart();
    await remove(ref(database, `user_cart/${userData}`));
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
      <div
        style={{
          background: "red",
          textAlign: "center",
          borderRadius: "50%",
          width: 20,
          height: 20,
          color: "white",
          position: "absolute",
          top: -14,
          right: -8,
        }}
      >
        {totalItems}
      </div>

      <div>
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasCart"
          aria-controls="offcanvasCart"
        >
          <ShoppingCartOutlined className="fs-2" />
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasCart"
          aria-labelledby="offcanvasCartLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasCartLabel">
              Giỏ hàng của bạn
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
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
                        <div style={{ width: 150 }}>{item.name}</div>
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
                <button className="btn btn-danger mt-3" onClick={DeleteAllItem}>
                  Xóa hết
                </button>
              </>
            )}
          </div>

          <div className="d-flex justify-content-between pb-2 px-2">
            <a
              href="/myitem"
              className="btn btn-secondary"
              tabIndex="-1"
              role="button"
              aria-disabled="true"
            >
              Đơn hàng của tôi
            </a>
            <a
              href="/payments"
              className="btn btn-primary"
              tabIndex="-1"
              role="button"
              aria-disabled="true"
            >
              Thanh toán
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOffcanvas;
