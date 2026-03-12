interface StudentApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    data: User[];
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "student" | "teacher" | string;
    profileImage?: string;
    phone?: string;
    verified: boolean;
    registered: boolean;
    status: "active" | "inactive" | string;
    skills: string[];
    grade?: string;
    isSubscription: boolean;
    subscription?: Subscription;
    subscriptionExpiry?: string;
    bio?: string;
    education: any[]; // can be typed further if needed
    experience: any[]; // can be typed further if needed
    course: Course[];
    socileLinks: SocialLink[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Course {
    _id: string;
    name: string;
    description: string;
    gradeLevel: string;
    category: string;
    courseVideo: CourseVideo[];
    createdBy: string;
    status: "active" | "inactive" | string;
    enrolledStudents: string[];
    coursePrice: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface CourseVideo {
    title: string;
    url: string;
    time: string;
}

interface Subscription {
    _id: string;
    name: string;
    price: number;
    type: string; // e.g., "month"
    features: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    status: "active" | "inactive";
    totalSubscripeUser: string[];
}

interface SocialLink {
    name: string;
    link: string;
    _id: string;
}
