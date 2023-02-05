export const getImageIdFromUrl = (url: string, folderName: string) => {
  const urlPrefix = `https://storage.googleapis.com/${process.env.FIREBASE_PROJECT_ID}.appspot.com/`;
  return url
    .replace(urlPrefix, '')
    .replace(`${folderName}%2F`, `${folderName}/`);
};
