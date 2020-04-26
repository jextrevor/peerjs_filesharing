import React, { createRef, useState, useEffect } from 'react';
import Peer from 'peerjs';

const App = () => {
  const fileInput = createRef();
  const textInput = createRef();
  const [id, setId] = useState('');
  const [peer, setPeer] = useState();
  useEffect(() => {
    const peer = new Peer();
    //console.log(peer);
    peer.on('open', (id) => {
      setId(id);
    });
    peer.on('connection', (conn) => {
      console.log('CONNECTION');
      //need to like set up an object to track this connection and the data being sent. need to have monitoring. do it.
      conn.on('data', (data) => {
        if(data === 'ready'){
          conn.send('ACK');
          return;
        }
        alert(data);
        conn.send('good');
        //conn.send('ACK');
      });
    });
    setPeer(peer);
  }, [setPeer]);
  return (
    <>
      <h1>File Sharing</h1>
      <p>
        My ID: <span>{id}</span>
      </p>
      <input type="file" ref={fileInput} />
      <br />
      Receiver's ID: <input type="text" ref={textInput} />
      <br />
      <button
        onClick={() => {
          const text = textInput.current.value;
          const files = fileInput.current.files;
          // if (files.length === 0) {
          //   alert('You must select a file!');
          // } else if (files.length > 1) {
          //   alert('Please select only one file!');
          // } else {
          //   alert("That's good!");
          // }
          const conn = peer.connect(text);
          conn.on('open', function () {
            console.log('CONNECTED TO');
            conn.send('ready');
          });
          conn.on('data', (data) => {
            console.log('DATA');
            if (data === 'good') {
              conn.close();
            }
            if (data === 'ACK') {
              conn.send('Your mom');
            }
          });
          
        }}
      >
        Send File
      </button>
    </>
  );
};

export default App;
