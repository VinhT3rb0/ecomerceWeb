import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Input, Select, Row, Col } from 'antd';
import styles from './Phone.module.css';
import Card from '../../components/ProductCardPhone/ProductCardPhone';

const { Option } = Select;

export default function Phone() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.trandai03.online/api/products?category_id=3&limit=100");
        setData(response.data.data.products);
        setFilteredData(response.data.data.products);
      } catch (error) {
        console.error('Có lỗi xảy ra:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (priceRange) {
      switch (priceRange) {
        case '<=10000000':
          filtered = filtered.filter(product => product.price <= 10000000);
          break;
        case '11000000-15000000':
          filtered = filtered.filter(product => product.price >= 11000000 && product.price <= 15000000);
          break;
        case '>15000000':
          filtered = filtered.filter(product => product.price > 15000000);
          break;
        case 'all':
          filtered = filtered.filter(product => product.price > 0);
          break;
        default:
          break;
      }
    }

    if (brand) {
      filtered = filtered.filter(product => product.sku.toLowerCase().includes(brand.toLowerCase()));
    }

    setFilteredData(filtered);
  }, [searchTerm, priceRange, brand, data]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleBrandChange = (value) => {
    setBrand(value);
  };

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        Loading...
      </div>
    );
  }
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Tất cả sản phẩm</h1>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Input
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Lọc theo giá"
            style={{ width: '100%' }}
            onChange={handlePriceRangeChange}
          >
            <Option value="all">Tất cả</Option>
            <Option value="<=10000000">Nhỏ hơn hoặc bằng 10,000,000</Option>
            <Option value="11000000-15000000">Trong khoảng 11,000,000 - 15,000,000</Option>
            <Option value=">15000000">Trên 15,000,000</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="Lọc theo hãng"
            style={{ width: '100%' }}
            onChange={handleBrandChange}
          >
            <Option value="iphone">iPhone</Option>
            <Option value="samsung">Samsung</Option>
            <Option value="xiaomi">Xiaomi</Option>
          </Select>
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', margin: '50px 0' }}>
        {filteredData.map((x, index) => (
          <div className={`${styles.item} animate__animated animate__backInLeft`} key={index}>
            <Card product={x} />
          </div>
        ))}
      </div>
    </div>
  );
}
