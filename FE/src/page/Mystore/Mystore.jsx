import React, { useEffect, useState } from 'react';
import { Space, Modal, message, Table, Form, Input, InputNumber, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { confirm } = Modal;
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

export default function Mystore() {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [filterSku, setFilterSku] = useState('');

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số lượng',
            dataIndex: 'inventory',
            key: 'inventory',
            align: 'center',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            render: (x) => <span>{formatPrice(x)}</span>
        },
        {
            title: 'Hãng',
            dataIndex: 'sku',
            key: 'sku',
            align: 'center',
        },
        {
            title: 'Create Item',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined onClick={() => handleEditProduct(record)} />
                    <DeleteOutlined onClick={() => showDeleteConfirm(record.id)} />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.trandai03.online/api/products/all");
                setItems(response.data.data.products);
                setFilteredItems(response.data.data.products);
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filterData = () => {
            let filtered = items;

            if (searchName) {
                filtered = filtered.filter(item => item.name.toLowerCase().includes(searchName.toLowerCase()));
            }

            if (filterSku) {
                filtered = filtered.filter(item => item.sku.toLowerCase().includes(filterSku.toLowerCase()));
            }

            setFilteredItems(filtered);
        };

        filterData();
    }, [searchName, filterSku, items]);

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsModalVisible(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`https://api.trandai03.online/api/products/${id}`);
            message.success("Xóa thành công");
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('There was an error deleting the product!', error);
            message.error('Có lỗi xảy ra khi xóa!');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDeleteProduct(id);
            },
            onCancel() {
                console.log('Hủy hành động xóa');
            },
        });
    };

    const handleOk = async () => {
        const updatedProduct = {
            name: currentProduct.name,
            price: currentProduct.price,
            categoryId: currentProduct.category_id,
            sku: currentProduct.sku,
            discount: currentProduct.discount,
            description: currentProduct.description,
            inventory: currentProduct.inventory,
        };

        try {
            await axios.put(`https://api.trandai03.online/api/products/${currentProduct.id}`, updatedProduct);
            message.success('Cập nhật thành công');
            setItems(items.map(item => item.id === currentProduct.id ? { ...item, ...updatedProduct } : item));
            setIsModalVisible(false);
        } catch (error) {
            console.error('Có lỗi xảy ra khi cập nhật sản phẩm!', error);
            message.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({
            ...currentProduct,
            [name]: value,
        });
    };

    const handleNumberChange = (name, value) => {
        setCurrentProduct({
            ...currentProduct,
            [name]: value,
        });
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Input 
                        placeholder="Search by name" 
                        value={searchName} 
                        onChange={(e) => setSearchName(e.target.value)} 
                    />
                </Col>
                <Col span={12}>
                    <Input 
                        placeholder="Filter by SKU" 
                        value={filterSku} 
                        onChange={(e) => setFilterSku(e.target.value)} 
                    />
                </Col>
            </Row>
            <Table 
                columns={columns} 
                pagination={{ pageSize: 5 }} 
                dataSource={filteredItems} 
                rowKey="id" 
            />
            <Modal 
                title="Chỉnh sửa sản phẩm" 
                open={isModalVisible} 
                onOk={handleOk} 
                onCancel={handleCancel}
            >
                {currentProduct && (
                    <Form layout="vertical">
                        <Form.Item label="Name">
                            <Input 
                                name="name" 
                                value={currentProduct.name} 
                                onChange={handleInputChange} 
                            />
                        </Form.Item>
                        <Form.Item label="Price">
                            <InputNumber 
                                name="price" 
                                value={currentProduct.price} 
                                onChange={(value) => handleNumberChange('price', value)} 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                        <Form.Item label="SKU">
                            <Input 
                                name="sku" 
                                value={currentProduct.sku} 
                                onChange={handleInputChange} 
                            />
                        </Form.Item>
                        <Form.Item label="Discount">
                            <InputNumber 
                                name="discount" 
                                value={currentProduct.discount} 
                                onChange={(value) => handleNumberChange('discount', value)} 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input.TextArea 
                                name="description" 
                                value={currentProduct.description} 
                                onChange={handleInputChange} 
                            />
                        </Form.Item>
                        <Form.Item label="Inventory">
                            <InputNumber 
                                name="inventory" 
                                value={currentProduct.inventory} 
                                onChange={(value) => handleNumberChange('inventory', value)} 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
}
