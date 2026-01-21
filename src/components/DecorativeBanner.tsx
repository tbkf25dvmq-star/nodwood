import decorativeCarpet from "@/assets/decorative-carpet.jpg";

const DecorativeBanner = () => {
  return (
    <div className="w-full h-32 md:h-48 lg:h-64 overflow-hidden">
      <img
        src={decorativeCarpet}
        alt="Dettaglio tappeto persiano"
        className="w-full h-full object-cover object-center"
        draggable={false}
      />
    </div>
  );
};

export default DecorativeBanner;
