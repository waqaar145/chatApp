import {useState, useEffect} from 'react';
import { stringValidation, numberValidation, emailValidation, imageValidation, validateFinallySimple } from './../utils/validations/inputValidations';
import { convertFileToBase64 } from './../utils/validations/common';

export default function useForm (INITIAL_STATE, submitCallback) {
  const MODIFIED_INITIAL_STATE = {...INITIAL_STATE, current_key: ''};
  const [values, setValues] = useState(MODIFIED_INITIAL_STATE);
  const [errors, setErrors] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: {
        ...values[name],
        input_val: value
      },
      current_key: name
    }) 
  }

  const handleFileChange = async (e) => {
    const { name } = e.target;
    let file = e.target.files[0];
    let { base64 } = await convertFileToBase64(file);

    setValues({
      ...values,
      [name]: {
        ...values[name],
        input_val: file,
        imgUrl: base64
      },
      current_key: name
    }) 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true)
      await validateFinallySimple(values);
      submitCallback();
      setSubmitting(false)
    } catch(errors) {
      setErrors(errors.errors)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    async function validations () {
      if (values.current_key) {

        let name = values.current_key;

        let { type, condition, required, input_val } = values[name];
        let min, max, size, dimensions, image_type;

        if (type.name !== 'File') {
          min = condition.min;
          max = condition.max;
        } else {
          size = condition.size;
          dimensions = condition.dimensions;
          image_type = condition.type;
        }

        let error = {};

        if (type.name === 'String') {
          error = await stringValidation(name, input_val, required, min, max);
        } else if (type.name === 'Number') {
          error = await numberValidation(name, input_val, required, min, max);
        } else if (type.name === 'Email') {
          error = await emailValidation(name, input_val, required)
        } else if (type.name === 'File') {
          error = await imageValidation(name, input_val, required, size, dimensions, image_type);
        }

        if (error) {
          let indexIs = errors.findIndex(e => {
            return e.key === error.key;
          });
          if (indexIs > -1) {
            setErrors([...errors.filter(e => e.key !== error.key), error]);
          } else {
            setErrors([...errors, error]);
          }
        } else {
          setErrors([...errors.filter(e => e.key !== name)]);
        }
      }
    }
    validations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);


  const setToInitialState = () => {
    setValues(MODIFIED_INITIAL_STATE)
  }

  return {
    values,
    handleChange,
    handleFileChange,
    handleSubmit,
    submitting,
    setToInitialState,
    errors
  }
}