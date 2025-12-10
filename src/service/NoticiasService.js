const API_URL = 'https://api.greenlandpy.com/api';

const NoticiasService = {
  getHeaders() {
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  async handleResponse(response) {
    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;

        if (response.status === 422 && errorData.errors) {
          console.error('❌ Validation errors:', errorData.errors);
          errorMessage = `Error de validación: ${JSON.stringify(errorData.errors)}`;
        }
      } catch {
        // Si no se puede parsear, usar mensaje por defecto
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },

  // Obtener todas las noticias
  async getAll() {
    const response = await fetch(`${API_URL}/noticias`, {
      method: 'GET',
    });
    return await this.handleResponse(response);
  },

  // Obtener solo las activas
  async getActivas() {
    const response = await fetch(`${API_URL}/noticias/activas`, {
      method: 'GET',
    });
    return await this.handleResponse(response);
  },

  // Obtener estadísticas
  async getEstadisticas() {
    const response = await fetch(`${API_URL}/noticias/estadisticas`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/noticias/${id}`, {
      method: 'GET',
    });
    return await this.handleResponse(response);
  },

  async create(noticiaData) {
    const response = await fetch(`${API_URL}/noticias`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(noticiaData)
    });
    return await this.handleResponse(response);
  },

  async update(id, noticiaData) {
    const response = await fetch(`${API_URL}/noticias/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(noticiaData)
    });
    return await this.handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/noticias/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return await this.handleResponse(response);
  },

  // Métodos de compatibilidad
  getNoticias() {
    return this.getAll();
  },
  createNoticia(noticiaData) {
    return this.create(noticiaData);
  },
  updateNoticia(id, noticiaData) {
    return this.update(id, noticiaData);
  },
  deleteNoticia(id) {
    return this.delete(id);
  }
};

export default NoticiasService;