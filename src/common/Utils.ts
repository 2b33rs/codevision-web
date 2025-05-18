function buildComposeId(orderNumber: string, posNumber: string | number): string {
  // Verwandle posNumber in String, falls nötig, und verbinde mit Punkt
  return `${orderNumber}.${posNumber}`;
}

export default buildComposeId;