import Link from "next/link";
import { gitDark, gitLight, heart } from "../../../public/assets";
import Image from "next/image";
import { cn } from "../../lib/utils";
export const Logo = () => {
  return (
    <div>
      <Link href="#hero" className={cn(`block w-56 xl:mr-5`)}>
        {/* <Image src={heart} alt="heart" width={22} height={22} className="absolute left-32 top-6" /> */}
        <Image
          src={gitDark}
          alt="gitDark"
          width={440}
          height={70}
          className="hidden dark:block"
        />
        <Image
          src={gitLight}
          alt="gitLight"
          width={440}
          height={70}
          className="block dark:hidden"
        />
      </Link>
    </div>
  );
};
