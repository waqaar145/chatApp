import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import {subjects} from './../data/subjects';
import {Container, Row, Col} from 'reactstrap';
import LeftSidebar from './../components/chat/leftSidebar'
import RightSidebar from './../components/chat/rightSidebar'
import axios from 'axios';
import './../main.css'
import './../assets/css/chat.css';

let ENDPOINT = 'http://localhost:4001';
const socket = socketIOClient(ENDPOINT, { transports: ['websocket']});

const Subject = (props) => {

  const {match: {params: {subject_slug}}} = props;
  const [currentSubject, setCurrentSubject] = useState({subject_name: '', subject_slug: ''});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('')

  useEffect(() => { // setting current subject
    let slug = subjects.filter(subject => subject.slug === subject_slug)[0];
    setCurrentSubject({
      ...currentSubject, 
      subject_name: slug.name, 
      subject_slug: slug.slug
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject_slug]);

  useEffect(() => {
    let user_object = {
      channel: currentSubject.subject_slug,
      name: 'Waqaar - ' + Math.floor(Math.random() * 101)
    }
    socket.on('connect', () => {
      if (user_object.channel) socket.emit("join-channel", user_object);
    })
  }, [currentSubject]);

  useEffect(() => {
    socket.on('channel-joined', (data) => {
      console.log('CHANNEL JOINED - ', data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('sent-message', data => {
      setMessages([...messages, data]);
    })
  }, [messages]);

  useEffect(() => {
    if (currentSubject.subject_slug) {
      axios.get(`/channel/${currentSubject.subject_slug}`)
        .then(response => {
          console.log(response.data)
          setMessages([...messages, ...response.data]);
        }).catch(error => {
          console.log(error);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubject]);

  const handleMessage = (e) => {
    const {value} = e.target;
    setMessage(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('send-message-to-channel', {...currentSubject, message}, () => {
      setMessage('');
    })
  }

  return (
    <div>
      {/* <span><span>SUBJECT - </span>{currentSubject.subject_name}</span>
      <div className="message-box">
        <div className="chat-message">
          {
            messages.map((message, index) => {
              return(
                <div className="single-message" key={index}>
                  <span className="username">Name - {message.subject_name}</span>
                  <br />
                  <span className="message">Message - {message.message}</span>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="message-box">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Message</label>
          <input 
            name="message"
            value={message}
            onChange={handleMessage}
            />
        </div>
        <button type="submit">Send</button>
      </form>
      </div> */}


      {/* <Container> */}
        <Row className="chat-box">
          <LeftSidebar />
          <RightSidebar messages={messages}/>
        </Row>
      {/* </Container> */}
    </div>
  )
}

export default Subject;