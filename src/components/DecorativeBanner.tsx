import decorativeCarpet from "@/assets/decorative-carpet.jpg";

const DecorativeBanner = () => {
  return (
    <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
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
