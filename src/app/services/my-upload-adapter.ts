import { environment } from "environments/environment";

export class MyUploadAdapter {
  loader: any;
  xhr: any;
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(file => new Promise((resolve, reject) => {
      this._initListeners(resolve, reject, file);
    }));
  }

  _initListeners(resolve, reject, file) {

    console.log(file);

    let bodyForUploadImage = new FormData();
    bodyForUploadImage.append('photo', file, `${file.name.split(".")[0]}-${Date.now()}.${file.name.split(".")[file.name.split(".").length - 1]}`);
    bodyForUploadImage.append('file_name', `${file.name.split(".")[0]}-${Date.now()}.${file.name.split(".")[file.name.split(".").length - 1]}`);

    fetch(environment.backendApiBaseUrl + 'commonData/uploadEditorImage', { method: 'POST', body: bodyForUploadImage }).then(rr => rr.json()).then((response: any) => {
        if (response?.default) {
            console.log(response);
            resolve(response);
        } else {
            console.error(response);
            reject(response)
        }
    })
    .catch(error => {
        console.error(error);
        reject(error)
    });

    // try {
    //   firebase.storage().ref().child(`text-editor-images/${file.name.split(".")[0]}-${Date.now()}.${file.name.split(".")[file.name.split(".").length - 1]}`).put(file).then(async res => {
    //     const firebaseImageUrl = await res.ref.getDownloadURL();
    //     console.log("firebaseImageUrl => ", firebaseImageUrl);
    //     resolve({ default: firebaseImageUrl });
    //   })
    // } catch (error) {
    //   console.error(error);
    //   reject(error)
    // }
  }
}
// `${result.name.split(".")[0]}-${Date.now()}.${result.name.split(".")[result.name.split(".").length - 1]}`
