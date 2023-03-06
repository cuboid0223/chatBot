import {
  SunIcon,
  BoltIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// type "rfce" making quick snip

function HomePage() {
  return (
    <div className="text-white flex flex-col items-center justify-center h-screen px-2">
      <h1 className="text-5xl font-bold mb-20">chatGPT</h1>
      <main className="flex space-x-2 text-center">
        {/* icons  */}
        <section>
          <div className="flex flex-col items-center justify-center mb-5">
            <SunIcon className="h-8 w-8 " />
            <h2>Example</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">輸贏輸贏輸贏輸贏輸贏輸贏輸贏</p>
            <p className="infoText">輸贏輸贏輸贏輸贏輸贏輸贏輸贏</p>
            <p className="infoText">輸贏輸贏輸贏輸贏輸贏輸贏輸贏</p>
          </div>
        </section>

        <section>
          <div className="flex flex-col items-center justify-center mb-5">
            <BoltIcon className="h-8 w-8 " />
            <h2>Capabilities</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">輸贏</p>
            <p className="infoText">輸贏輸贏輸贏輸贏輸贏輸贏輸贏</p>
            <p className="infoText">輸贏</p>
          </div>
        </section>

        <section>
          <div className="flex flex-col items-center justify-center mb-5">
            <ExclamationTriangleIcon className="h-8 w-8 " />
            <h2>Limitations</h2>
          </div>
          <div className="space-y-2">
            <p className="infoText">輸贏</p>
            <p className="infoText">輸贏</p>
            <p className="infoText">輸贏輸贏輸贏輸贏輸贏輸贏輸贏</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
