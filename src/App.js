import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";

function App() {

const [isLogin, setIsLogin] =
  useState(false);

const [email, setEmail] =
  useState("");

const [password, setPassword] =
  useState("");

const [showPassword, setShowPassword] =
  useState(false);

const [
  showEmployeePassword,
  setShowEmployeePassword,
] = useState(false);

const [activeTab, setActiveTab] =
  useState("profile");
  const [showProfileMenu, setShowProfileMenu] =
  useState(false);

const [editProfileMode, setEditProfileMode] =
  useState(false);

  useEffect(() => {

  fetchLeaves();

}, []);

const fetchLeaves = async () => {

  try {

    const response = await axios.get(
      "https://employee-tracker-server-production.up.railway.app/api/leave/leaves"
    );

    setLeaveRequests(response.data);

  } catch (error) {

    console.log(error);

  }

};

/* =========================
   EMPLOYEE STATES
========================= */

const [employeeTab, setEmployeeTab] =
  useState("register");

const [employeeName, setEmployeeName] =
  useState("");

const [designation, setDesignation] =
  useState("");

const [employeeEmail, setEmployeeEmail] =
  useState("");

const [employeePassword, setEmployeePassword] =
  useState("");

const [contactNumber, setContactNumber] =
  useState("");

const [city, setCity] =
  useState("");

const [employees, setEmployees] =
  useState([]);

const [selectedEmployee, setSelectedEmployee] =
  useState(null);

/* =========================
   ADMIN PROFILE STATES
========================= */

const [adminName, setAdminName] =
  useState("");

const [
  adminDesignation,
  setAdminDesignation,
] = useState("");

const [adminEmail, setAdminEmail] =
  useState("");

const [
  adminContact,
  setAdminContact,
] = useState("");

const [adminCity, setAdminCity] =
  useState("");

const [adminImage, setAdminImage] =
  useState(null);

const [adminId, setAdminId] =
  useState("");

const [adminData, setAdminData] =
  useState(null);  

  /* =========================
   ATTENDANCE STATES
========================= */

const [
  attendanceTab,
  setAttendanceTab,
] = useState("record");

const [
  selectedEmployeeFilter,
  setSelectedEmployeeFilter,
] = useState("");

const [
  selectedMonth,
  setSelectedMonth,
] = useState("");

const [attendanceData] = useState([]);
/* =========================
   LEAVE STATES
========================= */

const [leaveTab, setLeaveTab] =
  useState("request");

const [
  leaveRequests,
  setLeaveRequests,
] = useState([
  {
    _id: "1",

    employeeName: "Ali Khan",

    designation: "Developer",

    leaveDate: "2025-08-10",

    leaveType: "Casual Leave",

    reason: "Personal Work",

    status: "Pending",
  },
]);
const [
  leaveEmployeeFilter,
  setLeaveEmployeeFilter,
] = useState("");

const [leaveMonth, setLeaveMonth] =
  useState("");

  /* LOGIN */

const loginAdmin = async () => {

  try {

    const response =
      await axios.post(

        "https://employee-tracker-server-production.up.railway.app/api/admin/login",

        {
          email,
          password,
        }

      );

    alert(
      response.data.message
    );

    const admin =
      response.data.admin;

    setIsLogin(true);

    setAdminId(
      admin._id
    );

    setAdminData(
      admin
    );

    setAdminName(
      admin.name || ""
    );

    setAdminDesignation(
      admin.designation || ""
    );

    setAdminEmail(
      admin.email || ""
    );

    setAdminContact(
      admin.contactNumber || ""
    );

    setAdminCity(
      admin.city || ""
    );

    getEmployees();

  } catch (error) {

    console.log(error);

    alert("Login Failed");

  }

};

  /* CREATE EMPLOYEE */

  const createEmployee = async () => {

    try {

      const response =
        await axios.post(
          "https://employee-tracker-server-production.up.railway.app/api/employee/create",
          {
            employeeName,
            designation,
            email: employeeEmail,
            password: employeePassword,
            contactNumber,
            city,
          }
        );

      alert(response.data.message);

      getEmployees();

      setEmployeeName("");
      setDesignation("");
      setEmployeeEmail("");
      setEmployeePassword("");
      setContactNumber("");
      setCity("");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Employee Create Failed"
      );

    }

  };

  /* GET EMPLOYEES */

  const getEmployees = async () => {

    try {

      const response =
        await axios.get(
          "https://employee-tracker-server-production.up.railway.app/api/employee/all"
        );

      setEmployees(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  /* DELETE EMPLOYEE */

  const deleteEmployee = async (
    id
  ) => {

    try {

      const response =
        await axios.delete(
          `https://employee-tracker-server-production.up.railway.app/api/employee/delete/${id}`
        );

      alert(response.data.message);

      getEmployees();

    } catch (error) {

      alert("Delete Failed");

    }

  };

  /* UPDATE EMPLOYEE */

  const updateEmployee = async () => {

    try {

      const response =
        await axios.put(
          `https://employee-tracker-server-production.up.railway.app/api/employee/update/${selectedEmployee._id}`,
          {
            employeeName,
            designation,
            email: employeeEmail,
            password: employeePassword,
            contactNumber,
            city,
          }
        );

      alert(response.data.message);

      getEmployees();

      setSelectedEmployee(null);

      setEmployeeName("");
      setDesignation("");
      setEmployeeEmail("");
      setEmployeePassword("");
      setContactNumber("");
      setCity("");

    } catch (error) {

      alert("Update Failed");

    }

  };
  const downloadPDF = () => {

  if (!selectedEmployeeFilter) {

    alert("Select Employee");
    return;

  }

  const doc = new jsPDF();

  doc.text(
    `Attendance Report - ${selectedEmployeeFilter}`,
    20,
    20
  );

  const employeeAttendance =
    attendanceData.filter(
      (att) =>
        att.employee ===
        selectedEmployeeFilter
    );

  const tableData =
    employeeAttendance.map((att) => [
      att.date,
      att.checkIn,
      att.checkOut,
    ]);

  autoTable(doc, {
    startY: 30,
    head: [["Date", "Check In", "Check Out"]],
    body: tableData,
  });

  doc.save(
    `${selectedEmployeeFilter}-attendance.pdf`
  );

};

  /* LOGIN SCREEN */

  if (!isLogin) {

    return (

      <div
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
  }}
>
  <div
    style={{
      width: "450px",
      background: "#dbe5ff",
      padding: "40px",
      borderRadius: "25px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <FaUserCircle size={90} color="#3b6df6" />
    </div>

    <h1
      style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#1f2937",
      }}
    >
      Admin Login
    </h1>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
      }}
    >
      <FaEnvelope color="gray" />
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          marginLeft: "10px",
          width: "100%",
          fontSize: "16px",
        }}
      />
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "30px",
      }}
    >
      <FaLock color="gray" />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          marginLeft: "10px",
          width: "100%",
          fontSize: "16px",
        }}
      />
    </div>

    <button
      onClick={loginUser}
      style={{
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "15px",
        background: "#3b6df6",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
      }}
    >
      Login
    </button>
  </div>
