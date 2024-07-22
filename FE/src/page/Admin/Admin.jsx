import React, { useState } from 'react';
import styles from './Admin.module.css';
import { CheckSquareOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EuroCircleOutlined, FilterOutlined, LogoutOutlined, MenuUnfoldOutlined, MessageOutlined, NotificationOutlined, PieChartOutlined, PlusOutlined, RightOutlined, SearchOutlined, SettingOutlined, ShoppingOutlined, SmileOutlined, TeamOutlined, UsergroupDeleteOutlined, WindowsOutlined } from '@ant-design/icons';
import PieChart from '../../components/PieChart/PieChart';
import { Tag, Space, Modal, Image, Upload, Button, Form, Input, InputNumber, Select, message, Table } from 'antd';
import axios from 'axios';
import Mystore from '../Mystore/Mystore';
import Dashboard from '../Dashboard/Dashboard';

const { Option } = Select;

const Admin = () => {
    const [form] = Form.useForm();
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState(0);

    const handleCategoryChange = (value) => {
        console.log(category);
        setCategory(value);
    };


    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            // reader.onerror = (error) => reject(error);
        });

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('categoryId', values.categoryId);
        formData.append('description', values.description);
        formData.append('sku', values.sku);
        formData.append('inventory', values.inventory);
        formData.append('discount', values.discount);

        if (category == 1) {
            // phụ kiện
            console.log(1111);
        } if (category == 2) {
            // laptop
            formData.append('ram', values.ram);
            formData.append('drive', values.drive);
            formData.append('battery', values.battery);
            formData.append('display', values.display);
            formData.append('cpu', values.cpu);
            formData.append('vga', values.vga);

            console.log(2222);
        } if (category == 3) {
            // điện thoại
            formData.append('ram', values.ram);
            formData.append('behindCamera', values.behindCamera);
            formData.append('frontCamera', values.frontCamera);
            formData.append('drive', values.drive);
            formData.append('battery', values.battery);
            formData.append('display', values.display);
            formData.append('cpu', values.cpu);
            console.log(3333);
        }

        if (fileList.length > 0) {
            formData.append('files', fileList[0].originFileObj);
        }

        console.log("ok");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const response = await axios.post('https://api.trandai03.online/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Product added successfully!');
            form.resetFields();
            setFileList([]);
        } catch (error) {
            message.error('Failed to add product.');
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const uploadButton = (
        <Button
            icon={<PlusOutlined />}
            style={{
                border: '1px dashed #d9d9d9',
                width: '104px',
                height: '104px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            Upload
        </Button>
    );



    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', date: '01-01-2024', status: 'Available' },
        { id: 2, name: 'Product 2', date: '02-01-2024', status: 'Out of Stock' },
        { id: 3, name: 'Product 3', date: '03-01-2024', status: 'Available' },
    ]);
    const [customers, setCustomers] = useState([])
    const handleMenuClick = (section) => {
        setActiveSection(section);
    };


    const handleEditProduct = (id) => {
        alert(`Edit Product ${id}`);
    };

    const handleDeleteProduct = (id) => {
        alert(`Delete Product ${id}`);
        setProducts(products.filter(product => product.id !== id));
    };

    return (
        <div>
            <section className={styles.sidebar}>
                <a href="/" className={styles.brand}>
                    <SmileOutlined />
                    <span className={styles.text}>AdminHub</span>
                </a>
                <ul className={styles.sideMenu}>
                    <li className={activeSection === 'Dashboard' ? styles.active : ''}>
                        <a href="#" onClick={() => handleMenuClick('Dashboard')}>
                            <WindowsOutlined />
                            <span className={styles.text}>Dashboard</span>
                        </a>
                    </li>
                    <li className={activeSection === 'MyStore' ? styles.active : ''}>
                        <a href="#" onClick={() => handleMenuClick('MyStore')}>
                            <ShoppingOutlined />
                            <span className={styles.text}>My Store</span>
                        </a>
                    </li>
                    <li className={activeSection === 'Statistic' ? styles.active : ''}>
                        <a href="#" onClick={() => handleMenuClick('Statistic')}>
                            <PieChartOutlined />
                            <span className={styles.text}>Thống kê</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <MessageOutlined />
                            <span className={styles.text}>Tin nhắn</span>
                        </a>
                    </li>
                </ul>
                <ul className={styles.sideMenu}>
                    <li>
                        <a href="#">
                            <SettingOutlined />
                            <span className={styles.text}>Cài đặt</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" className="logout">
                            <LogoutOutlined />
                            <span className={styles.text}>Đăng xuất</span>
                        </a>
                    </li>
                </ul>
            </section>
            <section className={styles.content}>
                <nav>
                    <MenuUnfoldOutlined />
                    <a href="#" className={styles.navLink}>Phân loại</a>
                    <form action="#">
                        <div className={styles.formInput}>
                            <input type="search" placeholder="Search..." />
                            <button type="submit" className={styles.searchBtn}><SearchOutlined /></button>
                        </div>
                    </form>
                    <input type="checkbox" className={styles.switchModeI} hidden />
                    <label htmlFor="switch-mode" className={styles.switchMode}></label>
                    <a href="#" className={styles.notification}>
                        <NotificationOutlined />
                        <span className={styles.num}>8</span>
                    </a>
                    <a href="#" className={styles.profile}>
                        <img src="img/people.png" />
                    </a>
                </nav>
                <main style={{ overflow: "visible" }}>
                    {activeSection === 'Dashboard' && (
                        <Dashboard/>
                    )}
                    {activeSection === 'MyStore' && (
                        <div>
                            <div className={styles.headTitle}>
                                <div className={styles.left}>
                                    <h1>My Store</h1>
                                    <ul className={styles.breadcrumb}>
                                        <li>
                                            <a href="#">My Store</a>
                                        </li>
                                        <li><RightOutlined /></li>
                                        <li>
                                            <a className={styles.active} href="#">Home</a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <Button type="primary" onClick={showModal}>
                                        Thêm sản phẩm
                                    </Button>
                                    <Modal title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} onOk={handleSubmit} footer={null}>
                                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                                            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                                                <InputNumber min={0} style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
                                                <Select placeholder="Select a category" onChange={handleCategoryChange}>
                                                    <Option value="1">Phụ kiện</Option>
                                                    <Option value="2">Laptop</Option>
                                                    <Option value="3">Điện thoại</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
                                                <Input.TextArea />
                                            </Form.Item>
                                            <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                <Input />
                                            </Form.Item>

                                            {category != 1 && (
                                                <Form.Item name="ram" label="Ram" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            {category == 3 && (
                                                <Form.Item name="behindCamera" label="Camara sau" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            {category == 3 && (
                                                <Form.Item name="frontCamera" label="Camara trước" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            {category != 1 && (
                                                <Form.Item name="drive" label="Bộ nhớ" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            {category != 1 && (
                                                <Form.Item name="battery" label="Pin" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}
                                            {category != 1 && (
                                                <Form.Item name="display" label="Màn hình" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}
                                            {category != 1 && (
                                                <Form.Item name="cpu" label="Cpu" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            {/* Form laptop */}
                                            {category == 2 && (
                                                <Form.Item name="vga" label="Card đồ họa" rules={[{ required: true, message: 'Please input the Laptop!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            )}

                                            <Form.Item name="inventory" label="Kho" rules={[{ required: true, message: 'Please input the Laptop!' }]}>
                                                <Input />
                                            </Form.Item>

                                            <Form.Item name="discount" label="Discount" rules={[{ required: true, message: 'Please input the discount!' }]}>
                                                <InputNumber min={0} style={{ width: '100%' }} />
                                            </Form.Item>
                                            <Form.Item label="Upload Image">
                                                <Upload
                                                    action={null}
                                                    listType="picture-card"
                                                    fileList={fileList}
                                                    onPreview={handlePreview}
                                                    onChange={handleChange}
                                                >
                                                    {fileList.length >= 1 ? null : uploadButton}
                                                </Upload>
                                                {previewImage && (
                                                    <Image
                                                        wrapperStyle={{
                                                            display: 'none',
                                                        }}
                                                        preview={{
                                                            visible: previewOpen,
                                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                        }}
                                                        src={previewImage}
                                                    />
                                                )}
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit">
                                                    Add Product
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Modal>
                                </div>

                            </div>
                            <div className={styles.tableData}>
                                <div className={styles.order}>
                                    <div className={styles.head}>
                                        <h3>Danh sách sản phẩm</h3>
                                        <SearchOutlined />
                                        <FilterOutlined />
                                    </div>
                                    <Mystore />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'Statistic' && (
                        <div>
                            <PieChart />
                        </div>
                    )}
                </main>
            </section>
        </div>
    );
}

export default Admin;
