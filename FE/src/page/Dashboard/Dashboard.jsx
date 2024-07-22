import React, { useEffect, useState } from 'react';
import { CheckSquareOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EuroCircleOutlined, FilterOutlined, RightOutlined, SearchOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Space, Table, Modal, Select, Button, Popconfirm } from 'antd';
import axios from 'axios';
import styles from './Dashboard.module.css';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Dashboard() {
  const [dataItem, setDataItem] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (text) => <a>{text + 1}</a>,
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (text) => <a>KH{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (x) => <span>{formatPrice(x)}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setCurrentOrder(record);
    setNewStatus(record.status);
    setIsModalVisible(true);
  };

  const handleStatusChange = (value) => {
    setNewStatus(value);
  };

  const handleOk = async () => {
    try {
      await axios.put(`https://api.trandai03.online/api/orders/status/${currentOrder.id}?status=${newStatus}`);
      const updatedData = dataItem.map(item =>
        item.id === currentOrder.id ? { ...item, status: newStatus } : item
      );
      setDataItem(updatedData);
      setIsModalVisible(false);
      setCurrentOrder(null);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOrder(null);
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`https://api.trandai03.online/api/orders/${record.id}`);
      const updatedData = dataItem.filter(item => item.id !== record.id);
      setDataItem(updatedData);
    } catch (error) {
      console.error('Có lỗi xảy ra:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.trandai03.online/api/orders/get-orders-by-keyword");
        const data = response.data.data;
        const dataWithKeys = data.map((item, index) => ({
          ...item,
          key: index,
        }));
        setDataItem(dataWithKeys);
        console.log('Fetched data:', dataWithKeys);
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className={styles.headTitle}>
        <div className={styles.left}>
          <h1>Dashboard</h1>
          <ul className={styles.breadcrumb}>
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li><RightOutlined /></li>
            <li>
              <a className={styles.active} href="#">Home</a>
            </li>
          </ul>
        </div>
        <a href="#" className={styles.btnDownload}>
          <DownloadOutlined />
          <span className={styles.text}>Download PDF</span>
        </a>
      </div>
      <ul className={styles.boxInfo}>
        <li>
          <CheckSquareOutlined />
          <span className={styles.text}>
            <h3>1020</h3>
            <p>Đơn đặt hàng</p>
          </span>
        </li>
        <li>
          <UsergroupDeleteOutlined />
          <span className={styles.text}>
            <h3>2834</h3>
            <p>Khách hàng</p>
          </span>
        </li>
        <li>
          <EuroCircleOutlined />
          <span className={styles.text}>
            <h3>$2543</h3>
            <p>Tổng doanh thu</p>
          </span>
        </li>
      </ul>
      <div className={styles.tableData}>
        <div className={styles.order}>
          <div className={styles.head}>
            <h3>Đơn hàng</h3>
            <SearchOutlined />
            <FilterOutlined />
          </div>
          <Table columns={columns} pagination={{ pageSize: 5 }} dataSource={dataItem} />
        </div>
      </div>

      <Modal
        title="Chỉnh sửa trạng thái đơn hàng"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select value={newStatus} onChange={handleStatusChange} style={{ width: '100%' }}>
          {statuses.map(status => (
            <Select.Option key={status} value={status}>{status}</Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}
