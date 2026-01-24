import axios from "axios";

const analyticsService = {
  // Fetch profile analytics from RPC
  getProfileAnalytics: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/profile-analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error fetching profile analytics:", error);
      throw error;
    }
  },

  // Fetch analytics data for a specific date range
  getAnalytics: async (dateRange = "7days") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { dateRange },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  // Get detailed metrics
  getDetailedMetrics: async (dateRange = "7days") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/metrics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { dateRange },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      throw error;
    }
  },

  // Get chart data
  getChartData: async (type = "views", dateRange = "7days") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/chart/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { dateRange },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  },

  // Download report as PDF
  downloadReport: async (dateRange = "7days") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/report/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { dateRange },
          responseType: "blob",
        },
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics-report-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  },

  // Get export data in different formats
  exportAnalytics: async (format = "csv", dateRange = "7days") => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/analytics/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { format, dateRange },
          responseType: format === "csv" ? "blob" : "json",
        },
      );

      if (format === "csv") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `analytics-${dateRange}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentElement.removeChild(link);
      }

      return response.data;
    } catch (error) {
      console.error("Error exporting analytics:", error);
      throw error;
    }
  },
};

export default analyticsService;
