import React from 'react';
import ReactLayout from './lib/react_layout';
import AdminLayout from './components/layouts/admin_layout';
import MainLayout from './components/layouts/main_layout';
import Home from './components/home';
import AdminHome from './components/admin/home';
import Users from './components/admin/users';
import UserEdit from './components/admin/user_edit';
import Companies from './components/admin/companies';
import CompanyEdit from './components/admin/company_edit';

import Meetings from './components/organizer/meetings';
import MeetingEdit from './components/organizer/meeting';
import MeetingView from './components/organizer/meeting_view';
import MeetingVote from './components/organizer/vote';
import ReesterView from './components/organizer/reester';
import Results from './components/organizer/results';




FlowRouter.route('/', {
  action() {
    FlowRouter.go('/organizer/meetings');
    // ReactLayout.render(MainLayout, {active: false, content: <Home /> });
  }
});

FlowRouter.route('/organizer/meetings', {
  action() {
      ReactLayout.render(MainLayout, {content: <Meetings /> });
  }
});

FlowRouter.route('/organizer/meetings/edit/:m_id', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <MeetingEdit meet_id={params.m_id} /> });
  }
});

FlowRouter.route('/organizer/meetings/new', {
  action() {
    ReactLayout.render(MainLayout, { content: <MeetingEdit /> });
  }
});
FlowRouter.route('/organizer/meetings/view/:m_id', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <MeetingView meet_id={params.m_id} /> });
  }
});

FlowRouter.route('/organizer/meetings/vote/:m_id', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <MeetingVote meet_id={params.m_id} /> });
  }
});

FlowRouter.route('/organizer/meetings/results/:m_id', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <Results meet_id={params.m_id} /> });
  }
});

FlowRouter.route('/organizer/meetings/reester/:m_id', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <ReesterView meet_id={params.m_id} /> });
  }
});

FlowRouter.route('/owner', {
  action(params) {
    ReactLayout.render(MainLayout, { content: <Owner /> });
  }
});

let adminRoutes = FlowRouter.group({ prefix: '/admin' });

adminRoutes.route('/', {
  action() {
    ReactLayout.render(AdminLayout, { content: <AdminHome /> });
  }
});
adminRoutes.route('/users', {
  action() {
    ReactLayout.render(AdminLayout, { content: <Users /> });
  }
});

adminRoutes.route('/user/edit/:u_id', {
  action(params) {
    ReactLayout.render(AdminLayout, { content: <UserEdit user_id={params.u_id} /> });
  }
});

adminRoutes.route('/companies', {
  action() {
    ReactLayout.render(AdminLayout, { content: <Companies /> });
  }
});

adminRoutes.route('/companies/edit/:c_id', {
  action(params) {
    ReactLayout.render(AdminLayout, { content: <CompanyEdit comp_id={params.c_id} /> });
  }
});

adminRoutes.route('/companies/new', {
  action() {
    ReactLayout.render(AdminLayout, { content: <CompanyEdit /> });
  }
});

FlowRouter.initialize();
