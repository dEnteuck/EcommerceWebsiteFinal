
import React from "react";

import { Autoplay,Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';

const HomeBanner =()=>{
    

    return(
        <div className="container mt-3">
            <div className="homeBannerSection">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={15}
                    navigation={true}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction:false,
                    }}
                    modules={[Navigation,Autoplay]}
                    className="mySwiper"
                    >
                        <SwiperSlide>
                            <div className="item">
                            <img src ="https://moriitalia.com/images/thumbs/016/0160994.png" alt="Mô tả hình ảnh" className="w-100"/>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                            <img src ="https://moriitalia.com/images/thumbs/016/0161002.png" alt="Mô tả hình ảnh" className="w-100"/>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="item">
                            <img src ="https://moriitalia.com/images/thumbs/016/0162154_bannersale-he-ruc-ro-vui-het-co.jpeg" alt="Mô tả hình ảnh" className="w-100"/>
                            </div>
                        </SwiperSlide>




                    </Swiper>
        </div>  
        </div>
    )
}

export default HomeBanner;
