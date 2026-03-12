"use client";
import React, { useState } from 'react';
import Headers from "../../Reusable/Headers";
import { FaCalendar, FaEdit, FaPlus } from "react-icons/fa";
import { Trash } from "lucide-react";
import CommonModal from "../../Reusable/CommonModal";
import ReusableModal from '../../Reusable/ReusableModal';

const TaskCards = ({ title, subject, status, date, submissions, totalSubmissions, progress }) => {
    const [open, setOpen] = useState(false);
    const statusColors = {
        Pending: "bg-yellow-200 text-yellow-800",
        Completed: "bg-green-200 text-green-800",
        Overdue: "bg-red-200 text-red-800",
    };
    const courseFields = [
        { name: "name", label: "Task Name", type: "text", placeholder: "Enter Task name" },

        {
            name: "grade",
            label: "Course",
            type: "select",
            options: [
                { label: "6th Grade", value: "6" },
                { label: "7th Grade", value: "7" },
                { label: "8th Grade", value: "8" },
                { label: "9th Grade", value: "9" },
                { label: "10th Grade", value: "10" },
                { label: "11th Grade", value: "11" },
                { label: "12th Grade", value: "12" }
            ],
            placeholder: "Select grade level"
        },
        { name: "name", label: "Total Students", type: "text", placeholder: "Enter students number" },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "6th Grade", value: "6" },
                { label: "7th Grade", value: "7" },
                { label: "8th Grade", value: "8" },
                { label: "9th Grade", value: "9" },
                { label: "10th Grade", value: "10" },
                { label: "11th Grade", value: "11" },
                { label: "12th Grade", value: "12" }
            ],
            placeholder: "Select grade level"
        },
        { name: "name", label: "Submissions", type: "text", placeholder: "Enter students number" },
    ];
    const handleSave = (data) => {
        console.log("Saved data:", data);
        setOpen(false);
    };

    return (
        <div className="p-5 bg-white shadow-md rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100 mb-4">

            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-lg font-semibold text-gray-800">{title}</p>
                    <p className="text-[16px] text-[#737373] popreg ">{subject}</p>
                </div>
                <p className={`px-4 py-1 rounded-3xl text-sm font-medium ${statusColors[status] || "bg-gray-200 text-gray-700"}`}>
                    {status}
                </p>
            </div>





            <div className={`flex items-center justify-between gap-4`}>

                <div className=" flex items-center gap-2 ">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <FaCalendar className="text-gray-500" />
                            <p className="text-gray-600 popmed">Due Date:</p>
                        </div>
                        <p className="font-medium">{date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 popmed">Submissions:</p>
                        <p className="font-medium">{submissions}/{totalSubmissions}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 popmed">Progress:</p>
                        <p className="font-medium">{progress}%</p>
                    </div>
                </div>
                <div className="flex items-center justify-end mt-4 gap-3">
                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-3xl text-gray-700 font-medium hover:bg-gray-100 transition-all">
                        <FaEdit className="text-gray-600" /> Edit
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 px-4 py-1 rounded-3xl text-gray-700 font-medium hover:bg-red-50 hover:text-red-600 transition-all">
                        <Trash size={20} />
                    </button>
                </div>
            </div>
            <ReusableModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                location={'task'}
                edit={true}
                title="as New Task"
                fields={courseFields}
                submitText="Create Task"
            />
        </div>
    );
};

const Tasks = () => {
    const [open, setOpen] = useState(false);
    const taskData = [
        {
            title: "Physics Lab Report",
            subject: "Physics Fundamentals",
            status: "Pending",
            date: "10/03/25",
            submissions: 10,
            totalSubmissions: 112,
            progress: 50,
        },
        {
            title: "Math Assignment",
            subject: "Algebra & Geometry",
            status: "Completed",
            date: "09/29/25",
            submissions: 98,
            totalSubmissions: 100,
            progress: 100,
        },
        {
            title: "Chemistry Project",
            subject: "Organic Compounds",
            status: "Overdue",
            date: "10/01/25",
            submissions: 25,
            totalSubmissions: 90,
            progress: 30,
        },
    ];
    const courseFields = [
        { name: "name", label: "Task Name", type: "text", placeholder: "Enter Task name" },

        {
            name: "grade",
            label: "Course",
            type: "select",
            options: [
                { label: "6th Grade", value: "6" },
                { label: "7th Grade", value: "7" },
                { label: "8th Grade", value: "8" },
                { label: "9th Grade", value: "9" },
                { label: "10th Grade", value: "10" },
                { label: "11th Grade", value: "11" },
                { label: "12th Grade", value: "12" }
            ],
            placeholder: "Select grade level"
        },
        { name: "name", label: "Total Students", type: "text", placeholder: "Enter Task name" },
    ];
    const handleSave = (data) => {
        console.log("Saved data:", data);
        setOpen(false);
    };

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <Headers
                    title={"Tasks"}
                    subHeader={"Manage all your student assignments and track their progress"}
                />
                <button
                    onClick={() => setOpen(true)}
                    className="flex gap-2 items-center bg-[#FFFF00] hover:bg-yellow-500 py-3 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 font-semibold text-gray-900 hover:scale-105"
                >
                    <FaPlus className="text-sm" />
                    Create Task
                </button>
            </div>


            <div className="">
                {taskData.map((task, index) => (
                    <TaskCards key={index} {...task} />
                ))}
            </div>

            <ReusableModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                location={'task'}
                title="Create New Task"
                fields={courseFields}
                submitText="Create Task"
            />
        </div>
    );
};

export default Tasks;
