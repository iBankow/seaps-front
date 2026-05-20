interface ChecklistItem {
  id: string;
  checklist_id: string;
  item_id: string;
  score: number | null;
  observation: string | null;
  image: string | null;
  is_inspected: boolean;
  is_valid: boolean | null;
  created_at: string;
  updated_at: string;
  item: {
    id: string;
    name: string;
  };
}
