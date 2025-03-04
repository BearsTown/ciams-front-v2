interface apiInfo {
  readonly URL: () => string | undefined
  readonly PATH: string
  readonly PREFIX: string
}

export const BASIC_AUTH = {
  username: 'ciams-web-client',
  password: 'cGdtcy13ZWItY2xpZW50LXNlY3JldA==',
}

export const API_INFO_AUTH: apiInfo = {
  PATH: '',
  PREFIX: '/api-auth',
  URL: () => process.env.VITE_API_AUTH_URL,
}

export const API_INFO_CIAMS: apiInfo = {
  PATH: '',
  PREFIX: '/api-ciams',
  URL: () => process.env.VITE_API_CIAMS_URL,
}

export const API_INFO_VWORLD: apiInfo = {
  PATH: '',
  PREFIX: '/api-vWorld',
  URL: () => process.env.VITE_API_VWORLD_URL,
}
export const API_INFO_PUBLIC: apiInfo = {
  PATH: '',
  PREFIX: '/api-public',
  URL: () => process.env.VITE_API_PUBLIC_URL,
}

export const API_INFO_MAPSTUDIO: apiInfo = {
  PATH: '',
  PREFIX: '/api-mapstudio',
  URL: () => process.env.VITE_API_MAPSTUDIO_URL,
}

export const API_LIST: apiInfo[] = [
  API_INFO_AUTH,
  API_INFO_CIAMS,
  API_INFO_VWORLD,
  API_INFO_MAPSTUDIO,
  API_INFO_PUBLIC,
]
