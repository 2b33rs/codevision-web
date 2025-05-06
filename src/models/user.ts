/*export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string;
  mail: string;
}
*/
export type Customer = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  customerId: string
  companyname: string
  address: string
  postalcode: string
  city: string
  firstname: string
  lastname: string
  phonenumber: string
  mail: string
}
