const Home = () => {
  return (
    <div className="pt-[200px]">
      <div className="flex flex-row w-2/3 mx-auto">
        {/* Phần bên trái chứa nội dung */}
        <div className="w-1/2 h-[300px] flex flex-col">
          <h2 className="text-[35px] font-bold mx-auto mt-6">
            Liver Smart Printing
          </h2>
          <p className="text-[20px] mt-4">
            Liver Smart Printing - a smart printing service for serving students
            at Ho Chi Minh University of Technology to print their documents by
            operating any printer around the school campuses, which makes
            printing simpler to students.
          </p>
        </div>

        <div className="w-1/2 flex justify-center items-center">
          <img
            src="../../assets/ANH1.png"
            alt="Smart Printer"
            className="w-10/10 h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
