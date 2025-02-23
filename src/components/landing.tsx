import Image from "next/image";
import Navbar from "./navbar";

const Landing = () => {
  return (
    <div>
      <Navbar />
      Landing
      <Image src={"/code.svg"} alt="code" width={100} height={100} />
    </div>
  );
};

export default Landing;
