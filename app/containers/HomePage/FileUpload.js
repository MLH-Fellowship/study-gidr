import React from 'react';
import axios, { post } from 'axios';

class SimpleReactFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  // uploadFile(file) {
  //   fetch('http://localhost:3000/upload', {
  //     // content-type header should not be specified!
  //     method: 'POST',
  //     body: file
  //   })
  //     .catch(error => console.log(error)
  //     );
  // }
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file)
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileUpload(file) {
    const url = 'http://localhost:3000/upload';
    console.log('uploading...');
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return post(url, formData, config).catch(function(error) {
      // handle error
      console.log(error.response);
    });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default SimpleReactFileUpload;
