import { Document, Font, Page, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/Roboto-Medium.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    // padding: '30pt',
    // paddingBottom: '80pt',
    display: 'flex',
    flexDirection: 'row',
  },
});

// const pageLayout = {
//   tranformSize: ({ size }) => ({ height: size.height - 30, width: size.width + 30 }),
// };

export function PdfDocument(html: string) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <Html>{html}</Html>
      </Page>
    </Document>
  );
}
