import StudentInterface from "./StudentInterface";

interface GroupInterface {
  id: number;
  name: string;
  students: StudentInterface[];
}

export default GroupInterface;
