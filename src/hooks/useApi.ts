
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { mockApiResponses, mockDelay } from '@/mock/api';
import { useToast } from '@/hooks/use-toast';

// Mock mode flag - set to true to use mock data
const USE_MOCK = true;

// Generic API hook with mock support
export const useApiQuery = <T>(
  queryKey: string[],
  endpoint: string,
  options?: any
) => {
  const { toast } = useToast();
  
  return useQuery<T>({
    queryKey,
    queryFn: async (): Promise<T> => {
      if (USE_MOCK) {
        await mockDelay(500);
        const mockKey = `GET ${endpoint}` as keyof typeof mockApiResponses;
        const mockData = mockApiResponses[mockKey];
        if (mockData) {
          return mockData as T;
        }
        throw new Error(`Mock data not found for ${mockKey}`);
      }
      
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive'
      });
    },
    ...options
  });
};

export const useApiMutation = <TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (data: TVariables): Promise<TData> => {
      if (USE_MOCK) {
        await mockDelay(800);
        const mockKey = `${method} ${endpoint}` as keyof typeof mockApiResponses;
        const mockData = mockApiResponses[mockKey];
        if (mockData) {
          return mockData as TData;
        }
        throw new Error(`Mock data not found for ${mockKey}`);
      }
      
      let response;
      switch (method) {
        case 'POST':
          response = await apiClient.post(endpoint, data);
          break;
        case 'PUT':
          response = await apiClient.put(endpoint, data);
          break;
        case 'DELETE':
          response = await apiClient.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    },
    onSuccess: (data: any) => {
      // Invalidate related queries
      queryClient.invalidateQueries();
      
      if (data?.message) {
        toast({
          title: 'Success',
          description: data.message
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Operation failed',
        variant: 'destructive'
      });
    }
  });
};
