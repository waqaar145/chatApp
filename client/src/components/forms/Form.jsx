import React, {useState} from 'react';
import './../../main.css';
import useForm from './../../hooks/useForm';
import { showInputFieldError } from './../../utils/validations/common';
import { Col, Button, Form, FormGroup, Label, Input, FormFeedback, Container, Row, Alert } from 'reactstrap';

const INITIAL_STATE = {
  name: {
    input_val: '',
    required: true,
    type: String,
    condition: {
      min: 5,
      max: 20
    }
  },
  email: {
    input_val: '',
    required: true,
    type: {
      name: 'Email'
    },
    condition: {
      min: 1,
      max: 15
    }
  },
  tier_image: {
    input_val: '',
    imgUrl: '',
    required: true,
    type: File,
    condition: {
      size: 2, // in mb
      dimensions: {
        height: 200,
        width: 200
      },
      type: 'png|jpeg|jpg'
    }
  },
}

const FormComp = () => {

  const { 
    values, 
    handleChange, 
    handleFileChange, 
    handleSubmit, 
    submitting, 
    setToInitialState,
    errors
  } = useForm(INITIAL_STATE, submit);
  const [server_errors, setServerErrors] = useState('');

  function submit () {
    try {
      // eslint-disable-next-line no-unreachable
      console.log('DISPATCH & API CALL');
      setToInitialState();
      alert('Success', JSON.stringify(values, null, 2));
      document.getElementById('file').value = "";
    } catch (error) {
      setServerErrors('server error ')
    }
  }

  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col xs={3}></Col>
        <Col xs={6}>
          <h5>Sample Custom Hook Form</h5>
          <br />
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Name</Label>
              <Col sm={10}>
                <Input 
                  type="text"
                  name="name"
                  value={values.name.input_val}
                  onChange={handleChange}
                  placeholder="Name"
                  invalid={!!showInputFieldError(errors, 'name')}
                />
                {showInputFieldError(errors, 'name') && <FormFeedback >{showInputFieldError(errors, 'name')}</FormFeedback>}

              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Email</Label>
              <Col sm={10}>
                <Input 
                  type="text"
                  name="email"
                  value={values.email.input_val}
                  onChange={handleChange}
                  invalid={!!showInputFieldError(errors, 'email')}
                />
                {showInputFieldError(errors, 'email') && <FormFeedback>{showInputFieldError(errors, 'email')}</FormFeedback>}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="exampleEmail" sm={2}>Image</Label>
              <Col sm={10}>
                <Input 
                  id="file"
                  type="file"
                  name="tier_image"
                  onChange={handleFileChange}
                  invalid={!!showInputFieldError(errors, 'tier_image')}
                />
                {showInputFieldError(errors, 'tier_image') && <FormFeedback>{showInputFieldError(errors, 'tier_image')}</FormFeedback>}
                <br />
                {values.tier_image.imgUrl && <img width="50" src={values.tier_image.imgUrl} alt="tierimage" />}
              </Col>
            </FormGroup>

            <Button color="primary" disabled={submitting} type="submit">Submit</Button>
            <div>
              <br />
              {
                server_errors &&
                <Alert color="danger">
                  ERROR FROM SERVER - {server_errors}
                </Alert>
              }
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default FormComp;