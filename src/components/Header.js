import Image from "next/image";
import HeaderLogo from "../../public/logo.png";

export default function Header() {
  return (
    <div className="flex justify-center mx-auto p-12">
      <Image
        src={HeaderLogo}
        alt="PokéIndex"
        height={128}
        weight={128}
        priority={true}
        className="lg:scale-50 sm:scale-100"
      />
    </div>
  );
}
