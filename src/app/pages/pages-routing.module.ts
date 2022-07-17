import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeacherLinkListComponent } from './components/teacher-link/teacher-link-list.component';
import { AddTeacherLinkComponent } from './components/add-teacher-link/add-teacher-link.component';


const routes: Routes = [
  {
      path: '',
      component: PagesComponent,
      children: [
        {
          path:'dashboard', component:DashboardComponent
        },
        {
          path:'teacher-list', component:TeacherLinkListComponent
        },
        {
          path:'add-teacher-link', component:AddTeacherLinkComponent
        },
        {
          path:'attendance',
          loadChildren: () => import('src/app/pages/attendance/attendance.module').then(m => m.AttendanceModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'assignment',
          loadChildren: () => import('src/app/pages/assignment/assignment.module').then(m => m.AssignmentModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'student-details',
          loadChildren: () => import('src/app/pages/student-details/student-details.module').then(m => m.StudentDetailsModule),
          data:{ title: 'Dashboard'}
        },
        // {
        //   path:'student',component:StudentInfoComponent
        // },
        {
          path:'homework',
          loadChildren: () => import('src/app/pages/homework/homework.module').then(m => m.HomeworkModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'holiday',
          loadChildren: () => import('src/app/pages/holiday-list/holiday-list.module').then(m => m.HolidayListModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'syllabus',
          loadChildren: () => import('src/app/pages/syllabus/syllabus.module').then(m => m.SyllabusModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'examTimeTable',
          loadChildren: () => import('src/app/pages/examtimetable/examtimetable.module').then(m => m.ExamtimetableModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'examResult',
          loadChildren: () => import('src/app/pages/examresult/examresult.module').then(m => m.ExamresultModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'timetable',
          loadChildren: () => import('src/app/pages/timetable/timetable.module').then(m => m.TimetableModule),
          data:{ title: 'Dashboard'}
        },
        // {
        //   path:'StudentInfoPopup',component:StudentInfoPopupComponent
        // },
        {
          path:'fees',
          loadChildren: () => import('src/app/pages/fees/fees.module').then(m => m.FeesModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'parentMeet',
          loadChildren: () => import('src/app/pages/parent-meeting/parent-meeting.module').then(m => m.ParentMeetingModule),
          data:{ title: 'Dashboard'}
        },
        {
          path:'master/teacher',
          loadChildren: () => import('src/app/pages/teacher/teacher.module').then(m => m.TeacherModule),
          data:{ title: 'Master'}
        },
        {
          path: 'master/parent',
          loadChildren:() => import('src/app/pages/parent/parent.module').then(m => m.ParentModule),
          data:{ title: 'Master'}
        },
        {
          path: 'master/standard',
          loadChildren:() => import('src/app/pages/standard/standard.module').then(m => m.StandardModule),
          data:{ title: 'Master'}
        },
        {
          path: 'master/division',
          loadChildren:() => import('src/app/pages/division/division.module').then(m => m.DivisionModule),
          data:{ title: 'Master'}
        },
        {
          path: 'master/subject',
          loadChildren:() => import('src/app/pages/subject/subject.module').then(m => m.SubjectModule),
          data:{ title: 'Master'}
        },
        {
          path: 'master/location',
          loadChildren:() => import('src/app/pages/location/location.module').then(m => m.LocationModule),
          data:{ title: 'Master'}
        },
        {
          path:'profile', component:ProfileComponent
        },
  
       ]
    },

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
 
})
export class PagesRoutingModule { }
