export interface Property {
  id: string;
  organization_id: string;
  person_id: string;
  created_by: string;
  type: string;
  name: string;
  name_normalized: string;
  address: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  coordinates: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  number: string | null;
  organization: {
    name: string;
    acronym: string;
  };
  person: {
    id: string;
    name: string;
    phone: string;
    email: string;
    role: string;
  };
}
