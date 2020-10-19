import React from 'react';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
  },
  section: {
    margin: 40,
    padding: 10,
    flexGrow: 1,
  },
});

class MyDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const parsedjson = require('../../../parsed_textbook.json');
    const headers = parsedjson.heading;
    const text = parsedjson.paragraph;
    const len = headers.length;

    const sections = [];
    for (let i = 0; i < len; i++) {
      sections.push(
        <Text className="header" style={{ fontSize: 24, marginTop: 30 }}>
          {headers[i]}
        </Text>,
      );
      sections.push(
        <Text className="header" style={{ fontSize: 14 }}>
          {text[i]}
        </Text>,
      );
    }
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text
              style={{ fontSize: 45, alignSelf: 'center', marginBottom: 30 }}
            >
              Study Guide
            </Text>
            {sections}
          </View>
        </Page>
      </Document>
    );
  }
}
export class DownloadDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <PDFDownloadLink
          document={<MyDoc jsonloc={this.props.jsonloc} />}
          fileName="study_guide.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
        </PDFDownloadLink>
      </div>
    );
  }
}
