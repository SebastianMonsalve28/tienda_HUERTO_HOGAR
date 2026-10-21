export function validEmail(value) {
  return (
    /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(value.trim()) &&
    value.length <= 100
  );
}
export function validRun(value) {
  const run = value.replace(/[.\-]/g, "").trim().toUpperCase();
  if (!/^\d{6,8}[\dK]$/.test(run)) return false;
  let sum = 0,
    factor = 2;
  for (let i = run.length - 2; i >= 0; i--) {
    sum += Number(run[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const mod = 11 - (sum % 11);
  return run.slice(-1) === (mod === 11 ? "0" : mod === 10 ? "K" : String(mod));
}
export const locations = {
  "Región Metropolitana": ["Santiago", "Maipú", "Providencia", "Puente Alto"],
  Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué"],
  Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
};
export function validate(values, mode) {
  const errors = {};
  if (
    mode !== "login" &&
    !/^[a-záéíóúñü\s'-]{2,100}$/i.test(values.nombre?.trim() || "")
  )
    errors.nombre = "Ingresa un nombre válido (2 a 100 caracteres).";
  if (!validEmail(values.correo || ""))
    errors.correo = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  if (mode === "contact") {
    if (!(values.comentario || "").trim() || values.comentario.length > 500)
      errors.comentario = "Escribe un mensaje de hasta 500 caracteres.";
  } else if ((values.password || "").length < 4 || values.password.length > 10)
    errors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
  if (mode === "register") {
    if (!validRun(values.run || ""))
      errors.run = "Ingresa un RUN con dígito verificador válido.";
    if (!locations[values.region]?.includes(values.comuna))
      errors.comuna = "Selecciona una región y comuna de la lista.";
    if (!(values.direccion || "").trim() || values.direccion.length > 200)
      errors.direccion = "Ingresa una dirección de hasta 200 caracteres.";
  }
  return errors;
}
