import Head from "next/head";
import Image from "next/image";
import logo from "../public/assets/social-logo1.png";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../redux/features/authSlice";
import { persistor } from "../redux/store";
import { ImSpinner3 } from "react-icons/im";

const Login = () => {
  //checking the error
  const { isLoading, error, user } = useSelector((state) => ({
    ...state.auth,
  }));

  //state for login errors
  const [loginError, setLoginError] = useState("");
  //using the ref hook to get the login values
  const userEmail = useRef();
  const userPassword = useRef();

  //dispatch
  const dispatch = useDispatch();

  //router
  const router = useRouter();

  //handling the error from login
  useEffect(() => {
    if (error) {
      setLoginError(error);
      toast.error(error);
      persistor.purge();
      return;
    }
  }, [error]);

  //checking if user exists already
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  //handling the login action
  const handleLogin = (e) => {
    e.preventDefault();
    const email = userEmail.current.value;
    const password = userPassword.current.value;
    const loginFromValues = { email, password };

    if (email && password) {
      dispatch(login({ loginFromValues, router }));
      e.target.reset();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 flex flex-col min-h-screen justify-center px-3 md:px-0">
      <Head>
        <title>Login</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex flex-col">
        <div className="flex justify-center space-x-2 mb-5">
          <div className="relative w-8 h-8 2xl:w-12 2xl:h-12 -mt-1">
            <Image
              src={logo}
              alt="logo"
              layout="fill"
              className="object-cover"
            />
          </div>
          <p className="text-sm1 text-xl md:text-3xl font-charm tracking-widest cursor-pointer">
            Welcome back to Miles Social
          </p>
        </div>

        <p className="text-sm1 text-base md:text-lg font-charm font-semibold tracking-widest cursor-pointer capitalize text-left">
          Log in to your account
        </p>
      </section>
      <section className="bg-gradient-to-br from-sm2 via-sm6 to-sm2 w-full rounded-lg p-2 md:p-5">
        {loginError && <p>{loginError}</p>}
        <form
          className="flex flex-col space-y-5 py-3 md:py-5"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            ref={userEmail}
            placeholder="Enter your email"
            required
            className="px-2 py-3 md:py-5 rounded-md !bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg w-full"
            onFocus={() => setLoginError("")}
          />

          <input
            type="password"
            ref={userPassword}
            placeholder="Enter your password"
            required
            minLength={6}
            className="px-2 py-3 md:py-5 rounded-md !bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg w-full"
          />
          <div className="text-[13px] text-white flex items-center flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0">
            <span>test-email: rykermiles@gmail.com</span>
            <span>test-password: 1234567</span>
          </div>
          <button
            type="submit"
            className="bg-sm8 text-sm1 font-quicksand font-semibold py-2 md:py-4 rounded-md text-xl tracking-wider"
          >
            {isLoading ? (
              <p className="flex items-center space-x-2 justify-center">
                <span>Login in...</span>
                <ImSpinner3 className="w-5 h-5 animate-spin" />
              </p>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </section>
      <section>
        <p className="text-sm8 font-quicksand text-base md:text-lg font-bold">
          Forgot Password?
        </p>
        <button
          className="bg-sm6 text-sm1 font-quicksand font-semibold py-2 md:py-3 px-5 rounded-md text-sm md:text-base tracking-wider mt-2"
          onClick={() => router.push("/register")}
        >
          Create a new account
        </button>
      </section>
    </div>
  );
};

export default Login;
