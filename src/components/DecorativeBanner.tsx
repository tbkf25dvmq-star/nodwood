import carpetImage from "@/assets/decorative-carpet.png";
import { useBannerSettings } from "@/hooks/useBannerSettings";

const DecorativeBanner = () => {
  const { data: settings } = useBannerSettings();
  
  const scale = settings?.scale ?? 1;
  const rotation = settings?.rotation ?? 0;
  const positionY = settings?.position_y ?? 50;
  const displayImage = settings?.image_url || carpetImage;

  return (
    <section className="w-full h-40 md:h-56 lg:h-72 overflow-hidden">
      <img 
        src={displayImage}
        alt="Tappeto decorativo artigianale"
        className="w-full h-full"
        style={{
          objectFit: 'cover',
          objectPosition: `center ${positionY}%`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      />
    </section>
  );
};

export default DecorativeBanner;
