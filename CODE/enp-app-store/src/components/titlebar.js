import Navbar from "./navbar";

function TitleBar() {
  const logoUri = process.env.PUBLIC_URL + "/logo.png";
  const appLogoUri = process.env.PUBLIC_URL + "/appLogo.png";
  return (
    <>
      <div className="z-10 flex">
        <img
          src={appLogoUri}
          alt="left Logo"
          className="shadow-2xl shadow-black rounded-full bg-blue-950 h-24 w-24 z-20"
        />
        <div className="flex-col w-full">
          <div className="flex w-full justify-between">
            <div className="shadow-2xl h-12 mt-7 -ml-6 w-1/3 shadow-black bg-gray-300 justify-between border-gray-950 rounded-full items-center">
              <div className="ml-10 py-2 font-extrabold text-2xl">
                E&P AppStore
              </div>
            </div>
            <div className="mr-1 justify-self-end">
              <img src={logoUri} alt="Right Logo" className="h-20 w-30 " />
            </div>
          </div>
          <div className="flex -mt-3 w-1/3 justify-end z-20">
            <div className="bg-blue-950 text-blue-950 shadow-2xl shadow-black rounded-full">
              .......
            </div>
            <div className="bg-blue-400 text-blue-400 shadow-2xl shadow-black rounded-full">
              .......
            </div>
            <div className="bg-blue-950 text-blue-950 shadow-2xl shadow-black rounded-full">
              .......
            </div>
            <div className="bg-blue-400 text-blue-400 shadow-2xl shadow-black rounded-full mr-9">
              .......
            </div>
          </div>
        </div>
        {/* 
          <div className="relative w-[950px] ml-32 mx-2 z-20">
            <Navbar />
          </div>
        </div>
      </div> */}

        {/* <div className="logo-title items-center justify-between flex mr-24">
          <div class="logo-title-circle -z-2">
            <span className="ml-2">E</span>
          </div>
          <h1>
            nP<span>AppStore</span>
          </h1>
        </div> */}
      </div>
      <Navbar />
    </>
  );
}

export default TitleBar;
