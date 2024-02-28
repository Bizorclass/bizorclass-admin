import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BannerComponent } from 'app/modules/admin/banner/banner.component';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const bannerRoutes: Route[] = [
    {
        path: '',
        component: BannerComponent
    }
];

@NgModule({
    declarations: [
        BannerComponent
    ],
    imports: [
        FuseCardModule,
        SharedModule,
        MatIconModule,
        MatButtonModule,
        RouterModule.forChild(bannerRoutes)
    ]
})
export class BannerModule {
}
