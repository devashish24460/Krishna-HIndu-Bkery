import { createClient } from "@supabase/supabase-js";
import XLSX from "xlsx";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    return res.status(500).json({ error });
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

  res.send(buffer);
}