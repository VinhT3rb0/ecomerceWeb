import React from 'react';
import { Carousel } from 'antd';
import 'antd/dist/reset.css'; // Import CSS của Ant Design

export default function Carousels() {
    return (
        <Carousel autoplay draggable autoplaySpeed={3000}>
            <div>
                <img style={{ maxWidth: "100%", width: '100%' }} src="https://hanoicomputercdn.com/media/banner/05_Jul5187b00d660e414ea4fc5806a96a7c9b.png" alt="Slide 1" />
            </div>
            <div>
                <img style={{ maxWidth: "100%", width: '100%' }} src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/khai-truong-mien-nam-vinh-long-17-07.jpg" alt="Slide 2" />
            </div>
            <div>
                <img style={{ maxWidth: "100%", width: '100%' }} src="https://hanoicomputercdn.com/media/banner/14_Jun720e3d5a4f0ffeff6abb179f996287d0.png" alt="Slide 3" />
            </div>
            <div>
                <img style={{ maxWidth: "100%", width: '100%' }} src="https://hanoicomputercdn.com/media/banner/14_Jun720e3d5a4f0ffeff6abb179f996287d0.png" alt="Slide 4" />
            </div>
        </Carousel>
    );
}
