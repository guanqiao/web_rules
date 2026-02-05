import { DataModel } from '@/types/rule.types';

const COMPILER_API_URL = import.meta.env.VITE_COMPILER_API_URL || 'http://localhost:8080';

export interface CompileRequest {
  dataModels: DataModel[];
  ruleName?: string;
  rulePackage?: string;
  version?: string;
  includeDrools?: boolean;
  droolsContent?: string;
}

export interface CompileResponse {
  success: boolean;
  filename?: string;
  error?: string;
}

export class CompilerApi {
  private static readonly BASE_URL = COMPILER_API_URL;

  static async compileAndDownloadJar(request: CompileRequest): Promise<CompileResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/compiler/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Compilation failed: ${errorText}`);
      }

      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : 'compiled-models.jar';

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      console.error('Compilation API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/compiler/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default CompilerApi;
