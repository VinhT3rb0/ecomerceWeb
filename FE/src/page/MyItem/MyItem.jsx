import { List, Tabs, Avatar } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function MyItem() {
    const [dataItem, setDataItem] = useState([]);
    const userData = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://api.trandai03.online/api/orders/user/${userData}`);
                setDataItem(response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };

        fetchData();
    }, []);

    if (!dataItem) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                Loading...
            </div>
        );
    }

    const getFilteredData = (status) => {
        return dataItem.filter(order => {
            switch (status) {
                case 'pending':
                    return order.status === 'pending';
                case 'processing':
                    return order.status === 'processing';
                case 'shipped':
                    return order.status === 'shipped';
                case 'delivered':
                    return order.status === 'delivered';
                case 'cancelled':
                    return order.status === 'cancelled';
                default:
                    return true;
            }
        });
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
    };

    const renderOrderItem = (order) => (
        <div key={order.id} style={{ borderBottom: '2px solid gray', padding: 15 }}>
            <div>
                <p><strong>Order ID: {order.id}</strong> - Tên: {order.fullname}</p>
                <p><strong>Total:</strong> {formatPrice(order.total_money)}</p>
                <p><strong>Trạng thái:</strong> {order.status}</p>
            </div>
            {order.order_details.map(item => (
                <div key={item.id}>
                    <div>
                        <p><strong>Tên sản phẩm:</strong> {item.product_name}</p>
                        <p><strong>Số lượng:</strong> {item.number_of_products}</p>
                    </div>
                </div>
            ))}
        </div>
    );


    const items = [
        {
            key: '1',
            label: 'Tất cả',
            children: <List
                size="small"
                bordered
                dataSource={dataItem}
                renderItem={renderOrderItem}
            />,
        },
        {
            key: '2',
            label: 'Chờ xác nhận',
            children: <List
                size="small"
                bordered
                dataSource={getFilteredData('pending')}
                renderItem={renderOrderItem}
            />,
        },
        {
            key: '3',
            label: 'Đang xử lý',
            children: <List
                size="small"
                bordered
                dataSource={getFilteredData('processing')}
                renderItem={renderOrderItem}
            />,
        },
        {
            key: '4',
            label: 'Đang giao',
            children: <List
                size="small"
                bordered
                dataSource={getFilteredData('shipped')}
                renderItem={renderOrderItem}
            />,
        },
        {
            key: '5',
            label: 'Đã giao',
            children: <List
                size="small"
                bordered
                dataSource={getFilteredData('delivered')}
                renderItem={renderOrderItem}
            />,
        },
        {
            key: '6',
            label: 'Đã hủy',
            children: <List
                size="small"
                bordered
                dataSource={getFilteredData('cancelled')}
                renderItem={renderOrderItem}
            />,
        },
    ];

    return (
        <div>
            <h2>Đơn hàng của tôi</h2>
            <Tabs style={{ marginBottom: '10px' }} defaultActiveKey="1" items={items} />
        </div>
    )
}
