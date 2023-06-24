// Las imagenes que se suben se almacenan en el servidor de amazon. Buscar la forma de almacenar en servidor de vps

import fs from 'fs';
import multiparty from 'multiparty';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3' //chequear origen
import mime from 'mime-types'; //chequear origen
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

const bucketName = 'nlrecor-admin';
export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  
  const form = new multiparty.Form(); //ver como funciona multiparty
  const {fields, files} = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {

      if (err) {
        reject (err)
      } else {
        resolve({fields, files});
      }
      // chequear el if abreviado {original}
      // if (err) reject(err);
      // resolve({fields, files}); 
    });
  });

  // console.log('length: ', files.file.length);
  const client = new S3Client({
    region: 'us-east-2', //la region de la base de datos esta en us-east-2.. ver si hay en latam
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  for (const file of files.file){
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext; //ver la forma de asignar un nombre mas preciso a cada imagen
    await client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read', // ACL?
      ContentType: mime.lookup(file.path),
    }));
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`; 
    links.push(link);
  }
  return res.json({links});
}

export const config = {
    api: {bodyParser:false},
};