import Header from "../Header";

import MobileHeader from "../MobileHeader";

import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  //getting the user from redux using use selector
  const { user } = useSelector((state) => ({ ...state.auth }));

  //router
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return (
    <div className="">
      <div>
        <header className="hidden lg:inline-flex">
          <Header />
        </header>
        <header className="lg:hidden ">
          <MobileHeader />
        </header>
      </div>
      {user && (
        <div className="md:max-w-[95%] lg:max-w-[90%] mx-auto mt-[57px]">
          {children}
        </div>
      )}
    </div>
  );
};

export default Layout;