</div>

    );

  }

/* SAVE ADMIN PROFILE */

const saveAdminProfile = async () => {

  try {

    const formData =
      new FormData();

    formData.append(
      "name",
      adminName
    );

    formData.append(
      "designation",
      adminDesignation
    );

    formData.append(
      "email",
      adminEmail
    );

    formData.append(
      "contactNumber",
      adminContact
    );

    formData.append(
      "city",
      adminCity
    );

    if (adminImage) {

      formData.append(
        "profileImage",
        adminImage
      );

    }

    const response =
      await axios.put(

        `https://employee-tracker-server-production.up.railway.app/api/admin/update/${adminId}`,

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

    alert(
      response.data.message
    );

    setEditProfileMode(false);

  } catch (error) {

    console.log(error);

    alert(
      "Profile Save Failed"
    );

  }

};

  /* DASHBOARD */

  return (

    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: "250px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >

        <h2
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Admin Panel
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
          }}
        >

          <li
            onClick={() =>
              setActiveTab("profile")
            }
            style={menuStyle}
          >
            Admin Profile
          </li>

          <li
            onClick={() =>
              setActiveTab("employees")
            }
            style={menuStyle}
          >
            Employee Management
          </li>

          <li
            onClick={() =>
              setActiveTab("attendance")
            }
            style={menuStyle}
          >
            Attendance Management
          </li>

          <li
            onClick={() =>
              setActiveTab("leave")
            }
            style={menuStyle}
          >
            Leave Management
          </li>

        </ul>

      </div>

      {/* RIGHT SIDE */}

      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f3f4f6",
          overflowY: "auto",
        }}
      >

        {/* PROFILE */}

