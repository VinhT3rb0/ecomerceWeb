import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, DatePicker, InputNumber, Select, message } from 'antd';
import moment from 'moment';
import ItemPayments from '../ItemPayments/ItemPayments';
import { useCart } from "react-use-cart";
import { database } from "../../firebase";
import { ref, get, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const Payment = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [cartTotal, setCartTotal] = useState(0);
    const userData = localStorage.getItem("user");
    const userDataId = localStorage.getItem("userId");
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
    const [idsp, setIdsp] = useState([]);
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
                            id: data[key].id
                        }));

                        console.log(itemsArray);
                        setIdsp(itemsArray);
                        setItems(itemsArray);
                        console.log(items);
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
        form.setFieldsValue({ total_money: cartData.cartTotal });
        localStorage.setItem("react-use-cart", JSON.stringify(cartData));
    }, [items]);




    console.log(12345, idsp);

    const onFinish = async (values) => {
        const cartData = JSON.parse(localStorage.getItem('react-use-cart'));

        const combinedItems = idsp.map(product => {
            const cartItem = cartData?.items.find(item => item.name === product.name);
            console.log(777777777777, product);
            return {
                product_id: product.id,
                quantity: cartItem ? cartItem.quantity : 0
            };
        });

        console.log(55555555555, combinedItems);


        const data = {
            ...values,
            user_id: userDataId,
            cart_items: combinedItems,
            shipping_date: moment().add(3, 'days').format('YYYY-MM-DD'), // Set shipping date to 3 days from today
        };

        console.log(9999, data);

        await axios.post('https://api.trandai03.online/api/orders', data)
            .then(response => {
                message.success("Đặt hàng thành công");
                form.resetFields();
                console.log('Order created:', response.data);
                // Xóa trên firebase mới được
            })
            .catch(error => {
                console.error('There was an error creating the order!', error);
            });
        await remove(ref(database, `user_cart/${userData}`));
        emptyCart();

    };
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
            removeItem(itemId);
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };
    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <div className='d-flex justify-content-between'>
            <div className='w-50'>
                <h5 className="offcanvas-title" id="offcanvasCartLabel">
                    Giỏ hàng của bạn
                </h5>
                <div style={{ width: 530 }}>
                    {isEmpty ? (
                        <p>Không còn mặt hàng nào</p>
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
                                            <div style={{ width: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {item.name}
                                            </div>
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
            <div className='w-50'>
                <Form
                    className='mx-5'
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        status: 'Wait',
                        shipping_method: 'Standard',
                        payment_method: 'Credit Card',
                    }}
                >
                    <Form.Item
                        label="Fullname"
                        name="fullname"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Telephone"
                        name="telephone"
                        rules={[{ required: true, message: 'Please input your telephone number!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Note"
                        name="note"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Shipping Method"
                        name="shipping_method"
                    >
                        <Select>
                            <Option value="Standard">Standard</Option>
                            <Option value="Express">Express</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Shipping Address"
                        name="shipping_address"
                        rules={[{ required: true, message: 'Please input your shipping address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Payment Method"
                        name="payment_method"
                    >
                        <Select>
                            <Option value="Credit Card">Credit Card</Option>
                            <Option value="PayPal">PayPal</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Total Money"
                        name="total_money"
                        rules={[{ required: true, message: 'Please input the total money!' }]}
                    >
                        <InputNumber disabled={true} min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Payment;
