export function emailError(value) {
  const email = String(value || "").trim();
  if (!email) return "El correo es obligatorio.";
  if (email.length > 100) return "El correo no puede superar 100 caracteres.";
  if ((email.match(/@/g) || []).length !== 1) return "El correo debe contener un solo símbolo @.";
  if (/\s/.test(email)) return "El correo no puede contener espacios.";
  const [name, domain] = email.split('@');
  if (!name || name.startsWith('.') || name.endsWith('.') || name.includes('..') || !/^[a-z0-9_%+.-]+$/i.test(name))
    return "El nombre del correo tiene un formato inválido (revisa los puntos y símbolos).";
  if (!/^(gmail\.com|duoc\.cl|profesor\.duoc\.cl)$/i.test(domain))
    return "Correo no permitido. Usa @gmail.com, @duoc.cl o @profesor.duoc.cl y revisa la terminación.";
  return "";
}
export function validEmail(value) { return !emailError(value); }
export function nameError(value) {
  const name = String(value || "").trim();
  if (!name) return "El nombre es obligatorio.";
  if (!/^[a-záéíóúñü\s'-]{2,100}$/i.test(name)) return "El nombre solo puede contener letras y debe tener entre 2 y 100 caracteres.";
  return "";
}
export function addressError(value) {
  const address = String(value || "").trim();
  if (!address) return "La dirección es obligatoria.";
  if (address.length > 200) return "La dirección no puede superar 200 caracteres.";
  if (address.length < 5 || !/[a-záéíóúñ]/i.test(address) || (!/\d/.test(address) && !/\bS\/?N\b/i.test(address)))
    return "Ingresa una dirección con calle y número (o indica S/N si no tiene número).";
  return "";
}
export function validateCheckout(values) {
  const errors = {};
  const name = nameError(values.nombre); if (name) errors.nombre = name;
  const email = emailError(values.correo); if (email) errors.correo = email;
  const address = addressError(values.direccion); if (address) errors.direccion = address;
  if (!values.region || !locations[values.region]) errors.region = "Selecciona una región válida.";
  if (!locations[values.region]?.includes(values.comuna)) errors.comuna = "Selecciona una comuna válida.";
  if (String(values.indicaciones || "").length > 300) errors.indicaciones = "Máximo 300 caracteres.";
  return errors;
}
export const normalizeRun = (value) => String(value || '').replace(/[.\-\s]/g, '').toUpperCase();
export function validRun(value) {
  const run = normalizeRun(value);
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
  if (mode !== "login") {
    const message = nameError(values.nombre);
    if (message) errors.nombre = message;
  }
  const correo = emailError(values.correo);
  if (correo) errors.correo = correo;
  if (mode === "contact") {
    if (!(values.comentario || "").trim()) errors.comentario = "El comentario es obligatorio.";
    else if (values.comentario.length > 500) errors.comentario = "El comentario no puede superar 500 caracteres.";
  } else if ((values.password || "").length < 4 || values.password.length > 10)
    errors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
  if (mode === "register") {
    if (!values.confirmPassword) errors.confirmPassword = "Confirma tu contraseña.";
    else if (values.password !== values.confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden.";
    if (!validRun(values.run || "")) errors.run = "Ingresa un RUN válido con su dígito verificador.";
    if (!locations[values.region]) errors.region = "Selecciona una región válida.";
    if (!locations[values.region]?.includes(values.comuna)) errors.comuna = "Selecciona una comuna válida.";
    const address = addressError(values.direccion);
    if (address) errors.direccion = address;
  }
  return errors;
}