{/* PROFILE */}

{activeTab === "profile" && (

  <div style={cardStyle}>

    {/* TOP HEADER */}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        position: "relative",
      }}
    >

      <h1>
        Admin Profile
      </h1>

      <div>

        <button
          onClick={() =>
            setShowProfileMenu(
              !showProfileMenu
            )
          }
          style={{
            background: "transparent",
            border: "none",
            fontSize: "30px",
            cursor: "pointer",
          }}
        >
          ⋮
        </button>

        {showProfileMenu && (

          <div
            style={{
              position: "absolute",
              right: "0",
              top: "50px",
              background: "white",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.2)",
              borderRadius: "10px",
              overflow: "hidden",
              zIndex: 1000,
              minWidth: "180px",
            }}
          >

            <div
              onClick={() => {

                setEditProfileMode(true);

                setShowProfileMenu(false);

              }}
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              Update Profile
            </div>

            <div
              onClick={() => {

                setIsLogin(false);

              }}
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                color: "red",
              }}
            >
              Logout
            </div>

          </div>

        )}

      </div>

    </div>

    {/* PROFILE VIEW */}

    {!editProfileMode ? (

      <div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >

          <img
            src={
              adminData?.profileImage
                ? `https://employee-tracker-server-production.up.railway.app/uploads/${adminData.profileImage}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="admin"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border:
                "4px solid #2563eb",
            }}
          />

        </div>

        <p>
          <strong>Name:</strong>{" "}
          {adminName}
        </p>

        <p>
          <strong>Designation:</strong>{" "}
          {adminDesignation}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {adminEmail}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {adminContact}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {adminCity}
        </p>

      </div>

    ) : (

      /* EDIT PROFILE FORM */

      <div>

        <input
          type="text"
          placeholder="Name"
          value={adminName}
          onChange={(e) =>
            setAdminName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Designation"
          value={adminDesignation}
          onChange={(e) =>
            setAdminDesignation(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={adminEmail}
          onChange={(e) =>
            setAdminEmail(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Contact"
          value={adminContact}
          onChange={(e) =>
            setAdminContact(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="City"
          value={adminCity}
          onChange={(e) =>
            setAdminCity(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="file"
          onChange={(e) =>
            setAdminImage(
              e.target.files[0]
            )
          }
          style={{
            marginBottom: "20px",
          }}
        />

        <button
          onClick={saveAdminProfile}
          style={greenButton}
        >
          Save Profile
        </button>

      </div>

    )}

  </div>

)}

        {/* EMPLOYEE MANAGEMENT */}

        {activeTab === "employees" && (

          <div>

            <h1>
              Employee Management
            </h1>

            {/* SUB TABS */}

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginBottom: "25px",
                flexWrap: "wrap",
              }}
            >

              <button
                onClick={() =>
                  setEmployeeTab(
                    "register"
                  )
                }
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    employeeTab ===
                    "register"
                      ? "#2563eb"
                      : "#d1d5db",
                  color:
                    employeeTab ===
                    "register"
                      ? "white"
                      : "black",
                  cursor: "pointer",
                }}
              >
                Register Employee
              </button>

              <button
                onClick={() =>
                  setEmployeeTab(
                    "history"
                  )
                }
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    employeeTab ===
                    "history"
                      ? "#2563eb"
                      : "#d1d5db",
                  color:
                    employeeTab ===
                    "history"
                      ? "white"
                      : "black",
                  cursor: "pointer",
                }}
              >
                Employee History
              </button>

              <button
                onClick={() =>
                  setEmployeeTab(
                    "update"
                  )
                }
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    employeeTab ===
                    "update"
                      ? "#2563eb"
                      : "#d1d5db",
                  color:
                    employeeTab ===
                    "update"
                      ? "white"
                      : "black",
                  cursor: "pointer",
                }}
              >
                Update Employee
              </button>

              <button
                onClick={() =>
                  setEmployeeTab(
                    "delete"
                  )
                }
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    employeeTab ===
                    "delete"
                      ? "#2563eb"
                      : "#d1d5db",
                  color:
                    employeeTab ===
                    "delete"
                      ? "white"
                      : "black",
                  cursor: "pointer",
                }}
              >
                Delete Employee
              </button>

            </div>

            {/* REGISTER */}

            {employeeTab ===
              "register" && (

              <div style={cardStyle}>

                <input
                  type="text"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) =>
                    setEmployeeName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="Designation"
                  value={designation}
                  onChange={(e) =>
                    setDesignation(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={employeeEmail}
                  onChange={(e) =>
                    setEmployeeEmail(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <div
                  style={{
                    position: "relative",
                    marginBottom: "15px",
                  }}
                >

                  <input
                    type={
                      showEmployeePassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
                    value={employeePassword}
                    onChange={(e) =>
                      setEmployeePassword(
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  />

                  <span
                    onClick={() =>
                      setShowEmployeePassword(
                        !showEmployeePassword
                      )
                    }
                    style={{
                      position:
                        "absolute",
                      right: "15px",
                      top: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {showEmployeePassword
                      ? "Hide"
                      : "Show"}
                  </span>

                </div>

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChange={(e) =>
                    setContactNumber(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <button
                  onClick={
                    createEmployee
                  }
                  style={greenButton}
                >
                  Create Employee
                </button>

              </div>

            )}

            {/* EMPLOYEE HISTORY */}

            {employeeTab ===
              "history" && (

              <div style={cardStyle}>

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#2563eb",
                        color: "white",
                      }}
                    >

                      <th style={tableStyle}>#</th>
                      <th style={tableStyle}>Name</th>
                      <th style={tableStyle}>Designation</th>
                      <th style={tableStyle}>Email</th>
                      <th style={tableStyle}>City</th>
                      <th style={tableStyle}>Contact</th>

                    </tr>

                  </thead>

                  <tbody>

  {employees
    .filter(
      (emp) =>
        emp.employeeName &&
        emp.employeeName.trim() !== ""
    )
    .map(
      (
        emp,
        index
      ) => (

                        <tr
                          key={emp._id}
                        >

                          <td style={tableStyle}>
                            {index + 1}
                          </td>

                          <td style={tableStyle}>
                            {
                              emp.employeeName
                            }
                          </td>

                          <td style={tableStyle}>
                            {
                              emp.designation
                            }
                          </td>

                          <td style={tableStyle}>
                            {emp.email}
                          </td>

                          <td style={tableStyle}>
                            {emp.city}
                          </td>

                          <td style={tableStyle}>
                            {
                              emp.contactNumber
                            }
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

            {/* UPDATE */}

            {employeeTab ===
              "update" && (

              <div style={cardStyle}>

                <h2>
                  Update Employee
                </h2>

                {employees
  .filter(
    (emp) =>
      emp.employeeName &&
      emp.employeeName.trim() !== ""
  )
  .map((emp) => (

                  <div
                    key={emp._id}
                    style={{
                      background:
                        "#f9fafb",
                      padding: "15px",
                      borderRadius:
                        "10px",
                      marginTop: "15px",
                    }}
                  >

                    <p>
                      <strong>Name:</strong>
                      {" "}
                      {
                        emp.employeeName
                      }
                    </p>

                    <p>
                      <strong>Email:</strong>
                      {" "}
                      {emp.email}
                    </p>

                    <button
                      onClick={() => {

                        setSelectedEmployee(
                          emp
                        );

                        setEmployeeName(
                          emp.employeeName
                        );

                        setDesignation(
                          emp.designation
                        );

                        setEmployeeEmail(
                          emp.email
                        );

                        setEmployeePassword(
                          emp.password
                        );

                        setContactNumber(
                          emp.contactNumber
                        );

                        setCity(
                          emp.city
                        );

                      }}
                      style={{
                        marginTop:
                          "10px",
                        padding:
                          "10px 15px",
                        background:
                          "#2563eb",
                        color:
                          "white",
                        border: "none",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Edit Employee
                    </button>

                  </div>

                ))}

                {selectedEmployee && (

                  <div
                    style={{
                      marginTop:
                        "30px",
                    }}
                  >

                    <input
                      type="text"
                      placeholder="Employee Name"
                      value={employeeName}
                      onChange={(e) =>
                        setEmployeeName(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      type="text"
                      placeholder="Designation"
                      value={designation}
                      onChange={(e) =>
                        setDesignation(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={employeeEmail}
                      onChange={(e) =>
                        setEmployeeEmail(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      type="text"
                      placeholder="Password"
                      value={employeePassword}
                      onChange={(e) =>
                        setEmployeePassword(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      type="text"
                      placeholder="Contact Number"
                      value={contactNumber}
                      onChange={(e) =>
                        setContactNumber(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) =>
                        setCity(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <button
                      onClick={
                        updateEmployee
                      }
                      style={greenButton}
                    >
                      Update Employee
                    </button>

                  </div>

                )}

              </div>

            )}

            {/* DELETE */}

            {employeeTab ===
              "delete" && (

              <div style={cardStyle}>

                <h2>
                  Delete Employee
                </h2>

                {employees
  .filter(
    (emp) =>
      emp.employeeName &&
      emp.employeeName.trim() !== ""
  )
  .map((emp) => (

                  <div
                    key={emp._id}
                    style={{
                      background:
                        "#f9fafb",
                      padding: "15px",
                      borderRadius:
                        "10px",
                      marginTop: "15px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >

                    <div>

                      <p>
                        <strong>Name:</strong>
                        {" "}
                        {
                          emp.employeeName
                        }
                      </p>

                      <p>
                        <strong>Designation:</strong>
                        {" "}
                        {
                          emp.designation
                        }
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteEmployee(
                          emp._id
                        )
                      }
                      style={{
                        padding:
                          "10px 15px",
                        background:
                          "red",
                        color:
                          "white",
                        border: "none",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}
        
        
       {/* ATTENDANCE MANAGEMENT */}

{activeTab === "attendance" && (

  <div>

    <h1>
      Attendance Management
    </h1>

    {/* SUB TABS */}

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        marginTop: "20px",
      }}
    >

      <button
        onClick={() =>
          setAttendanceTab("record")
        }
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background:
            attendanceTab === "record"
              ? "#2563eb"
              : "#d1d5db",
          color:
            attendanceTab === "record"
              ? "white"
              : "black",
        }}
      >
        Attendance Record
      </button>

      <button
        onClick={() =>
          setAttendanceTab("report")
        }
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background:
            attendanceTab === "report"
              ? "#2563eb"
              : "#d1d5db",
          color:
            attendanceTab === "report"
              ? "white"
              : "black",
        }}
      >
        Attendance Report
      </button>

    </div>

    {/* ATTENDANCE RECORD */}

    {attendanceTab === "record" && (

      <div style={cardStyle}>

        <h2>
          Attendance Record
        </h2>

        <input
          type="text"
          placeholder="Employee Name (Optional)"
          value={selectedEmployeeFilter}
          onChange={(e) =>
            setSelectedEmployeeFilter(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          style={greenButton}
        >
          Search
        </button>

        <div
          style={{
            marginTop: "30px",
          }}
        >

          {employees
  .filter(
    (emp) =>
      emp.employeeName &&
      emp.employeeName.trim() !== ""
  )
  .filter((emp) => {

    if (
      selectedEmployeeFilter === ""
    ) {
      return true;
    }

    return emp.employeeName
      .toLowerCase()
      .includes(
        selectedEmployeeFilter.toLowerCase()
      );

  })
            .map((emp) => (

              <details
                key={emp._id}
                style={{
                  marginBottom: "15px",
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >

                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {emp.employeeName}
                </summary>

                <table
                  style={{
                    width: "100%",
                    marginTop: "15px",
                    borderCollapse:
                      "collapse",
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#2563eb",
                        color: "white",
                      }}
                    >

                      <th style={tableStyle}>
                        Date
                      </th>

                      <th style={tableStyle}>
                        Check In
                      </th>

                      <th style={tableStyle}>
                        Check Out
                      </th>
                      <th style={tableStyle}>
                        Location
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {attendanceData
                      .filter(
                        (att) =>
                          att.employee ===
                          emp.employeeName
                      )
                      .map(
                        (
                          att,
                          index
                        ) => (

                          <tr
                            key={index}
                          >

                            <td style={tableStyle}>
                              {att.date}
                            </td>

                            <td style={tableStyle}>
                              {att.checkIn}
                            </td>

                            <td style={tableStyle}>
                              {att.checkOut}
                            </td>

                          </tr>

                        )
                      )}

                  </tbody>

                </table>

              </details>

            ))}

        </div>

      </div>

    )}

    {/* ATTENDANCE REPORT */}

    {attendanceTab === "report" && (

      <div style={cardStyle}>

        <h2>
          Attendance Report
        </h2>

        <select
          value={selectedEmployeeFilter}
          onChange={(e) =>
            setSelectedEmployeeFilter(
              e.target.value
            )
          }
          style={inputStyle}
        >

          <option value="">
            Select Employee
          </option>

         {employees
  .filter(
    (emp) =>
      emp.employeeName &&
      emp.employeeName.trim() !== ""
  )
  .map((emp) => (

    <option
      key={emp._id}
      value={
        emp.employeeName
      }
    >
      {emp.employeeName}
    </option>

))}

        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
  onClick={downloadPDF}
  style={{
    padding: "14px 25px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  }}
>
  Download PDF
</button>

      </div>

    )}

  </div>

)} 
        
{/* LEAVE MANAGEMENT */}

{activeTab === "leave" && (

  <div>

    <h1>
      Leave Management
    </h1>

    {/* SUB TABS */}

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        marginTop: "20px",
      }}
    >

      <button
        onClick={() =>
          setLeaveTab("request")
        }
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background:
            leaveTab === "request"
              ? "#2563eb"
              : "#d1d5db",
          color:
            leaveTab === "request"
              ? "white"
              : "black",
        }}
      >
        Leave Request
      </button>

      <button
        onClick={() =>
          setLeaveTab("record")
        }
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background:
            leaveTab === "record"
              ? "#2563eb"
              : "#d1d5db",
          color:
            leaveTab === "record"
              ? "white"
              : "black",
        }}
      >
        Leave Record
      </button>

    </div>

    {/* LEAVE REQUEST */}

    {leaveTab === "request" && (

      <div style={cardStyle}>

        <h2>
          Leave Requests
        </h2>

        {leaveRequests
          .filter(
            (leave) =>
              leave.employeeName &&
              leave.employeeName.trim() !== ""
          )
          .map((leave, index) => (

            <div
              key={index}
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >

              <p>
                <strong>Employee Name:</strong>{" "}
                {leave.employeeName}
              </p>

              <p>
                <strong>Designation:</strong>{" "}
                {leave.designation}
              </p>

              <p>
                <strong>Leave Date:</strong>{" "}
                {leave.leaveDate}
              </p>

              <p>
                <strong>Leave Type:</strong>{" "}
                {leave.leaveType}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {leave.reason}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "20px",
                  alignItems: "center",
                }}
              >

                {leave.status === "Pending" ? (

                  <>

                    <button
                      onClick={() =>
                        approveLeave(
                          leave._id
                        )
                      }
                      style={{
                        padding:
                          "10px 20px",
                        background:
                          "green",
                        color: "white",
                        border: "none",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectLeave(
                          leave._id
                        )
                      }
                      style={{
                        padding:
                          "10px 20px",
                        background:
                          "red",
                        color: "white",
                        border: "none",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Reject
                    </button>

                  </>

                ) : (

                  <span
                    style={{
                      fontWeight:
                        "bold",
                      color:
                        leave.status ===
                        "Approved"
                          ? "green"
                          : "red",
                    }}
                  >
                    {leave.status}
                  </span>

                )}

              </div>

            </div>

          ))}

      </div>

    )}

    {/* LEAVE RECORD */}

    {leaveTab === "record" && (

      <div style={cardStyle}>

        <h2>
          Leave Record
        </h2>

        <input
          type="text"
          placeholder="Employee Name"
          value={
            leaveEmployeeFilter
          }
          onChange={(e) =>
            setLeaveEmployeeFilter(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="month"
          value={leaveMonth}
          onChange={(e) =>
            setLeaveMonth(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          style={greenButton}
        >
          SHOW
        </button>

        <table
          style={{
            width: "100%",
            marginTop: "30px",
            borderCollapse:
              "collapse",
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  "#2563eb",
                color: "white",
              }}
            >

              <th style={tableStyle}>
                Employee Name
              </th>

              <th style={tableStyle}>
                Designation
              </th>

              <th style={tableStyle}>
                Leave Date
              </th>

              <th style={tableStyle}>
                Leave Type
              </th>

              <th style={tableStyle}>
                Reason
              </th>

              <th style={tableStyle}>
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {leaveRequests
              .filter((leave) => {

                if (
                  leaveEmployeeFilter ===
                  ""
                ) {
                  return true;
                }

                return leave.employeeName
                  .toLowerCase()
                  .includes(
                    leaveEmployeeFilter.toLowerCase()
                  );

              })
              .map((leave, index) => (

                <tr key={index}>

                  <td style={tableStyle}>
                    {
                      leave.employeeName
                    }
                  </td>

                  <td style={tableStyle}>
                    {
                      leave.designation
                    }
                  </td>

                  <td style={tableStyle}>
                    {
                      leave.leaveDate
                    }
                  </td>

                  <td style={tableStyle}>
                    {
                      leave.leaveType
                    }
                  </td>

                  <td style={tableStyle}>
                    {leave.reason}
                  </td>

                  <td style={tableStyle}>
                    {leave.status}
                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    )}

  </div>

)}

      </div>
    </div>
  );

  /* APPROVE LEAVE */

 async function approveLeave(id) {

  try {

    const response = await axios.put(
      `https://employee-tracker-server-production.up.railway.app/api/leave/approve-leave/${id}`
    );

    alert(response.data.message);

    fetchLeaves();

  } catch (error) {

    alert("Approve Failed");

  }

}

  /* REJECT LEAVE */

  async function rejectLeave(id) {

  try {

    const response = await axios.put(
      `https://employee-tracker-server-production.up.railway.app/api/leave/reject-leave/${id}`
    );

    alert(response.data.message);

    fetchLeaves();

  } catch (error) {

    alert("Reject Failed");

  }

}

}

const menuStyle = {
  padding: "15px",
  cursor: "pointer",
  borderRadius: "8px",
  marginBottom: "10px",
  background: "#1f2937",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const tableStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "left",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
};

const greenButton = {
  width: "100%",
  padding: "12px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default App;