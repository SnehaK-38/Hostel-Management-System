import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from '../Images/carousel/img1.png'
import img2 from '../Images/carousel/img2.png'
import img3 from '../Images/carousel/img3.png'
import img4 from '../Images/carousel/img4.png'
import img5 from '../Images/carousel/img5.png'
import img6 from '../Images/carousel/img6.png'
import img7 from '../Images/carousel/img7.png'
import img8 from '../Images/carousel/img8.png'
import img9 from '../Images/carousel/img9.png'


const Collage = () => {
  const carouselContainerStyle = {
    maxHeight: "340px",
    overflow: "hidden",
  };

  const imgWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cce7ff",
    borderRadius: "10px",
    padding: "10px",
    width: "auto",         // allow wrapper to shrink to image size
    maxWidth: "80%",       // limit wrapper width
    margin: "0 auto",      // center the wrapper
  };

  const imgStyle = {
    maxHeight: "290px",
    maxWidth: "100%",
    objectFit: "contain",
    borderRadius: "5px",
    display: "block",
  };

  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <div style={carouselContainerStyle}>
      <Carousel indicators={false} controls={true}>
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <div style={imgWrapperStyle}>
              <img src={img} alt={`Slide ${index + 1}`} style={imgStyle} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Collage;