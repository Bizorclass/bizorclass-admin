import { Route } from '@angular/router';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from 'app/modules/admin/courses-page/courses/courses.resolvers';
import { TransferTeacherRequestListComponent } from './transfer-teacher-request/list/transfer-teacher-request-list.component';
import { TransferTeacherRequestComponent } from './transfer-teacher-request/transfer-teacher-request.component';

export const TransferTeacherRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'request-list'
    },
    {
        path     : 'request-list',
        component: TransferTeacherRequestComponent,
        children : [
            {
                path     : '',
                component: TransferTeacherRequestListComponent,
                resolve  : {
                    brands    : InventoryBrandsResolver,
                    categories: InventoryCategoriesResolver,
                    products  : InventoryProductsResolver,
                    tags      : InventoryTagsResolver,
                    vendors   : InventoryVendorsResolver
                }
            }
        ]
    }
];
