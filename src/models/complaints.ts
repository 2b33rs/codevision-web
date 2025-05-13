export interface Complaints {
  id: string;
  positionId: string;
  amount: number;
  reason: string;
  createdAt: string; // Use ISO string for date (e.g. "2025-05-13T10:00:00Z")
  complaintKind: "intern" | "extern";
  status: "active" | "finished";
}
