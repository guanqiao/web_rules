import { v4 as uuidv4 } from 'uuid';

export const generateNodeId = (): string => {
  return uuidv4();
};

export const generateConnectionId = (): string => {
  return uuidv4();
};

export const createNode = (
  type: 'condition' | 'action' | 'group' | 'decision' | 'start' | 'end',
  position: { x: number; y: number },
  label: string,
  config: Record<string, any> = {}
) => {
  return {
    id: generateNodeId(),
    type,
    position,
    data: {
      label,
      config
    }
  };
};

export const validateConnection = (
  source: string,
  target: string,
  connections: any[]
): boolean => {
  if (source === target) return false;
  
  const existingConnection = connections.find(
    c => c.source === source && c.target === target
  );
  
  return !existingConnection;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateTime = (date: Date): string => {
  return date.toISOString();
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
