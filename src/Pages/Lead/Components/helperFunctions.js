const nodeApi = import.meta.env.VITE_NODE_API_URL;
const appUrl = import.meta.env.VITE_APP_URL;

export const getTransactionListByLead = async (id) => {
    try {
      const response = await fetch(`${nodeApi}/transactions/${id}`);
      const data = await response.json();
      return data.data ? { success: true, data: data.data } : { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };