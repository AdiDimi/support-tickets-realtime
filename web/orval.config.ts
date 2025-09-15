import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: 'http://localhost:8080/swagger/v1/swagger.json',
    output: {
      target: 'src/generated/client.ts',
      client: 'axios',
      httpClient: 'axios',
      clean: true,
      prettier: true,
      baseUrl: '${VITE_API_BASE}',
      override: {
        mutator: {
          path: 'src/lib/axios.ts',
          name: 'axiosClient',
        },
        query: {
          useSuspenseQuery: false,
          useMutation: true,
          useQuery: true,
          signal: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'echo "orval: client generated"'
    }
  }
})