import React from 'react';
import {Link} from 'react-router-dom';
import {subjects} from './../data/subjects';
import {Row, Col, Container} from 'reactstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

const Home = (props) => {

  return (
    <Container>
      <br />
      <Row>
        {
          subjects.map((subject, index) => {
            return (
              <Col key={index} sm={3}>
                 <Link to={`/subject/${subject.slug}`}>
                 <Card>
                    <CardImg top height="30%" src={subject.image} alt="Card image cap" />
                    <CardBody>
                      <CardTitle>{subject.name}</CardTitle>
                    </CardBody>
                  </Card>
                </Link>
              </Col> 
            )
          })
        }
      </Row>
    </Container>
  )
}

export default Home;