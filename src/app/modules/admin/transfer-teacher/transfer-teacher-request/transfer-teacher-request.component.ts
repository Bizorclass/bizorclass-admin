import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'transfer-teacher-request',
    templateUrl: './transfer-teacher-request.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferTeacherRequestComponent {
    /**
     * Constructor
     */
    constructor() {
    }
}
