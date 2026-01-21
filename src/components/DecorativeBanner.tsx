import carpetImage from "@/assets/decorative-carpet.png";

const DecorativeBanner = () => {
  return (
    <section className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      <img 
        src={carpetImage} 
        alt="Tappeto decorativo artigianale"
        className="w-full h-full object-cover object-center"
      />
    </section>
  );
};

export default DecorativeBanner;
