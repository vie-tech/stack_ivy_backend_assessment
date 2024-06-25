const GET_BALANCE_QUERY = `
    SELECT a.id, a.username, a.email, a.phone, w.balance
    FROM accounts AS a
    LEFT JOIN wallet AS w ON a.id = w.owner_id
    WHERE a.id = $1
`;

const CREDIT_ACCOUNT_QUERY = `
    UPDATE wallet
    SET balance=$1
    WHERE owner_id = $2;
  `;

const DEBIT_ACCOUNT_QUERY = `
    UPDATE wallet
    SET balance=$1
    WHERE owner_id = $2;
  `;

module.exports = {
  GET_BALANCE_QUERY,
  CREDIT_ACCOUNT_QUERY,
  DEBIT_ACCOUNT_QUERY,
};
