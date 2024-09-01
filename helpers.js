const createTableQuery = `
   CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        clicks INT NOT NULL DEFAULT 0,
        original_url VARCHAR(255) NOT NULL,
        short_url VARCHAR(150) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

function insertQuery(values) {
  const insertQuery = `
        INSERT INTO urls( original_url, short_url) VALUES ($1, $2)
    `;
  return { text: insertQuery, values };
}

const fetchAllQuery = `
    SELECT * from urls;
`;
function fetchSingleQuery(values) {
  const findQuery = `
    SELECT * FROM urls where short_url = $1
    `;
  return { text: findQuery, values };
}

function updateQuery(id, values) {
    const updateQuery = `
        UPDATE urls SET clicks = $1 WHERE id = ${id}
    `;
    return { text: updateQuery, values };
}


module.exports = {
  createTableQuery,
  insertQuery,
  fetchAllQuery,
  fetchSingleQuery,
  updateQuery
};
