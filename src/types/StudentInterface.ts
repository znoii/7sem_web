interface StudentInterface {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
  contacts: string;
  isDeleted?: boolean;
};

export default StudentInterface;
