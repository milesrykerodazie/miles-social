import Head from "next/head";
import Image from "next/image";
import logo from "../public/assets/social-logo1.png";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register } from "../redux/features/authSlice";
import { persistor } from "../redux/store";
import { ImSpinner3 } from "react-icons/im";

const Register = () => {
  //checking console
  const { isLoading, error, user } = useSelector((state) => ({
    ...state.auth,
  }));
  //state for register errors
  const [registerError, setRegisterError] = useState("");
  //state for password match
  const [passwordMatch, setPasswordMatch] = useState("");
  //using the ref hook to get the register values
  const userFirstName = useRef();
  const userLastName = useRef();
  const userUsername = useRef();
  const userEmail = useRef();
  const userPassword = useRef();
  const userConfirmPassword = useRef();

  //dispatch
  const dispatch = useDispatch();

  //router
  const router = useRouter();

  //handling the error from register
  useEffect(() => {
    if (error) {
      setRegisterError(error);
      toast.error(error);
    }
    persistor.purge();
  }, [error]);

  //checking if user exists already
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  //handle reggister
  const handleRegister = (e) => {
    e.preventDefault();
    const firstName = userFirstName.current.value;
    const lastName = userLastName.current.value;
    const username = userUsername.current.value;
    const email = userEmail.current.value;
    const password = userPassword.current.value;
    const confirmPassword = userConfirmPassword.current.value;
    const registerFromValues = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    if (
      firstName === "" ||
      lastName === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setPasswordMatch("Passwords do not match");
      userConfirmPassword.current.value = "";

      return;
    }

    if (firstName && lastName && username && email && password) {
      dispatch(register({ registerFromValues, router }));
      e.target.reset();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 flex flex-col min-h-screen justify-center px-3 md:px-0">
      <Head>
        <title>Register</title>
        <meta
          name="description"
          content="Social media app for development purposes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex flex-col mt-5">
        <div className="flex items-center justify-center space-x-2 mb-5">
          <div className="relative w-8 h-8 2xl:w-12 2xl:h-12">
            <Image
              src={logo}
              alt="logo"
              layout="fill"
              className="object-cover"
            />
          </div>
          <p className="text-sm1 text-xl md:text-3xl font-charm tracking-widest cursor-pointer text-center uppercase">
            Welcome to Miles Social
          </p>
        </div>
        <p className="text-sm1 text-base md:text-lg font-semibold font-charm tracking-widest cursor-pointer mb-4 capitalize">
          Create your account
        </p>
      </section>

      <section className="bg-gradient-to-br from-sm2 via-sm6 to-sm2 w-full rounded-lg p-2 md:p-5">
        {registerError && <p>{registerError}</p>}
        <form
          className="flex flex-col space-y-5 py-3 md:py-5"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="First name"
            ref={userFirstName}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="Last name"
            ref={userLastName}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
          />
          <input
            type="text"
            placeholder="Username"
            ref={userUsername}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
            onFocus={() => setRegisterError("")}
          />
          <input
            type="email"
            placeholder="Email"
            ref={userEmail}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
            onFocus={() => setRegisterError("")}
          />
          <input
            type="password"
            placeholder="Password"
            ref={userPassword}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
            onFocus={() => setPasswordMatch("")}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={userConfirmPassword}
            required
            className="px-2 py-3 md:py-5 rounded-md bg-sm7 text-sm1 font-quicksand text-lg outline-none placeholder:font-quicksand placeholder:text-lg"
            onFocus={() => setPasswordMatch("")}
          />

          {passwordMatch && <p>{passwordMatch}</p>}

          <button
            type="submit"
            className="bg-sm8 text-sm1 font-quicksand font-semibold py-3 md:py-4 rounded-md text-base md:text-xl tracking-wider"
          >
            {isLoading ? (
              <p className="flex items-center space-x-2 justify-center">
                <span>Creating account...</span>
                <ImSpinner3 className="w-5 h-5 animate-spin" />
              </p>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-sm8 font-quicksand text-base md:text-lg font-bold">
          Already have an account?
        </p>
        <button
          className="bg-sm6 text-sm1 font-quicksand font-semibold py-2 md:py-3 px-5 rounded-md text-sm md:text-base tracking-wider mt-2"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </section>
    </div>
  );
};

export default Register;
