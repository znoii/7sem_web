import GroupInterface from "./GroupInterface";

interface StudentInterface {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
  isDeleted?: boolean;
  contacts?: string;
  group: GroupInterface[];
};

export default StudentInterface;
