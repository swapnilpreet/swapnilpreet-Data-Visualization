export const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(1); // Ensure 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month (0-based index)
    const year = date.getFullYear(); // Get 4-digit year
  
    return `${day}/${month}/${year}`;
  };
  
 