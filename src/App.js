import React, { createRef, useState, useEffect } from 'react';
import OutgoingTransfer from './outgoing';
import IncomingTransfer from './incoming';
import Peer from 'peerjs';

function saveAs(uri, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); // Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); // remove the link when done
  } else {
    window.location.replace(uri);
  }
}

const App = () => {
  const fileInput = createRef();
  const textInput = createRef();
  const [id, setId] = useState('Generating...');
  const [peer, setPeer] = useState();
  const [transfers, setTransfers] = useState([]);
  useEffect(() => {
    const peer = new Peer();
    //console.log(peer);
    peer.on('open', (id) => {
      setId(id);
    });
    peer.on('disconnected', () => {
      setId('Getting an id failed, trying again...');
      console.log('DISCONNECTED PANIC NOW');
      peer.reconnect();
    });
    peer.on('error', (err) => {
      console.log(err);
    });
    peer.on('connection', (conn) => {
      //setTransfers((transfers) => transfers.concat(IncomingTransfer(conn)));
      console.log('CONNECTION');
      conn.on('data', (data) => {
        let array = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          array[i] = data.charCodeAt(i);
        }
        var b = new Blob([array], { type: 'application/octet-stream' });
        saveAs(URL.createObjectURL(b), 'test.zip');
      });
      // //need to like set up an object to track this connection and the data being sent. need to have monitoring. do it.
      // conn.on('data', (data) => {
      //   if(data === 'ready'){
      //     conn.send('ACK');
      //     return;
      //   }
      //   alert(data);
      //   conn.send('good');
      //   //conn.send('ACK');
      // });
      // Set up a new data transfer thing with the connection.
    });
    setPeer(peer);
  }, [setPeer, setTransfers]);
  return (
    <>
      <h1>File Sharing</h1>
      <p>
        NOTE: This application loads any inbound or outbound files completely
        into memory before saving/sending them. Please ensure you have enough
        memory before sending large files.
      </p>
      <p>
        NOTE: This application currently only supports sending .zip files. Feel
        free to send other files, but make sure that the recipient renames the
        file from "test.zip" before trying to use it.
      </p>
      <p>
        LAST NOTE: This application is currently in development, and sends all
        the data at once, and is not very good at reporting/recovering from
        errors. I wouldn't use it for large files just yet.
      </p>
      <p>
        My ID:{' '}
        <b>
          <span>{id}</span>
        </b>
      </p>
      <input type="file" ref={fileInput} />
      <br />
      Receiver's ID: <input type="text" ref={textInput} />
      <br />
      <button
        onClick={() => {
          const text = textInput.current.value;
          const files = fileInput.current.files;
          if (files.length === 0) {
            alert('You must select a file!');
            return;
          } else if (files.length > 1) {
            alert('Please select only one file!');
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            console.log(reader.result);
            const conn = peer.connect(text);
            // setTransfers((transfers) => transfers.concat(OutgoingTransfer(conn)));
            conn.on('open', function () {
              console.log('CONNECTED TO');
              conn.send(reader.result);
            });
          };
          reader.onprogress = (event) => {
            console.log(event);
          };
          reader.readAsBinaryString(files[0]);
          //create a new outgoing transfer...

          // conn.on('data', (data) => {
          //   console.log('DATA');
          //   if (data === 'good') {
          //     conn.close();
          //   }
          //   if (data === 'ACK') {
          //     conn.send('Your mom');
          //   }
          // });
        }}
      >
        Send File
      </button>
      <br />
      {transfers}
    </>
  );
};

export default App;
