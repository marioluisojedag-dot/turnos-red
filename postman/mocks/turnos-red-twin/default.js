const http = require("http");

// ─── Helpers ────────────────────────────────────────────────────────────────

function jsonResponse(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function apiError(res, status, message, code, details) {
  jsonResponse(res, status, { status, message, code, details: details || [] });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ─── Validation ──────────────────────────────────────────────────────────────

const ESPECIALIDADES = ['Clínica médica', 'Pediatría', 'Odontología', 'Nutrición'];

function validateTurno(body) {
  const errors = [];
  if (!body.paciente || typeof body.paciente !== 'string' || body.paciente.trim() === '')
    errors.push({ path: ['paciente'], message: 'Required' });
  if (!body.documento || String(body.documento).trim() === '')
    errors.push({ path: ['documento'], message: 'Required' });
  if (!ESPECIALIDADES.includes(body.especialidad))
    errors.push({ path: ['especialidad'], message: `Must be one of: ${ESPECIALIDADES.join(', ')}` });
  if (body.id === undefined || body.id === null)
    errors.push({ path: ['id'], message: 'Required' });
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(body.fecha || ''))
    errors.push({ path: ['fecha'], message: 'La fecha debe tener el formato DD/MM/YYYY' });
  if (!/^\d{2}[:\.]\d{2}$/.test(body.hora || ''))
    errors.push({ path: ['hora'], message: 'La hora debe tener el formato HH:MM o HH.MM' });
  if (body.confirmado === undefined || (typeof body.confirmado !== 'boolean' && body.confirmado !== 'si' && body.confirmado !== 'no'))
    errors.push({ path: ['confirmado'], message: 'Must be boolean or "si"/"no"' });
  return errors;
}

function validateMedico(body) {
  const errors = [];
  if (body.id === undefined || body.id === null)
    errors.push({ path: ['id'], message: 'Required' });
  if (!body.nombre || typeof body.nombre !== 'string' || body.nombre.trim() === '')
    errors.push({ path: ['nombre'], message: 'Required' });
  if (!ESPECIALIDADES.includes(body.especialidad))
    errors.push({ path: ['especialidad'], message: `Must be one of: ${ESPECIALIDADES.join(', ')}` });
  if (typeof body.disponible !== 'boolean')
    errors.push({ path: ['disponible'], message: 'Must be a boolean' });
  return errors;
}

// ─── Normalization ───────────────────────────────────────────────────────────

function normalizarTurno(raw) {
  const id = Number(raw.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  const paciente = String(raw.paciente || '').trim();
  const documento = String(raw.documento || '').trim();
  const especialidad = String(raw.especialidad || '').trim();
  if (!paciente || !documento || !especialidad) return null;
  const [dia, mes, año] = String(raw.fecha).split('/');
  const diaNum = Number(dia), mesNum = Number(mes), añoNum = Number(año);
  if (diaNum <= 0 || diaNum > 31 || mesNum <= 0 || mesNum > 12 || añoNum <= 0) return null;
  const fechaDate = new Date(añoNum, mesNum - 1, diaNum);
  if (fechaDate.getFullYear() !== añoNum || fechaDate.getMonth() !== mesNum - 1 || fechaDate.getDate() !== diaNum) return null;
  const fecha = `${año}-${mes}-${dia}`;
  const hora = String(raw.hora).replace('.', ':');
  const [hp, mp] = hora.split(':');
  const horaNum = Number(hp), minNum = Number(mp);
  if (!Number.isInteger(horaNum) || !Number.isInteger(minNum) ||
      horaNum < 0 || horaNum > 23 || minNum < 0 || minNum > 59) return null;
  let confirmado;
  if (typeof raw.confirmado === 'boolean') {
    confirmado = raw.confirmado;
  } else {
    const c = String(raw.confirmado).trim().toLowerCase();
    if (c === 'si') confirmado = true;
    else if (c === 'no') confirmado = false;
    else return null;
  }
  return { id, paciente, documento, especialidad, fecha, hora, confirmado };
}

function normalizarMedico(raw) {
  const id = Number(raw.id);
  if (!Number.isInteger(id) || id <= 0) return null;
  const nombre = String(raw.nombre || '').trim();
  const especialidad = String(raw.especialidad || '').trim();
  if (!nombre || !especialidad) return null;
  if (typeof raw.disponible !== 'boolean') return null;
  return { id, nombre, especialidad, disponible: raw.disponible };
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_TURNOS = [
  { id: 102, paciente: 'Carlos Ruiz', documento: '31654210', especialidad: 'Pediatría', fecha: '2026-08-14', hora: '10:00', confirmado: true },
];

const SEED_MEDICOS = [
  { id: 1, nombre: 'Dra. Laura Gómez', especialidad: 'Clínica médica', disponible: true },
  { id: 2, nombre: 'Dr. Martín Pérez', especialidad: 'Pediatría', disponible: true },
  { id: 3, nombre: 'Dra. Sofía Ruiz', especialidad: 'Odontología', disponible: false },
  { id: 4, nombre: 'Lic. Paula Díaz', especialidad: 'Nutrición', disponible: true },
];

// ─── State bootstrap ─────────────────────────────────────────────────────────

async function getState() {
  const seeded = await pm.state.get('turnos-red:seeded');
  if (!seeded) {
    await pm.state.set('turnos-red:turnos', SEED_TURNOS);
    await pm.state.set('turnos-red:medicos', SEED_MEDICOS);
    await pm.state.set('turnos-red:seeded', true);
  }
  const turnos = (await pm.state.get('turnos-red:turnos')) || [];
  const medicos = (await pm.state.get('turnos-red:medicos')) || [];
  return { turnos, medicos };
}

// ─── Route matching ──────────────────────────────────────────────────────────

function matchPath(pattern, url) {
  const path = url.split('?')[0];
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

function getQuery(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  const qs = url.slice(idx + 1);
  const result = {};
  for (const part of qs.split('&')) {
    const [k, v] = part.split('=');
    if (k) result[decodeURIComponent(k)] = v !== undefined ? decodeURIComponent(v) : '';
  }
  return result;
}

// ─── Server ──────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const { turnos, medicos } = await getState();

  // @endpoint GET /turnos
  if (method === 'GET' && matchPath('/turnos', url)) {
    return jsonResponse(res, 200, turnos);
  }

  // @endpoint GET /turnos/:id
  const turnoIdParams = matchPath('/turnos/:id', url);
  if (method === 'GET' && turnoIdParams) {
    const id = Number(turnoIdParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return apiError(res, 400, 'El ID debe ser un número entero positivo', 'VALIDATION_ERROR');
    const turno = turnos.find(t => t.id === id);
    if (!turno)
      return apiError(res, 404, 'Turno no encontrado', 'NOT_FOUND');
    return jsonResponse(res, 200, turno);
  }

  // @endpoint POST /turnos
  if (method === 'POST' && matchPath('/turnos', url)) {
    let body;
    try { body = await parseBody(req); } catch { return apiError(res, 400, 'JSON inválido', 'VALIDATION_ERROR'); }
    const errors = validateTurno(body);
    if (errors.length > 0)
      return jsonResponse(res, 400, { status: 400, message: 'Error de validación en los datos ingresados', code: 'VALIDATION_ERROR', details: errors });
    const nuevo = normalizarTurno(body);
    if (!nuevo)
      return jsonResponse(res, 400, { error: 'Datos del turno inválidos' });
    turnos.push(nuevo);
    await pm.state.set('turnos-red:turnos', turnos);
    return jsonResponse(res, 201, nuevo);
  }

  // @endpoint PUT /turnos/:id
  const turnoUpdateParams = matchPath('/turnos/:id', url);
  if (method === 'PUT' && turnoUpdateParams) {
    const id = Number(turnoUpdateParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return jsonResponse(res, 400, { error: 'El ID debe ser un número entero positivo' });
    let body;
    try { body = await parseBody(req); } catch { return apiError(res, 400, 'JSON inválido', 'VALIDATION_ERROR'); }
    const errors = validateTurno(body);
    if (errors.length > 0)
      return jsonResponse(res, 400, { status: 400, message: 'Error de validación en los datos ingresados', code: 'VALIDATION_ERROR', details: errors });
    const idx = turnos.findIndex(t => t.id === id);
    if (idx === -1)
      return apiError(res, 404, 'Turno no encontrado', 'NOT_FOUND');
    const actualizado = normalizarTurno(body);
    if (!actualizado)
      return apiError(res, 400, 'Datos del médico inválidos', 'VALIDATION_ERROR');
    turnos[idx] = actualizado;
    await pm.state.set('turnos-red:turnos', turnos);
    return jsonResponse(res, 200, actualizado);
  }

  // @endpoint DELETE /turnos/:id
  const turnoDeleteParams = matchPath('/turnos/:id', url);
  if (method === 'DELETE' && turnoDeleteParams) {
    const id = Number(turnoDeleteParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return jsonResponse(res, 400, { error: 'El ID debe ser un número entero positivo' });
    const idx = turnos.findIndex(t => t.id === id);
    if (idx === -1)
      return jsonResponse(res, 404, { error: 'Turno no encontrado' });
    turnos.splice(idx, 1);
    await pm.state.set('turnos-red:turnos', turnos);
    return jsonResponse(res, 200, { mensaje: 'Turno eliminado correctamente' });
  }

  // @endpoint GET /medicos
  if (method === 'GET' && matchPath('/medicos', url)) {
    const q = getQuery(url);
    let result = medicos;
    if (q.especialidad) result = result.filter(m => m.especialidad === q.especialidad);
    if (q.disponible === 'true') result = result.filter(m => m.disponible === true);
    else if (q.disponible === 'false') result = result.filter(m => m.disponible === false);
    return jsonResponse(res, 200, result);
  }

  // @endpoint GET /medicos/:id
  const medicoIdParams = matchPath('/medicos/:id', url);
  if (method === 'GET' && medicoIdParams) {
    const id = Number(medicoIdParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return apiError(res, 400, 'El ID debe ser un número entero positivo', 'VALIDATION_ERROR');
    const medico = medicos.find(m => m.id === id);
    if (!medico)
      return apiError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    return jsonResponse(res, 200, medico);
  }

  // @endpoint POST /medicos
  if (method === 'POST' && matchPath('/medicos', url)) {
    let body;
    try { body = await parseBody(req); } catch { return apiError(res, 400, 'JSON inválido', 'VALIDATION_ERROR'); }
    const errors = validateMedico(body);
    if (errors.length > 0)
      return jsonResponse(res, 400, { status: 400, message: 'Error de validación en los datos ingresados', code: 'VALIDATION_ERROR', details: errors });
    const nuevo = normalizarMedico(body);
    if (!nuevo)
      return jsonResponse(res, 400, { error: 'Datos del médico inválidos' });
    medicos.push(nuevo);
    await pm.state.set('turnos-red:medicos', medicos);
    return jsonResponse(res, 201, nuevo);
  }

  // @endpoint PUT /medicos/:id
  const medicoUpdateParams = matchPath('/medicos/:id', url);
  if (method === 'PUT' && medicoUpdateParams) {
    const id = Number(medicoUpdateParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return apiError(res, 400, 'El ID debe ser un número entero positivo', 'VALIDATION_ERROR');
    let body;
    try { body = await parseBody(req); } catch { return apiError(res, 400, 'JSON inválido', 'VALIDATION_ERROR'); }
    const errors = validateMedico(body);
    if (errors.length > 0)
      return jsonResponse(res, 400, { status: 400, message: 'Error de validación en los datos ingresados', code: 'VALIDATION_ERROR', details: errors });
    const idx = medicos.findIndex(m => m.id === id);
    if (idx === -1)
      return apiError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    const actualizado = normalizarMedico(body);
    if (!actualizado)
      return apiError(res, 400, 'Datos del médico inválidos', 'VALIDATION_ERROR');
    medicos[idx] = actualizado;
    await pm.state.set('turnos-red:medicos', medicos);
    return jsonResponse(res, 200, actualizado);
  }

  // @endpoint DELETE /medicos/:id
  const medicoDeleteParams = matchPath('/medicos/:id', url);
  if (method === 'DELETE' && medicoDeleteParams) {
    const id = Number(medicoDeleteParams.id);
    if (!Number.isInteger(id) || id <= 0)
      return apiError(res, 400, 'El ID debe ser un número entero positivo', 'VALIDATION_ERROR');
    const idx = medicos.findIndex(m => m.id === id);
    if (idx === -1)
      return apiError(res, 404, 'Médico no encontrado', 'NOT_FOUND');
    medicos.splice(idx, 1);
    await pm.state.set('turnos-red:medicos', medicos);
    return jsonResponse(res, 200, { mensaje: 'Médico eliminado correctamente' });
  }

  // 404 fallback
  return apiError(res, 404, 'Ruta no encontrada', 'NOT_FOUND');
});

server.listen(process.env.PORT || 4500);
