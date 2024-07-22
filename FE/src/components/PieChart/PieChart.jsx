import { Button } from 'antd';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { utils, writeFile } from 'xlsx';

const laptopData = [
  {
    name: 'MacBook', sales: 15, fill: '#8884d8', product: [{
      id: 1,
      name: 'Iphone 15 Pro max',
      price: 2000000
    }],
  },
  {
    name: 'Dell', sales: 25, fill: '#82ca9d', product: [{
      id: 2,
      name: 'Iphone 15 Pro max',
      price: 2000000
    }],
  },
  {
    name: 'HP', sales: 20, fill: '#ffc658', product: [{
      id: 3,
      name: 'Iphone 15 Pro max',
      price: 2000000
    }],
  }
];

const phoneData = [
  { name: 'iPhone', sales: 30, fill: '#8884d8', product: [{ id: 4, name: 'iPhone 15', price: 15000000 }] },
  { name: 'Samsung', sales: 40, fill: '#82ca9d', product: [{ id: 5, name: 'Samsung Galaxy S23', price: 12000000 }] },
  { name: 'Xiaomi', sales: 35, fill: '#ffc658', product: [{ id: 6, name: 'Xiaomi Mi 13', price: 10000000 }] }
];

const accessoryData = [
  { name: 'Tai nghe', sales: 45, fill: '#8884d8', product: [{ id: 7, name: 'Tai nghe Bose', price: 3000000 }] },
  { name: 'Chuột', sales: 50, fill: '#82ca9d', product: [{ id: 8, name: 'Chuột Logitech', price: 800000 }] },
  { name: 'Bàn phím', sales: 40, fill: '#ffc658', product: [{ id: 9, name: 'Bàn phím Corsair', price: 1500000 }] }
];

const dataTotal = [
  { name: 'Laptop', sales: 10, fill: '#8884d8', product: [{ id: 10, name: 'Laptop Dell', price: 20000000 }] },
  { name: 'Điện thoại', sales: 20, fill: '#82ca9d', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Phụ kiện', sales: 30, fill: '#ffc658', product: [{ id: 12, name: 'Phụ kiện Chuột', price: 500000 }] }
];

const revenueData = [
  { name: 'Tháng 1', revenue: 10000000, fill: '#8884d8', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 2', revenue: 12000000, fill: '#82ca9d', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 3', revenue: 13000000, fill: '#ffc658', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 4', revenue: 9000000, fill: '#8884d8', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 5', revenue: 11000000, fill: '#82ca9d', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 6', revenue: 14000000, fill: '#ffc658', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 7', revenue: 15000000, fill: '#8884d8', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 8', revenue: 16000000, fill: '#82ca9d', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 9', revenue: 17000000, fill: '#ffc658', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 10', revenue: 18000000, fill: '#8884d8', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 11', revenue: 19000000, fill: '#82ca9d', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] },
  { name: 'Tháng 12', revenue: 20000000, fill: '#ffc658', product: [{ id: 11, name: 'Điện thoại Samsung', price: 15000000 }] }
];

const formatCurrency = (value) => {
  return `${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ')}`;
};

const Chart = ({ dataItem, dataKey = "sales", formatter }) => {
  return (
    <BarChart
      width={1200}
      height={500}
      data={dataItem}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} barSize={100}>
        {dataItem.map((entry, index) => (
          <Bar key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Bar>
    </BarChart>
  );
};

const removeFillField = (data) => {
  return data.map(({ fill, product, ...rest }) => ({
    ...rest,
    product: product.map(({ name, price }) => `${name} - ${formatCurrency(price)}`).join('; ')
  }));
};



const exportToExcel = () => {
  const worksheetData = [
    { sheetName: 'Tổng sản phẩm tháng này', data: removeFillField(dataTotal) },
    { sheetName: 'Chi tiết mặt hàng Laptop', data: removeFillField(laptopData) },
    { sheetName: 'Chi tiết mặt hàng Điện thoại', data: removeFillField(phoneData) },
    { sheetName: 'Chi tiết mặt hàng Phụ kiện', data: removeFillField(accessoryData) },
    { sheetName: 'Doanh số tổng tiền từng tháng', data: removeFillField(revenueData) },
  ];

  const workbook = utils.book_new();

  worksheetData.forEach(sheet => {
    const worksheet = utils.json_to_sheet(sheet.data);
    utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });

  writeFile(workbook, 'SalesData.xlsx');
};

const SalesCharts = () => {
  return (
    <div>
      <Button style={{ position: 'absolute', right: 10, top: 65 }} type="primary" onClick={exportToExcel}>Lưu dưới định dạng Excel</Button>
      <h1 className='text-center'>Tổng sản phẩm tháng này</h1>
      <Chart dataItem={dataTotal} />
      <h1 className='text-center'>Chi tiết mặt hàng Laptop</h1>
      <Chart dataItem={laptopData} />
      <h1 className='text-center'>Chi tiết mặt hàng Điện thoại</h1>
      <Chart dataItem={phoneData} />
      <h1 className='text-center'>Chi tiết mặt hàng Phụ kiện</h1>
      <Chart dataItem={accessoryData} />
      <h1 className='text-center'>Chi tiết doanh số tổng tiền của từng tháng</h1>
      <Chart dataItem={revenueData} dataKey="revenue" formatter={formatCurrency} />
    </div>
  );
};

export default SalesCharts;
