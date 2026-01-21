import decorativeCarpet from "@/assets/decorative-carpet.jpg";

const DecorativeBanner = () => {
  return (
    <div className="w-full h-72 md:h-96 lg:h-[28rem] overflow-hidden">
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
