import carpetImage from "@/assets/decorative-carpet.png";
import { useBannerSettings } from "@/hooks/useBannerSettings";

const DecorativeBanner = () => {
  const { data: settings } = useBannerSettings();
  
  const scale = settings?.scale ?? 1;
  const rotation = settings?.rotation ?? 0;
  const positionY = settings?.position_y ?? 50;

  return (
    <section className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      <img 
        src={carpetImage} 
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
