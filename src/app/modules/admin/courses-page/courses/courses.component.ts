import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'courses',
    templateUrl    : './courses.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
