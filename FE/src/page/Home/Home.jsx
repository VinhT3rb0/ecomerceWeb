import React from 'react'
import Header from '../../components/Header/Header'
import Carousels from '../../components/Carousel/Carousel'
import CatSlider from '../../components/CatSlider/CatSlider'
import Footer from '../../components/Footer/Footer'
import CardPhone from '../../components/ProductCardPhone/ProductCardPhone';
import Banner from '../../components/Banner/Banner'
import ContactBox from '../../components/ContactBox/ContactBox'
import Laptop from '../../page/Laptop/Laptop'
import Phone from '../Phone/Phone'
import Pk from '../Pk/Pk'
import LaptopHome from '../../components/Laptophome/LaptopHome'
import PhoneHome from '../../components/Phonehome/PhoneHome'
import Pkhome from '../../components/Pkhome/Pkhome'
import CatBanner from '../../components/CardBanner/CatBanner'


export default function Home() {

  return (
    <div>
      <Header></Header>
      {/* <ContactBox></ContactBox> */}
      <div className="container">
        <div className="row">
          <Carousels></Carousels>
          <Banner></Banner>
          <CatSlider></CatSlider>
          <h1 style={{ textAlign: 'center', marginTop: 50 }}>Điện thoại bán chạy</h1>
          <PhoneHome></PhoneHome>
          <CatBanner></CatBanner>
          <h1 style={{ textAlign: 'center', marginTop: 50 }}>Laptop ưa chuộng</h1>
          <LaptopHome></LaptopHome>
          <h1 style={{ textAlign: 'center', marginTop: 50 }}>Phụ kiện điện tử</h1>
          <Pkhome></Pkhome>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}
