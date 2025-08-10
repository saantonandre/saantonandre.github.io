/** 
 * Returns a string formatted as an acronym
 * @example 
 * "srl" => "S.r.l."
 * "sapa" => "S.a.p.a."
 */
export const toAcronym = (society_form: string) => {
  return (society_form || "srl")
    .split("")
    .map((c, i) => (i === 0 ? c.toUpperCase() : c))
    .join(".");
};
