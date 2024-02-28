import { Component, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'banner',
    templateUrl: './banner.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BannerComponent {

    images = [];
    isLoading: boolean = false;

    constructor(private apiService: ApiService) {
        this.getBannerImagesFromServer();
    }


    getBannerImagesFromServer() {
        this.isLoading = true;
        this.apiService.getBannerImages().subscribe(async (getBannerImagesResponse: any) => {
            console.log(getBannerImagesResponse);
            if (getBannerImagesResponse.data) {
                this.images = getBannerImagesResponse.data;
            } else {
                // !! error handle
            }
            this.isLoading = false;
        }, (err) => {
            console.log(err);
            this.isLoading = false;
        });
    }

    addBanner() {
        let htmlElement = document.createElement("input");
        htmlElement.type = "file";
        htmlElement.accept = "image/*";
        htmlElement.multiple = true;
        htmlElement.click();
        htmlElement.onchange = this.onChangeSelectImage.bind(this);
    }

    onChangeSelectImage(e) {
        let _files = Object.keys(e.target.files).map((m) => e.target.files[m]);
        if (!_files.some(s => !s.type.includes("image"))) {
            this.goToUpload(_files);
        } else {
            // errorToast("Please Select only images.");
        }
    }

    async goToUpload(_files) {
        console.log(_files);
        for (const fileItem of _files) {
            const file: any = await this.convertImageFileToWebpFile(fileItem);
            let bodyForUploadImage = new FormData();
            bodyForUploadImage.append('photo', file, `${Date.now()}.webp`);
            const uploadBannerImagesResponse = await this.apiService.uploadBannerImages(bodyForUploadImage);

            console.log(uploadBannerImagesResponse);

        }

        console.log("end");

        this.getBannerImagesFromServer();

    }

    async gotoDeleteImage(url) {
        console.log(url);
        const deleteBannerImageResponse:any = await this.apiService.deleteBannerImage({bannerPath: url});
        console.log(deleteBannerImageResponse);

        if (deleteBannerImageResponse?.data && deleteBannerImageResponse?.data?.length ) {
            this.getBannerImagesFromServer();
        } else {

        }
    }

    convertImageFileToWebpFile(file) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                canvas.getContext('2d').drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    let myFile = new File([blob], 'my-new-group-image.webp', {
                        type: blob.type,
                    });
                    resolve(myFile);
                }, 'image/webp');
            };
            image.crossOrigin = 'anonymous';
            image.src = URL.createObjectURL(file);
        });
    }
}
