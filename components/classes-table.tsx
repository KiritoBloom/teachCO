"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader } from "./loader";
import { Card, CardDescription, CardTitle } from "./ui/card";

const ClassesTable = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [classes, setClasses] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get("/api/role");
        setUserRole(response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, [router]);

  useEffect(() => {
    const fetchedClasses = async () => {
      try {
        const response = await axios.get("/api/class");
        const responseData = response.data;

        const classesData = responseData.includes("Success")
          ? JSON.parse(responseData.replace("Success", ""))
          : responseData;

        if (Array.isArray(classesData)) {
          setClasses(classesData);
        } else {
          console.error("Invalid response format for classes:", classesData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setIsLoading(false);
      }
    };

    fetchedClasses();
  }, []);

  const cleanedUserRole = userRole
    ?.replace("Success", "")
    ?.replace(/"role":/g, "")
    ?.replace(/[{}"]/g, "")
    ?.trim();

  const handleOnClick = (classId: string) => {
    router.push(`/classes/${classId}`);
    setIsLoading(true);
  };

  return (
    <>
      <div className="ml-2">
        {isLoading ? (
          <div className="flex justify-center items-center mt-[20%] h-full">
            <Loader />
          </div>
        ) : (
          <div>
            {cleanedUserRole === "Teacher" ? (
              <div>
                <h1 className="mt-2 font-bold text-3xl">Created Classes</h1>
                {classes.length > 0 ? (
                  <div className="mt-5">
                    {classes.map((classItem) => (
                      <Card
                        className="cursor-pointer hover:scale-[102%] transition-all mb-4 ml-0 mx-auto w-[90%] p-4 bg-slate-200 bg-opacity-20 backdrop-blur-md border-opacity-18 border-solid rounded-lg shadow-md border-black"
                        onClick={() => handleOnClick(classItem.classId)}
                      >
                        <CardTitle>Class Name: {classItem.className}</CardTitle>
                        <CardTitle className="mb-2 mt-1 text-foreground/100 text-lg">
                          Teacher Name: {classItem.teacherName}
                        </CardTitle>
                        <CardDescription className="mb-2 mt-2">
                          Class Subject: {classItem.classSubject}
                        </CardDescription>
                        <CardDescription>
                          Class Code: {classItem.classId}
                        </CardDescription>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No classes created yet.</p>
                )}
              </div>
            ) : cleanedUserRole === "Student" ? (
              <div>
                <h1 className="mt-2 font-bold text-3xl">Joined Classes</h1>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default ClassesTable;
