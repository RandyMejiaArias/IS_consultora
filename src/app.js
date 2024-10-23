import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const csvWriter = createObjectCsvWriter({
  path: './reviewedFiles/output.csv',
  header: [
    { id: 'poliza', title: 'Poliza' },
    { id: 'monto', title: 'Monto' },
    { id: 'fecha', title: 'Fecha' },
    { id: 'descripcion', title: 'Descripcion' },
    { id: 'aprobado', title: 'Aprobado' },
  ]
});

const pathFileToReview = './filesToReview/output.csv';

export const reviewPolicies = () => {
  const results = [];
  const recordsToCSV = [];

  try {
    fs.createReadStream(pathFileToReview)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        for (const { Poliza, Monto, Fecha, Descripcion} of results) {
          
          const mustAccept = Math.random() > 0.5;
          const newRow = {
            poliza: Poliza,
            monto: Monto,
            fecha: Fecha,
            descripcion: Descripcion,
            aprobado: mustAccept ? 'APROBADO' : 'NO APROBADO'
          }
  
          recordsToCSV.push(newRow);
        }
        
        csvWriter.writeRecords(recordsToCSV)
          .then(() => console.log('...Policies reviewed'));
      })
  } catch (error) {
    console.log(error);
  }
}