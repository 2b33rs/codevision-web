import React from "react";
import { CellContext } from "@tanstack/react-table";
import { Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Customer } from "@/models/customer";

export default function CustomerContactCell({
  row,
}: CellContext<Customer, unknown>) {
  const { phone, email } = row.original;
  const [hovered, setHovered] = React.useState(false);

  return (
    <div className="flex items-center gap-x-4 gap-y-1 text-sm">
      <motion.a
        href={`tel:${phone}`}
        className="flex items-center gap-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Phone className="size-4 shrink-0" />
        <motion.span
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, width: hovered ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {phone}
        </motion.span>
      </motion.a>
      <motion.a
        href={`mailto:${email}`}
        className="flex items-center gap-1"
        onMouseEnter={() => setHovered(false)}
        onMouseLeave={() => setHovered(false)}
      >
        <Mail className="size-4 shrink-0" />
        <motion.span
          initial={false}
          animate={{ opacity: hovered ? 0 : 1, width: hovered ? 0 : "auto" }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {email}
        </motion.span>
      </motion.a>
    </div>
  );
}
