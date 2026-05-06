const { Parser } = require('json2csv');

/**
 * Converts an array of user documents to a CSV string
 * @param {Array} users - Array of user objects
 * @returns {string} CSV string
 */
const exportUsersToCSV = (users) => {
  const fields = [
    { label: 'ID', value: '_id' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Full Name', value: (row) => `${row.firstName} ${row.lastName}` },
    { label: 'Email', value: 'email' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Gender', value: 'gender' },
    { label: 'Status', value: 'status' },
    { label: 'Location', value: 'location' },
    { label: 'Created At', value: (row) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const parser = new Parser({ fields });
  return parser.parse(users);
};

module.exports = { exportUsersToCSV };
