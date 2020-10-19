import React from 'react';
import axios, { post } from 'axios';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { DownloadDoc } from './renderPDF';

class SimpleReactFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileName: null,
      loc: null,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

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
    return post(url, formData, config)
      .then(res => {
        this.setState({ fileName: res.data });
        this.setState({ loc: '../../../parsed_textbook.json' });
        // ReactPDF.render(<MyDocument />, '../../../pdf/guide.pdf');
      })
      .catch(function(error) {
        // handle error
        console.log(error.response);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
          <div>
            {this.state.fileName ? (
              <p>You have uploaded {this.state.fileName}</p>
            ) : (
              <p />
            )}
          </div>
        </form>
        <div>{this.state.fileName ? <DownloadDoc /> : <div />}</div>
      </div>
    );
  }
}

export default SimpleReactFileUpload;
