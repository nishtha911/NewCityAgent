import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL + '/api'
  : '/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Request failed'
    return Promise.reject(new Error(message))
  },
)

export const SignalsAPI = {
  send: (payload) => api.post('/signals', payload).then((r) => r.data),
}

export const AccountsAPI = {
  get: (phone) => api.get(`/accounts/${phone}`).then((r) => r.data),
  reactivateInitiate: (payload) =>
    api.post('/accounts/reactivate/initiate', payload).then((r) => r.data),
  reactivateVerify: (payload) =>
    api.post('/accounts/reactivate/verify', payload).then((r) => r.data),
  open: (payload) => api.post('/accounts/open', payload).then((r) => r.data),
  createRemittance: (payload) =>
    api.post('/accounts/remittance', payload).then((r) => r.data),
}

export const DemoAPI = {
  state: () => api.get('/demo/state').then((r) => r.data),
  reset: () => api.post('/demo/reset').then((r) => r.data),
  triggerScenario: (scenario) =>
    api.post('/demo/trigger-scenario', { scenario }).then((r) => r.data),
}

export default api
