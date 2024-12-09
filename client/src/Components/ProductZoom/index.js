import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef, useState } from 'react';

const ProductZoom = ({ images }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSlider.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    };

    return (
        <div className="productZoom">
            <div className="productZoom position-relative">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    navigation={false}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="zoomSliderBig"
                    ref={zoomSliderBig}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="item">
                                <InnerImageZoom
                                    zoomType="hover"
                                    zoomScale={1}
                                    src={`http://localhost:4002/uploads/${image}`}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <Swiper
                slidesPerView={4}
                spaceBetween={0}
                navigation={true}
                slidesPerGroup={1}
                modules={[Navigation]}
                className="zoomSlider"
                ref={zoomSlider}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={`item ${slideIndex === index && 'item_active'}`}
                            onClick={() => goto(index)}
                        >
                            <img
                                src={`http://localhost:4002/uploads/${image}`}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-100"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductZoom;
