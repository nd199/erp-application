// ─── Departments ───────────────────────────────────────────────
export const fakeDepartments = [
  { id: 1, name: 'Engineering', description: 'Software development, system architecture, DevOps, and technical infrastructure management' },
  { id: 2, name: 'Human Resources', description: 'Talent acquisition, employee relations, payroll administration, and organizational development' },
  { id: 3, name: 'Marketing', description: 'Brand strategy, digital campaigns, content creation, market research, and lead generation' },
  { id: 4, name: 'Finance & Accounts', description: 'Financial planning, accounts payable/receivable, tax compliance, auditing, and budgeting' },
  { id: 5, name: 'Sales', description: 'Enterprise sales, client acquisition, account management, channel partnerships, and revenue operations' },
  { id: 6, name: 'Operations', description: 'Supply chain management, vendor relations, logistics, facilities, and IT infrastructure' },
  { id: 7, name: 'Legal & Compliance', description: 'Corporate governance, contract management, regulatory compliance, and intellectual property' },
  { id: 8, name: 'Customer Success', description: 'Client onboarding, technical support, ticket resolution, and customer retention programs' },
];

// ─── Product Categories ────────────────────────────────────────
export const fakeCategories = [
  { id: 1, name: 'Laptops & Notebooks', description: 'Portable computing devices including ultrabooks, workstations, and Chromebooks', active: true },
  { id: 2, name: 'Monitors & Displays', description: 'Desktop monitors, portable displays, digital signage, and projector screens', active: true },
  { id: 3, name: 'Input Devices', description: 'Keyboards, mice, trackpads, styluses, and ergonomic input peripherals', active: true },
  { id: 4, name: 'Audio & Video', description: 'Headphones, speakers, webcams, microphones, and conferencing equipment', active: true },
  { id: 5, name: 'Networking', description: 'Switches, routers, access points, cables, and network infrastructure', active: true },
  { id: 6, name: 'Power & UPS', description: 'Uninterruptible power supplies, surge protectors, PDUs, and battery backups', active: true },
  { id: 7, name: 'Storage', description: 'External SSDs, hard drives, NAS devices, and backup solutions', active: true },
  { id: 8, name: 'Accessories & Peripherals', description: 'Docking stations, laptop stands, cable organizers, and misc accessories', active: true },
];

// ─── Product Types ─────────────────────────────────────────────
export const fakeTypes = [
  { id: 1, name: 'Hardware', description: 'Physical equipment and tangible computing devices', active: true },
  { id: 2, name: 'Software', description: 'Licensed software, SaaS subscriptions, and digital tools', active: true },
  { id: 3, name: 'Accessory', description: 'Add-on peripherals and complementary products', active: true },
  { id: 4, name: 'Service', description: 'Installation, maintenance, consulting, and support services', active: true },
  { id: 5, name: 'Consumable', description: 'Disposable items like cables, toner, paper, and batteries', active: true },
];

