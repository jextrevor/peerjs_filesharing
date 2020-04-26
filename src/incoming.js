import React from 'react';

const IncomingTransfer = (conn) => {
  return (
    <>
      <p>INCOMING: {conn.peer}</p>
    </>
  );
};

export default IncomingTransfer;
