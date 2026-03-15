import { useAuth } from "./useAuth"
export const useApi = () => {
  const config = useRuntimeConfig()
  const { accessToken } = useAuth()

  const apiFetch = <T>(url: string, options: any = {}) => {
    return $fetch<T>(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken.value ? `Bearer ${accessToken.value}` : '',
      },
    })
  }

  return { apiFetch }
}