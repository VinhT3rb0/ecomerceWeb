import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { message, Tabs } from 'antd';
import axios from 'axios';
import {
    Button,
    Cascader,
    Form,
    Input,
    InputNumber,
    Mentions,
    TreeSelect,
} from 'antd';
import { LogoutOutlined, SettingOutlined, ShoppingOutlined, WindowsOutlined } from '@ant-design/icons';
import MyItem from '../MyItem/MyItem';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const userData = localStorage.getItem('userId');
    const [activeSection, setActiveSection] = useState('Dashboard');
    const [data2, setData] = useState(null);
    const [checkLogin, setCheckLogin] = useState(null);
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userData) {
                    message.warning("Chưa đăng nhập nhau vui lòng thử lại");
                    navigate("/login");
                    return;
                }
                const response = await axios.get(`https://api.trandai03.online/api/auth/profile/${userData}`);
                setData(response.data.data);
                form.setFieldsValue({
                    full_name: response.data.data.full_name,
                    telephone: response.data.data.telephone,
                    email: response.data.data.email,
                    addressLine: response.data.data.address?.addressLine,
                    city: response.data.data.address?.city,
                    country: response.data.data.address?.country,
                });
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };

        fetchData();
    }, [userData, form]);

    if (!data2) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                Loading...
            </div>
        );
    }



    const handleMenuClick = (section) => {
        setActiveSection(section);
    };

    return (
        <div style={{ display: 'flex' }}>
            <section className={styles.sidebar}>
                <ul className={styles.sideMenu}>
                    <li className={activeSection === 'Dashboard' ? styles.active : ''}>
                        <a href="#" onClick={() => handleMenuClick('Dashboard')}>
                            <WindowsOutlined />
                            <span className={styles.text}>Thông tin tài khoản</span>
                        </a>
                    </li>
                    <li className={activeSection === 'MyStore' ? styles.active : ''}>
                        <a href="#" onClick={() => handleMenuClick('MyStore')}>
                            <ShoppingOutlined />
                            <span className={styles.text}>Đơn hàng của tôi</span>
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
                        <a href="#" className="logout">
                            <LogoutOutlined />
                            <span className={styles.text}>Đăng xuất</span>
                        </a>
                    </li>
                </ul>
            </section>
            {data2?.full_name}
            <main style={{ overflow: "visible", width: '70%', marginTop: '20px' }}>
                {activeSection === 'Dashboard' && (
                    <Form
                        {...formItemLayout}
                        form={form}
                        initialValues={data2}
                        variant="filled"
                    >
                        <Form.Item
                            label="Họ tên"
                            name="full_name"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="telephone"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>

                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Mentions />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="addressLine"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <Cascader />
                        </Form.Item>

                        <Form.Item
                            label="Tỉnh thành phố"
                            name="city"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <TreeSelect />
                        </Form.Item>

                        <Form.Item
                            label="Quận huyện"
                            name="country"
                            rules={[{ required: true, message: 'Please input!' }]}
                        >
                            <TreeSelect />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                )}
                {activeSection === 'MyStore' && (
                    <MyItem />
                )}
            </main>
        </div>
    );
};

export default Profile;
