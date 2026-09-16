export const fakeDepartments = [
  { id: 1, name: 'Engineering', description: 'Software development, architecture, and technical operations' },
  { id: 2, name: 'Human Resources', description: 'Employee management, recruitment, payroll, and company culture' },
  { id: 3, name: 'Marketing', description: 'Brand management, advertising, digital campaigns, and market research' },
  { id: 4, name: 'Finance', description: 'Financial planning, accounting, audits, and annual budgeting' },
  { id: 5, name: 'Sales', description: 'Client acquisition, account management, and revenue generation' },
  { id: 6, name: 'Operations', description: 'Day-to-day business operations, logistics, and infrastructure' },
  { id: 7, name: 'Legal', description: 'Legal compliance, contracts, and corporate governance' },
  { id: 8, name: 'Customer Support', description: 'Client onboarding, ticket resolution, and customer satisfaction' },
];

export const fakeProducts = [
  { id: 1, name: 'Laptop Pro 14"', sku: 'LP-14X', description: '14-inch ultrabook, 16GB RAM, 512GB SSD', price: 119900, quantity: 25, active: true, imageUrl: 'https://picsum.photos/seed/laptop/150' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'KB-200', description: 'RGB backlit mechanical keyboard with hot-swap switches', price: 8999, quantity: 60, active: true, imageUrl: 'https://picsum.photos/seed/keyboard/150' },
  { id: 3, name: 'Wireless Mouse', sku: 'MS-1001', description: '2.4GHz wireless mouse, silent clicks', price: 1999, quantity: 120, active: true, imageUrl: 'https://picsum.photos/seed/mouse/150' },
  { id: 4, name: '27" 4K Monitor', sku: 'MN-27K', description: '27-inch 4K IPS display, USB-C power delivery', price: 44999, quantity: 15, active: true, imageUrl: 'https://picsum.photos/seed/monitor/150' },
  { id: 5, name: 'USB-C Docking Station', sku: 'DK-C03', description: '9-in-1 docking station with 4K HDMI and ethernet', price: 13499, quantity: 0, active: true, imageUrl: 'https://picsum.photos/seed/dock/150' },
  { id: 6, name: 'Noise Cancelling Headphones', sku: 'HP-NC7', description: 'Over-ear ANC headphones, 30h battery', price: 25999, quantity: 40, active: true, imageUrl: 'https://picsum.photos/seed/headphones/150' },
  { id: 7, name: '1080p Webcam', sku: 'WC-1080', description: 'Full HD webcam with privacy shutter', price: 4999, quantity: 3, active: false, imageUrl: 'https://picsum.photos/seed/webcam/150' },
  { id: 8, name: 'Bluetooth Speaker', sku: 'SP-BT2', description: 'Portable Bluetooth 5.3 speaker, IPX7 rated', price: 7999, quantity: 35, active: true, imageUrl: 'https://picsum.photos/seed/speaker/150' },
];

