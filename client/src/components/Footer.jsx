const Footer = ({ role }) => {
  const blue = "#1f89db";
  const red = "#f05258";
  const bgColor = role === "admin" ? red : blue;

  return (
    <footer className={`h-[200px] w-full bg-[${bgColor}] flex flex-col`}>
      <div className="flex flex-row items-center pt-8 pl-4">
        <div className="w-1/6 items-center pl-4">
          <h2 className="text-[30px] font-extrabold pt-2 text-black pl-8">
            LSP
          </h2>
          <p className="flex pl-2">Live Smart Printing</p>
          <ul className="flex flex-row gap-2 pt-2">
            <li>
              <img src="face.png" alt="" className="rounded-full" />
            </li>
            <li>
              <img src="email.png" alt="" className="rounded-full" />
            </li>
            <li>
              <img src="mess.png" alt="" className="rounded-full" />
            </li>
            <li>
              <img src="mess.png" alt="" className="rounded-full" />
            </li>
          </ul>
        </div>
        <div className="flex flex-row items-center w-5/6 font-medium">
          <ul>
            <li>Email : ddthu@hcmut.edu.vn</li>
            <li>Tel. : (84-8) 38647256 - 5258</li>
            <li>
              For HCMUT account, please contact to : Data and Information
              Technology Center
            </li>
            <li>Email : dl-cntt@hcmut.edu.vn</li>
            <li>Tel. : (84-8) 38647256 - 5200</li>
          </ul>
        </div>
      </div>
      <p className="flex justify-center">Copyright©2024 LSP</p>
    </footer>
  );
};

export default Footer;
