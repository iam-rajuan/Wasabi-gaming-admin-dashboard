import { FaBook, FaChartBar, FaSchool, FaTasks } from "react-icons/fa";
import CommonTable from "../../Reusable/CommonTable";

import Headers from "../../Reusable/Headers";

const Cards = ({ name, icons, number, details }) => {
    return (
        <div className='bg-white p-6 py-5 h-[200px] flex flex-col justify-between rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300'>
            <div className='flex justify-between items-center mb-4'>
                <p className='text-[#737373]  text-sm font-medium popreg'>{name}</p>
                <div className='text-blue-500 text-lg'>
                    {icons}
                </div>
            </div>
            <div>            <p className='text-2xl font-bold text-gray-800 popmed mb-1'>{number}</p>
                <p className='text-[12px] text-gray-500 popreg'>{details}</p></div>
        </div>
    );
};

const Dashboard = () => {
    const statsData = [
        {
            name: "Total Students",
            icons: <FaSchool />,
            number: "1,234",
            details: "1,200 active • 34 new"
        },
        {
            name: "Active Courses",
            icons: <FaBook />,
            number: "24",
            details: "18 ongoing • 6 upcoming"
        },
        {
            name: "Pending Tasks",
            icons: <FaTasks />,
            number: "12",
            details: "8 assignments • 4 reviews"
        },
        {
            name: "Quiz Results",
            icons: <FaChartBar />,
            number: "87%",
            details: "5% increase from last month"
        }
    ];

    const sampleData = [
        {
            student: "Sarah Johnson",
            email: "sarah.j@email.com",
            grade: "10th",
            courses: 5,
            status: "Active",
        },
        {
            student: "Michael Chen",
            email: "michael.c@email.com",
            grade: "11th",
            courses: 6,
            status: "Active",
        },
        {
            student: "Emma Williams",
            email: "emma.w@email.com",
            grade: "9th",
            courses: 4,
            status: "Inactive",
        },
        {
            student: "James Davis",
            email: "james.d@email.com",
            grade: "12th",
            courses: 7,
            status: "Active",
        },
        {
            student: "Olivia Martinez",
            email: "olivia.m@email.com",
            grade: "10th",
            courses: 5,
            status: "Active",
        },
    ];

    const columns = [
        { header: "Student", accessor: "student" },
        { header: "Email", accessor: "email" },
        { header: "Grade", accessor: "grade" },
        { header: "Courses", accessor: "courses" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions" },
    ];

    const filterOptions = ["All", "9th", "10th", "11th", "12th"];

    const title = "Recent Students"
    const subtitle = "Manage and view all students enrolled in your platform"
  
    return (
        <div className='  min-h-screen'>

            <Headers title={"Dashboard"} subHeader={"Welcome back! Here's what's happening with your school."} />


            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {statsData.map((item, index) => (
                    <Cards
                        key={index}
                        name={item.name}
                        icons={item.icons}
                        number={item.number}
                        details={item.details}
                    />
                ))}
            </div>

            <div className='bg-white mt-8 p-5 border-2 border-[#0000001A] rounded-2xl'>
                <div className='pb-4'>
                    <h2 className="text-lg popmed text-gray-800">{title}</h2>
                    <p className="text-lg text-gray-500">{subtitle}</p>
                </div>
                <CommonTable

                    columns={columns}
                    data={sampleData}
                    filterOptions={filterOptions}
                />
            </div>
        </div>
    );
};

export default Dashboard;