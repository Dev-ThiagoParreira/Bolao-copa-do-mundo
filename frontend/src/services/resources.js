import api from './api';

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
};

export const campanhaService = {
  list: () => api.get('/campanhas'),
  getById: (id) => api.get(`/campanhas/${id}`),
  create: (payload) => api.post('/campanhas', payload),
  update: (id, payload) => api.put(`/campanhas/${id}`, payload),
  definirResultado: (id, opcaoId) => api.patch(`/campanhas/${id}/resultado-final`, { opcaoId }),
  listOpcoes: (campanhaId) => api.get(`/campanhas/${campanhaId}/opcoes`),
};

export const opcaoService = {
  create: (payload) => api.post('/opcoes-campanha', payload),
  update: (id, payload) => api.put(`/opcoes-campanha/${id}`, payload),
};

export const apostaService = {
  list: () => api.get('/apostas'),
  create: (payload) => api.post('/apostas', payload),
};

export const tipoCampanhaService = {
  list: () => api.get('/tipos-campanha'),
  create: (payload) => api.post('/tipos-campanha', payload),
};

export const meioPagamentoService = {
  list: () => api.get('/meios-pagamento'),
};

export const usuarioService = {
  list: () => api.get('/usuarios'),
  update: (id, payload) => api.put(`/usuarios/${id}`, payload),
};
