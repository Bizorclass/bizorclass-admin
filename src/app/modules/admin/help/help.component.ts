import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'app/services/api.service';
import Editor from '../../../../../CK-Build/build/ckeditor';
import { MyUploadAdapter } from '../../../../../CK-Build/my-upload-adapter';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpComponent {

  public Editor = Editor;
  isLoading: boolean = true;
  textData: string;

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar) {
    this.getTermsAndConditionsDataFromServer();


    console.log(Editor);

  }

  async getTermsAndConditionsDataFromServer() {
    try {
      this.isLoading = true;
      const getTermsAndConditionsDataResponse: any = await this.apiService.getHelpData();
      console.log("getTermsAndConditionsDataResponse => ", getTermsAndConditionsDataResponse);
      if (getTermsAndConditionsDataResponse?.data) {
        this.textData = getTermsAndConditionsDataResponse?.data?.help;
      } else if (getTermsAndConditionsDataResponse?.error?.message) {
        //! getTermsAndConditionsDataResponse?.error?.message
        this._snackBar.open(getTermsAndConditionsDataResponse?.error?.message, "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      } else {
        //! Something went wrong! Try again
        this._snackBar.open("Something went wrong! Try again", "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      }
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      if (error?.error?.message) {
        this._snackBar.open(error?.error?.message, "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      } else {
        this._snackBar.open("Something went wrong! Try again", "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      }
      this.isLoading = false;
    }
  }

  async saveData() {
    try {
      this.isLoading = true;
      const updateCommonDataResponse: any = await this.apiService.updateCommonData({help: this.textData});
      console.log("updateCommonDataResponse => ", updateCommonDataResponse);
      if (updateCommonDataResponse?.data) {
        this._snackBar.open("Data updated successfully.", "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          panelClass: ['success-toast']
        //   panelClass: ['error-toast']
        })
      } else if (updateCommonDataResponse?.error?.message) {
        //! updateCommonDataResponse?.error?.message
        this._snackBar.open(updateCommonDataResponse?.error?.message, "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      } else {
        //! Something went wrong! Try again
        this._snackBar.open("Something went wrong! Try again", "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      }
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      if (error?.error?.message) {
        this._snackBar.open(error?.error?.message, "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      } else {
        this._snackBar.open("Something went wrong! Try again", "", {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 3000,
          // panelClass: ['success-toast']
          panelClass: ['error-toast']
        })
      }
      this.isLoading = false;
    }
  }


  onReady(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }
}
