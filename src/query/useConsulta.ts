import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { Servicio } from '../store/tipos';

// Generic query hook
export function useApiConsulta<TData = unknown, TError = unknown>(
  key: string[],
  queryFn: () => Promise<TData>,
  options?: {
    staleTime?: number;
    cacheTime?: number;
  }
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

// Generic mutation hook
export function useApiMutacion<TData = unknown, TVariables = void, TError = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    onError?: (error: TError, variables: TVariables, context: unknown) => void;
    onSettled?: (
      data: TData | undefined,
      error: TError | null,
      variables: TVariables,
      context: unknown
    ) => void;
  }
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      options?.onSettled?.(data, error, variables, context);
    },
  });
}

// Specific query hooks
interface ClienteInfo {
  id: string;
  nombre: string;
  email: string;
  estado: string;
}

export const useServiciosCliente = () => {
  return useApiConsulta<Servicio[], Error>(
    ['cliente', 'servicios'],
    () => apiClient.get('/cliente/servicios').then((res) => res.data),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for frequently changing data
    }
  );
};

export const useClientesOperador = () => {
  return useApiConsulta<ClienteInfo[], Error>(
    ['operador', 'clientes'],
    () => apiClient.get('/operador/clientes').then((res) => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useEstadoDeIncorporacionCliente = () => {
  return useApiConsulta<{ paso: number; estado: string }, Error>(
    ['cliente', 'estado-incorporacion'],
    () => apiClient.get('/cliente/estado-incorporacion').then((res) => res.data)
  );
};
