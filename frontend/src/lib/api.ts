const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to get auth headers
function getHeaders(isMultipart = false) {
  const token = typeof window !== "undefined" ? localStorage.getItem("guardrail_token") : null;
  const headers: Record<string, string> = {};
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

export const api = {
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("guardrail_token", token);
    }
  },

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("guardrail_token");
    }
    return null;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("guardrail_token");
    }
  },

  async request(endpoint: string, options: RequestInit & { skipAuthRedirect?: boolean } = {}) {
    const isMultipart = options.body instanceof FormData;
    const { skipAuthRedirect, ...fetchOptions } = options;
    const config = {
      ...fetchOptions,
      headers: {
        ...getHeaders(isMultipart),
        ...(fetchOptions.headers || {}),
      } as HeadersInit,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      if (errData.detail) {
        if (Array.isArray(errData.detail)) {
          errorMessage = errData.detail.map((e: any) => e.msg).join(", ");
        } else if (typeof errData.detail === "string") {
          errorMessage = errData.detail;
        } else {
          errorMessage = JSON.stringify(errData.detail);
        }
      }
      
      if (response.status === 401) {
        api.logout();
        if (!skipAuthRedirect && typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          // Store error in sessionStorage so login page can show it
          sessionStorage.setItem("auth_error", "Your session has expired. Please log in again.");
          window.location.href = "/login";
        }
      }
      
      throw new Error(errorMessage);
    }
    
    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  },

  // Auth endpoints
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const data = await this.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  },

  async register(email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe() {
    return this.request("/auth/me", { skipAuthRedirect: true });
  },

  // Audits endpoints
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.request("/audits/upload", {
      method: "POST",
      body: formData,
    });
  },

  async listAudits(skip = 0, limit = 50) {
    return this.request(`/audits?skip=${skip}&limit=${limit}`);
  },

  async getAudit(auditId: string) {
    return this.request(`/audits/${auditId}`);
  },

  async deleteAudit(auditId: string) {
    return this.request(`/audits/${auditId}`, {
      method: "DELETE",
    });
  },

  async rerunAudit(auditId: string) {
    return this.request(`/audits/${auditId}/rerun`, {
      method: "POST",
    });
  },

  // Reports endpoints
  async downloadReport(auditId: string, format: "json" | "csv") {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/reports/${auditId}/${format}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guardrail_report.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Stats endpoints
  async getStats() {
    return this.request("/dashboard/stats");
  },

  // Policy rules
  async getPolicies() {
    return this.request("/policies");
  },

  updatePassword(data: any) {
    return this.request("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  },

  forgotPassword(email: string) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" }
    });
  },

  resetPassword(data: any) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  }
};
