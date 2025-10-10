import { API_CONFIG } from '../config/api';

export interface UploadResponse {
  url: string;
  filename: string;
  originalFilename: string;
}

class FileUploadService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // Note: Ne pas inclure Content-Type dans les headers pour FormData
    // Le navigateur le fera automatiquement avec le boundary
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erreur lors de l\'upload' }));
      throw new Error(error.error || 'Erreur lors de l\'upload du fichier');
    }

    const data = await response.json();
    // Construire l'URL complète
    return {
      ...data,
      url: `${API_CONFIG.BASE_URL}${data.url}`
    };
  }

  async deleteImage(filename: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/files/${filename}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du fichier');
    }
  }

  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Format de fichier non autorisé. Utilisez: JPG, PNG, GIF ou WEBP'
      };
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Le fichier est trop volumineux (max 5MB)'
      };
    }

    return { valid: true };
  }
}

export default new FileUploadService();

