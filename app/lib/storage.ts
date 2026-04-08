export const getNotes = () => {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem("calendar-notes");
  return saved ? JSON.parse(saved) : {};
};

export const saveNotes = (notes: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("calendar-notes", JSON.stringify(notes));
};