// ─── Products (IT Hardware Catalogue) ──────────────────────────
export const fakeProducts = [
  { id: 1,  name: 'Lenovo ThinkPad X1 Carbon Gen 11', sku: 'LEN-X1C-G11', description: '14" WUXGA IPS, Intel Core i7-1365U, 16GB LPDDR5, 512GB SSD, Windows 11 Pro', price: 142500, quantity: 18, active: true, imageUrl: 'https://picsum.photos/seed/thinkpad/150', categoryId: 1, categoryName: 'Laptops & Notebooks', typeId: 1, typeName: 'Hardware' },
  { id: 2,  name: 'Apple MacBook Air M3 15"', sku: 'APL-MBA15-M3', description: '15.3" Liquid Retina, Apple M3, 16GB Unified Memory, 512GB SSD, Starlight', price: 174900, quantity: 12, active: true, imageUrl: 'https://picsum.photos/seed/macbook/150', categoryId: 1, categoryName: 'Laptops & Notebooks', typeId: 1, typeName: 'Hardware' },
  { id: 3,  name: 'Dell UltraSharp 27" 4K Hub Monitor', sku: 'DEL-U2723QE', description: '27" 4K IPS Black, USB-C 90W PD, HDMI, DP 1.4, RJ45, KVM switch', price: 58999, quantity: 24, active: true, imageUrl: 'https://picsum.photos/seed/dellmon/150', categoryId: 2, categoryName: 'Monitors & Displays', typeId: 1, typeName: 'Hardware' },
  { id: 4,  name: 'Logitech MX Keys S Keyboard', sku: 'LOG-MXK-S', description: 'Wireless illuminated keyboard, Smart Actions, USB-C rechargeable, multi-device', price: 12495, quantity: 65, active: true, imageUrl: 'https://picsum.photos/seed/mxkeys/150', categoryId: 3, categoryName: 'Input Devices', typeId: 3, typeName: 'Accessory' },
  { id: 5,  name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MXM3S', description: 'Wireless ergonomic mouse, 8K DPI sensor, quiet clicks, MagSpeed scroll wheel', price: 10995, quantity: 58, active: true, imageUrl: 'https://picsum.photos/seed/mxmouse/150', categoryId: 3, categoryName: 'Input Devices', typeId: 3, typeName: 'Accessory' },
  { id: 6,  name: 'Sony WH-1000XM5 Headphones', sku: 'SNY-WH1000XM5', description: 'Over-ear ANC headphones, 30h battery, multipoint, LDAC, Speak-to-Chat', price: 29990, quantity: 30, active: true, imageUrl: 'https://picsum.photos/seed/sonyxm5/150', categoryId: 4, categoryName: 'Audio & Video', typeId: 1, typeName: 'Hardware' },
  { id: 7,  name: 'Anker 555 USB-C Hub (8-in-1)', sku: 'ANK-555-8IN1', description: 'USB-C hub with 4K HDMI, 100W PD, USB-A 3.2, SD/microSD, Ethernet', price: 5499, quantity: 42, active: true, imageUrl: 'https://picsum.photos/seed/ankerhub/150', categoryId: 8, categoryName: 'Accessories & Peripherals', typeId: 3, typeName: 'Accessory' },
  { id: 8,  name: 'APC Back-UPS Pro 1500VA', sku: 'APC-BP1500', description: '1500VA/865W line-interactive UPS, automatic voltage regulation, USB port', price: 18999, quantity: 8, active: true, imageUrl: 'https://picsum.photos/seed/apcups/150', categoryId: 6, categoryName: 'Power & UPS', typeId: 1, typeName: 'Hardware' },
  { id: 9,  name: 'Cisco Catalyst 2960+ 24-Port Switch', sku: 'CSC-2960-24P', description: '24-port PoE+ managed switch, Layer 2, 195W PoE budget, enterprise-grade', price: 89500, quantity: 5, active: true, imageUrl: 'https://picsum.photos/seed/cisco/150', categoryId: 5, categoryName: 'Networking', typeId: 1, typeName: 'Hardware' },
  { id: 10, name: 'Samsung T7 Portable SSD 1TB', sku: 'SAM-T7-1TB', description: 'USB 3.2 Gen2 external SSD, 1050MB/s read, 256-bit AES encryption', price: 8499, quantity: 0, active: false, imageUrl: 'https://picsum.photos/seed/samsungssd/150', categoryId: 7, categoryName: 'Storage', typeId: 1, typeName: 'Hardware' },
];

// ─── Employees ─────────────────────────────────────────────────
export const fakeEmployees = [
  { id: 1,  firstName: 'Rajesh',   lastName: 'Kumar',     email: 'rajesh.kumar@nexacorp.com',    phone: '+91-98765-43210', hireDate: '2021-03-15', jobTitle: 'Principal Software Engineer',   department: fakeDepartments[0], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=1', managerId: 10, managerName: 'Deepa Menon' },
  { id: 2,  firstName: 'Priya',    lastName: 'Sharma',    email: 'priya.sharma@nexacorp.com',     phone: '+91-98765-43211', hireDate: '2020-06-20', jobTitle: 'HR Manager',                     department: fakeDepartments[1], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=2', managerId: null, managerName: null },
  { id: 3,  firstName: 'Amit',     lastName: 'Patel',     email: 'amit.patel@nexacorp.com',       phone: '+91-98765-43212', hireDate: '2022-09-10', jobTitle: 'Marketing Lead',                 department: fakeDepartments[2], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=3', managerId: null, managerName: null },
  { id: 4,  firstName: 'Sneha',    lastName: 'Reddy',     email: 'sneha.reddy@nexacorp.com',      phone: '+91-98765-43213', hireDate: '2019-11-01', jobTitle: 'Senior Finance Analyst',         department: fakeDepartments[3], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=4', managerId: null, managerName: null },
  { id: 5,  firstName: 'Vikram',   lastName: 'Singh',     email: 'vikram.singh@nexacorp.com',     phone: '+91-98765-43214', hireDate: '2018-07-18', jobTitle: 'Enterprise Account Executive',  department: fakeDepartments[4], status: 'INACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=5', managerId: null, managerName: null },
  { id: 6,  firstName: 'Ananya',   lastName: 'Iyer',      email: 'ananya.iyer@nexacorp.com',      phone: '+91-98765-43215', hireDate: '2022-01-05', jobTitle: 'Senior DevOps Engineer',         department: fakeDepartments[0], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=6', managerId: 10, managerName: 'Deepa Menon' },
  { id: 7,  firstName: 'Mohit',    lastName: 'Gupta',     email: 'mohit.gupta@nexacorp.com',      phone: '+91-98765-43216', hireDate: '2020-11-22', jobTitle: 'Head of Operations',            department: fakeDepartments[5], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=7', managerId: null, managerName: null },
  { id: 8,  firstName: 'Kavitha',  lastName: 'Nair',      email: 'kavitha.nair@nexacorp.com',     phone: '+91-98765-43217', hireDate: '2021-04-12', jobTitle: 'Legal Counsel',                  department: fakeDepartments[6], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=8', managerId: null, managerName: null },
  { id: 9,  firstName: 'Arjun',    lastName: 'Mehta',     email: 'arjun.mehta@nexacorp.com',      phone: '+91-98765-43218', hireDate: '2023-02-01', jobTitle: 'Support Engineer L2',            department: fakeDepartments[7], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=9', managerId: 15, managerName: 'Kiran Bedi' },
  { id: 10, firstName: 'Deepa',    lastName: 'Menon',     email: 'deepa.menon@nexacorp.com',      phone: '+91-98765-43219', hireDate: '2017-08-14', jobTitle: 'Engineering Manager',           department: fakeDepartments[0], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=10', managerId: null, managerName: null },
  { id: 11, firstName: 'Rohan',    lastName: 'Desai',     email: 'rohan.desai@nexacorp.com',      phone: '+91-98765-43220', hireDate: '2024-01-19', jobTitle: 'Software Engineer',             department: fakeDepartments[0], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=11', managerId: 10, managerName: 'Deepa Menon' },
  { id: 12, firstName: 'Fatima',   lastName: 'Khan',      email: 'fatima.khan@nexacorp.com',      phone: '+91-98765-43221', hireDate: '2022-10-30', jobTitle: 'UI/UX Designer',                department: fakeDepartments[2], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=12', managerId: 3, managerName: 'Amit Patel' },
  { id: 13, firstName: 'Sanjay',   lastName: 'Rao',       email: 'sanjay.rao@nexacorp.com',       phone: '+91-98765-43222', hireDate: '2016-05-08', jobTitle: 'Assistant Manager - Accounts',  department: fakeDepartments[3], status: 'INACTIVE', imageUrl: 'https://i.pravatar.cc/150?img=13', managerId: 4, managerName: 'Sneha Reddy' },
  { id: 14, firstName: 'Neha',     lastName: 'Joshi',     email: 'neha.joshi@nexacorp.com',       phone: '+91-98765-43223', hireDate: '2021-08-25', jobTitle: 'Regional Sales Manager',        department: fakeDepartments[4], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=14', managerId: null, managerName: null },
  { id: 15, firstName: 'Kiran',    lastName: 'Bedi',      email: 'kiran.bedi@nexacorp.com',       phone: '+91-98765-43224', hireDate: '2020-02-11', jobTitle: 'Customer Success Lead',         department: fakeDepartments[7], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=15', managerId: null, managerName: null },
  { id: 16, firstName: 'Manish',   lastName: 'Agarwal',   email: 'manish.agarwal@nexacorp.com',   phone: '+91-98765-43225', hireDate: '2022-06-14', jobTitle: 'QA Engineer',                    department: fakeDepartments[0], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=16', managerId: 10, managerName: 'Deepa Menon' },
  { id: 17, firstName: 'Divya',    lastName: 'Pillai',    email: 'divya.pillai@nexacorp.com',     phone: '+91-98765-43226', hireDate: '2022-12-02', jobTitle: 'Business Intelligence Analyst', department: fakeDepartments[3], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=17', managerId: 4, managerName: 'Sneha Reddy' },
  { id: 18, firstName: 'Rahul',    lastName: 'Verma',     email: 'rahul.verma@nexacorp.com',      phone: '+91-98765-43227', hireDate: '2019-09-16', jobTitle: 'Network Engineer',               department: fakeDepartments[5], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=18', managerId: 7, managerName: 'Mohit Gupta' },
  { id: 19, firstName: 'Pooja',    lastName: 'Bhat',      email: 'pooja.bhat@nexacorp.com',       phone: '+91-98765-43228', hireDate: '2024-03-22', jobTitle: 'Talent Acquisition Specialist', department: fakeDepartments[1], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=19', managerId: 2, managerName: 'Priya Sharma' },
  { id: 20, firstName: 'Ashwin',   lastName: 'Nambiar',   email: 'ashwin.nambiar@nexacorp.com',   phone: '+91-98765-43229', hireDate: '2020-11-09', jobTitle: 'Information Security Analyst',  department: fakeDepartments[5], status: 'ACTIVE',   imageUrl: 'https://i.pravatar.cc/150?img=20', managerId: 7, managerName: 'Mohit Gupta' },
];

// ─── Roles ─────────────────────────────────────────────────────
export const fakeRoles = [
  { id: 1, name: 'SUPER_ADMIN',     description: 'Full system access with all permissions, including user and role management' },
  { id: 2, name: 'ADMIN',           description: 'Administrative access for managing users, roles, and system configuration' },
  { id: 3, name: 'HR_MANAGER',      description: 'Manage employees, departments, recruitment, and organizational structure' },
  { id: 4, name: 'DEPARTMENT_HEAD',  description: 'Manage own department employees, approve requests, and view reports' },
  { id: 5, name: 'FINANCE_MANAGER', description: 'Access financial records, approve invoices, manage budgets, and payroll data' },
  { id: 6, name: 'SALES_MANAGER',   description: 'Manage sales pipeline, orders, customer accounts, and revenue forecasts' },
  { id: 7, name: 'EMPLOYEE',        description: 'Basic access to view own profile, attendance, and submit requests' },
  { id: 8, name: 'VIEWER',          description: 'Read-only access to dashboards, reports, and analytics' },
];

// ─── Permissions ───────────────────────────────────────────────
export const fakePermissions = [
  { id: 1,  name: 'USER_CREATE',        description: 'Create new user accounts in the system' },
  { id: 2,  name: 'USER_READ',          description: 'View user profiles, status, and access details' },
  { id: 3,  name: 'USER_UPDATE',        description: 'Update user details, roles, and status' },
  { id: 4,  name: 'USER_DELETE',        description: 'Deactivate or permanently remove user accounts' },
  { id: 5,  name: 'USER_ACTIVATE',      description: 'Activate inactive or suspended user accounts' },
  { id: 6,  name: 'USER_DEACTIVATE',    description: 'Deactivate active user accounts' },
  { id: 7,  name: 'USER_LOCK',          description: 'Lock user accounts due to security concerns' },
  { id: 8,  name: 'USER_UNLOCK',        description: 'Unlock previously locked user accounts' },
  { id: 9,  name: 'USER_CHANGE_PASSWORD', description: 'Reset or change user passwords' },
  { id: 10, name: 'ROLE_READ',          description: 'View roles and their assigned permissions' },
  { id: 11, name: 'ROLE_ASSIGN',        description: 'Assign roles to user accounts' },
  { id: 12, name: 'ROLE_REMOVE',        description: 'Remove roles from user accounts' },
  { id: 13, name: 'PERMISSION_READ',    description: 'View the full permission catalog' },
  { id: 14, name: 'PERMISSION_ASSIGN',  description: 'Assign permissions to roles' },
  { id: 15, name: 'PERMISSION_REMOVE',  description: 'Remove permissions from roles' },
  { id: 16, name: 'EMPLOYEE_CREATE',    description: 'Create new employee records' },
  { id: 17, name: 'EMPLOYEE_READ',      description: 'View employee profiles and department data' },
  { id: 18, name: 'EMPLOYEE_UPDATE',    description: 'Update employee details, job title, and status' },
  { id: 19, name: 'EMPLOYEE_DELETE',    description: 'Remove employee records from the system' },
  { id: 20, name: 'PRODUCT_CREATE',     description: 'Add new products to the inventory catalogue' },
  { id: 21, name: 'PRODUCT_READ',       description: 'View product details, pricing, and stock levels' },
  { id: 22, name: 'PRODUCT_UPDATE',     description: 'Update product information, pricing, and availability' },
  { id: 23, name: 'PRODUCT_DELETE',     description: 'Deactivate or remove products from the catalogue' },
  { id: 24, name: 'SALES_ORDER_CREATE', description: 'Create new sales orders for customers' },
  { id: 25, name: 'SALES_ORDER_READ',   description: 'View sales order details and status' },
  { id: 26, name: 'SALES_ORDER_UPDATE', description: 'Update sales order status and details' },
  { id: 27, name: 'SALES_ORDER_DELETE', description: 'Cancel or delete sales orders' },
  { id: 28, name: 'PURCHASE_CREATE',    description: 'Create purchase orders and register new suppliers' },
  { id: 29, name: 'PURCHASE_READ',      description: 'View purchase orders, supplier details, and receipts' },
  { id: 30, name: 'PURCHASE_UPDATE',    description: 'Update purchase order status and details' },
  { id: 31, name: 'PURCHASE_DELETE',    description: 'Cancel or delete purchase orders' },
  { id: 32, name: 'REPORT_VIEW',        description: 'View dashboards, analytics, and business reports' },
  { id: 33, name: 'REPORT_EXPORT',      description: 'Export reports to CSV, PDF, or external systems' },
  { id: 34, name: 'AUDIT_LOG_VIEW',     description: 'View system audit trail and access history' },
  { id: 35, name: 'SYSTEM_SETTINGS',    description: 'Access and modify global system configuration' },
];

// ─── Users ─────────────────────────────────────────────────────
export const fakeUsers = [
  { id: 1,  username: 'admin',         email: 'admin@nexacorp.com',              phone: '+91-98765-00001', address: '1 MG Road, Bangalore 560001',                status: 'ACTIVE',   roles: [fakeRoles[0]], imageUrl: 'https://i.pravatar.cc/150?img=21' },
  { id: 2,  username: 'priya.sharma',  email: 'priya.sharma@nexacorp.com',       phone: '+91-98765-00002', address: '22 Park Street, Kolkata 700016',              status: 'ACTIVE',   roles: [fakeRoles[2]], imageUrl: 'https://i.pravatar.cc/150?img=22' },
  { id: 3,  username: 'amit.patel',    email: 'amit.patel@nexacorp.com',         phone: '+91-98765-00003', address: '7 Andheri West, Mumbai 400058',               status: 'ACTIVE',   roles: [fakeRoles[3]], imageUrl: 'https://i.pravatar.cc/150?img=23' },
  { id: 4,  username: 'sneha.reddy',   email: 'sneha.reddy@nexacorp.com',        phone: '+91-98765-00004', address: '15 Banjara Hills, Hyderabad 500034',          status: 'ACTIVE',   roles: [fakeRoles[4]], imageUrl: 'https://i.pravatar.cc/150?img=24' },
  { id: 5,  username: 'vikram.singh',  email: 'vikram.singh@nexacorp.com',       phone: '+91-98765-00005', address: '42 HSR Layout, Bangalore 560102',              status: 'INACTIVE', roles: [fakeRoles[7]], imageUrl: 'https://i.pravatar.cc/150?img=25' },
  { id: 6,  username: 'deepa.menon',   email: 'deepa.menon@nexacorp.com',        phone: '+91-98765-00006', address: '18 Koramangala 4th Block, Bangalore 560095',   status: 'LOCKED',   roles: [fakeRoles[3]], imageUrl: 'https://i.pravatar.cc/150?img=26' },
  { id: 7,  username: 'neha.joshi',    email: 'neha.joshi@nexacorp.com',         phone: '+91-98765-00007', address: '27 Sarvapriya Vihar, New Delhi 110016',        status: 'ACTIVE',   roles: [fakeRoles[5]], imageUrl: 'https://i.pravatar.cc/150?img=28' },
  { id: 8,  username: 'kiran.bedi',    email: 'kiran.bedi@nexacorp.com',         phone: '+91-98765-00008', address: '11 Civil Lines, Pune 411001',                  status: 'ACTIVE',   roles: [fakeRoles[6]], imageUrl: 'https://i.pravatar.cc/150?img=29' },
  { id: 9,  username: 'mohit.gupta',   email: 'mohit.gupta@nexacorp.com',        phone: '+91-98765-00009', address: '5 Gomti Nagar, Lucknow 226010',                status: 'ACTIVE',   roles: [fakeRoles[3]], imageUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: 10, username: 'rohan.desai',   email: 'rohan.desai@nexacorp.com',        phone: '+91-98765-00010', address: '33 Vyttila, Kochi 682019',                    status: 'ACTIVE',   roles: [fakeRoles[6]], imageUrl: 'https://i.pravatar.cc/150?img=11' },
];

// ─── Sales Orders (realistic Indian B2B transactions) ──────────
export const fakeOrders = [
  { id: 1001, userId: 1, userName: 'admin', orderDate: '2025-07-02T09:15:00Z', status: 'DELIVERED', totalAmount: 354490, notes: 'Q3 onboarding batch - 2 new developers', items: [
    { id: 1, productId: 1, productName: 'Lenovo ThinkPad X1 Carbon Gen 11', productSku: 'LEN-X1C-G11', quantity: 2, unitPrice: 142500, lineTotal: 285000 },
    { id: 2, productId: 4, productName: 'Logitech MX Keys S Keyboard', productSku: 'LOG-MXK-S', quantity: 2, unitPrice: 12495, lineTotal: 24990 },
    { id: 3, productId: 5, productName: 'Logitech MX Master 3S Mouse', productSku: 'LOG-MXM3S', quantity: 2, unitPrice: 10995, lineTotal: 21990 },
    { id: 4, productId: 7, productName: 'Anker 555 USB-C Hub (8-in-1)', productSku: 'ANK-555-8IN1', quantity: 4, unitPrice: 5499, lineTotal: 21996 },
  ]},
  { id: 1002, userId: 7, userName: 'neha.joshi', orderDate: '2025-07-18T14:30:00Z', status: 'SHIPPED', totalAmount: 177995, notes: 'Client demo kit for Tata Digital pitch', items: [
    { id: 5, productId: 2, productName: 'Apple MacBook Air M3 15"', productSku: 'APL-MBA15-M3', quantity: 1, unitPrice: 174900, lineTotal: 174900 },
    { id: 6, productId: 7, productName: 'Anker 555 USB-C Hub (8-in-1)', productSku: 'ANK-555-8IN1', quantity: 1, unitPrice: 5499, lineTotal: 5499 },
  ]},
  { id: 1003, userId: 9, userName: 'mohit.gupta', orderDate: '2025-08-01T11:00:00Z', status: 'PENDING', totalAmount: 386490, notes: 'Network refresh for Bangalore office floor 3', items: [
    { id: 7, productId: 9, productName: 'Cisco Catalyst 2960+ 24-Port Switch', productSku: 'CSC-2960-24P', quantity: 3, unitPrice: 89500, lineTotal: 268500 },
    { id: 8, productId: 8, productName: 'APC Back-UPS Pro 1500VA', productSku: 'APC-BP1500', quantity: 3, unitPrice: 18999, lineTotal: 56997 },
    { id: 9, productId: 3, productName: 'Dell UltraSharp 27" 4K Hub Monitor', productSku: 'DEL-U2723QE', quantity: 1, unitPrice: 58999, lineTotal: 58999 },
  ]},
  { id: 1004, userId: 4, userName: 'sneha.reddy', orderDate: '2025-08-05T16:45:00Z', status: 'DELIVERED', totalAmount: 204985, notes: 'Finance team quarterly hardware refresh', items: [
    { id: 10, productId: 1, productName: 'Lenovo ThinkPad X1 Carbon Gen 11', productSku: 'LEN-X1C-G11', quantity: 1, unitPrice: 142500, lineTotal: 142500 },
    { id: 11, productId: 3, productName: 'Dell UltraSharp 27" 4K Hub Monitor', productSku: 'DEL-U2723QE', quantity: 1, unitPrice: 58999, lineTotal: 58999 },
    { id: 12, productId: 7, productName: 'Anker 555 USB-C Hub (8-in-1)', productSku: 'ANK-555-8IN1', quantity: 1, unitPrice: 5499, lineTotal: 5499 },
  ]},
  { id: 1005, userId: 2, userName: 'priya.sharma', orderDate: '2025-08-12T10:20:00Z', status: 'CANCELLED', totalAmount: 59980, notes: 'Cancelled - budget reallocated to Q4 hiring', items: [
    { id: 13, productId: 6, productName: 'Sony WH-1000XM5 Headphones', productSku: 'SNY-WH1000XM5', quantity: 2, unitPrice: 29990, lineTotal: 59980 },
  ]},
  { id: 1006, userId: 8, userName: 'kiran.bedi', orderDate: '2025-08-20T08:00:00Z', status: 'SHIPPED', totalAmount: 124950, notes: 'Support team headsets and peripherals', items: [
    { id: 14, productId: 6, productName: 'Sony WH-1000XM5 Headphones', productSku: 'SNY-WH1000XM5', quantity: 3, unitPrice: 29990, lineTotal: 89970 },
    { id: 15, productId: 4, productName: 'Logitech MX Keys S Keyboard', productSku: 'LOG-MXK-S', quantity: 3, unitPrice: 12495, lineTotal: 37485 },
  ]},
];

// ─── Suppliers ─────────────────────────────────────────────────
export const fakeSuppliers = [
  { id: 1, name: 'Redington India Ltd',           contactPerson: 'Suresh Iyer',      email: 'enterprise@redington.in',      phone: '+91-98200-11111', address: '14 MIDC Industrial Area, Hosur Road, Bangalore 560068',  gstNumber: '29AABCR1234F1Z5', active: true },
  { id: 2, name: 'Ingram Micro India Pvt Ltd',    contactPerson: 'Pradeep Menon',     email: 'b2b@ingrammicro.co.in',        phone: '+91-98200-22222', address: '78 Andheri Kurla Road, Andheri East, Mumbai 400069',      gstNumber: '27AABCI5678G1Z2', active: true },
  { id: 3, name: 'TSI Technologies Pvt Ltd',      contactPerson: 'Rajiv Kapoor',      email: 'procurement@tsitech.in',       phone: '+91-98200-33333', address: '23 plot No. 15, Electronic City Phase 1, Hosur 635126',   gstNumber: '33AABCT9012H1Z8', active: true },
  { id: 4, name: 'Nexa Distribution Solutions',   contactPerson: 'Farhan Sheikh',     email: 'orders@nexadist.com',          phone: '+91-98200-44444', address: '56 Sec 44, Gurugram, Haryana 122003',                       gstNumber: '06AABCN3456I1Z1', active: true },
  { id: 5, name: 'Acme Peripherals Pvt Ltd',      contactPerson: 'Meera Chakraborty', email: 'sales@acmeperipherals.in',     phone: '+91-98200-55555', address: '9 Salt Lake Sector V, Kolkata 700091',                        gstNumber: '19AABCA7890J1Z3', active: false },
];

// ─── Purchase Orders ───────────────────────────────────────────
export const fakePurchaseOrders = [
  { id: 2001, supplierId: 1, supplierName: 'Redington India Ltd', userId: 1, userName: 'admin', orderDate: '2025-06-10T09:00:00Z', status: 'RECEIVED', totalAmount: 1282500, notes: 'Q3 inventory restocking - laptops and peripherals', items: [
    { id: 1, productId: 1, productName: 'Lenovo ThinkPad X1 Carbon Gen 11', productSku: 'LEN-X1C-G11', quantity: 6, unitPrice: 135000, lineTotal: 810000 },
    { id: 2, productId: 4, productName: 'Logitech MX Keys S Keyboard', productSku: 'LOG-MXK-S', quantity: 10, unitPrice: 11500, lineTotal: 115000 },
    { id: 3, productId: 5, productName: 'Logitech MX Master 3S Mouse', productSku: 'LOG-MXM3S', quantity: 10, unitPrice: 10200, lineTotal: 102000 },
    { id: 4, productId: 7, productName: 'Anker 555 USB-C Hub (8-in-1)', productSku: 'ANK-555-8IN1', quantity: 25, unitPrice: 5100, lineTotal: 127500 },
    { id: 5, productId: 8, productName: 'APC Back-UPS Pro 1500VA', productSku: 'APC-BP1500', quantity: 7, unitPrice: 17500, lineTotal: 122500 },
  ]},
  { id: 2002, supplierId: 2, supplierName: 'Ingram Micro India Pvt Ltd', userId: 9, userName: 'mohit.gupta', orderDate: '2025-07-05T11:30:00Z', status: 'RECEIVED', totalAmount: 530994, notes: 'Monitor bulk order for new floor setup', items: [
    { id: 6, productId: 3, productName: 'Dell UltraSharp 27" 4K Hub Monitor', productSku: 'DEL-U2723QE', quantity: 8, unitPrice: 54500, lineTotal: 436000 },
    { id: 7, productId: 8, productName: 'APC Back-UPS Pro 1500VA', productSku: 'APC-BP1500', quantity: 5, unitPrice: 18999, lineTotal: 94995 },
  ]},
  { id: 2003, supplierId: 3, supplierName: 'TSI Technologies Pvt Ltd', userId: 1, userName: 'admin', orderDate: '2025-08-15T14:00:00Z', status: 'PENDING', totalAmount: 314990, notes: 'Headphones and SSDs for support team', items: [
    { id: 8, productId: 6, productName: 'Sony WH-1000XM5 Headphones', productSku: 'SNY-WH1000XM5', quantity: 8, unitPrice: 27500, lineTotal: 220000 },
    { id: 9, productId: 10, productName: 'Samsung T7 Portable SSD 1TB', productSku: 'SAM-T7-1TB', quantity: 11, unitPrice: 7999, lineTotal: 87989 },
  ]},
  { id: 2004, supplierId: 4, supplierName: 'Nexa Distribution Solutions', userId: 9, userName: 'mohit.gupta', orderDate: '2025-08-20T10:15:00Z', status: 'CANCELLED', totalAmount: 179000, notes: 'Cancelled - vendor delayed beyond lead time, reordered from Redington', items: [
    { id: 10, productId: 9, productName: 'Cisco Catalyst 2960+ 24-Port Switch', productSku: 'CSC-2960-24P', quantity: 2, unitPrice: 85000, lineTotal: 170000 },
    { id: 11, productId: 7, productName: 'Anker 555 USB-C Hub (8-in-1)', productSku: 'ANK-555-8IN1', quantity: 2, unitPrice: 4500, lineTotal: 9000 },
  ]},
];

// ─── Dev User (auto-logged-in when VITE_DEV_MODE=true) ────────
export const fakeDevUser = {
  userId: 999,
  username: 'dev_admin',
  roles: ['SUPER_ADMIN'],
  permissions: fakePermissions.map((p) => p.name),
};

// ─── HCM: Leave Requests ──────────────────────────────────────
export const fakeLeaveRequests = [
  { id: 1, employeeId: 11, employeeName: 'Rohan Desai', employeeEmail: 'rohan.desai@nexacorp.com', leaveType: 'ANNUAL', fromDate: '2025-09-01', toDate: '2025-09-05', days: 5, reason: 'Family vacation', status: 'APPROVED', approvedById: 10, approvedByName: 'Deepa Menon', approvalNotes: 'Approved - team coverage arranged', createdAt: '2025-08-20T10:00:00Z', lastUpdated: '2025-08-21T09:00:00Z' },
  { id: 2, employeeId: 12, employeeName: 'Fatima Khan', employeeEmail: 'fatima.khan@nexacorp.com', leaveType: 'SICK', fromDate: '2025-09-10', toDate: '2025-09-12', days: 3, reason: 'Viral fever', status: 'PENDING', approvedById: null, approvedByName: null, approvalNotes: null, createdAt: '2025-09-09T08:30:00Z', lastUpdated: '2025-09-09T08:30:00Z' },
  { id: 3, employeeId: 16, employeeName: 'Manish Agarwal', employeeEmail: 'manish.agarwal@nexacorp.com', leaveType: 'CASUAL', fromDate: '2025-09-15', toDate: '2025-09-15', days: 1, reason: 'Personal work', status: 'APPROVED', approvedById: 10, approvedByName: 'Deepa Menon', approvalNotes: 'OK', createdAt: '2025-09-12T11:00:00Z', lastUpdated: '2025-09-12T15:00:00Z' },
  { id: 4, employeeId: 19, employeeName: 'Pooja Bhat', employeeEmail: 'pooja.bhat@nexacorp.com', leaveType: 'ANNUAL', fromDate: '2025-10-01', toDate: '2025-10-10', days: 10, reason: 'Diwali break', status: 'PENDING', approvedById: null, approvedByName: null, approvalNotes: null, createdAt: '2025-09-18T12:00:00Z', lastUpdated: '2025-09-18T12:00:00Z' },
  { id: 5, employeeId: 9, employeeName: 'Arjun Mehta', employeeEmail: 'arjun.mehta@nexacorp.com', leaveType: 'UNPAID', fromDate: '2025-08-18', toDate: '2025-08-19', days: 2, reason: 'Personal emergency', status: 'REJECTED', approvedById: 10, approvedByName: 'Deepa Menon', approvalNotes: 'Critical release week - please reschedule', createdAt: '2025-08-15T09:00:00Z', lastUpdated: '2025-08-16T10:00:00Z' },
];

// ─── HCM: Attendance ──────────────────────────────────────────
export const fakeAttendance = [
  { id: 1, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', workDate: '2025-09-01', checkIn: '09:02:00', checkOut: '18:10:00', status: 'PRESENT', notes: null, createdAt: '2025-09-01T09:02:00Z', lastUpdated: '2025-09-01T18:10:00Z' },
  { id: 2, employeeId: 6, employeeName: 'Ananya Iyer', employeeEmail: 'ananya.iyer@nexacorp.com', workDate: '2025-09-01', checkIn: '08:45:00', checkOut: '17:50:00', status: 'WORK_FROM_HOME', notes: 'WFH - infra maintenance', createdAt: '2025-09-01T08:45:00Z', lastUpdated: '2025-09-01T17:50:00Z' },
  { id: 3, employeeId: 11, employeeName: 'Rohan Desai', employeeEmail: 'rohan.desai@nexacorp.com', workDate: '2025-09-01', checkIn: null, checkOut: null, status: 'ON_LEAVE', notes: 'Approved annual leave', createdAt: '2025-09-01T00:00:00Z', lastUpdated: '2025-09-01T00:00:00Z' },
  { id: 4, employeeId: 12, employeeName: 'Fatima Khan', employeeEmail: 'fatima.khan@nexacorp.com', workDate: '2025-09-02', checkIn: '09:15:00', checkOut: '13:00:00', status: 'HALF_DAY', notes: 'Left early - medical appointment', createdAt: '2025-09-02T09:15:00Z', lastUpdated: '2025-09-02T13:00:00Z' },
  { id: 5, employeeId: 16, employeeName: 'Manish Agarwal', employeeEmail: 'manish.agarwal@nexacorp.com', workDate: '2025-09-02', checkIn: null, checkOut: null, status: 'ABSENT', notes: 'No check-in recorded', createdAt: '2025-09-02T18:00:00Z', lastUpdated: '2025-09-02T18:00:00Z' },
  { id: 6, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', workDate: '2025-09-02', checkIn: '09:00:00', checkOut: '18:05:00', status: 'PRESENT', notes: null, createdAt: '2025-09-02T09:00:00Z', lastUpdated: '2025-09-02T18:05:00Z' },
];

// ─── HCM: Payroll Runs ────────────────────────────────────────
export const fakePayrollRuns = [
  {
    id: 1, periodMonth: 8, periodYear: 2025, periodLabel: 'August 2025', status: 'PAID',
    totalGross: 4850000, totalDeductions: 727500, totalNet: 4122500,
    processedById: 2, processedByName: 'Priya Sharma', notes: 'August 2025 payroll',
    createdAt: '2025-08-28T10:00:00Z', lastUpdated: '2025-09-01T12:00:00Z',
    items: [
      { id: 1, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', basicSalary: 180000, allowances: 25000, deductions: 18000, tax: 32000, netPay: 155000, notes: null },
      { id: 2, employeeId: 2, employeeName: 'Priya Sharma', employeeEmail: 'priya.sharma@nexacorp.com', basicSalary: 150000, allowances: 20000, deductions: 15000, tax: 27000, netPay: 128000, notes: null },
      { id: 3, employeeId: 6, employeeName: 'Ananya Iyer', employeeEmail: 'ananya.iyer@nexacorp.com', basicSalary: 140000, allowances: 18000, deductions: 14000, tax: 25000, netPay: 119000, notes: null },
    ],
  },
  {
    id: 2, periodMonth: 9, periodYear: 2025, periodLabel: 'September 2025', status: 'DRAFT',
    totalGross: 4900000, totalDeductions: 735000, totalNet: 4165000,
    processedById: null, processedByName: null, notes: 'September 2025 - pending final attendance',
    createdAt: '2025-09-25T10:00:00Z', lastUpdated: '2025-09-25T10:00:00Z',
    items: [
      { id: 4, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', basicSalary: 180000, allowances: 25000, deductions: 18000, tax: 32000, netPay: 155000, notes: null },
      { id: 5, employeeId: 2, employeeName: 'Priya Sharma', employeeEmail: 'priya.sharma@nexacorp.com', basicSalary: 150000, allowances: 20000, deductions: 15000, tax: 27000, netPay: 128000, notes: null },
    ],
  },
];

// ─── HCM: Leave Balances ──────────────────────────────────────
export const fakeLeaveBalances = [
  { id: 1, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', year: 2025, leaveType: 'ANNUAL', totalEntitled: 12, used: 3, remaining: 9, createdAt: '2025-01-01T00:00:00Z', lastUpdated: '2025-01-01T00:00:00Z' },
  { id: 2, employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', year: 2025, leaveType: 'SICK', totalEntitled: 8, used: 1, remaining: 7, createdAt: '2025-01-01T00:00:00Z', lastUpdated: '2025-01-01T00:00:00Z' },
  { id: 3, employeeId: 11, employeeName: 'Rohan Desai', employeeEmail: 'rohan.desai@nexacorp.com', year: 2025, leaveType: 'ANNUAL', totalEntitled: 12, used: 5, remaining: 7, createdAt: '2025-01-01T00:00:00Z', lastUpdated: '2025-01-01T00:00:00Z' },
];

// ─── HCM: Org Chart ───────────────────────────────────────────
export const fakeOrgChart = [
  { id: 10, firstName: 'Deepa', lastName: 'Menon', jobTitle: 'Engineering Manager', departmentName: 'Engineering', managerId: null, managerName: null, children: [
    { id: 1, firstName: 'Rajesh', lastName: 'Kumar', jobTitle: 'Principal Software Engineer', departmentName: 'Engineering', managerId: 10, managerName: 'Deepa Menon', children: [] },
    { id: 6, firstName: 'Ananya', lastName: 'Iyer', jobTitle: 'Senior DevOps Engineer', departmentName: 'Engineering', managerId: 10, managerName: 'Deepa Menon', children: [] },
    { id: 11, firstName: 'Rohan', lastName: 'Desai', jobTitle: 'Software Engineer', departmentName: 'Engineering', managerId: 10, managerName: 'Deepa Menon', children: [] },
    { id: 16, firstName: 'Manish', lastName: 'Agarwal', jobTitle: 'QA Engineer', departmentName: 'Engineering', managerId: 10, managerName: 'Deepa Menon', children: [] },
  ]},
  { id: 2, firstName: 'Priya', lastName: 'Sharma', jobTitle: 'HR Manager', departmentName: 'Human Resources', managerId: null, managerName: null, children: [
    { id: 19, firstName: 'Pooja', lastName: 'Bhat', jobTitle: 'Talent Acquisition Specialist', departmentName: 'Human Resources', managerId: 2, managerName: 'Priya Sharma', children: [] },
  ]},
];

// ─── HCM: Payslips ────────────────────────────────────────────
export const fakePayslips = [
  { payrollRunId: 1, periodMonth: 8, periodYear: 2025, periodLabel: 'August 2025', runStatus: 'PAID', employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', jobTitle: 'Principal Software Engineer', departmentName: 'Engineering', basicSalary: 180000, allowances: 25000, deductions: 18000, tax: 32000, netPay: 155000, grossEarnings: 205000, totalDeductions: 50000, notes: null, processedByName: 'Priya Sharma', generatedAt: '2025-09-01T12:00:00Z' },
];

// ─── HCM: Attendance Summary ──────────────────────────────────
export const fakeAttendanceSummary = { employeeId: 1, employeeName: 'Rajesh Kumar', employeeEmail: 'rajesh.kumar@nexacorp.com', year: 2025, month: 9, present: 18, absent: 1, halfDay: 1, onLeave: 2, workFromHome: 3, holiday: 0, totalMarked: 25, breakdown: [ { status: 'PRESENT', count: 18 }, { status: 'ABSENT', count: 1 }, { status: 'HALF_DAY', count: 1 }, { status: 'ON_LEAVE', count: 2 }, { status: 'WORK_FROM_HOME', count: 3 } ] };

