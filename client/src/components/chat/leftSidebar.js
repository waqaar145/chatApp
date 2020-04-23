import React from 'react';
import {Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import {channels, users} from './../../data/channels_users'
import {Link} from 'react-router-dom';

const LeftSidebar = (props) => {

  const handleAddChannel = () => {
    console.log('add new channel')
  }

  const handleAddUser = () => {
    console.log('add new user')
  }

  return (
    <Col xs={2} className="chat-users-box users-list-scroll nopadding">
      <div className="chat-users-header">
        <span className="header-text">Conversations</span>
      </div>
      <div className="chat-users-body">
        <div className="channels">
          <div className="title">
            <span className="channel-name">Channels</span>
            <span className="content-float-right">
              <FontAwesomeIcon onClick={handleAddChannel} icon={faPlusCircle} />
            </span>
          </div>
          <div className="list">
            <ul className="list-style">
              {
                channels.map((channel, index) => {
                  return (
                    <li key={index}>
                      <Link to={`/subject/${channel.slug}`}>
                        # {channel.name}
                      </Link>
                    </li>
                  )
                })
              }
              <li>
                <a href="#asd">
                  More
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="channels">
          <div className="title">
            <span className="channel-name">Users</span>
            <span className="content-float-right">
              <FontAwesomeIcon onClick={handleAddUser} icon={faPlusCircle} />
            </span>
          </div>
          <div className="list">
            <ul className="list-style">
            {
                users.map((user, index) => {
                  return (
                    <li key={index}>
                      <span className="dot online"></span>
                      <Link to={`/subject/${user.slug}`}>
                        {user.name}
                      </Link>
                    </li>
                  )
                })
              }
              <li>
                <a href="#asd">
                  More
                </a>
              </li>
            </ul>
          </div>
          </div>
      </div>
    </Col>
  )
}

export default LeftSidebar;