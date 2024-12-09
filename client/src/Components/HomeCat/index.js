import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import homecat1 from "../../assets/images/homecat1.png";

const HomeCat = () => {


    const [itemBg, setItemBg] = useState([
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#fff3ff',
        '#f2fce4',
        '#feefea',
        '#fffceb',
        '#feefea',
        '#ecffec',
    ]);




    return (
        <>
            <section className="homeCat">
                <div className="container">
                <h3 className="mb-3 hd">Feature Categories</h3>
                    <Swiper
                        slidesPerView={10}
                        spaceBetween={8}
                        navigation={true}
                        slidesPerGroup={3}
                        modules={[Navigation]}
                        className="mySwiper"
                    >
                        {
                            itemBg?.map((item, index) =>{
                                return(
                                    <SwiperSlide>
                                        <div className="item text-center cursor" style={{background:item}}>
                                            <img src={homecat1} alt="homecat1"></img>
                                            <h6>Red Apple</h6>
                                        </div>
                                    </SwiperSlide>
                                )
                            })
                        }




                    </Swiper>
                </div>
            </section>
        </>
    )
}

export default HomeCat;