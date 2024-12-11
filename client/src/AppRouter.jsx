import React, { useState } from "react";

const CaLamViec = () => {
  const [selectedDate, setSelectedDate] = useState(""); // Lưu ngày đã chọn
  const [doctorInfo, setDoctorInfo] = useState({
    name: "", // Tên bác sĩ
    gender: "", // Giới tính bác sĩ
  });
  const [workSchedule, setWorkSchedule] = useState({}); // Lưu lịch làm việc theo ngày
  const [isConfirmed, setIsConfirmed] = useState(false); // Kiểm tra xem bác sĩ đã xác nhận chưa
  const [error, setError] = useState(""); // Lưu thông báo lỗi
  const [isEditing, setIsEditing] = useState(false); // Kiểm tra xem có đang chỉnh sửa ca làm việc hay không

  const times = [
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "12:30 - 13:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
  ];

  // Xử lý khi người dùng chọn hoặc bỏ chọn ca làm việc
  const handleClick = (time) => {
    if (isEditing) {
      // Nếu đang trong chế độ chỉnh sửa, cho phép thay đổi ca làm việc
      setWorkSchedule((prevSchedule) => {
        const updatedSchedule = { ...prevSchedule };
        if (updatedSchedule[selectedDate]) {
          if (updatedSchedule[selectedDate].includes(time)) {
            updatedSchedule[selectedDate] = updatedSchedule[selectedDate].filter(
              (t) => t !== time
            );
          } else {
            updatedSchedule[selectedDate].push(time);
          }
        } else {
          updatedSchedule[selectedDate] = [time];
        }
        return updatedSchedule;
      });
    } else {
      // Nếu không phải chỉnh sửa, thêm ca làm việc
      setWorkSchedule((prevSchedule) => {
        const updatedSchedule = { ...prevSchedule };
        if (updatedSchedule[selectedDate]) {
          if (updatedSchedule[selectedDate].includes(time)) {
            updatedSchedule[selectedDate] = updatedSchedule[selectedDate].filter(
              (t) => t !== time
            );
          } else {
            updatedSchedule[selectedDate].push(time);
          }
        } else {
          updatedSchedule[selectedDate] = [time];
        }
        return updatedSchedule;
      });
    }
  };

  // Xử lý xác nhận ca làm việc
  const handleConfirm = () => {
    if (!doctorInfo.name || !doctorInfo.gender || !selectedDate || !workSchedule[selectedDate]?.length) {
      setError("Vui lòng điền đầy đủ thông tin bác sĩ và chọn ít nhất một ca làm việc!");
    } else {
      setError("");
      setIsConfirmed(true);
    }
  };

  // Chỉnh sửa ca làm việc (cho phép chọn lại ca làm việc)
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Xóa một ca làm việc khỏi danh sách
  const handleDelete = (time) => {
    setWorkSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      updatedSchedule[selectedDate] = updatedSchedule[selectedDate].filter(
        (t) => t !== time
      );
      return updatedSchedule;
    });
  };

  return (
    <div className="calamviec mt-5 mb-5">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-md-8">
            <div className="col-md-6">
              <select
                className="form-select"
                aria-label="Chọn ngày"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Chọn ngày</option>
                <option value="2024-12-11">Hôm nay - 11/12</option>
                <option value="2024-12-12">Thứ 5 - 12/12</option>
                <option value="2024-12-13">Thứ 6 - 13/12</option>
                <option value="2024-12-14">Thứ 7 - 14/12</option>
              </select>
            </div>

            <div className="d-flex align-items-center mt-3">
              <svg
                viewBox="0 0 24 24"
                preserveAspectRatio="none"
                width="16"
                fill="#333"
                height="16"
              >
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zM9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"></path>
              </svg>
              <h6 className="m-0 ms-2">CA LÀM VIỆC</h6>
            </div>

            {/* Chọn các ca làm việc trong ngày đã chọn */}
            {!isConfirmed && (
              <div className="giokham">
                {times.map((time, index) => (
                  <div
                    key={index}
                    className={`giokham-item ${
                      workSchedule[selectedDate]?.includes(time) ? "active" : ""
                    }`}
                    onClick={() => handleClick(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}

            {/* Nhập thông tin bác sĩ */}
            <div className="mt-3 mb-3">
              <input
                className="form-control"
                placeholder="Họ tên bác sĩ (bắt buộc)"
                value={doctorInfo.name}
                onChange={(e) =>
                  setDoctorInfo({ ...doctorInfo, name: e.target.value })
                }
              />
              <div className="d-flex mt-2">
                <input
                  name="gender"
                  type="radio"
                  checked={doctorInfo.gender === "Nam"}
                  onChange={() => setDoctorInfo({ ...doctorInfo, gender: "Nam" })}
                />
                Nam
                <input
                  name="gender"
                  type="radio"
                  checked={doctorInfo.gender === "Nữ"}
                  onChange={() => setDoctorInfo({ ...doctorInfo, gender: "Nữ" })}
                  className="ms-5"
                />
                Nữ
              </div>
            </div>

            {/* Hiển thị thông báo lỗi nếu thông tin chưa đầy đủ */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Xác nhận ca làm việc đã chọn */}
            <div className="mt-3 mb-3">
              <button className="btn btn-warning w-100 mt-4" onClick={handleConfirm}>
                Xác nhận ca làm việc
              </button>
            </div>

            {/* Hiển thị ca làm việc đã chọn và cho phép chỉnh sửa hoặc xóa */}
            {isConfirmed && (
              <div className="mt-3">
                <h5>Danh sách ca làm việc đã chọn cho ngày {selectedDate}:</h5>
                <ul>
                  {workSchedule[selectedDate]?.map((time, index) => (
                    <li key={index}>
                      {time}{" "}
                      <button
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => handleDelete(time)}
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-secondary mt-3" onClick={handleEdit}>
                  Chỉnh sửa ca làm việc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaLamViec;
