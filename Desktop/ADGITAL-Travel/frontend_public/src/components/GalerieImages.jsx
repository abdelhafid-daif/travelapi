import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { Box, Typography, Card } from '@mui/joy';

const GalerieImages = ({ images, titre }) => {
  if (!images || images.length === 0) {
    return <Typography>Aucune image disponible.</Typography>;
  }

  return (
    <Box mt={5}>
      <Typography level="h4" fontWeight="bold" mb={2}>
        📸 Galerie
      </Typography>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          960: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        style={{ paddingBottom: '30px' }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 'lg',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                minHeight: 180,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 'md',
                },
                cursor: 'pointer',
              }}
              onClick={() => window.open(img.image_url, '_blank')}
            >
              <img
                src={img.image_url}
                alt={`${titre} - ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default GalerieImages;
