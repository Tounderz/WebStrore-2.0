import React from "react";
import { Form } from "react-bootstrap";
import NoImg from '../components/img/no_image.jpg'

export const CONFIG_MULTIPART = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};

export const FORM_DATA_VIEW = (id, role, currentPage) => {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('Role', role);
    formData.append('CurrentPage', currentPage);
    return formData;
}

export const PICTURE = (img) => {
    if (!img) {
      return NoImg;
    } else {
      return `https://localhost:44350${img}`;
    }
}

export const FormField = ({ label, value, onChange, onBlur, minLength, placeholder }) => (
    <React.Fragment>
      {(value.isDirty && value.minLengthError) && (
        <div className='error-message'>{value.messageError}</div>
      )}
      <Form.Control
        className='form-control-create-brand'
        value={value.value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </React.Fragment>
  );