export const fakeEmployees = [
  { id: 1, firstName: 'Raj', lastName: 'Kumar', email: 'raj.kumar@nexacorp.com', phone: '+91-98765-43210', hireDate: '2022-01-15', jobTitle: 'Senior Software Engineer', department: fakeDepartments[0], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@nexacorp.com', phone: '+91-98765-43211', hireDate: '2021-06-20', jobTitle: 'HR Manager', department: fakeDepartments[1], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, firstName: 'Amit', lastName: 'Patel', email: 'amit.patel@nexacorp.com', phone: '+91-98765-43212', hireDate: '2023-03-10', jobTitle: 'Marketing Lead', department: fakeDepartments[2], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@nexacorp.com', phone: '+91-98765-43213', hireDate: '2020-09-01', jobTitle: 'Finance Analyst', department: fakeDepartments[3], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@nexacorp.com', phone: '+91-98765-43214', hireDate: '2019-07-18', jobTitle: 'Sales Executive', department: fakeDepartments[4], status: 'INACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, firstName: 'Ananya', lastName: 'Iyer', email: 'ananya.iyer@nexacorp.com', phone: '+91-98765-43215', hireDate: '2023-01-05', jobTitle: 'DevOps Engineer', department: fakeDepartments[0], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, firstName: 'Mohit', lastName: 'Gupta', email: 'mohit.gupta@nexacorp.com', phone: '+91-98765-43216', hireDate: '2021-11-22', jobTitle: 'Operations Manager', department: fakeDepartments[5], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, firstName: 'Kavitha', lastName: 'Nair', email: 'kavitha.nair@nexacorp.com', phone: '+91-98765-43217', hireDate: '2022-04-12', jobTitle: 'Legal Counsel', department: fakeDepartments[6], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@nexacorp.com', phone: '+91-98765-43218', hireDate: '2023-08-01', jobTitle: 'Support Engineer', department: fakeDepartments[7], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, firstName: 'Deepa', lastName: 'Menon', email: 'deepa.menon@nexacorp.com', phone: '+91-98765-43219', hireDate: '2018-02-14', jobTitle: 'Tech Lead', department: fakeDepartments[0], status: 'LOCKED', imageUrl: 'https://i.pravatar.cc/150?img=10' },
  { id: 11, firstName: 'Rohan', lastName: 'Desai', email: 'rohan.desai@nexacorp.com', phone: '+91-98765-43220', hireDate: '2024-02-19', jobTitle: 'Software Developer', department: fakeDepartments[0], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=11' },
  { id: 12, firstName: 'Fatima', lastName: 'Khan', email: 'fatima.khan@nexacorp.com', phone: '+91-98765-43221', hireDate: '2023-10-30', jobTitle: 'UI/UX Designer', department: fakeDepartments[2], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=12' },
  { id: 13, firstName: 'Sanjay', lastName: 'Rao', email: 'sanjay.rao@nexacorp.com', phone: '+91-98765-43222', hireDate: '2017-05-08', jobTitle: 'Accountant', department: fakeDepartments[3], status: 'INACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=13' },
  { id: 14, firstName: 'Neha', lastName: 'Joshi', email: 'neha.joshi@nexacorp.com', phone: '+91-98765-43223', hireDate: '2022-08-25', jobTitle: 'Sales Manager', department: fakeDepartments[4], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=14' },
  { id: 15, firstName: 'Kiran', lastName: 'Bedi', email: 'kiran.bedi@nexacorp.com', phone: '+91-98765-43224', hireDate: '2021-02-11', jobTitle: 'Customer Success Lead', department: fakeDepartments[7], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=15' },
  { id: 16, firstName: 'Manish', lastName: 'Agarwal', email: 'manish.agarwal@nexacorp.com', phone: '+91-98765-43225', hireDate: '2023-06-14', jobTitle: 'QA Engineer', department: fakeDepartments[0], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=16' },
  { id: 17, firstName: 'Divya', lastName: 'Pillai', email: 'divya.pillai@nexacorp.com', phone: '+91-98765-43226', hireDate: '2022-12-02', jobTitle: 'Data Analyst', department: fakeDepartments[3], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=17' },
  { id: 18, firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@nexacorp.com', phone: '+91-98765-43227', hireDate: '2019-09-16', jobTitle: 'Network Administrator', department: fakeDepartments[5], status: 'LOCKED', imageUrl: 'https://i.pravatar.cc/150?img=18' },
  { id: 19, firstName: 'Pooja', lastName: 'Bhat', email: 'pooja.bhat@nexacorp.com', phone: '+91-98765-43228', hireDate: '2024-04-22', jobTitle: 'Talent Acquisition Specialist', department: fakeDepartments[1], status: 'ACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=19' },
  { id: 20, firstName: 'Ashwin', lastName: 'Nambiar', email: 'ashwin.nambiar@nexacorp.com', phone: '+91-98765-43229', hireDate: '2020-11-09', jobTitle: 'Security Analyst', department: fakeDepartments[5], status: 'INACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=20' },
];

export const fakeRoles = [
  { id: 1, name: 'ADMIN', description: 'Full system access with all permissions and user management' },
  { id: 2, name: 'HR_MANAGER', description: 'Manage employees, departments, user accounts, and recruitment' },
  { id: 3, name: 'DEPARTMENT_HEAD', description: 'Manage own department employees, reports, and approvals' },
  { id: 4, name: 'FINANCE_MANAGER', description: 'Access financial records, payroll, and expense approvals' },
  { id: 5, name: 'EMPLOYEE', description: 'Basic access to view own profile, attendance, and requests' },
  { id: 6, name: 'VIEWER', description: 'Read-only access to reports and dashboards' },
  { id: 7, name: 'SUPPORT_AGENT', description: 'Manage support tickets, customer profiles, and service requests' },
];

export const fakePermissions = [
  { id: 1, name: 'EMPLOYEE_VIEW', description: 'View employee records and profiles' },
  { id: 2, name: 'EMPLOYEE_CREATE', description: 'Create new employee records' },
  { id: 3, name: 'EMPLOYEE_UPDATE', description: 'Update employee details and status' },
  { id: 4, name: 'EMPLOYEE_DELETE', description: 'Permanently remove employee records' },
  { id: 5, name: 'DEPARTMENT_VIEW', description: 'View department list and details' },
  { id: 6, name: 'DEPARTMENT_CREATE', description: 'Create new departments' },
  { id: 7, name: 'DEPARTMENT_UPDATE', description: 'Update department details' },
  { id: 8, name: 'DEPARTMENT_DELETE', description: 'Delete departments and reassign members' },
  { id: 9, name: 'USER_VIEW', description: 'View user accounts and access logs' },
  { id: 10, name: 'USER_CREATE', description: 'Create user accounts' },
  { id: 11, name: 'USER_UPDATE', description: 'Update user details, roles, and status' },
  { id: 12, name: 'USER_DELETE', description: 'Deactivate or delete user accounts' },
  { id: 13, name: 'ROLE_VIEW', description: 'View roles and their permission mapping' },
  { id: 14, name: 'ROLE_CREATE', description: 'Create new roles' },
  { id: 15, name: 'ROLE_UPDATE', description: 'Modify role permissions and descriptions' },
  { id: 16, name: 'ROLE_DELETE', description: 'Remove roles and revoke access' },
  { id: 17, name: 'PERMISSION_VIEW', description: 'View full permission catalog' },
  { id: 18, name: 'REPORT_VIEW', description: 'View reports and dashboards' },
  { id: 19, name: 'REPORT_EXPORT', description: 'Export reports to external systems' },
  { id: 20, name: 'AUDIT_LOG_VIEW', description: 'View audit trail and access history' },
  { id: 21, name: 'ATTENDANCE_VIEW', description: 'View attendance records and leave balance' },
  { id: 22, name: 'PAYROLL_VIEW', description: 'View payroll and compensation data' },
  { id: 23, name: 'TICKET_VIEW', description: 'View support tickets and customer requests' },
  { id: 24, name: 'SYSTEM_SETTINGS', description: 'Access global system configuration' },
];

export const fakeUsers = [
  { id: 1, username: 'admin', email: 'admin@nexacorp.com', phone: '+91-98765-00001', address: '1 MG Road, Bangalore 560001', status: 'ACTIVE', roles: [fakeRoles[0]], imageUrl: 'https://i.pravatar.cc/150?img=21' },
  { id: 2, username: 'priya.hr', email: 'priya.sharma@nexacorp.com', phone: '+91-98765-00002', address: '22 Park Street, Kolkata 700016', status: 'ACTIVE', roles: [fakeRoles[1]], imageUrl: 'https://i.pravatar.cc/150?img=22' },
  { id: 3, username: 'amit.mkt', email: 'amit.patel@nexacorp.com', phone: '+91-98765-00003', address: '7 Andheri West, Mumbai 400058', status: 'ACTIVE', roles: [fakeRoles[2]], imageUrl: 'https://i.pravatar.cc/150?img=23' },
  { id: 4, username: 'sneha.fin', email: 'sneha.reddy@nexacorp.com', phone: '+91-98765-00004', address: '15 Banjara Hills, Hyderabad 500034', status: 'ACTIVE', roles: [fakeRoles[3]], imageUrl: 'https://i.pravatar.cc/150?img=24' },
  { id: 5, username: 'viewer01', email: 'viewer@nexacorp.com', phone: '+91-98765-00005', address: '30 Anna Salai, Chennai 600002', status: 'INACTIVE', roles: [fakeRoles[5]], imageUrl: 'https://i.pravatar.cc/150?img=25' },
  { id: 6, username: 'deepa.tech', email: 'deepa.menon@nexacorp.com', phone: '+91-98765-00006', address: '18 Koramangala, Bangalore 560095', status: 'LOCKED', roles: [fakeRoles[2]], imageUrl: 'https://i.pravatar.cc/150?img=26' },
  { id: 7, username: 'rahul.ops', email: 'rahul.verma@nexacorp.com', phone: '+91-98765-00007', address: '5 Gomti Nagar, Lucknow 226010', status: 'INACTIVE', roles: [fakeRoles[4]], imageUrl: 'https://i.pravatar.cc/150?img=27' },
  { id: 8, username: 'neha.sales', email: 'neha.joshi@nexacorp.com', phone: '+91-98765-00008', address: '27 Sarvapriya Vihar, Delhi 110016', status: 'ACTIVE', roles: [fakeRoles[2]], imageUrl: 'https://i.pravatar.cc/150?img=28' },
  { id: 9, username: 'kiran.support', email: 'kiran.bedi@nexacorp.com', phone: '+91-98765-00009', address: '11 Civil Lines, Pune 411001', status: 'ACTIVE', roles: [fakeRoles[6]], imageUrl: 'https://i.pravatar.cc/150?img=29' },
  { id: 10, username: 'ashwin.ops', email: 'ashwin.nambiar@nexacorp.com', phone: '+91-98765-00010', address: '33 Vyttila, Kochi 682019', status: 'LOCKED', roles: [fakeRoles[4]], imageUrl: 'https://i.pravatar.cc/150?img=30' },
];

export const fakeDevUser = {
  userId: 999,
  username: 'dev_admin',
  roles: ['ADMIN'],
  permissions: fakePermissions.map((p) => p.name),
};