import Papa from "papaparse";

/**
 * Parse CSV file with validations
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<{data: Array, errors: Array}>}
 */
export const parseCSV = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    // 🔴 Basic file validation
    if (!file) {
      reject("No file provided");
      return;
    }

    // ✅ File type validation
    if (!file.name.toLowerCase().endsWith(".csv")) {
      reject("Invalid file type. Please upload a CSV file.");
      return;
    }

    // ✅ File size validation (default 5MB)
    const maxSize = options.maxSize || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(`File too large. Max allowed size is ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true, // better for large files

      complete: (results) => {
        let data = results.data;
        let errors = [];

        // 🔴 Check if CSV is empty
        if (!data || data.length === 0) {
          reject("CSV file is empty");
          return;
        }

        // ✅ Required fields validation
        if (options.requiredFields && options.requiredFields.length > 0) {
          data.forEach((row, index) => {
            options.requiredFields.forEach((field) => {
              if (!row[field] || row[field].toString().trim() === "") {
                errors.push({
                  row: index + 1,
                  field,
                  message: `${field} is required`,
                });
              }
            });
          });
        }

        // ✅ Custom validation function
        if (options.validateRow) {
          data.forEach((row, index) => {
            const customErrors = options.validateRow(row, index);
            if (customErrors && customErrors.length > 0) {
              errors.push(...customErrors);
            }
          });
        }

        // ✅ Remove duplicate rows (based on key)
        if (options.uniqueBy) {
          const seen = new Set();
          data = data.filter((row) => {
            const key = row[options.uniqueBy];
            if (seen.has(key)) {
              errors.push({
                row,
                field: options.uniqueBy,
                message: "Duplicate value",
              });
              return false;
            }
            seen.add(key);
            return true;
          });
        }

        // ✅ Trim all values
        data = data.map((row) => {
          const newRow = {};
          Object.keys(row).forEach((key) => {
            newRow[key.trim()] =
              typeof row[key] === "string" ? row[key].trim() : row[key];
          });
          return newRow;
        });

        resolve({
          data,
          errors,
          meta: results.meta,
        });
      },

      error: (error) => {
        reject(error.message || "Error parsing CSV");
      },
    });
  });
};