import React, { useState } from "react";

const ConfigPage = () => {
  const [activeTab, setActiveTab] = useState("paper");

  const [paperTypes, setPaperTypes] = useState([
    { type: "A4", price: 0.1, quantity: 100 },
    { type: "A3", price: 0.5, quantity: 50 },
    // Add more paper types here
  ]);

  const [printPrices, setPrintPrices] = useState([
    { type: "Black & White", price: 0.05 },
    { type: "Color", price: 0.15 },
    // Add more print prices here
  ]);

  const [configs, setConfigs] = useState([
    { name: "Max Print Jobs", value: 10 },
    { name: "Default Paper Size", value: "A4" },
    // Add more configurations here
  ]);

  const handleAddPaperType = () => {
    setPaperTypes([...paperTypes, { type: "", price: 0, quantity: 0 }]);
  };

  const handlePaperTypeChange = (index, field, value) => {
    const newPaperTypes = [...paperTypes];
    newPaperTypes[index][field] = value;
    setPaperTypes(newPaperTypes);
  };

  const handleAddPrintPrice = () => {
    setPrintPrices([...printPrices, { type: "", price: 0 }]);
  };

  const handlePrintPriceChange = (index, field, value) => {
    const newPrintPrices = [...printPrices];
    newPrintPrices[index][field] = value;
    setPrintPrices(newPrintPrices);
  };

  const handleConfigChange = (index, field, value) => {
    const newConfigs = [...configs];
    newConfigs[index][field] = value;
    setConfigs(newConfigs);
  };

  return (
    <div className="pt-16 w-full h-full">
      <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Configuration Page
        </h1>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "paper"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("paper")}
          >
            Paper Config
          </button>
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "printPrice"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("printPrice")}
          >
            Print Price Config
          </button>
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "other"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("other")}
          >
            Other Config
          </button>
        </div>
        {activeTab === "paper" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Paper Config
            </h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 border-b text-left">Type</th>
                    <th className="py-3 px-6 border-b text-left">Price</th>
                    <th className="py-3 px-6 border-b text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {paperTypes.map((paper, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="text"
                          value={paper.type}
                          onChange={(e) =>
                            handlePaperTypeChange(index, "type", e.target.value)
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="number"
                          value={paper.price}
                          onChange={(e) =>
                            handlePaperTypeChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="number"
                          value={paper.quantity}
                          onChange={(e) =>
                            handlePaperTypeChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleAddPaperType}
              >
                Add Paper Type
              </button>
            </div>
          </div>
        )}
        {activeTab === "printPrice" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Print Price Config
            </h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 border-b text-left">Type</th>
                    <th className="py-3 px-6 border-b text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {printPrices.map((price, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="text"
                          value={price.type}
                          onChange={(e) =>
                            handlePrintPriceChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="number"
                          value={price.price}
                          onChange={(e) =>
                            handlePrintPriceChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleAddPrintPrice}
              >
                Add Print Price
              </button>
            </div>
          </div>
        )}
        {activeTab === "other" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Other Config
            </h2>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-6 border-b text-left">Name</th>
                    <th className="py-3 px-6 border-b text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((config, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border-b text-left">
                        {config.name}
                      </td>
                      <td className="py-3 px-6 border-b text-left">
                        <input
                          type="text"
                          value={config.value}
                          onChange={(e) =>
                            handleConfigChange(index, "value", e.target.value)
                          }
                          className="border rounded w-full p-2"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPage;
