-- SUPER_ADMIN -> all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         CROSS JOIN permissions p
WHERE r.name = 'SUPER_ADMIN';


-- ADMIN -> user management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         JOIN permissions p ON p.name IN (
                                           'USER_CREATE',
                                           'USER_READ',
                                           'USER_UPDATE',
                                           'USER_DELETE',
                                           'USER_ACTIVATE',
                                           'USER_DEACTIVATE',
                                           'USER_LOCK',
                                           'USER_UNLOCK',
                                           'USER_PASSWORD_CHANGE',
                                           'ROLE_READ',
                                           'ROLE_ASSIGN',
                                           'ROLE_REMOVE',
                                           'PERMISSION_READ'
    )
WHERE r.name = 'ADMIN';


-- MANAGER -> basic user management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         JOIN permissions p ON p.name IN (
            'USER_READ',
            'USER_UPDATE'
         )
WHERE r.name = 'MANAGER';


-- EMPLOYEE -> basic user read access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
         JOIN permissions p ON p.name = 'USER_READ'
WHERE r.name = 'EMPLOYEE';