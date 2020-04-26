import React, { useState, useEffect } from 'react';

const OutgoingTransfer = (conn) => {
  //const [status, setStatus] = useState('Opening connection...');
  // useEffect(() => {
  //   conn.on('open', () => {
  //     setStatus('Sending ready packet...');
  //   });
  // }, [conn, setStatus]);
  return (
    <>
      <p>OUTGOING: {conn.peer}</p>
      <p>Status:</p>
      <p>Packet Size: </p>
    </>
  );
};

export default OutgoingTransfer;
